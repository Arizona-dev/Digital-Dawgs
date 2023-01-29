import { StatusCodes } from 'http-status-codes';
import { Room } from '../model/index';

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
