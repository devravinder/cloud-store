import 'dotenv/config' // to work properly on emulators
import cors from "cors";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { API_PREFIX } from "./constants.js";
import swaggerDocument from "./openapi.json" with { type: "json" };
import routes from "./routes.js";
import './util/generateWebEnv.js';
import { clientErrorHandler, serverErrorHandler } from "./Errors.js";
import { setupDb } from "./DbService.js";


const app: Express = express();
app.use(cors());

app.use(express.json());


//====
// Create an initialization promise ( we can't use top level await )
 await setupDb()

/* 

const dbInit = setupDb().catch(err => {
    console.error("Database initialization failed", err);
});
// Middleware to ensure DB is ready before any route runs
app.use(async (req, res, next) => {
    await dbInit; 
    next();
});


 */
// app.use(express.static(PUBLIC_PATH));// run only on local & on firebase use hoisting

app.get("/test",(req, res)=>res.json("Hello World"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(API_PREFIX, routes, clientErrorHandler, serverErrorHandler);


export default app