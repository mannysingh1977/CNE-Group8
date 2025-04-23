import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from "@azure/storage-blob";
import { CustomError } from "../domain/custom-error";
import { v4 as uuidv4 } from "uuid";

export class StorageService {
  private static instance: StorageService;
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  private constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
    const containerName = process.env.STORAGE_CONTAINER_NAME || "uploads";

    if (!connectionString) {
      throw CustomError.internalServerError(
        "Missing Azure Storage configuration"
      );
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient =
      this.blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    this.initializeContainer();
  }

  private async initializeContainer(): Promise<void> {
    try {
      // Create the container if it doesn't exist
      const exists = await this.containerClient.exists();
      if (!exists) {
        console.log(
          `Creating container: ${this.containerClient.containerName}`
        );
        await this.containerClient.create({ access: "blob" }); // 'blob' allows public read access for blobs
      }
    } catch (error) {
      console.error("Error initializing container:", error);
      throw CustomError.internalServerError(
        "Failed to initialize storage container"
      );
    }
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getBlockBlobClient(filename: string): BlockBlobClient {
    return this.containerClient.getBlockBlobClient(filename);
  }

  public async uploadFile(
    data: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    try {
      // Generate a unique filename to prevent overwrites
      const fileExtension = fileName.split(".").pop() || "";
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;

      const blockBlobClient = this.getBlockBlobClient(uniqueFileName);

      await blockBlobClient.upload(data, data.length, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
      });

      return blockBlobClient.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw CustomError.internalServerError("Failed to upload file");
    }
  }

  public async deleteFile(blobUrl: string): Promise<void> {
    try {
      // Extract the blob name from the URL
      const blobName = blobUrl.split("/").pop();

      if (!blobName) {
        throw CustomError.validation("Invalid blob URL");
      }

      const blockBlobClient = this.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
    } catch (error) {
      console.error("Error deleting file:", error);
      throw CustomError.internalServerError("Failed to delete file");
    }
  }
}
