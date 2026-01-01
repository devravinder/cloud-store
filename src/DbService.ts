import type { FileMeta } from "./storage-services/localStorage.js";
import { storageService } from "./storage-services/StorageService.js";

const DB_FILE = "db.json";

const setupDb = async () => {
  const isFileExits = storageService.isFileExits(DB_FILE);

  if (!isFileExits) await writeToDb([]);

  console.log("DB Setup done");
};

const writeToDb = async (files: FileMeta[]) => {
  await storageService.upload(
    Buffer.from(JSON.stringify(files, null, 2), "utf-8"),
    DB_FILE,
    "application/json"
  );
};

const readDB = async () => {
  const content = await storageService.readContent(DB_FILE);

  const data = JSON.parse(content) as FileMeta[];

  return data;
};

setupDb();

export const DB = { read: readDB, write: writeToDb };
