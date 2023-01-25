import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 } from 'uuid';
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
        edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        discriminator: {
            type: DataTypes.INTEGER,
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

    user.discriminator = await generateDiscriminator(user.username);
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

const generateDiscriminator = async (username) => {
    const x1 = Math.floor(Math.random() * 10), x2 = Math.floor(Math.random() * 10), x3 = Math.floor(Math.random() * 10), x4 = Math.floor(Math.random() * 10);
    const discriminator = `${x1}${x2}${x3}${x4}`;
    const userWithSameUsernameAndDiscriminator = await User.findOne({
        where: {
            username: username,
            discriminator: discriminator,
        },
    });

    if (userWithSameUsernameAndDiscriminator) {
        await generateDiscriminator(username);
    }

    return discriminator;
};

Message.belongsTo(User, {
    as: 'sender',
    foreignKey: 'senderId',
});

Message.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiverId',
});

User.hasMany(Message, {
    as: 'invitations',
    foreignKey: 'receiverId',
});

const createMessage = async (message) => {
  const m = await Message.create(message);
  const s = await Message.findOne({
    where: { id: m.dataValues.id },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'email'],
      },
      {
        model: User,
        as: 'receiver',
        attributes: ['id', 'username', 'email'],

      },
    ],
  });
  return s;
};

const updateMessage = (message) => Message.update(message, {
  where: {
    id: message.id,
  },
});

const deleteMessage = (messageId, message) => Message.update(message, {
  where: {
    id: messageId,
  },
});

const messages = new Set();

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.user = socket.handshake.query.userId;
    this.socket.join(this.user);
    this.io = io;

    this.io.sockets.emit('usersCount', this.io.sockets.sockets.size);

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (value) => this.handleMessage(value));
    socket.on('friendRequest', (value) => this.handleFriendRequest(value));
    socket.on('update', (message) => this.editMessage(message));
    socket.on('delete', (message) => this.deleteMessage(message));
    socket.on('disconnect', () => this.disconnect());
    socket.on('isTyping', (data) => this.sendIsTyping(data));
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  async sendMessage(data) {
    const message = await createMessage({
      text: data.text,
      senderId: data.sender.id,
      receiverId: data.receiver.id,
    });

    if (this.user) {
      this.io.sockets.to([data.receiver.id, data.sender.id]).emit('message', message);
    }
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  handleFriendRequest(value) {
    this.io.sockets.to([value.senderId, value.receiverId]).emit('friendRequest');
  }

  handleMessage(value) {
    const message = {
      id: v4(),
      text: value.text,
      receiver: {
        ...value.receiver,
      },
      sender: {
        ...value.sender,
      },
      createdAt: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);
    messages.delete(message);
  }

  async sendIsTyping(data) {
    if (this.user) {
      this.io.sockets.to([data.receiver.id, data.sender.id]).emit('isTyping', {
        id: v4(),
        ...data,
      });
    }
  }

  async deleteMessage(message) {
    if (message.sender.id === this.user) {
      const tmp = message;
      tmp.deleted = true;
      const result = await deleteMessage(message.id, tmp);

      if (result[0] > 0) {
        this.io.sockets.to([message.receiver.id, message.sender.id]).emit('delete', tmp);
      }
    }
  }

  async editMessage(message) {
    if (message.sender.id === this.user) {
      const tmp = message;
      tmp.edited = true;
      tmp.updated_at = Date.now();
      const result = await updateMessage(tmp);
      if (result[0] > 0) this.io.sockets.to([tmp.receiver.id, tmp.sender.id]).emit('update', tmp);
    }
  }

  disconnect() {
    this.socket.leave(this.user);
    this.user = null;
    this.socket.disconnect();
    this.socket.broadcast.emit('usersCount', this.io.sockets.sockets.size);
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
}

dotenv.config();

const port = process.env.PORT || 3000;
const server = express();
const app = createServer(server);

server.use(
  cors({
    origin: '*', // only allow front call
  }),
);

const io = new Server(app, {
  cors: {
    origin: process.env.FRONT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

server.get('/', (req, res) => {
  res.send('Hello World!');
});


server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

chat(io);
