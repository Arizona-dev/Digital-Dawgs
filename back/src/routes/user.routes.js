import express from 'express';
import * as usersController from '../controllers/user.controller';
import passport from 'passport';

const router = express.Router();

router.get('/', passport.authenticate("jwt", { session: false }), usersController.getUser);

export default router;
