// src/lib/firebase.ts
import admin, { type ServiceAccount } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";

import serviceAccount from "../firebase-credentials.json" with { type: "json" };
import { IS_EMULATOR } from "./constants.js";


const firebaseConfig = {
    projectId: serviceAccount.project_id,
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
    ...!IS_EMULATOR&&{credential: admin.credential.cert(serviceAccount as ServiceAccount)}
}

export class FirebaseConfig {
    constructor(){
        if (getApps().length === 0) {
        initializeApp(firebaseConfig);
      }
 }
}
