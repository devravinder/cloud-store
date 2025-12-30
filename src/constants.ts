import path from "path";

export const SERVER_PORT = process.env.PORT;
export const API_PREFIX = "/files";

export const STORE_DIR = path.join(process.cwd(), "src", "store");
export const DB_PATH = path.join(process.cwd(), "src", "db.json");

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
