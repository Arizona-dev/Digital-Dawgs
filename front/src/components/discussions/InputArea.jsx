import React, { useEffect, useRef } from "react";
import EmojiPicker from 'emoji-picker-react';

const InputArea = ({ room, message, updateMessage, sendMessage, maxMessageLengthError }) => {
  const [showEmojiKeyboard, setShowEmojiKeyboard] = React.useState(false);
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowEmojiKeyboard(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setShowEmojiKeyboard(false);
    updateMessage({ target: { value: message + emojiObject.emoji } });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="absolute w-full flex bottom-0 flex-row justify-between items-center gap-4">
      <div className="flex items-center px-3 py-2 md:rounded-b-lg bg-gray-50 dark:bg-gray-700 w-full max-h-56">
        <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
          <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
          <span className="sr-only">Envoyer une image</span>
        </button>
        <div className="relative">
          <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)}>
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Ajouter un emoji</span>
          </button>
          {showEmojiKeyboard === true && (
            <div ref={modalRef} className="absolute bottom-0 left-0">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <textarea id="chat" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-h-52 resize-none"
          placeholder={"Envoyer un message dans " + room.title}
          autoFocus={true}
          maxLength={10000}
          rows={1}
          onChange={(e) => updateMessage(e)}
          onKeyDown={(e) => sendMessage(e)}
          value={message}></textarea>
        {maxMessageLengthError !== false && <p className="text-red-500 text-xs italic flex w-8">- {maxMessageLengthError}</p>}
        <button type="button" className="inline-flex justify-center p-2 text-cyan-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-cyan-500 dark:hover:bg-gray-600" onClick={(e) => sendMessage(e, true)} disabled={message.length === 0 || maxMessageLengthError !== false}>
          <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          <span className="sr-only">Envoyer</span>
        </button>
      </div>
    </div>
  )
}

export default InputArea;
