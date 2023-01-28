import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';
import './middleware/passport';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes/index';
import chat from './core/socket.chat';

const port = process.env.PORT || 3000
const server = express()

server.use(
  cors({
    origin: '*',
  }),
);

server.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2'],
}))

server.use(passport.initialize());
server.use(passport.session());
server.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb()
    }
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb()
    }
  }
  next()
})
server.use('/api', routes);

const app = createServer(server);
const io = new Server(app, {
  cors: {
    origin: process.env.FRONT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})

chat(io)
