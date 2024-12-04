import express from "express";
import {
    createUser,
    getActiveWorkspace,
    getUserDetails,
    getUserForSidebar,
    getUsers,
    getUserWorkspaces,
    setActiveWorkspace,
    updateUser
} from "../controllers/user.controller.js";
import { isAuthenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/workspace/:workspaceId", isAuthenticate, getUsers);
router.get("/sidebar", isAuthenticate, getUserForSidebar);
router.post("/", isAuthenticate, createUser);
router.put("/", isAuthenticate, updateUser);
router.put("/active-workspace", isAuthenticate, setActiveWorkspace);
router.get("/workspaces", isAuthenticate, getUserWorkspaces);
router.get("/active-workspace", isAuthenticate, getActiveWorkspace);
router.get("/me", isAuthenticate, getUserDetails);

export default router;  
