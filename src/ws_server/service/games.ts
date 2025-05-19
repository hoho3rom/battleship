import { gamesDb, type Coord, type Player, type ShipCoords } from "../db/games";
import type { AddShipsRequest, AttackRequest } from "../types/messaging";
import { convertShips, getMissedCoords } from "../utils";

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
    player.shipsCoords = convertShips(data.ships);
}

const attack = (data: AttackRequest): { 
    position: Coord, 
    status: string, 
    players: Player[], 
    turn: string, 
    missedCoords?: Coord[] 
} | undefined => {
    const game = gamesDb.getById(data.gameId);
    const player = game?.players.find(player => player.id === data.indexPlayer);
    const opponent = game?.players.find(player => player.id !== data.indexPlayer);
    if (!opponent || !player || !player.turn) return;

    const shotShip = opponent?.shipsCoords.find(
        ship => {
            const shotCoord = ship.find(coord => coord.x === data.x && coord.y === data.y);
            if (shotCoord) {
                shotCoord.shot = true;
            }
            return shotCoord;
        }
    );

    const killed = shotShip?.every(coord => coord.shot);
    player.turn = !!shotShip;
    opponent.turn = !shotShip;

    return { 
        position: { x: data.x, y: data.y }, 
        status: killed ? 'killed' : shotShip ? 'shot' : 'miss', 
        players: [player, opponent],
        turn: !shotShip ? opponent.id : player.id,
        missedCoords: killed && shotShip ? getMissedCoords(shotShip) : undefined
     };
}

export const gamesService = {
    getById,
    isReadyToStart,
    createGame,
    addShips,
    attack,
}