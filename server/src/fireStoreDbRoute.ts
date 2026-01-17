import express, { Router } from "express";
import { getFirestore } from "firebase-admin/firestore";
import type { AuthRequest } from "./authMiddleware.js";
import { ValidationError } from "./Errors.js";

/* 

This is created to use in madhuram player

*/

const router: Router = express();

const db = getFirestore();

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

  res.json("All docs deleted");
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
    const docRef = colRef.doc();

    batch.set(docRef, {
      ...item,
      userId,
    });
  });

  await batch.commit();
  res.json("Bulk insert success");
});

export default router;
