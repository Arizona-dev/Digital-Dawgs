import React from "react";

const Message = ({ username, avatar, message, createdAt }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="flex flex-row mb-1">
            <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
            <div className="flex flex-col ml-2">
              <div className="flex flex-row items-center">
                <span className="text-gray-700 font-bold">{username}</span>
                <span className="text-gray-500 ml-2">{createdAt && new Date(createdAt).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 overflow-hidden break-all">{message}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
