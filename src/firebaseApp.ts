import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
//  * import {onCall} from "firebase-functions/v2/https";

import app from "./server.js";
import { logger } from "./logger.js";

setGlobalOptions({ maxInstances: 1 });
onRequest(app)

logger.log("Firebase app started")