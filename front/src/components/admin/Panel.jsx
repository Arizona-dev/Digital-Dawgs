import React, { useEffect, useState } from "react";
import { fetchRooms, createRoom } from "../services";
import RoomInfo from "./RoomInfo";

const Panel = () => {
  const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [rooms, setRooms] = useState([]);

  const addRoom = () => {
    setOpenCreateRoomModal(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const newRoom = await createRoom(title, description, maxParticipants, false);
    setRooms([...rooms, newRoom]);
    setOpenCreateRoomModal(false);
  };

  const refreshRooms = async () => {
    const rooms = await fetchRooms();
    setRooms(rooms);
  };

  useEffect(() => {
    const getRooms = async () => {
      const rooms = await fetchRooms();
      setRooms(rooms);
    };
    getRooms();
  }, [fetchRooms, setRooms]);

  const mapRooms = () => {
    if (rooms.length > 0) {
      return rooms.filter((room) => !room.isPrivate || !room.deleted).map((room) => {
        return <RoomInfo key={room.id} id={room.id} title={room.title} description={room.description} participants={room.participants} maxParticipants={room.maxParticipants} closed={room.closed} refreshRooms={refreshRooms} />;
      });
    }
  };

  return (
    <main className="flex flex-col w-full sm:w-10/12 mx-auto mt-6 lg:max-w-3xl shadow-md">
      <div className="flex flex-col border sm:rounded-t-md bg-slate-100 w-full p-4">
        <h1 className="text-lg font-bold">Panel d'administration</h1>
        <p className="text-xs text-slate-600">Gérez les salons de discussion</p>
      </div>
      <div className="flex flex-col border-x border-b bg-white w-full p-2">
        <div className="flex gap-6 justify-evenly">
          <button data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" className="block text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800" type="button" onClick={addRoom}>
            Ajouter un salon
          </button>
        </div>
      </div>
      {mapRooms()}
      {openCreateRoomModal && (
        <div id="authentication-modal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => setOpenCreateRoomModal(false)}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Fermer la modale</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Créer un salon</h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du salon</label>
                    <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Salon Général" required onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <input type="text" name="description" id="description" placeholder="Entrez une courte description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required  onChange={(e) => setDescription(e.target.value)}  />
                  </div>
                  <div>
                    <label htmlFor="maxParticipants" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de participants max</label>
                    <input type="number" min={1} name="maxParticipants" id="maxParticipants" placeholder="Entrez le nombre de participants max" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required  onChange={(e) => setMaxParticipants(e.target.value)}  />
                  </div>
                  <button type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleCreateRoom}>Créer</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Panel;
