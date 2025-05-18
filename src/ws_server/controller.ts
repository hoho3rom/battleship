import type { Game } from "./db/games";
import { socketsHub } from "./db/sockets";
import { gamesService } from "./service/games";
import { roomsService } from "./service/rooms";
import { usersService } from "./service/users";
import { MessageType, UserWebSocket, type AddShipsRequest } from "./types/messaging";
import { respond } from "./utils";
import { WebSocket, WebSocketServer } from "ws";

const register = (currentSocket: UserWebSocket, server: WebSocketServer, data: string) => {
    const signInRequest = JSON.parse(data);

    const userDTO = usersService.signInUp(signInRequest);
    if (!userDTO.error) {
        currentSocket.userId = userDTO.index;
    }

    respond(currentSocket, MessageType.reg, userDTO);

    const availableRooms = roomsService.getAvailableRooms();
    notifyAll(server, MessageType.updateRoom, availableRooms);

    const winners = usersService.getWinners();
    notifyAll(server, MessageType.updateWinners, winners);
}

const createRoom = (currentSocket: UserWebSocket, server: WebSocketServer) => {
    console.log('meh');
    roomsService.createMyRoom(currentSocket.userId);

    const availableRooms = roomsService.getAvailableRooms();
    notifyAll(server, MessageType.updateRoom, availableRooms);
}

const addUserToRoom = (currentSocket: UserWebSocket, server: WebSocketServer, data: string) => {
    const parsedData = JSON.parse(data);
    roomsService.addMeToRoom(currentSocket.userId, parsedData.indexRoom);

    const availableRooms = roomsService.getAvailableRooms();
    notifyAll(server, MessageType.updateRoom, availableRooms);

    const game = gamesService.createGame(parsedData.indexRoom);

    if (game) {
        [...game.players.values()].forEach(player => {
            const socket = socketsHub.getByUserId(player.userId);
            socket && respond(socket, MessageType.createGame, { idGame: game.id, idPlayer: player.id });
        });
    }
}

const addShips = (data: string) => {
    const addShipsRequest = JSON.parse(data) as AddShipsRequest;
    gamesService.addShips(addShipsRequest)

    const { gameId } = addShipsRequest;

    if (gamesService.isReadyToStart(gameId)) {
        gamesService.getById(gameId)
            ?.players
            .forEach(player => {
                const socket = socketsHub.getByUserId(player.userId);
                socket && respond(socket, MessageType.startGame, { ships: player.ships, currentPlayerIndex: player.id });
            });
    }
}

const notifyAll = (server: WebSocketServer, type: MessageType, data: any) => {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            respond(client, type, data);
        }
    })
}

// const notifyUsers = (userIds: number[], type: MessageType, data: any) => {
//     userIds.forEach(userId => {
//         const socket = socketsHub.getByUserId(userId);
//         socket && respond(socket, type, data);
//     })
// }


export const controller = {
    register,
    createRoom,
    addUserToRoom,
    addShips
}

