import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chat from './core/socket.chat';

const port = process.env.PORT || 3000
const server = express()
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
  res.send('Hello World!')
})


server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})

chat(io)
