import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Performer = sequelize.define('Performer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Male', 'Female']]
        }
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Height in cm'
    },
    hairColor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eyeColor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    skinTone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    faceShape: {
        type: DataTypes.STRING,
        allowNull: true
    },
    distinctiveMarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        comment: 'Array of up to 9 image URLs'
    }
}, {
    timestamps: true
});

export default Performer;
