import crypto from 'node:crypto';

type Room = {
    id: string;
    available: boolean;
}

const rooms: Room[] = [];

const list = () => {
    return [...rooms];
}

const listAvailable = () => {
    return rooms.filter(room => room.available);
}

const existsById = (roomId: string) => {
    return rooms.some(room => room.id === roomId);
}

const create = () => {
    const newRoom = { id: crypto.randomUUID(), available: true };
    rooms.push(newRoom);

    return newRoom;
}

const update = (id: string, room: Room) => {
    const roomIndex = rooms.findIndex((room) => room.id === id);

    if (roomIndex > -1) {
        rooms.splice(roomIndex, 1, { ...room, id });
    }
}

export const roomsDb = {
    list,
    listAvailable,
    existsById,
    create,
    update,
}