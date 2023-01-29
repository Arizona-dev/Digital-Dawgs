import React, { useEffect, useState } from "react";
import DiscussionsHeader from "./DiscussionsHeader";
import RoomInfo from "../discussions/RoomInfo";
import { fetchRooms } from "../services";

const Home = () => {
  const [rooms, setRooms] = useState([]);

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
        return <RoomInfo key={room.id} id={room.id} title={room.title} description={room.description} participants={room.participants} maxParticipants={room.maxParticipants} closed={room.closed} />;
      });
    }
  };

  return (
    <main className="flex flex-col w-full sm:w-10/12 mx-auto mt-6 lg:max-w-3xl shadow-md">
      <DiscussionsHeader />
      {mapRooms()}
      <div className="flex">
        <div className="flex justify-center w-full py-2 text-sm font-medium customBlue bg-slate-100 rounded-b-md" />
      </div>
    </main>
  );
}

export default Home;
