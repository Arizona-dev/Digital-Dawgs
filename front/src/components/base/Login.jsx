import React, { useCallback, useContext, useEffect } from "react";
import Cookies from 'js-cookie';
import { UserContext } from "../../contexts/user.context";
import logo from "../../assets/logo.png";

const Login = () => {
  const { setUser } = useContext(UserContext);

  const login = useCallback(
    async event => {
      event.preventDefault();
      try {
        window.open(import.meta.env.VITE_API_URL + '/api/auth/google', '_self');
      } catch (error) {
        console.log(error);
      }
    }, []
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('token');

    if (jwt) {
      Cookies.set('token', jwt);
      fetch(import.meta.env.VITE_API_URL + '/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => response.json())
        .then(user => {
          setUser(user);
          window.location.href = '/';
        })
        .catch(error => {
          console.log(error);
        }
        );
    }
  }, [setUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
      <div className="flex flex-col items-center justify-center w-1/2 max-w-md bg-white p-8 rounded-lg">
        <img className="w-3/4" src={logo} alt="Google logo" />
        <p className="text-center mt-6">Connectez vous avec votre compte Google pour accéder à l'application</p>
        <div className="flex flex-col items-center justify-center mt-8">
          <button className="flex items-center justify-center bg-slate-900 text-white rounded-lg hover:bg-slate-800 p-4" onClick={login}>
            <img className="w-4 h-4 mr-2" src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google logo" />
            Se connecter
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login;
