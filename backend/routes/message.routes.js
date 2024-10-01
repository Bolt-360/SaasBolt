import express from "express"
import { isAuthenticate } from "../middleware/verifyToken.js"
import { getMessage, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()
router.post("/send/:id", isAuthenticate, sendMessage)
router.get("/:id", isAuthenticate, getMessage)

export default router