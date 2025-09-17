import express from 'express';
import { setupSSEConnection } from '../controllers/notification.controller';

const router = express.Router();

// Route pour établir la connexion SSE
router.get('/notifications', setupSSEConnection);

export default router;



