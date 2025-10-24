import { v4 as uuidv4 } from 'uuid';
import { Client, CastingGroup, CastingOrder, Performer } from '../models/index.js';

export const generateClientLink = async (req, res) => {
    try {
        const { companyName, commercialDescription } = req.body;

        const accessCode = uuidv4().split('-')[0].toUpperCase();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const client = await Client.create({
            companyName,
            commercialDescription,
            accessCode,
            expiresAt
        });

        const clientUrl = `${process.env.BASE_URL}/client?code=${accessCode}`;

        res.json({
            client,
            accessCode,
            url: clientUrl
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const validateAccessCode = async (req, res) => {
    try {
        const { accessCode } = req.params;

        const client = await Client.findOne({
            where: { accessCode, isActive: true }
        });

        if (!client) {
            return res.status(404).json({ error: 'Invalid access code' });
        }

        if (new Date() > new Date(client.expiresAt)) {
            return res.status(403).json({ error: 'Access code expired' });
        }

        res.json({
            client: {
                id: client.id,
                companyName: client.companyName,
                commercialDescription: client.commercialDescription,
                expiresAt: client.expiresAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const addToCastingGroup = async (req, res) => {
    try {
        const { clientId, performerId } = req.body;

        let castingGroup = await CastingGroup.findOne({
            where: { clientId, isFinalized: false }
        });

        if (!castingGroup) {
            castingGroup = await CastingGroup.create({
                clientId,
                performerIds: [performerId]
            });
        } else {
            if (!castingGroup.performerIds.includes(performerId)) {
                castingGroup.performerIds = [...castingGroup.performerIds, performerId];
                await castingGroup.save();
            }
        }

        res.json(castingGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const removeFromCastingGroup = async (req, res) => {
    try {
        const { clientId, performerId } = req.body;

        const castingGroup = await CastingGroup.findOne({
            where: { clientId, isFinalized: false }
        });

        if (!castingGroup) {
            return res.status(404).json({ error: 'Casting group not found' });
        }

        castingGroup.performerIds = castingGroup.performerIds.filter(
            id => id !== performerId
        );
        await castingGroup.save();

        res.json(castingGroup);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCastingGroup = async (req, res) => {
    try {
        const { clientId } = req.params;

        const castingGroup = await CastingGroup.findOne({
            where: { clientId, isFinalized: false }
        });

        if (!castingGroup) {
            return res.json({ performerIds: [] });
        }

        const performers = await Performer.findAll({
            where: { id: castingGroup.performerIds }
        });

        res.json({
            castingGroup,
            performers
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const finalizeCastingGroup = async (req, res) => {
    try {
        const { clientId } = req.body;

        const castingGroup = await CastingGroup.findOne({
            where: { clientId, isFinalized: false }
        });

        if (!castingGroup) {
            return res.status(404).json({ error: 'Casting group not found' });
        }

        const client = await Client.findByPk(clientId);
        const performers = await Performer.findAll({
            where: { id: castingGroup.performerIds }
        });

        const castingOrder = await CastingOrder.create({
            clientId,
            castingGroupId: castingGroup.id,
            companyName: client.companyName,
            commercialDescription: client.commercialDescription,
            selectedPerformers: performers
        });

        castingGroup.isFinalized = true;
        await castingGroup.save();

        res.json(castingOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllCastingOrders = async (req, res) => {
    try {
        const orders = await CastingOrder.findAll({
            include: [
                { model: Client },
                { model: CastingGroup }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCastingOrderById = async (req, res) => {
    try {
        const order = await CastingOrder.findByPk(req.params.id, {
            include: [
                { model: Client },
                { model: CastingGroup }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Casting order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
