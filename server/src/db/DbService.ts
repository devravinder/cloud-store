import { DB_PATH } from "../constants.js";
import type { FileMeta } from "../FilesService.js";
import { FirestoreService } from "./FireStoreService.js";
import { JsonDbService } from "./JsonDbService.js";

// DbService.ts
export interface DbService<T> {
  create(id: string, data: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}


export const dbService: DbService<FileMeta> =
  process.env.DB_STORAGE === "FIREBASE"
    ? new FirestoreService("files")
    : new JsonDbService(DB_PATH);
