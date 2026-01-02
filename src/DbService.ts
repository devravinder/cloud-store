import type { FileMeta } from "./FilesService.js";
import { storageService } from "./storage-services/StorageService.js";

const DB_FILE = "db.json";

export const setupDb = async () => {
  console.log("Setting up DB");
  const isFileExits = await storageService.isFileExits(DB_FILE);

  console.log({isFileExits})

  if (!isFileExits) {
    await writeToDb([]);
  }
  console.log("DB Setup done");
};

const writeToDb = async (files: FileMeta[]) => {
  await storageService.writeTextContent(
    DB_FILE,
    JSON.stringify(files, null, 2),
    "application/json"
  );
};

const readDB = async () => {
  const content = await storageService.readContent(DB_FILE);
  const data = JSON.parse(content) as FileMeta[];
  return data;
};

export const DB = { read: readDB, write: writeToDb };
