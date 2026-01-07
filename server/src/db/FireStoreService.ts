import {
  getFirestore,
  type CollectionReference,
  type DocumentData,
  type Firestore,
} from "firebase-admin/firestore";
import { type DbService } from "./DbService.js";
import { NotFoundError } from "../Errors.js";
import { FirebaseConfig } from "../FirebaseConfig.js";

export class FirestoreService<T extends DocumentData> implements DbService<T> {
  private readonly db: Firestore;
  private readonly collection: CollectionReference<T>;

  constructor(collectionName: string) {
    new FirebaseConfig();
    this.db = getFirestore();
    this.collection = this.db.collection(
      collectionName
    ) as CollectionReference<T>;
  }

  async create(id: string, data: T): Promise<T> {
    await this.collection.doc(id).set(data);
    return data;
  }

  async getById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async getAll(): Promise<T[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const ref = this.collection.doc(id);

    await ref.update(data as { [key: string]: any });

    const current = await this.getById(id);
    if (!current) throw new NotFoundError(`Document with id ${id} not found`);

    return current;
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
