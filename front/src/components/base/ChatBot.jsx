import { useState } from 'react'
import { Popover } from '@headlessui/react'

const ChatBot = () => {

  const currentPath = useState(0)

  const helpTypes = [
    { label: "Vérifier l'entretien de votre véhicule", path: 1 },
    { label: "Informations sur votre véhicule", path: 2 },
    { label: "Demande de contact", path: 3 },
    { label: "Fermer le chatbot", action: 'end' }
  ]

  const cardComponent = ({ label, action }, close) => {
    return (
      <div className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 cursor-pointer">
        <div className="ml-4" onClick={() => action == 'end' ? close() : action}>
          <p className="text-sm font-medium text-gray-900">
            {label}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-16 w-full max-w-sm px-4">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span>Chatbot</span>
            </Popover.Button>
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                  {helpTypes.map((item) => cardComponent(item, close))}
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  )
}

export default ChatBot;
