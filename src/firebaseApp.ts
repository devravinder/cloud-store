import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
//  * import {onCall} from "firebase-functions/v2/https";

import app from "./server.js";
import { logger } from "./logger.js";

import type {Request, Response} from 'express'
logger.log("Firebase app started")
setGlobalOptions({ maxInstances: 1 });
// onRequest((req,res)=>res.json("Hello"))

export function handle(req:Request, res:Response) {
   res.send("Hellow");
}
