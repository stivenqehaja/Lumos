import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CastingGroup = sequelize.define('CastingGroup', {
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
    performerIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: []
    },
    isFinalized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

export default CastingGroup;
