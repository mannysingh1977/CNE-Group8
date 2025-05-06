import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import * as fs from "fs";
import * as path from "path";
import * as multipart from "parse-multipart";

app.http("uploadFile", {
  methods: ["POST"],
  route: "upload",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    try {
      const contentType = req.headers.get("content-type");
      if (!contentType || !contentType.includes("multipart/form-data")) {
        return {
          status: 400,
          body: "Content type must be multipart/form-data",
        };
      }

      const boundary = multipart.getBoundary(contentType);
      if (!boundary) {
        return { status: 400, body: "Invalid multipart boundary" };
      }

      const bodyBuffer = await req.arrayBuffer();
      const body = Buffer.from(bodyBuffer);
      const parts = multipart.Parse(body, boundary);

      if (!parts || parts.length === 0) {
        return { status: 400, body: "No file uploaded" };
      }

      const file = parts[0];

      const targetDir = path.join(
        __dirname,
        "../../../../front-end/public/productPictures"
      );

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const fileName =
        file.filename ||
        `upload_${Date.now()}${path.extname(file.filename || "")}`;

      const targetPath = path.join(targetDir, fileName);
      fs.writeFileSync(targetPath, file.data);

      return {
        status: 200,
        body: JSON.stringify({
          message: "File uploaded successfully",
          fileName: fileName,
        }),
      };
    } catch (e: any) {
      ctx.log(e);
      return { status: 500, body: `Error: ${e.message}` };
    }
  },
});
