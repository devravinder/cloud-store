import * as fbLogger from "firebase-functions/logger";
import { APP_ENV } from "./constants.js";


type Logger= Pick<typeof console, 'log'|'info'>


const setupLogger=():Logger=>{
    switch (APP_ENV) {
  
  case "FIREBASE": return fbLogger

  default: return console
}
}

export const logger:Logger = setupLogger()
