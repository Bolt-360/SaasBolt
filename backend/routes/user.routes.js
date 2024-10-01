import express from "express";
import { isAuthenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticate, getUserForSidebar)

export default router;
