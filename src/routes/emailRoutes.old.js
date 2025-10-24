import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { generateEmail } from '../services/aiService.js';
import { sendPerformerEmail } from '../services/emailService.js';
import { CastingOrder, Performer } from '../models/index.js';

const router = express.Router();

router.post('/generate', authenticateAdmin, async (req, res) => {
    try {
        const { performerId, castingOrderId } = req.body;

        const performer = await Performer.findByPk(performerId);
        if (!performer) {
            return res.status(404).json({ error: 'Performer not found' });
        }

        const order = await CastingOrder.findByPk(castingOrderId);
        if (!order) {
            return res.status(404).json({ error: 'Casting order not found' });
        }

        const emailContent = await generateEmail(
            performer,
            order.commercialDescription,
            order.companyName
        );

        res.json({ emailContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/send', authenticateAdmin, async (req, res) => {
    try {
        const { performerId, emailContent } = req.body;

        const performer = await Performer.findByPk(performerId);
        if (!performer) {
            return res.status(404).json({ error: 'Performer not found' });
        }

        const result = await sendPerformerEmail(performer, emailContent);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
