import path from "path";

export const SERVER_PORT = process.env.PORT;
export const APP_ENV = process.env.APP_ENV
export const API_PREFIX = "/api";

export const STORE_DIR = path.join(process.cwd(), "src", "local-files-store");
export const DB_PATH = path.join(STORE_DIR, "files.json");
export const PUBLIC_PATH = path.join(process.cwd(), "public");

export const IS_EMULATOR = Boolean(process.env.FIREBASE_STORAGE_EMULATOR_HOST);



export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
