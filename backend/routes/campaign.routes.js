import express from 'express';
import * as campaignController from '../controllers/campaign.controller.js';
import { isAuthenticate } from '../middleware/verifyToken.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

router.post('/:workspaceId', 
  isAuthenticate, 
  fileUpload(), 
  campaignController.createCampaign
);
router.get('/:workspaceId', campaignController.getCampaigns);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

export default router;
