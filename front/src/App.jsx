import Cookies from 'js-cookie';
import { io } from "socket.io-client";
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { UserContext } from './contexts/user.context';
import Main from './components/base/Main'
import Login from './components/base/Login'
import Home from './components/base/Home'
import Room from './components/discussions/Room'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!user) {
      const token = Cookies.get('token')
      if (token) {
        fetch('http://localhost:3001/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data) {
              setUser(data);
              const newSocket = io(import.meta.env.VITE_API_URL, {
                query: { userId: data.id }
              })
              console.log(newSocket);
              setSocket(newSocket);
            }
          })
          .catch(err => console.log(err));
      }
    }
    setInterval(() => {
      setLoading(false);
    }, 200);
  }, [setUser, setLoading]);

  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="justify-center items-center h-screen bg-gray-100 w-full" style={{ display: loading ? 'absolute' : 'none' }}>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <UserContext.Provider value={{
          user,
          setUser,
          socket,
          setSocket,
          room,
          setRoom,
          participants,
          setParticipants
        }} >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                user ? <Main /> : <Navigate to="/login" />
              }>
                <Route path="/" element={<Home />} />
                <Route path="discussions/:roomId" element={<Room />} />
              </Route>
              <Route path="login" element={
                user ? <Navigate to="/" /> : <Login />
              } />
              <Route path="*" element={<Navigate to="/" />} />
              {/* <Route path="/logout" exact component={Logout} /> */}
              {/* <Route path="/admin" exact component={Admin} /> */}
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      )}
    </div>
  )
}

export default App
