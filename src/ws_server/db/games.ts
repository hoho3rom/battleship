
import crypto from 'node:crypto';

type Ship = {
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

type Game = {
    id: string;
    player1: Player;
    player2: Player;
}

const games: Game[] = [];

const createGame = (userId: number) => {
    const id = crypto.randomUUID();
    const game = { }

}