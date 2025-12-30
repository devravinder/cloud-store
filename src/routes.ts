import express, { Router } from "express";
import multer from "multer";
import fs from "fs";
import { saveFile, deleteFile, getFile, readDB, toFilePath } from "./fileHandle.js";

const upload = multer({ dest: "temp/" });
const router: Router = express();


router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    const result = saveFile(req.file);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/download/:id", (req, res) => {
  const file = getFile(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  res.download(toFilePath(file.path), file.name);
});


router.get("/content/:id", (req, res) => {
  const file = getFile(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  const content = fs.readFileSync(toFilePath(file.path), "utf-8");
  res.send(content);
});


router.put("/update/:id", upload.single("file"), (req, res) => {
  try {
    const old = getFile(req.params.id!);
    if (!old) return res.status(404).json({ error: "File not found" });

    deleteFile(old.id);
    const updated = saveFile(req.file!);

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", (req, res) => {
  try {
    deleteFile(req.params.id);
    res.json({ message: "File deleted" });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});


router.get("/", (_, res) => {
  res.json(readDB());
});

export default router;
