import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import roomRoutes from './room.routes';
// import messageRoutes from './message.routes';

const router = express.Router();

const routes = [
    {
        path: 'auth',
        routes: authRoutes,
    },
    {
        path: 'user',
        routes: userRoutes,
    },
    {
        path: 'rooms',
        routes: roomRoutes,
    },
    // {
    //     path: 'messages',
    //     routes: messageRoutes,
    // },
];

routes.forEach((route) => {
    router.use(`/${route.path}`, route.routes);
});

export default router;
