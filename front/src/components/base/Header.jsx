import React from 'react';
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className='flex w-full border-b bg-white justify-center'>
      <div className='flex flex-col sm:flex-row w-full py-6 px-6 lg:max-w-3xl'>
        <div className="flex justify-center sm:justify-start w-full">
          <a href="/">
            <img src={logo} alt="Digital Dawgs logo" className='w-52' />
          </a>
        </div>
        <div className="flex justify-center sm:justify-end w-full my-auto text-sm">
          <ul className="flex">
            <li className="mr-4 customBlue">
              <a href="/">Accueil</a>
            </li>
            <li className="">
              <a href="/contact">Besoin d'aide?</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header;
