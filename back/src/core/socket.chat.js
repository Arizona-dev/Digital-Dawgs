import { v4 as uuidv4 } from 'uuid';
import * as messageService from '../services/message.service.js';

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
    const message = await messageService.createMessage({
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
      id: uuidv4(),
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
