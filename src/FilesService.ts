import path from "node:path";
import { MAX_FILE_SIZE, MAX_TOTAL_SIZE } from "./constants.js";
import { DB } from "./DbService.js";
import { randomUUID } from "node:crypto";
import { storageService } from "./storage-services/StorageService.js";
import { MaxPayloadError, NotFoundError } from "./Errors.js";
import type { FileMeta } from "../dist/storage-services/localStorage.js";

const getTotalSize = (files: FileMeta[]) =>
  files.reduce((sum, f) => sum + f.size, 0);

const saveFile = async (file: Express.Multer.File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new MaxPayloadError("File exceeds 5MB limit");
  }

  const files = await getFiles();
  const totalSize = getTotalSize(files);

  if (totalSize + file.size > MAX_TOTAL_SIZE) {
    throw new MaxPayloadError("Total storage limit exceeded (100MB)");
  }

  const ext = path.extname(file.originalname);
  const id = `${randomUUID()}${ext}`;

  const mimeType = file.mimetype;

  const result = await storageService.upload(file.path, id, mimeType);

  const meta: FileMeta = {
    id,
    name: file.originalname,
    mimeType,
    size: file.size,
    path: result.path,
    createdAt: new Date().toISOString(),
  };

  files.push(meta);

  await DB.write(files);

  return meta;
};

const updateFile = async (id: string, file: Express.Multer.File) => {
  const old = await getFile(id);

  if (file.size > MAX_FILE_SIZE) {
    throw new MaxPayloadError("File exceeds 5MB limit");
  }

  const files = await getFiles();
  const totalSize = getTotalSize(files.filter((f) => f.id === id));

  if (totalSize + file.size > MAX_TOTAL_SIZE) {
    throw new MaxPayloadError("Total storage limit exceeded (100MB)");
  }

  const mimeType = file.mimetype;

  const result = await storageService.upload(file.path, id, mimeType);

  const meta: FileMeta = {
    ...old,
    name: file.originalname,
    mimeType,
    size: file.size,
    path: result.path,
  };

  await DB.write(files.map((f) => (f.id === id ? meta : f)));

  return meta;
};

const downloadFile = async (id: string) => {
  const file = await getFile(id);
  const stream = await storageService.download(id);

  return { stream, file };
};

const deleteFile = async (id: string) => {
  const files = await getFiles();
  const file = files.find((f) => f.id === id);
  if (!file) throw new NotFoundError("File not found");

  await storageService.deleteFile(id);

  DB.write(files.filter((f) => f.id !== id));
};

const getFile = async (id: string) => {
  const files = await getFiles();
  const file = files.find((f) => f.id === id);
  if (!file) throw new NotFoundError("File not found");

  return file;
};

const getFiles = async () => {
  const files = await DB.read();
  return files;
};

const getFileContent = async (id: string) => {
  const file = await getFile(id)

  const content = await storageService.readContent(file.path);

  return content;
};

export const FileService = {
  getFiles,
  getFile,
  saveFile,
  updateFile,
  downloadFile,
  deleteFile,
  getFileContent,
};
