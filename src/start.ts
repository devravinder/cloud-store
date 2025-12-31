import { ENV, SERVER_PORT } from "./constants.js";
import { logger } from "./logger.js";
import app from "./server.js";

const port = SERVER_PORT;

const startApp = async () => {
  switch (ENV) {
    case "LOCAL": {
      app.listen(port, () => {
        logger.log(`Server running at http://localhost:${port}`);
      });
      break
    }
    case "FIREBASE": {
      await import("./firebaseApp.js");
      break
    }
  }
};


startApp()