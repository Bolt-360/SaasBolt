import express from "express"
import { getUserConversations } from "../controllers/conversations.controller.js"
import { isAuthenticate } from "../middleware/verifyToken.js"

const router = express.Router()
router.get("/", isAuthenticate, getUserConversations)

export default router