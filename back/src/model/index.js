import { connection } from '../core/db.postgres';

import { Message } from './Message.postgres';
import { User } from './User.postgres';
import { Room } from './Room.postgres';

Message.belongsTo(User, {
    as: 'author',
    foreignKey: 'authorId',
});

Message.belongsTo(Room, {
    as: 'room',
    foreignKey: 'roomId',
});

export {
    connection, User, Message, Room,
};
