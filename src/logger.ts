import * as fbLogger from "firebase-functions/logger";
import { ENV } from "./constants.js";


type Logger= Pick<typeof console, 'log'|'info'>


const setupLogger=():Logger=>{
    switch (ENV) {
  
  case "FIREBASE": return fbLogger

  default: return console
}
}

export const logger:Logger = setupLogger()
