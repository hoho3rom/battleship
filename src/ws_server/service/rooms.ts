import { roomsDb } from "../db/rooms";
import { usersDb } from "../db/users";

const getAvailableRooms = () => {
    const availableRooms = roomsDb.listAvailable();

    return availableRooms.map((room) => ({
        roomId: room.id,
        roomUsers: usersDb.listByRoom(room.id).map(user => ({ name: user.name, index: user.id }))
    }));
}

const createMyRoom = (myId: number) => {
    const newRoom = roomsDb.create();
    addUserToRoom(myId, newRoom.id);
}

const addMeToRoom = (userId: number, roomId: string) => {
    addUserToRoom(userId, roomId);
    roomsDb.update(roomId, { id: roomId, available: false });
}

const addUserToRoom = (userId: number, roomId: string) => {
    if (!roomsDb.existsById(roomId)) return;

    const me = usersDb.getById(userId);
    if (!me) return;

    me.roomId = roomId;
    usersDb.update(userId, me);
}

export const roomsService = {
    getAvailableRooms,
    createMyRoom,
    addMeToRoom
}
