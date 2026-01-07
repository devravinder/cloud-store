import fs, { promises as fsPromise } from "fs";
import { type DbService } from "./DbService.js";
import { NotFoundError } from "../Errors.js";

export class JsonDbService<T extends { id: string }> implements DbService<T> {
  private filePath: string;

  constructor(fileName: string) {
    if (!fs.existsSync(fileName))
      fs.writeFileSync(fileName, JSON.stringify([], null, 2));
    this.filePath = fileName;
  }

  private async readDb(): Promise<T[]> {
    try {
      const data = await fsPromise.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeDb(data: T[]): Promise<void> {
    await fsPromise.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(id: string, data: T): Promise<T> {
    const db = await this.readDb();
    const record = { ...data, id };
    db.push(record);
    await this.writeDb(db);
    return record;
  }

  async getById(id: string): Promise<T | null> {
    const db = await this.readDb();
    return db.find((item) => item.id === id) || null;
  }

  async getAll(): Promise<T[]> {
    return this.readDb();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const db = await this.readDb();
    const index = db.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundError(`Record not found withn id: ${id}`);
    }

    db[index] = { ...db[index], ...data } as T;
    await this.writeDb(db);

    return db[index];
  }

  async delete(id: string): Promise<void> {
    const db = await this.readDb();
    const filtered = db.filter((item) => item.id !== id);
    await this.writeDb(filtered);
  }
}
