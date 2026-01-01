import path from "path";

export const SERVER_PORT = process.env.PORT;
export const ENV = process.env.ENV
export const API_PREFIX = "/api";

export const STORE_DIR = path.join(process.cwd(), "src", "store");
export const DB_PATH = path.join(STORE_DIR, "db.json");
export const PUBLIC_PATH = path.join(process.cwd(), "public");

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
