import Busboy from 'busboy';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { MAX_FILE_SIZE } from './constants.js';
import { type Request } from 'express';

const uploadMiddleware = async (req: any, res: any, next: any) => {
  if (req.method !== 'POST' && req.method !== 'PUT') return next();

  // On Firebase, the body is already parsed if it's not multipart.
  // We check the header to ensure we only run on multipart requests.
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) return next();

  const busboy = Busboy({ 
    headers: req.headers,
    limits: { fileSize: MAX_FILE_SIZE, files: 1 }
  });

  const tmpdir = os.tmpdir();
  const uploads: any = {};
  const fields: any = {};
  const fileWrites: Promise<void>[] = [];
  let isAborted = false;

  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on('file', (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const filepath = path.join(tmpdir, filename);
    
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const promise = new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      
      file.on('limit', () => {
        isAborted = true;
        fs.unlinkSync(filepath); // Clean up partial file
        reject(new Error('LIMIT_FILE_SIZE'));
      });
    });

    fileWrites.push(promise);
    uploads[fieldname] = { filepath, mimetype: mimeType, filename };
  });

  busboy.on('finish', async () => {
    try {
      await Promise.all(fileWrites); // Ensure all files are fully written to disk
      req.body = fields;
      req.files = uploads;
      next();
    } catch (err: any) {
      if (err.message === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large' });
      }
      res.status(500).json({ error: 'File processing error' });
    }
  });

  busboy.on('error', (error: any) => {
    res.status(400).json({ error: 'File upload failed' });
  });

  // FIREBASE SPECIFIC: Use rawBody
  if (req.rawBody) {
    busboy.end(req.rawBody);
  } else {
    req.pipe(busboy);
  }
};

export default uploadMiddleware;


export interface FileRequest extends Request {
  rawBody?: Buffer; // Added by Firebase
  files?: {
    [fieldname: string]: {
      filepath: string;
      mimetype: string;
      filename: string;
    };
  };
}
