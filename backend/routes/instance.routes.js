import express from 'express';
import { 
    createInstance, 
    getAllInstances, 
    getInstanceById, 
    updateInstance, 
    deleteInstance,
    getInstancesByWorkspace,
    connectInstance
} from '../controllers/instance.controller.js';
import { isAuthenticate } from '../middleware/verifyToken.js';

const router = express.Router();

// Modificamos estas rotas para passar o socket
router.post('/:workspaceId', isAuthenticate, (req, res) => {
    const io = req.app.get('io');
    createInstance(req, res, io);
});
router.put('/:id', isAuthenticate, (req, res) => {
    const io = req.app.get('io');
    updateInstance(req, res, io);
});
router.delete('/:id', isAuthenticate, (req, res) => {
    const io = req.app.get('io');
    deleteInstance(req, res, io);
});

// Estas rotas permanecem inalteradas
router.get('/', isAuthenticate, getAllInstances);
router.get('/:id', isAuthenticate, getInstanceById);
router.get('/workspace/:workspaceId', isAuthenticate, getInstancesByWorkspace);
router.get('/connect/:instanceName', isAuthenticate, connectInstance);

export default router;
