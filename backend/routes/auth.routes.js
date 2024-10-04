import express from "express"
import { cadastro, login, logout, forgotPassword, verPwdToken, changePassword } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/cadastro", cadastro)

router.post("/login", login)

router.get("/logout", logout)

router.get("/forgotpassword", forgotPassword)

router.get("/verpwdtoken", verPwdToken)

router.get("/changepwd", changePassword)

export default router