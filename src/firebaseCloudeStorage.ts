import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET
});

const bucket = getStorage().bucket();

export async function uploadToCloud(
  buffer: Buffer,
  filename: string,
  mimeType: string
) {
  const file = bucket.file(filename);

  await file.save(buffer, {
    contentType: mimeType,
    resumable: false
  });

  return {
    name: file.name,
    bucket: bucket.name
  };
}


export async function downloadFromCloud(filename: string) {
  const file = bucket.file(filename);
  const [exists] = await file.exists();

  if (!exists) throw new Error("File not found");

  return file.createReadStream();
}
