import express, { Router } from "express";
import { FileService } from "./FilesService.js";
import { NoFilePayloadError } from "./Errors.js";
import uploadMiddleware, { type FileRequest } from "./uploadMiddleware.js";
import * as fs from "fs";

const router: Router = express();

const  safeName = (filename: string)=>filename.replace(/[^\w.-]/g, "_");

router.post(
  ["/upload", "/upload/:id"],
  uploadMiddleware,
  async (req: FileRequest, res) => {
    const id = req.params.id;

    const file = req.files?.["file"]; // Match the key from frontend FormData

    if (!file) throw new NoFilePayloadError("No file uploaded");

    const appFile: AppFile = {
      mimeType: file.mimetype,
      path: file.filepath,
      size: fs.statSync(file.filepath).size,
      name: safeName(file.filename),
    };
    const result = await FileService.saveFile(appFile, id);
    res.json(result);
  }
);

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

router.put("/update/:id", uploadMiddleware, async (req:FileRequest, res) => {
  try {
    const file = req.files?.["file"]; // Match the key from frontend FormData

    if (!file) throw new NoFilePayloadError("No file uploaded");

    const appFile: AppFile = {
      mimeType: file.mimetype,
      path: file.filepath,
      size: fs.statSync(file.filepath).size,
      name: safeName(file.filename),
    };
    const result = await FileService.updateFile(req.params.id!, appFile);
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
