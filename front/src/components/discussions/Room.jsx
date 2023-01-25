import React from "react";

const Room = ({ title, description, participants = 0 }) => {
  return (
    <div className="flex flex-col border-b border-x bg-white w-full">
      <div className="w-full p-4 hover:bg-slate-50 cursor-pointer">
        <div className="flex justify-between">
          <h1 className="font-medium">{title}</h1>
          <p className="font-thin text-xs text-slate-600">{participants} participants</p>
        </div>
        <p className="font-thin text-xs text-slate-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

export default Room;
