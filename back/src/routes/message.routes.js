import express from 'express';
import * as messageController from '../controllers/message.controller';
import { authorized } from '../middlewares/auth';
import { areFriends } from '../middlewares/friend';
import { isMyMessage } from '../middlewares/message';

const router = express.Router();

router.post('/', authorized(), areFriends, messageController.sendMessage);

// used for DELETE or UPDATE a message cf : cahier des charges
router.put('/:messageId', authorized(), isMyMessage, messageController.updateMessage);
router.get('/:senderId/:receiverId', authorized(), messageController.getMessagesFromUsers);

export default router;
