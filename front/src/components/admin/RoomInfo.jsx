import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { updateRoom, deleteRoom } from "../services";

const RoomInfo = ({ id, title, description, maxParticipants, closed, participants: _participants = 0, refreshRooms }) => {
  const { socket, setRoom } = useContext(UserContext);
  const [participants, setParticipants] = useState(_participants);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newTitle, setTitle] = useState(title);
  const [newDescription, setDescription] = useState(description);
  const [newMaxParticipants, setMaxParticipants] = useState(maxParticipants);
  const full = participants >= maxParticipants;

  const enterRoom = () => {
    if (participants >= maxParticipants) return;
    if (closed) return;
    navigate(`/discussions/${id}`);
  };

  const handleDeleteRoom = async () => {
    socket.emit('closeRoom', id);
    await deleteRoom(id);
    await refreshRooms();
  };

  const handleCloseRoom = async () => {
    socket.emit('closeRoom', id);
    await updateRoom({
      id,
      closed: !closed,
    });
    await refreshRooms();
  };

  const handleOpenUpdateRoom = () => {
    setOpen(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    await updateRoom({
      id, title: newTitle, description: newDescription, maxParticipants: newMaxParticipants
    });
    await refreshRooms();
    setOpen(false);
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
    <div className="relative border-b border-x bg-white">
      <div className="flex flex-col px-4 pt-4 w-full hover:bg-slate-50 cursor-pointer" onClick={() => enterRoom()}>
        <div className="flex justify-between">
          <div className="flex items-baseline text-medium">
            <h1>{title}</h1>
            {(closed || full) && <span className="text-slate-600 ml-1">-</span>}
            {closed && <span className="text-red-600 ml-1">Fermé</span>}
            {full && <span className="text-red-600 ml-1">Complet</span>}
          </div>
          <p className="font-thin text-xs text-slate-600">{participants} / {maxParticipants} participants</p>
        </div>
        <p className="font-thin text-xs text-slate-600 line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-end px-4 pb-3 gap-3">
        <button className="bg-red-600 text-white text-xs font-bold rounded-md px-2 py-1 mt-2" onClick={handleDeleteRoom}>Supprimer</button>
        <button className="bg-green-600 text-white text-xs font-bold rounded-md px-2 py-1 mt-2" onClick={handleOpenUpdateRoom}>Modifier</button>
        <button className="bg-cyan-600 text-white text-xs font-bold rounded-md px-2 py-1 mt-2" onClick={handleCloseRoom}>{closed ? 'Ouvrir' : 'Fermer'}</button>
      </div>
      {open && (
        <div id="authentication-modal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => setOpen(false)}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Fermer la modale</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Modifier {title}</h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du salon</label>
                    <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Salon Général" required value={newTitle} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <input type="text" name="description" id="description" placeholder="Entrez une courte description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value={newDescription} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="maxParticipants" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de participants max</label>
                    <input type="number" min={1} name="maxParticipants" id="maxParticipants" placeholder="Entrez le nombre de participants max" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value={newMaxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
                  </div>
                  <button type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleUpdateRoom}>Modifier</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomInfo;
