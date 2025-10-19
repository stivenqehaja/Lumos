import { Performer } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllPerformers = async (req, res) => {
    try {
        const performers = await Performer.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getPerformerById = async (req, res) => {
    try {
        const performer = await Performer.findByPk(req.params.id);

        if (!performer) {
            return res.status(404).json({ error: 'Performer not found' });
        }

        res.json(performer);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createPerformer = async (req, res) => {
    try {
        const performer = await Performer.create(req.body);
        res.status(201).json(performer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updatePerformer = async (req, res) => {
    try {
        const performer = await Performer.findByPk(req.params.id);

        if (!performer) {
            return res.status(404).json({ error: 'Performer not found' });
        }

        await performer.update(req.body);
        res.json(performer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deletePerformer = async (req, res) => {
    try {
        const performer = await Performer.findByPk(req.params.id);

        if (!performer) {
            return res.status(404).json({ error: 'Performer not found' });
        }

        await performer.destroy();
        res.json({ message: 'Performer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const searchPerformers = async (req, res) => {
    try {
        const {
            gender,
            minAge,
            maxAge,
            hairColor,
            minHeight,
            maxHeight,
            eyeColor,
            keywords,
            search
        } = req.query;

        const where = {};

        if (gender) {
            where.gender = gender;
        }

        if (hairColor) {
            where.hairColor = hairColor;
        }

        if (eyeColor) {
            where.eyeColor = eyeColor;
        }

        if (minHeight || maxHeight) {
            where.height = {};
            if (minHeight) where.height[Op.gte] = parseInt(minHeight);
            if (maxHeight) where.height[Op.lte] = parseInt(maxHeight);
        }

        if (minAge || maxAge) {
            const currentYear = new Date().getFullYear();
            where.birthday = {};
            if (maxAge) {
                const minBirthYear = currentYear - parseInt(maxAge);
                where.birthday[Op.gte] = new Date(`${minBirthYear}-01-01`);
            }
            if (minAge) {
                const maxBirthYear = currentYear - parseInt(minAge);
                where.birthday[Op.lte] = new Date(`${maxBirthYear}-12-31`);
            }
        }

        if (keywords) {
            where[Op.or] = [
                { distinctiveMarks: { [Op.iLike]: `%${keywords}%` } },
                { faceShape: { [Op.iLike]: `%${keywords}%` } }
            ];
        }

        if (search) {
            where[Op.or] = [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const performers = await Performer.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.json(performers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
