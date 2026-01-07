import fs from "fs";
import path from "path";
import type { Readable } from "stream";
import { STORE_DIR } from "../constants.js";
import type { FileStorageService } from "./FileStorageService.js";
import { NotFoundError } from "../Errors.js";

const toFilePath = (filename: string) => path.join(STORE_DIR, filename);

export class LocalFileStorage implements FileStorageService {
  constructor() {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR);
    }
  }
  async isFileExits(filename: string) {
    const filePath = toFilePath(filename);

    return fs.existsSync(filePath);
  }

  async upload(tempFilePath: string, filename: string, _mimeType: string) {
    const destPath = toFilePath(filename);

    fs.renameSync(tempFilePath, destPath);

    return { path: filename };
  }

  async writeTextContent(filename: string, content: string) {
    fs.writeFileSync(toFilePath(filename), content, "utf-8");
    return { path: filename };
  }

  async download(filename: string): Promise<Readable> {
    const isFileExits = await this.isFileExits(filename);
    if (!isFileExits) throw new NotFoundError("File not found");

    return fs.createReadStream(toFilePath(filename));
  }

  async deleteFile(filename: string): Promise<void> {
    const isFileExits = await this.isFileExits(filename);
    if (!isFileExits) throw new NotFoundError("File not found");

    fs.unlinkSync(toFilePath(filename));
  }

  async readContent(filename: string): Promise<string> {
    const isFileExits = await this.isFileExits(filename);
    if (!isFileExits) throw new NotFoundError("File not found");

    return fs.readFileSync(toFilePath(filename), "utf-8");
  }
}
