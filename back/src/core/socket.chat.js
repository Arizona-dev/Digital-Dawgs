import { v4 as uuidv4 } from 'uuid';
import * as messageService from '../services/message.service.js';
import * as roomService from '../services/room.service.js';

const messages = new Set();
const rooms = new Set();

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
    socket.on('joinRoom', (room) => {
      if (!room) return;
      if (!rooms.has(room.id)) {
        rooms.add(room.id);
      }
      socket.join(room.id);
      const participants = this.io.sockets.adapter.rooms.get(room.id).size;
      roomService.updateRoom(room.id, participants);
      this.io.of('/').in(room.id).emit('roomParticipants', participants);
    });

    socket.on('leaveRoom', (room) => {
      if (!room) return;
      console.log('leaveRoom', room);
      socket.leave(room.id);
      const _room = this.io.sockets.adapter.rooms.get(room.id);
      if (_room) {
        const participants = room.size;
        roomService.updateRoom(room.id, participants);
        this.io.of('/').in(room.id).emit('roomParticipants', participants);
      }
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  async sendMessage(data) {
    const message = await messageService.createMessage(data);

    if (this.user) {
      this.io.sockets.to([data.roomId]).emit('message', message);
    }
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  getRoomParticipants(room) {
    const participants = this.io.sockets.adapter.rooms.get(room.id).size;
    return participants;
  }

  handleMessage(value) {
    if (value.message.length === 0) return;
    if (value.message.length > 5000) return;
    const message = {
      id: uuidv4(),
      text: value.message,
      authorId: value.authorId,
      roomId: value.room.id,
      createdAt: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);
    messages.delete(message);
  }

  async sendIsTyping(data) {
    if (this.user) {
      this.io.sockets.to([data.receiver.id, data.sender.id]).emit('isTyping', {
        id: uuidv4(),
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

export default chat;
