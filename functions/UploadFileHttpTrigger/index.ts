import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { StorageService } from "../service/storage-service";
import { CustomError } from "../domain/custom-error";
import * as formidable from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import * as fs from "fs";

// Define a type that matches formidable v3.x File structure
interface FormidableFile {
  filepath: string;
  originalFilename?: string;
  newFilename?: string;
  mimetype?: string;
  size: number;
  [key: string]: any;
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (user) => {
    try {
      // Since Azure Functions don't directly handle multipart/form-data,
      // we need to create a mock request for formidable to parse
      const mockRequest = createMockRequest(req);

      const { files, fields } = await parseForm(mockRequest);
      const fileKey = Object.keys(files)[0];

      if (!fileKey || !files[fileKey]) {
        throw CustomError.validation("No file was provided");
      }

      // Get the file data
      const fileData = files[fileKey];

      // Handle potential array (when using multiples: true)
      if (Array.isArray(fileData)) {
        throw CustomError.validation("Multiple files are not supported");
      }

      // Check if fileData exists before type assertion
      if (!fileData) {
        throw CustomError.validation("File data is missing");
      }

      // Read file data with proper type casting
      const file = fileData as unknown as FormidableFile;
      const fileBuffer = await readFileBuffer(file.filepath);
      const filename = file.originalFilename || "unknown_file";
      const contentType = file.mimetype || "application/octet-stream";

      // Upload the file to Azure Blob Storage
      const fileUrl = await StorageService.getInstance().uploadFile(
        fileBuffer,
        filename,
        contentType
      );

      context.res = {
        status: 200,
        body: {
          url: fileUrl,
          filename: filename,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      context.log.error("Error uploading file:", error);
      throw CustomError.internalServerError("Failed to upload file");
    }
  }, context);
};

// Helper function to create a mock request for formidable
function createMockRequest(req: HttpRequest): IncomingMessage {
  const mockRequest = new Readable() as IncomingMessage;
  mockRequest.headers = req.headers as any;
  mockRequest.method = req.method || "POST"; // Default to POST if method is null
  mockRequest.url = req.url;

  // Push the body to the readable stream
  if (req.body && Buffer.isBuffer(req.body)) {
    mockRequest.push(req.body);
    mockRequest.push(null); // Signal end of stream
  } else if (req.body) {
    const buffer = Buffer.from(req.body);
    mockRequest.push(buffer);
    mockRequest.push(null); // Signal end of stream
  } else {
    mockRequest.push(null); // Signal end of stream for empty body
  }

  return mockRequest;
}

// Helper function to parse a multipart form using formidable
function parseForm(
  req: IncomingMessage
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

// Helper function to read a file as buffer
function readFileBuffer(filepath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err: Error | null, data: Buffer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

export default httpTrigger;
