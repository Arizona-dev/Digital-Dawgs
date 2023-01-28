import express from 'express';
import * as auth from '../controllers/auth.controller';

const router = express.Router();

router.get('/google', auth.googleAuth);
router.get('/failed', auth.authFailed);
router.get('/success', auth.authSuccess);
router.get('/google/callback', auth.googleAuthCallback);

export default router;
