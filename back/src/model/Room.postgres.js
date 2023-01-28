import { DataTypes, Model } from 'sequelize';
import { connection } from '../core/db.postgres';

class Room extends Model {}

Room.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        closed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'room',
    },
);

export { Room };
