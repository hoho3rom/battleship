
import crypto from 'node:crypto';

export type Ship = {
    position: { x: number, y: number };
    direction: boolean;
    length: number;
    type: 'small' | 'medium' | 'large' | 'huge';
}

type Player = {
    id: string;
    userId: number;
    ships: Ship[];
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
    const players = users.map((user) => ({ 
        id: crypto.randomUUID(), 
        userId: user.id, 
        ships: [] 
    }));
    const game = { id, players };

    games.push(game);

    return game;
}

export const gamesDb = {
    getById,
    createGame
}