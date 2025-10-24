import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { generateEmail } from '../services/aiService.js';
import { sendPerformerEmail } from '../services/emailService.js';
import { CastingOrder, Performer } from '../models/index.js';

const router = express.Router();

/**
 * @swagger
 * /api/email/generate:
 *   post:
 *     summary: Generate AI-powered email
 *     description: Generate a personalized email for a performer using Claude AI (admin only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - performerId
 *               - castingOrderId
 *             properties:
 *               performerId:
 *                 type: string
 *                 format: uuid
 *                 description: Performer ID
 *               castingOrderId:
 *                 type: string
 *                 format: uuid
 *                 description: Casting order ID
 *           example:
 *             performerId: "123e4567-e89b-12d3-a456-426614174000"
 *             castingOrderId: "987fcdeb-51a2-43e7-b789-123456789abc"
 *     responses:
 *       200:
 *         description: Email content generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emailContent:
 *                   type: string
 *                   description: Generated email content
 *                   example: "Dear John Doe,\n\nWe are excited to inform you..."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Performer or casting order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/email/send:
 *   post:
 *     summary: Send email to performer
 *     description: Send an email to a performer (admin only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - performerId
 *               - emailContent
 *             properties:
 *               performerId:
 *                 type: string
 *                 format: uuid
 *                 description: Performer ID
 *               emailContent:
 *                 type: string
 *                 description: Email content to send
 *           example:
 *             performerId: "123e4567-e89b-12d3-a456-426614174000"
 *             emailContent: "Dear John Doe,\n\nWe are excited to inform you..."
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully"
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Performer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
