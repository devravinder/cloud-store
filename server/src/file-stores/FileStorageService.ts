import type { Readable } from "node:stream";
import { FirebaseCloudStorage } from "./FirebaseCloudStorage.js";
import { LocalFileStorage } from "./LocalFileStorage.js";

export interface UploadResult {
  path: string;
}

export interface FileStorageService {
  isFileExits(filename: string): Promise<boolean>;
  upload(
    tempFilePath: string,
    filename: string,
    mimeType: string
  ): Promise<UploadResult>;

  writeTextContent(
    filename: string,
    cotent: string,
    contentType?: string
  ): Promise<UploadResult>;

  download(filename: string): Promise<Readable>;

  deleteFile(filename: string): Promise<void>;

  readContent(filename: string): Promise<string>;
}

export const fileStorageService: FileStorageService =
  process.env.FILE_STORAGE === "FIREBASE"
    ? new FirebaseCloudStorage()
    : new LocalFileStorage();
