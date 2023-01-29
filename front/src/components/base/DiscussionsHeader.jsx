import React from "react";

const DiscussionsHeader = () => {
  return (
    <>
      <div className="flex flex-col border sm:rounded-t-md bg-slate-100 w-full p-4">
        <h1 className="text-lg font-bold">Discussions</h1>
        <p className="text-xs text-slate-600">Rejoignez une discussion avec d'autres membres de la communauté, contactez un conseiller ou utilisez notre chatbot.</p>
      </div>
      <div className="flex flex-col border-x border-b bg-white w-full p-2">
        <div className="flex gap-6 justify-evenly">
          <button className="flex justify-center w-full text-sm font-medium customBlue rounded-md hover:font-bold">
            Contactez un conseiller
          </button>
          <button className="flex justify-center w-full text-sm font-medium customBlue rounded-md hover:font-bold">
            Chatbot
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscussionsHeader;
