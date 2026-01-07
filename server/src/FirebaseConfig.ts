import admin, { type ServiceAccount, type AppOptions } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import {
  FIREBASE_CREDENTIALS_FILE,
  IS_EMULATOR,
  IS_LOCAL,
} from "./constants.js";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

export class FirebaseConfig {
  constructor() {
    if (getApps().length > 0) return;

    let config: AppOptions | undefined =undefined;

    if (IS_LOCAL) {
      const path = resolve(FIREBASE_CREDENTIALS_FILE);
      const fileContent = readFileSync(path, "utf8");
      const serviceAccount = JSON.parse(fileContent);

      config = {
        projectId: serviceAccount.project_id,
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
        ...(!IS_EMULATOR && {
          credential: admin.credential.cert(serviceAccount as ServiceAccount),
        }),
      };
    }
    initializeApp(config);
  }
}
