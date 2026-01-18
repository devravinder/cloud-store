import 'dotenv/config' // to work properly on firebase
import cors from "cors";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { API_PREFIX } from "./constants.js";
import swaggerDocument from "./openapi.json" with { type: "json" };
import routes from "./routes.js";
import { clientErrorHandler, serverErrorHandler } from "./Errors.js";
import { authenticate } from './authMiddleware.js';


const app: Express = express();
app.use(cors());



app.get("/test",(req, res)=>res.json("Hello World"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(API_PREFIX, authenticate, routes, clientErrorHandler, serverErrorHandler);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '15mb',
  parameterLimit: 50000 
}));

export default app