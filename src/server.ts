import cors from "cors";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { API_PREFIX } from "./constants.js";
import swaggerDocument from "./openapi.json" with { type: "json" };
import routes from "./routes.js";
import './util/generateWebEnv.js';
import { clientErrorHandler, serverErrorHandler } from "./Errors.js";
import { setupDb } from "./DbService.js";


await setupDb()
const app: Express = express();
app.use(cors());

app.use(express.json());

// app.use(express.static(PUBLIC_PATH));// run only on local & on firebase use hoisting

app.get("/test",(req, res)=>res.json("Hello World"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(API_PREFIX, routes, clientErrorHandler, serverErrorHandler);


export default app