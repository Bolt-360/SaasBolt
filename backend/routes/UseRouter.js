import express from 'express';
import { getUsers } from '../controllers/user.controller.js'; // ajuste o caminho conforme necessário

const router = express.Router();

router.get('/users', getUsers);

export default router;
