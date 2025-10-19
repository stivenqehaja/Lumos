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
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone'
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
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
        comment: 'Array of up to 9 images (base64 encoded or URLs)'
    }
}, {
    timestamps: true
});

export default Performer;
