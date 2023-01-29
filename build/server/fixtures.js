import Sequelize, { DataTypes, Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

const config = process.env.NODE_ENV === 'development' ? {
    newUrlParser: true,
} : {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
};

const connection = new Sequelize(process.env.DATABASE_URL, config);

connection.authenticate().then(() => {
    console.log('Postgres (with sequelize) connection open.');
}).catch((err) => {
    console.error(`Unable to connect to the database >> ${process.env.DATABASE_URL}:`, err);
});

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

const roles = Object.freeze({
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER',
});

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [8, 100],
            },
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: roles.ROLE_USER,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: `https://avatars.dicebear.com/api/male/${Math.random() * 100}.svg`,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'user',
    },
);

User.addHook('beforeCreate', async (user) => {
    if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt(),
        );
    }
});

User.addHook('beforeUpdate', async (user, { fields }) => {
    if (fields.includes('password')) {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt(),
        );
    }
});

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
        participants: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
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

Message.belongsTo(User, {
    as: 'user',
    foreignKey: 'authorId',
});

Message.belongsTo(Room, {
    as: 'room',
    foreignKey: 'roomId',
});

const rooms = [
    {
        title: 'Room 1',
        description: 'Room 1 description',
        maxParticipants: 10,
        closed: false,
    },
    {
        title: 'Room 2',
        description: 'Room 2 description',
        maxParticipants: 10,
        closed: false,
    },
    {
        title: 'Room 3',
        description: 'Room 3 description',
        maxParticipants: 10,
        closed: true,
    },
];

const fixtures = async function () {
    await Room.bulkCreate(rooms);
};

fixtures().then(() => {
    console.log('Fixtures created');
}).catch((err) => {
    console.log(err);
}).finally(() => {
    process.exit(0);
});
