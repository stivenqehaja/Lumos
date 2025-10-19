import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CastingOrder = sequelize.define('CastingOrder', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    castingGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'CastingGroups',
            key: 'id'
        }
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    commercialDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    selectedPerformers: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Array of performer objects with full details'
    },
    emailsSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

export default CastingOrder;
