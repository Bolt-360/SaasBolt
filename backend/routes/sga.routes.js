import express from 'express';
import { syncSgaCredentials } from '../controllers/sga.controller.js';
import { isAuthenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/sync-credentials', isAuthenticate, syncSgaCredentials);

export default router;
