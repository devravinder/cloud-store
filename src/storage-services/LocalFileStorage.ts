import fs from "fs";
import path from "path";
import type { Readable } from "stream";
import type { StorageService } from "./StorageService.js";
import { STORE_DIR } from "../constants.js";

const toFilePath = (filename: string) => path.join(STORE_DIR, filename);

export class LocalFileStorage implements StorageService {
  async isFileExits(filename: string) {
    const filePath = toFilePath(filename);

    return fs.existsSync(filePath);
  }

  async upload(buffer: Buffer, filename: string, _mimeType: string) {
    const filePath = toFilePath(filename);
    fs.writeFileSync(filePath, buffer);

    return { path: filename };
  }

  async download(filename: string): Promise<Readable> {
    const isFileExits = await this.isFileExits(filename);
    if (!isFileExits) throw new Error("File not found");

    return fs.createReadStream(toFilePath(filename));
  }

  async deleteFile(filename: string): Promise<void> {
    const isFileExits = await this.isFileExits(filename);
    if (!isFileExits) throw new Error("File not found");

    fs.unlinkSync(toFilePath(filename));
  }

  async readContent(filename: string): Promise<string> {
    const isFileExits = await this.isFileExits(filename);
    if (!isFileExits) throw new Error("File not found");

    return fs.readFileSync(toFilePath(filename), "utf-8");
  }
}
