
import crypto from 'node:crypto';

export type Coord = {
    x: number;
    y: number;
}

export type ShipCoords = {
    x: number;
    y: number;
    shot: boolean;
}[]

export type Ship = {
    position: { x: number, y: number };
    direction: boolean;
    length: number;
    type: 'small' | 'medium' | 'large' | 'huge';
}

export type Player = {
    id: string;
    userId: number;
    ships: Ship[];
    shipsCoords: ShipCoords[];
    turn: boolean;
}

export type Game = {
    id: string;
    players: Player[];
}

const games: Game[] = [];

const getById = (id: string) => {
    return games.find(game => game.id === id);
}

const createGame = (users: User[]) => {
    const id = crypto.randomUUID();
    const players = users.map((user, index) => ({ 
        id: crypto.randomUUID(), 
        userId: user.id, 
        ships: [],
        shipsCoords: [],
        turn: !index
    }));
    const game = { id, players };

    games.push(game);

    return game;
}

export const gamesDb = {
    getById,
    createGame
}