import express from 'express';
import { 
    createCampaign, 
    getAllCampaigns, 
    getCampaignById, 
    updateCampaign, 
    deleteCampaign 
} from '../controllers/campaign.controller.js';
import { isAuthenticate } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', isAuthenticate, createCampaign);
router.get('/', isAuthenticate, getAllCampaigns);
router.get('/:id', isAuthenticate, getCampaignById);
router.put('/:id', isAuthenticate, updateCampaign);
router.delete('/:id', isAuthenticate, deleteCampaign);

export default router;

