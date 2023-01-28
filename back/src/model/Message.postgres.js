import { DataTypes, Model } from 'sequelize';
import { connection } from '../core/db.postgres';

class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: DataTypes.STRING(5000),
            allowNull: false,
        },
        media: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize: connection,
        modelName: 'message',
    },
);

export { Message };
