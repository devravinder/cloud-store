import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { DB_PATH, STORE_DIR, MAX_FILE_SIZE, MAX_TOTAL_SIZE } from "./constants.js";

export interface FileMeta {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

export const readDB = (): FileMeta[] => {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};

export const writeDB = (data: FileMeta[]) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const getTotalSize = (files: FileMeta[]) =>
  files.reduce((sum, f) => sum + f.size, 0);

export const saveFile = (file: Express.Multer.File): FileMeta => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds 5MB limit");
  }

  const files = readDB();
  const totalSize = getTotalSize(files);

  if (totalSize + file.size > MAX_TOTAL_SIZE) {
    throw new Error("Total storage limit exceeded (100MB)");
  }

  const id = uuid();
  const filePath = path.join(STORE_DIR, id);

  fs.renameSync(file.path, filePath);

  const meta: FileMeta = {
    id,
    name: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: filePath,
    createdAt: new Date().toISOString()
  };

  files.push(meta);
  writeDB(files);

  return meta;
};

export const deleteFile = (id: string) => {
  const files = readDB();
  const file = files.find(f => f.id === id);
  if (!file) throw new Error("File not found");

  fs.unlinkSync(file.path);
  writeDB(files.filter(f => f.id !== id));
};

export const getFile = (id: string) => {
  const files = readDB();
  return files.find(f => f.id === id);
};
