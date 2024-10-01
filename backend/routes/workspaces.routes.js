import express from "express";
import { isAuthenticate } from "../middleware/verifyToken.js"
import { getUserActiveWorkspaces, getUserWorkspaces } from "../controllers/workspaces.controller.js"

const router = express.Router();

router.get("/", isAuthenticate, getUserWorkspaces)
router.get("/active", isAuthenticate, getUserActiveWorkspaces)


export default router;