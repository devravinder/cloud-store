import cors from "cors";
import express, { type Express } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./openapi.json" with { type: "json" };
import { API_PREFIX } from "./constants.js";
import routes from "./routes.js";

const app: Express = express();
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/test",(req, res)=>res.json("Hello World"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(API_PREFIX, routes);

export default app