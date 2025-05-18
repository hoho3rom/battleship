import type { UserWebSocket } from "../types/messaging";

const sockets: UserWebSocket[] = [];

const add = (socket: UserWebSocket) => {
    sockets.push(socket);
}

const getByUserId = (userId: number) => {
    return sockets.find(socket => socket.userId === userId);
}

export const socketsHub = {
    add,
    getByUserId,
}