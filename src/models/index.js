import Admin from './Admin.js';
import Performer from './Performer.js';
import Client from './Client.js';
import CastingGroup from './CastingGroup.js';
import CastingOrder from './CastingOrder.js';

// Define relationships
Client.hasMany(CastingGroup, { foreignKey: 'clientId' });
CastingGroup.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasMany(CastingOrder, { foreignKey: 'clientId' });
CastingOrder.belongsTo(Client, { foreignKey: 'clientId' });

CastingGroup.hasOne(CastingOrder, { foreignKey: 'castingGroupId' });
CastingOrder.belongsTo(CastingGroup, { foreignKey: 'castingGroupId' });

export {
    Admin,
    Performer,
    Client,
    CastingGroup,
    CastingOrder
};
