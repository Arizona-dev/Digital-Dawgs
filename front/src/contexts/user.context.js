import { createContext } from 'react';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
    socket: null,
    setSocket: () => {},
    participants: 0,
    setParticipants: () => {},
    room: [],
    setRoom: () => {},
});
