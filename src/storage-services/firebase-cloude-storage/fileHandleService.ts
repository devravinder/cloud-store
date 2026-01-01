import type { Request, Response } from "express";
import { uploadToCloud, downloadFromCloud } from "./firebaseCloudeStorage.js";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadToCloud(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      message: "File uploaded successfully",
      file: result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    const stream = await downloadFromCloud(filename!);
    stream.pipe(res);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
