import React from "react";

const Message = ({ message }) => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="flex flex-row mb-1">
            <img src="https://avatars.githubusercontent.com/u/555777?v=4" alt="avatar" className="w-12 h-12 rounded-full border" />
            <div className="flex flex-col ml-2">
              <div className="flex flex-row items-center">
                <span className="text-gray-700 font-bold">John Doe</span>
                <span className="text-gray-500 ml-2">10:00</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet aliquam lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc sit amet aliquam lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
