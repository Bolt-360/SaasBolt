import express from 'express';
import { createSgaUser, syncSgaCredentials } from '../controllers/sgaController.js';
import { isAuthenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/create-user', isAuthenticate, createSgaUser);
router.post('/sync-credentials', isAuthenticate, syncSgaCredentials);

export default router;
