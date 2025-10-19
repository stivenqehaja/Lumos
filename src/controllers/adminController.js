import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await admin.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.json({
            id: req.admin.id,
            username: req.admin.username,
            email: req.admin.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
