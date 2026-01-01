import type { Readable } from "node:stream";
import { FirebaseCloudStorage } from "./FibaseCloudeStorage.js";
import { LocalFileStorage } from "./LocalFileStorage.js";

export interface UploadResult {
  path: string;
}

export interface StorageService {

  isFileExits(filename: string): Promise<boolean>
  upload(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<UploadResult>;

  download(filename: string): Promise<Readable>;

  deleteFile(filename: string): Promise<void>;

  readContent(filename: string): Promise<string>;
}

export const storageService: StorageService =
  process.env.STORAGE === "FIREBASE"
    ? new FirebaseCloudStorage()
    : new LocalFileStorage();
