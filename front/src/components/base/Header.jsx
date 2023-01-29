import React, { useContext } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <header className='flex w-full border-b bg-white justify-center'>
      <div className='flex flex-col sm:flex-row w-full py-6 px-6 lg:max-w-3xl'>
        <div className="flex justify-center sm:justify-start w-full">
          <Link to="/">
            <img src={logo} alt="Digital Dawgs logo" className='w-52' />
          </Link>
        </div>
        <div className="flex justify-center sm:justify-end w-full my-auto text-sm">
          <ul className="flex">
            <li className="mr-4 customBlue">
              <Link to="/">Accueil</Link>
            </li>
            {user && user.role === 'ROLE_ADMIN' && (
              <li className="">
                <Link to="/panel">Panel d'administration</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header;
