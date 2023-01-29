import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from '../../contexts/user.context';
import Message from "./Message";
import { fetchRoom } from "../services";
import { useParams } from "react-router-dom";

const Room = () => {
  const { socket } = useContext(UserContext);
  const { participants, setParticipants, setRoom, room } = useContext(UserContext);
  const { roomId } = useParams();

  useEffect(() => {
    const loadRoom = async () => {
      const room = await fetchRoom(roomId);
      socket.emit('joinRoom', room);
      socket.on('roomParticipants', (participants) => {
        setParticipants(participants);
      });
      setRoom(room);
    };
    loadRoom();
  }, [fetchRoom, socket, useParams, setRoom, setParticipants]);

  if (!room) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center p-6 max-w-6xl mx-auto">
      <div className="flex flex-col justify-center bg-white rounded-lg shadow-lg">
        <div className="flex flex-row justify-between border-b w-full p-4">
          <h1 className="text-2xl font-bold">{room.title}</h1>
          <div className="flex flex-row items-center">
            <img src="https://img.icons8.com/ios/50/000000/online.png" alt="online" className="w-6 h-6" />
            <span className="text-gray-500 ml-2">{participants} / {room.maxParticipants} Participants</span>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full p-4">
          <span className="text-gray-500 mb-3 line-clamp-4">{room.description}</span>
        </div>
      </div>
      <div className="relative flex flex-col mt-6 bg-white rounded-lg shadow-lg min-h-[320px] md:min-h-[720px]">
        <Message />
        <div className="absolute w-full flex bottom-0 flex-row justify-between items-center p-4 gap-4">
          <textarea type="text" className="w-full rounded-lg border border-gray-300 p-2 max-h-[90px]" placeholder="Votre message"
            aria-label="Votre message"
            autoFocus={true}
            maxLength={255}
          />
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Room;
