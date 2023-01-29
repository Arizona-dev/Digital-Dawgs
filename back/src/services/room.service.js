import { Room } from "../model/index";

export async function updateRoom(roomId, participants) {
  try {
    await Room.update({ participants }, { where: { id: roomId } });
  } catch (error) {
    console.log(error);
  }
}
