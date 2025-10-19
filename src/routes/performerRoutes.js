import express from 'express';
import {
    getAllPerformers,
    getPerformerById,
    createPerformer,
    updatePerformer,
    deletePerformer,
    searchPerformers
} from '../controllers/performerController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for client view)
router.get('/search', searchPerformers);
router.get('/:id', getPerformerById);

// Protected routes (admin only)
router.get('/', authenticateAdmin, getAllPerformers);
router.post('/', authenticateAdmin, createPerformer);
router.put('/:id', authenticateAdmin, updatePerformer);
router.delete('/:id', authenticateAdmin, deletePerformer);

export default router;
