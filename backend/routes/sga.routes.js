import express from 'express';
import { searchBoleto, syncSgaCredentials } from '../controllers/sga.controller.js';
import { isAuthenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/sync-credentials', isAuthenticate, syncSgaCredentials);
router.get('/buscar-boleto/:nosso_numero', isAuthenticate, searchBoleto);

export default router;
