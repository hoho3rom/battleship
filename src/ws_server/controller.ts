import type { Player } from "./db/games";
import { socketsHub } from "./db/sockets";
import { gamesService } from "./service/games";
import { roomsService } from "./service/rooms";
import { usersService } from "./service/users";
import { MessageType, UserWebSocket, type AddShipsRequest, type AttackRequest } from "./types/messaging";
import { respond as notify } from "./utils";
import { WebSocket, WebSocketServer } from "ws";

const register = (currentSocket: UserWebSocket, server: WebSocketServer, data: string) => {
    const signInRequest = JSON.parse(data);

    const userDTO = usersService.signInUp(signInRequest);
    if (!userDTO.error) {
        currentSocket.userId = userDTO.index;
    }

    notify(currentSocket, MessageType.reg, userDTO);

    const availableRooms = roomsService.getAvailableRooms();
    notifyAll(server, MessageType.updateRoom, availableRooms);

    const winners = usersService.getWinners();
    notifyAll(server, MessageType.updateWinners, winners);
}

const createRoom = (currentSocket: UserWebSocket, server: WebSocketServer) => {
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
            socket && notify(socket, MessageType.createGame, { idGame: game.id, idPlayer: player.id });
        });
    }
}

const addShips = (data: string) => {
    const addShipsRequest = JSON.parse(data) as AddShipsRequest;
    gamesService.addShips(addShipsRequest)

    const { gameId } = addShipsRequest;

    if (gamesService.isReadyToStart(gameId)) {
        startGame(gameId);
    }
}

const startGame = (gameId: string) => {
    const players = gamesService.getById(gameId)?.players || [];

    players.forEach(player => {
        const socket = socketsHub.getByUserId(player.userId);
        if (socket) {
            notify(socket, MessageType.startGame, { ships: player.ships, currentPlayerIndex: player.id });
            notify(socket, MessageType.turn, { currentPlayer: players[0].id });
        }
    });
}

const attack = (server: WebSocketServer, data: string) => {
    const attack: AttackRequest = JSON.parse(data);

    const result = gamesService.attack(attack);
    if (!result) return;

    const { position, status, players, missedCoords, turn } = result;

    players.forEach(player => {
        const socket = socketsHub.getByUserId(player.userId);
        if (!socket) return;

        const data = { position, currentPlayer: players[0].id, status }
        notify(socket, MessageType.attack, data);

        missedCoords?.forEach(position => {
            notify(socket, MessageType.attack, { position, currentPlayer: players[0].id, status: 'miss' });
        });

        notify(socket, MessageType.turn, { currentPlayer: turn });
    });

    const winner = gamesService.getGameWinner(attack.gameId);
    if (winner) {
        finishGame(server, players, winner);
    }
}

const finishGame = (server: WebSocketServer, players: Player[], winner: Player) => {
    usersService.updateWinner(winner.userId);

    players.forEach(player => {
        const socket = socketsHub.getByUserId(player.userId);
        if (!socket) return;

        notify(socket, MessageType.finish, { winPlayer: winner.id });
    });

    const winners = usersService.getWinners();
    notifyAll(server, MessageType.updateWinners, winners);
}

const notifyAll = (server: WebSocketServer, type: MessageType, data: any) => {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            notify(client, type, data);
        }
    })
}

export const controller = {
    register,
    createRoom,
    addUserToRoom,
    addShips,
    attack,
}

