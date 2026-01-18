import express, { Router } from "express";
import multer from "multer";
import { FileService } from "./FilesService.js";
import { NoFilePayloadError } from "./Errors.js";

const upload = multer({ dest: "temp/" });
const router: Router = express();

router.post("/upload/:id?", upload.single("file"), async (req, res) => {
  const id = req.params.id
  if (!req.file) throw new NoFilePayloadError("No file uploaded");
  const result = await FileService.saveFile(req.file, id);
  res.json(result);
});

router.get("/download/:id", async (req, res) => {
  const { stream, file } = await FileService.downloadFile(req.params.id!);

  res.contentType(file.mimeType);
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  stream.pipe(res);
});

router.get("/content/:id", async (req, res) => {
  const content = await FileService.getFileContent(req.params.id!);
  res.send(content);
});

router.put("/update/:id", upload.single("file"), async (req, res) => {
  try {
    const result = await FileService.updateFile(req.params.id!, req.file!);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  await FileService.deleteFile(req.params.id);
  res.json({ message: "File deleted" });
});

router.get("/", async (_, res) => {
  const files = await FileService.getFiles();
  res.json(files);
});

export default router;
