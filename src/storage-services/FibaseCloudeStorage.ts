import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import type { StorageService } from "./StorageService.js";

type Bucket = ReturnType<ReturnType<typeof getStorage>["bucket"]>;

export class FirebaseCloudStorage implements StorageService {
  bucket: Bucket;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET,
    });

    this.bucket = getStorage().bucket();
  }

  async isFileExits(filename: string) {
    const file = this.bucket.file(filename);
    const [exists] = await file.exists();
    return exists;
  }

  async upload(tempFilePath: string, filename: string, mimeType: string) {
    await this.bucket.upload(tempFilePath, {
      destination: filename,
      metadata: {
        contentType: mimeType,
      },
      resumable: false,
    });

    return { path: filename };
  }

  async writeTextContent(
    filename: string,
    content: string,
    contentType: string = "text/plain"
  ) {
    const file = this.bucket.file(filename);

    await file.save(Buffer.from(content, "utf-8"), {
      contentType,
      resumable: false,
    });

    return { path: file.name };
  }

  async download(filename: string) {
    const file = this.bucket.file(filename);
    const [exists] = await file.exists();
    if (!exists) throw new Error("File not found");

    return file.createReadStream();
  }

  async deleteFile(filename: string) {
    const file = this.bucket.file(filename);
    const [exists] = await file.exists();
    if (!exists) throw new Error("File not found");

    await file.delete();
  }

  async readContent(filename: string): Promise<string> {
    const file = this.bucket.file(filename);
    const [exists] = await file.exists();
    if (!exists) throw new Error("File not found");

    return new Promise((resolve, reject) => {
      let data = "";

      file
        .createReadStream()
        .on("data", (chunk) => (data += chunk.toString("utf-8")))
        .on("end", () => resolve(data))
        .on("error", reject);
    });
  }
}
