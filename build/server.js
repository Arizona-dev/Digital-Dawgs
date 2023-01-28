import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import Sequelize, { DataTypes, Model, Op } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { v4 } from 'uuid';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BACK_BASE_URL + '/api/auth/google/callback',
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
},
  function (jwtPayload, done) {
    return done(null, jwtPayload.user);
  }
));

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
    as: 'author',
    foreignKey: 'authorId',
});

Message.belongsTo(Room, {
    as: 'room',
    foreignKey: 'roomId',
});

/* eslint-disable no-param-reassign */

async function googleAuth(req, res) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
}

async function googleAuthCallback(req, res, next) {
  passport.authenticate('google', {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/failed',
  })(req, res, next);
}

async function authSuccess(req, res) {
  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.user.emails[0].value,
        },
      },
    });

    if (!user) {
      const email = req.user.emails[0].value;
      const username = req.user.displayName;
      const avatar = req.user.photos[0].value;
      const googleId = req.user.id;
      const active = true;

      user = await User.create({
        email,
        username,
        avatar,
        googleId,
        active,
        role: 'ROLE_USER',
      });
    }
    jwt.sign(
      { user: { ...user } },
      process.env.JWT_SECRET,
      { expiresIn: "3h" },
      (err, token) => {
        if (err) {
          return res.redirect('http://localhost:3000/login');
        }
        res.redirect(`http://localhost:3000/login?token=${token}`);
      }
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

async function authFailed(req, res) {
  res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
}

const router$2 = express.Router();

router$2.get('/google', googleAuth);
router$2.get('/failed', authFailed);
router$2.get('/success', authSuccess);
router$2.get('/google/callback', googleAuthCallback);

async function getUser(req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect(process.env.FRONT_URL + '/login');
    }
    if (!req.user && !req.user.dataValues.email) {
      return res.json({ message: 'User not authenticated' });
    }
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.user.dataValues.email,
        },
      },
    });
    user.password = undefined;
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

const router$1 = express.Router();

router$1.get('/', passport.authenticate("jwt", { session: false }), getUser);

// import messageRoutes from './message.routes';

const router = express.Router();

const routes = [
    {
        path: 'auth',
        routes: router$2,
    },
    {
        path: 'user',
        routes: router$1,
    },
    // {
    //     path: 'messages',
    //     routes: messageRoutes,
    // },
];

routes.forEach((route) => {
    router.use(`/${route.path}`, route.routes);
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

  disconnect() {
    this.socket.leave(this.user);
    this.user = null;
    this.socket.disconnect();
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

server.use(
  cors({
    origin: '*',
  }),
);

server.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2'],
}));

server.use(passport.initialize());
server.use(passport.session());
server.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});
server.use('/api', router);

const app = createServer(server);
const io = new Server(app, {
  cors: {
    origin: process.env.FRONT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

chat(io);
