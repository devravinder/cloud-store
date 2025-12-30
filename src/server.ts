import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import router from "./routes.js";
import { STORE_DIR, DB_PATH, API_PREFIX, SERVER_PORT } from "./constants.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json" with { type: "json" };


const port = SERVER_PORT;

const app: Express = express();
app.use(cors());

app.use(express.json());
// app.use(express.static("public"));
app.use(express.static(path.join(process.cwd(), "public")));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");

app.use(API_PREFIX, router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app