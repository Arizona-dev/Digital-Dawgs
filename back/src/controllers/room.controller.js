import { StatusCodes } from 'http-status-codes';
import { Room, Message, User } from '../model/index';

export async function getRooms(req, res) {
  try {
    const rooms = await Room.findAll();
    res.status(StatusCodes.OK).json(rooms);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function getRoom(req, res) {
  try {
    const room = await Room.findByPk(req.params.id);
    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function getRoomMessages(req, res) {
  try {
    const messages = await Message.findAll({
      where: {
        roomId: req.params.id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'avatar'],
        },
      ],
      limit: 50,
      order: [['createdAt', 'DESC']],
    });
    // sort messages by createdAt
    messages.sort((a, b) => a.createdAt - b.createdAt);
    if (!messages) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Messages not found' });
    }
    res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}
