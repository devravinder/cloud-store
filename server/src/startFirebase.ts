import { onRequest } from "firebase-functions/https";
import server from "./server.js";

export const app = onRequest(server)
/* 
to access on firease emulator
http://localhost:3000/cloud-store-79e72/us-central1/app
http://127.0.0.1:3000/<project-name>/<region>/<export-variable-name>
*/