import React from "react";
import Room from "../discussions/Room";
import Header from "../base/Header";
import DiscussionsHeader from "../discussions/DiscussionsHeader";

const Main = () => {
  const room = {
    title: "Discussion générale",
    description: "Rejoignez la discussion générale pour discuter avec d'autres membres de la communauté.",
    participants: 10,
  }
  return (
    <>
      <Header />
      <main className="flex flex-col w-full sm:w-10/12 mx-auto mt-6 lg:max-w-3xl shadow-md">
        <DiscussionsHeader />
        <Room title={room.title} description={room.description} participants={room.participants} />
        <div className="flex">
          <button className="flex justify-center w-full py-2 text-sm font-medium customBlue bg-slate-100 rounded-b-md hover:bg-slate-200">
          </button>
        </div>
      </main>
    </>
  );
};

export default Main;
