import { SERVER_PORT } from "./constants.js";
import { logger } from "./logger.js";
import server from "./server.js";


const port = SERVER_PORT;

server.listen(port, () => {logger.log(`Server running at http://localhost:${port}`);});