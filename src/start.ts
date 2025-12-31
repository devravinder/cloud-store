import { ENV, SERVER_PORT } from "./constants.js";
import { logger } from "./logger.js";
import server from "./server.js";
import type {Request, Response} from 'express'
import {onRequest} from "firebase-functions/https";

const port = SERVER_PORT;

logger.log("------------------------------------")

const startApp = async () => {
  switch (ENV) {
    case "LOCAL": {
     // app.listen(port, () => {logger.log(`Server running at http://localhost:${port}`);});
      break
    }
    case "FIREBASE": {
      await import("./firebaseApp.js");
      break
    }
  }
};

// startApp()

export function app(){
  return server
}

// @ts-ignore
onRequest((req:Request,res:Response)=>res.json("Hello"))