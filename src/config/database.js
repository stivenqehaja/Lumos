import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('[DATABASE] Connection established successfully');
        return true;
    } catch (error) {
        console.error('[DATABASE] Unable to connect:', error.message);
        return false;
    }
};

export const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('[DATABASE] Models synchronized successfully');
    } catch (error) {
        console.error('[DATABASE] Error synchronizing models:', error.message);
    }
};

export default sequelize;
