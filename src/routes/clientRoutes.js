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

/**
 * @swagger
 * /api/client/generate-link:
 *   post:
 *     summary: Generate client access link
 *     description: Create a unique access link for a client to view and select performers (admin only)
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - commercialDescription
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: Client company name
 *               commercialDescription:
 *                 type: string
 *                 description: Description of the commercial project
 *           example:
 *             companyName: "Acme Productions"
 *             commercialDescription: "Summer fashion campaign 2024"
 *     responses:
 *       200:
 *         description: Client link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *                 accessCode:
 *                   type: string
 *                   description: Unique access code
 *                   example: "ABC123XY"
 *                 url:
 *                   type: string
 *                   description: Full URL for client portal
 *                   example: "http://localhost:3000/client?code=ABC123XY"
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
 */
router.post('/generate-link', authenticateAdmin, generateClientLink);

/**
 * @swagger
 * /api/client/validate/{accessCode}:
 *   get:
 *     summary: Validate client access code
 *     description: Validate an access code and retrieve client information
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: accessCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Client access code
 *         example: "ABC123XY"
 *     responses:
 *       200:
 *         description: Access code is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     companyName:
 *                       type: string
 *                     commercialDescription:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Access code expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Invalid access code
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
router.get('/validate/:accessCode', validateAccessCode);

/**
 * @swagger
 * /api/client/casting-group/add:
 *   post:
 *     summary: Add performer to casting group
 *     description: Add a performer to the client's casting selection
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - performerId
 *             properties:
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 description: Client ID
 *               performerId:
 *                 type: string
 *                 format: uuid
 *                 description: Performer ID to add
 *           example:
 *             clientId: "123e4567-e89b-12d3-a456-426614174000"
 *             performerId: "987fcdeb-51a2-43e7-b789-123456789abc"
 *     responses:
 *       200:
 *         description: Performer added to casting group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CastingGroup'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/casting-group/add', addToCastingGroup);

/**
 * @swagger
 * /api/client/casting-group/remove:
 *   post:
 *     summary: Remove performer from casting group
 *     description: Remove a performer from the client's casting selection
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - performerId
 *             properties:
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 description: Client ID
 *               performerId:
 *                 type: string
 *                 format: uuid
 *                 description: Performer ID to remove
 *           example:
 *             clientId: "123e4567-e89b-12d3-a456-426614174000"
 *             performerId: "987fcdeb-51a2-43e7-b789-123456789abc"
 *     responses:
 *       200:
 *         description: Performer removed from casting group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CastingGroup'
 *       404:
 *         description: Casting group not found
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
router.post('/casting-group/remove', removeFromCastingGroup);

/**
 * @swagger
 * /api/client/casting-group/{clientId}:
 *   get:
 *     summary: Get casting group
 *     description: Retrieve all performers in a client's casting selection
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Casting group retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 castingGroup:
 *                   $ref: '#/components/schemas/CastingGroup'
 *                 performers:
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
router.get('/casting-group/:clientId', getCastingGroup);

/**
 * @swagger
 * /api/client/casting-group/finalize:
 *   post:
 *     summary: Finalize casting selection
 *     description: Finalize the client's casting selection and create a casting order
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *             properties:
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 description: Client ID
 *           example:
 *             clientId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Casting finalized successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CastingOrder'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Casting group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/casting-group/finalize', finalizeCastingGroup);

/**
 * @swagger
 * /api/client/casting-orders:
 *   get:
 *     summary: Get all casting orders
 *     description: Retrieve all finalized casting orders (admin only)
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all casting orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CastingOrder'
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
router.get('/casting-orders', authenticateAdmin, getAllCastingOrders);

/**
 * @swagger
 * /api/client/casting-orders/{id}:
 *   get:
 *     summary: Get casting order by ID
 *     description: Retrieve detailed information about a specific casting order (admin only)
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Casting order ID
 *     responses:
 *       200:
 *         description: Casting order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CastingOrder'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Casting order not found
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
router.get('/casting-orders/:id', authenticateAdmin, getCastingOrderById);

export default router;
