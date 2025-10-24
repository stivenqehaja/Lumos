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

/**
 * @swagger
 * /api/performers/search:
 *   get:
 *     summary: Search performers
 *     description: Search and filter performers by various criteria (public endpoint)
 *     tags: [Performers]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *         description: Filter by gender
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Minimum age
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Maximum age
 *       - in: query
 *         name: minHeight
 *         schema:
 *           type: integer
 *         description: Minimum height in cm
 *       - in: query
 *         name: maxHeight
 *         schema:
 *           type: integer
 *         description: Maximum height in cm
 *       - in: query
 *         name: hairColor
 *         schema:
 *           type: string
 *         description: Filter by hair color
 *       - in: query
 *         name: eyeColor
 *         schema:
 *           type: string
 *         description: Filter by eye color
 *     responses:
 *       200:
 *         description: List of performers matching criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Performer'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', searchPerformers);

/**
 * @swagger
 * /api/performers/{id}:
 *   get:
 *     summary: Get performer by ID
 *     description: Retrieve a single performer's details by ID (public endpoint)
 *     tags: [Performers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performer ID
 *     responses:
 *       200:
 *         description: Performer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Performer'
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
router.get('/:id', getPerformerById);

/**
 * @swagger
 * /api/performers:
 *   get:
 *     summary: Get all performers
 *     description: Retrieve all performers (admin only)
 *     tags: [Performers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all performers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Performer'
 *       401:
 *         description: Not authenticated
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
router.get('/', authenticateAdmin, getAllPerformers);

/**
 * @swagger
 * /api/performers:
 *   post:
 *     summary: Create new performer
 *     description: Create a new performer profile (admin only)
 *     tags: [Performers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Performer'
 *           example:
 *             firstName: John
 *             lastName: Doe
 *             birthday: "1990-05-15"
 *             email: john.doe@example.com
 *             phone: "+1234567890"
 *             gender: Male
 *             height: 180
 *             hairColor: Brown
 *             eyeColor: Blue
 *             skinTone: Fair
 *             faceShape: Oval
 *             distinctiveMarks: None
 *             images: []
 *             profileImageIndex: 0
 *     responses:
 *       201:
 *         description: Performer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Performer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
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
router.post('/', authenticateAdmin, createPerformer);

/**
 * @swagger
 * /api/performers/{id}:
 *   put:
 *     summary: Update performer
 *     description: Update an existing performer's information (admin only)
 *     tags: [Performers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Performer'
 *     responses:
 *       200:
 *         description: Performer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Performer'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.put('/:id', authenticateAdmin, updatePerformer);

/**
 * @swagger
 * /api/performers/{id}:
 *   delete:
 *     summary: Delete performer
 *     description: Delete a performer by ID (admin only)
 *     tags: [Performers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Performer ID
 *     responses:
 *       200:
 *         description: Performer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Performer deleted successfully
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
router.delete('/:id', authenticateAdmin, deletePerformer);

export default router;
