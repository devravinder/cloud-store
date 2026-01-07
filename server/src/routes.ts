import express, { Router } from "express";
import filesRoute from "./filesRoute.js";

const router: Router = express();

router.use("/files", filesRoute);

export default router;
