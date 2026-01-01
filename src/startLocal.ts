import express from "express";
import { PUBLIC_PATH, SERVER_PORT } from "./constants.js";
import { logger } from "./logger.js";
import server from "./server.js";


const port = SERVER_PORT;
server.use(express.static(PUBLIC_PATH));// run only on local & on firebase use hoisting

server.listen(port, () => {logger.log(`Server running at http://localhost:${port}`);});