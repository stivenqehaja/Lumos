import express from 'express';
import {
    generateClientLink,
    validateAccessCode,
    addToCastingGroup,
    removeFromCastingGroup,
    getCastingGroup,
    finalizeCastingGroup,
    getAllCastingOrders,
    getCastingOrderById
} from '../controllers/clientController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/generate-link', authenticateAdmin, generateClientLink);
router.get('/casting-orders', authenticateAdmin, getAllCastingOrders);
router.get('/casting-orders/:id', authenticateAdmin, getCastingOrderById);

// Client routes
router.get('/validate/:accessCode', validateAccessCode);
router.post('/casting-group/add', addToCastingGroup);
router.post('/casting-group/remove', removeFromCastingGroup);
router.get('/casting-group/:clientId', getCastingGroup);
router.post('/casting-group/finalize', finalizeCastingGroup);

export default router;
