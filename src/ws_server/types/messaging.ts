import { WebSocket } from "ws";

export type Message<T> = {
    type: string;
    data: T;
    id: 0;
};

export type SignInRequest = {
    name: string;
    password: string;
};

export type SignInResponse = {
    name: string,
    index: number,
    error: boolean,
    errorText?: string,
};

export type Winner = {
    name: string;
    wins: number;
}

export type UserWebSocket = WebSocket & { userId: number };

export enum MessageType {
    reg = "reg",
    updateRoom = "update_room",
    updateWinners = "update_winners",
    createGame = "create_game",
    startGame = "start_game",
    turn = "turn",
    attack = "attack",
    finish = "finish",
    createRoom = "create_room",
    addShips = "add_ships",
    randomAttack = "randomAttack"
}