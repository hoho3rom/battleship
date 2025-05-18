import { gamesDb } from "../db/games";
import type { AddShipsRequest } from "../types/messaging";

import { usersService } from "./users";

const getById = (id: string) => {
    return gamesDb.getById(id);
}

const isReadyToStart = (id: string) => {
    const game = gamesDb.getById(id);

    return game?.players.every(player => player.ships.length > 0);
}

const createGame = (roomId: string) => {
    const users = usersService.listByRoomId(roomId);

    if (users.length === 2) {
        return gamesDb.createGame(users);
    }
}

const addShips = (data: AddShipsRequest) => {
    const game = gamesDb.getById(data.gameId);
    if (!game) return;

    const player = game.players.find(player => player.id === data.indexPlayer);
    if (!player) return;

    player.ships = data.ships; // reference save
}

export const gamesService = {
    getById,
    isReadyToStart,
    createGame,
    addShips
}