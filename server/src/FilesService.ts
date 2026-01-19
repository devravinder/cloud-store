import path from "node:path";
import { MAX_FILE_SIZE, MAX_TOTAL_SIZE } from "./constants.js";
import { randomUUID } from "node:crypto";
import { fileStorageService } from "./file-stores/FileStorageService.js";
import { MaxPayloadError, NotFoundError } from "./Errors.js";
import { dbService } from "./db/DbService.js";
export interface FileMeta {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    path: string;
    createdAt: string;
}


const getTotalSize = (files: FileMeta[]) =>
  files.reduce((sum, f) => sum + f.size, 0);

const saveFile = async (file: AppFile, fileId?: string) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new MaxPayloadError(`File exceeds limit (${MAX_FILE_SIZE} bites)`);
  }

  const files = await getFiles();
  const totalSize = getTotalSize(files);

  if (totalSize + file.size > MAX_TOTAL_SIZE) {
    throw new MaxPayloadError(`Total storage limit exceeded (${MAX_TOTAL_SIZE} bites)`);
  }

  const id =  fileId || `${randomUUID()}${path.extname(file.name)}`;

  const mimeType = file.mimeType;

  const result = await fileStorageService.upload(file.path, id, mimeType);

  const meta: FileMeta = {
    id,
    name: file.name,
    mimeType,
    size: file.size,
    path: result.path,
    createdAt: new Date().toISOString(),
  };

  files.push(meta);

  await dbService.create(meta.id, meta);

  return meta;
};

const updateFile = async (id: string, file: AppFile) => {

  if (file.size > MAX_FILE_SIZE) {
    throw new MaxPayloadError("File exceeds 5MB limit");
  }

  const files = await getFiles();
  const totalSize = getTotalSize(files.filter((f) => f.id === id));

  if (totalSize + file.size > MAX_TOTAL_SIZE) {
    throw new MaxPayloadError("Total storage limit exceeded (100MB)");
  }

  const mimeType = file.mimeType;

  const result = await fileStorageService.upload(file.name, id, mimeType);

  const meta: Partial<FileMeta> = {
    id,
    name: file.name,
    mimeType,
    size: file.size,
    path: result.path,
  };

  await dbService.update(id, meta);

  return meta;
};

const downloadFile = async (id: string) => {
  const file = await getFile(id);
  const stream = await fileStorageService.download(id);

  return { stream, file };
};

const deleteFile = async (id: string) => {
  const file = await getFile(id);

  await dbService.delete(id)

  await fileStorageService.deleteFile(file.id);

};

const getFile = async (id: string) => {
  const file = await dbService.getById(id)
  if (!file) throw new NotFoundError("File not found");

  return file;
};

const getFiles = async () => {
  const files = await dbService.getAll();
  return files;
};

const getFileContent = async (id: string) => {
  const file = await getFile(id)

  const content = await fileStorageService.readContent(file.path);

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
