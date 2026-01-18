import express, { Router } from "express";
import { getFirestore } from "firebase-admin/firestore";
import type { AuthRequest } from "./authMiddleware.js";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "./Errors.js";

/* 

This is created to use in madhuram player

*/

const router: Router = express();

const db = getFirestore();

const UPDATE_INFO_COLLECTION = "updateInfo";

const updateInfo = async (collectionName: string, userId: string) => {
  const ref = db.collection(UPDATE_INFO_COLLECTION).doc(collectionName);

  await ref.set(
    {
      collectionName,
      userId,
      updatedAt: new Date(),
    },
    { merge: true } // 👈 UPSERT magic
  );
};

router.get("/:collectionName", async (req: AuthRequest, res) => {
  const userId = req.user?.uid;
  const collectionName = req.params.collectionName!;
  const collection = db.collection(collectionName);

  const snapshot = await collection.where("userId", "==", userId).get();
  const docs = snapshot.docs.map((doc) => doc.data());
  res.send(docs);
});

router.delete("/:collectionName", async (req: AuthRequest, res) => {
  const userId = req.user?.uid;
  const collectionName = req.params.collectionName!;
  const collection = db.collection(collectionName);
  const snapshot = await collection.where("userId", "==", userId).get();

  if (snapshot.empty) return res.json("No docs found");

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  await updateInfo(collectionName, userId!);

  res.json("All docs deleted");
});

router.delete("/:collectionName/:id", async (req: AuthRequest, res) => {
  const userId = req.user?.uid;
  const collectionName = req.params.collectionName!;
  const id = req.params.id!;
  const ref = db.collection(collectionName).doc(id);

  // 1. Read doc
  const snap = await ref.get();

  if (!snap.exists) throw new NotFoundError("Not found " + id);

  // 2. Check ownership
  if (snap.data()!.userId !== userId)
    throw new AuthorizationError("Not allowed");

  // 3. Delete
  await ref.delete();

  await updateInfo(collectionName, userId!);

  res.json("doc deleted");
});

router.post("/:collectionName/:id", async (req: AuthRequest, res) => {
  const userId = req.user?.uid;
  const collectionName = req.params.collectionName!;
  const id = req.params.id!;

  const item = req.body;

  if (!item) throw new ValidationError("Body must be present");

  const docRef = db.collection(collectionName).doc(id);
  docRef.set({ ...item, userId }, { merge: true });
  await updateInfo(collectionName, userId!);
  res.json("upsert success");
});
router.post("/:collectionName", async (req: AuthRequest, res) => {
  const userId = req.user?.uid;
  const collectionName = req.params.collectionName!;
  const items = req.body; // array

  if (!Array.isArray(items))
    throw new ValidationError("Body must be an array of items");

  const batch = db.batch();
  const colRef = db.collection(collectionName);

  items.forEach((item) => {
    const docRef = colRef.doc(item.id);

    batch.set(docRef, {
      ...item,
      userId,
    });
  });

  await batch.commit();
  await updateInfo(collectionName, userId!);
  res.json("Bulk insert success");
});

export default router;
