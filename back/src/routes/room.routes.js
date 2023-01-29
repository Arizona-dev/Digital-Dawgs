import express from 'express';
import * as roomController from '../controllers/room.controller';
import passport from 'passport';

const router = express.Router();

router.get('/', passport.authenticate("jwt", { session: false }), roomController.getRooms);
router.get('/:id', passport.authenticate("jwt", { session: false }), roomController.getRoom);

export default router;
