import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../../contexts/user.context';
import { fetchRoom, getMessages } from "../services";
import InputArea from "./InputArea";
import Message from "./Message";

const Room = () => {
  const { socket, user, participants, setParticipants, setRoom, room } = useContext(UserContext);
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [maxMessageLengthError, setMaxMessageLengthError] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  const leaveRoom = () => {
    socket.emit('leaveRoom', room);
  }

  useEffect(() => {
    const loadRoom = async () => {
      if (firstLoad) {
        const room = await fetchRoom(roomId);
        if (!room) navigate('/');
        if (room.deleted || room.closed) navigate('/');
        if (participants >= room.maxParticipants) navigate('/');
        const messages = await getMessages(room.id);
        setMessages(messages);
        socket.emit('joinRoom', room);
        setFirstLoad(false);
        setRoom(room);
      }
    };
    loadRoom();
    socket.on('roomParticipants', (participants) => {
      setParticipants(participants);
    });

    return () => {
      leaveRoom();
    };
  }, [fetchRoom, socket, useParams, setRoom, setParticipants, setMessages, setFirstLoad, navigate]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [socket, setMessages]);

  const updateMessage = useCallback((e) => {
    const message = e.target.value
    if (message.length > 4999) {
      setMaxMessageLengthError(message.length - 4999);
    } else {
      setMaxMessageLengthError(false);
    }
    setMessage(message);
  }, [setMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback((e, button = false) => {
    if (e.key === 'Enter' || button) {
      if (message && !maxMessageLengthError) {
        e.preventDefault();
        socket.emit('message', { message, room, authorId: user.id });
        setMessage('');
      }
    }
  }, [message, setMessage, socket, room, user.id, setMaxMessageLengthError]);

  const mapMessages = useCallback((messages) => {
    return messages.map((message) => {
      return (
        <Message
          key={message.id}
          message={message.text}
          username={message.user.username}
          avatar={message.user.avatar}
          createdAt={message.createdAt}
        />
      );
    });
  }, [messages]);

  if (!room) {
    return null;
  }

  return (
    <div className="relative top-0 flex flex-col justify-center md:p-4 max-w-6xl mx-auto max-h-[100vh] w-full">
      <div className="relative flex flex-col justify-center bg-white rounded-b-lg shadow-lg max-h-[90vh]">
        <div className="flex flex-col justify-center bg-white md:rounded-t-lg shadow-lg px-4 pt-2 border-b">
          <div className="flex flex-row justify-between w-full">
            <h1 className="text-2xl font-bold">{room.title}</h1>
            <div className="flex flex-row items-center">
              <img src="https://img.icons8.com/ios/50/000000/online.png" alt="online" className="w-6 h-6" />
              <span className="text-gray-500 ml-2">{participants} / {room.maxParticipants} Participants</span>
            </div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <span className="text-sm text-gray-500 md:mb-3 line-clamp-4">{room.description}</span>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 gap-4 overflow-y-auto mb-16 min-h-[60vh]">
          {mapMessages(messages)}
          <div ref={bottomRef} />
        </div>
        <InputArea room={room} message={message} updateMessage={updateMessage} sendMessage={sendMessage} maxMessageLengthError={maxMessageLengthError} />
      </div>
    </div>
  );
}

export default Room;
