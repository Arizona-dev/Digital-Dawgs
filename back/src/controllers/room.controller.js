import { StatusCodes } from 'http-status-codes';
import { Room, Message, User } from '../model/index';
import { roles } from '../utils/Helpers';

export async function getRooms(req, res) {
  try {
    const rooms = await Room.findAll();
    rooms.sort((a, b) => a.createdAt - b.createdAt);
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
    messages.sort((a, b) => a.createdAt - b.createdAt);
    if (!messages) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Messages not found' });
    }
    res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function createRoom(req, res) {
  try {
    if (req.user.dataValues.role !== roles.ROLE_ADMIN) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
    const { title, description, maxParticipants, isPrivate } = req.body;
    if (!title || !description || !maxParticipants || !!isPrivate) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing fields' });
    }
    const room = await Room.create({
      title,
      description,
      maxParticipants,
      isPrivate,
    });
    res.status(StatusCodes.CREATED).json(room);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function updateRoom(req, res) {
  try {
    if (req.user.dataValues.role !== roles.ROLE_ADMIN) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
    const room = await Room.update(req.body,
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function deleteRoom(req, res) {
  try {
    if (req.user.dataValues.role !== roles.ROLE_ADMIN) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
    const room = await Room.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}
