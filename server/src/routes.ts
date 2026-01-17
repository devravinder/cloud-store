import express, { Router } from "express";
import filesRoute from "./filesRoute.js";
import fireStoreDbRoute from './fireStoreDbRoute.js'

const router: Router = express();

router.use("/files", filesRoute);
router.use("/firestore", fireStoreDbRoute);

export default router;
