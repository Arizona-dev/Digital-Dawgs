import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";

const Room = ({ id, title, description, maxParticipants, closed, participants = 0 }) => {
  const navigate = useNavigate();
  const { socket, setRoom, setParticipants } = useContext(UserContext);

  const enterRoom = () => {
    navigate(`/discussions/${id}`);
  };

  useEffect(() => {
    const loadRoom = async () => {
      const room = {
        id,
        title,
        description,
        maxParticipants,
        closed,
      }
      socket.emit('getRoomParticipants', room);
      socket.on('roomParticipants', (participants) => {
        setParticipants(participants);
      });
      setRoom(room);
    };
    loadRoom();
  }, [socket, setRoom, setParticipants]);

  return (
    <div className="flex flex-col border-b border-x bg-white hover:bg-slate-50 cursor-pointer w-full p-4" onClick={() => enterRoom()}>
      <div className="flex justify-between">
        <div className="flex items-baseline text-medium">
          <h1>{title}</h1>
          {closed && <span className="text-slate-600 ml-1">-</span>}
          {closed && <span className="text-red-600 ml-1">Fermé</span>}
        </div>
        <p className="font-thin text-xs text-slate-600">{participants} / {maxParticipants} participants</p>
      </div>
      <p className="font-thin text-xs text-slate-600 line-clamp-2">{description}</p>
    </div>
  );
}

export default Room;
