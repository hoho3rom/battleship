import { usersDb } from "../db/users.js";
import type { SignInResponse } from "../types/messaging.js";
import { ensureSignInRequest } from "../utils.js";

const getWinners = () => {
    const users = usersDb.list();

    return users.map(user => ({ name: user.name, wins: user.wins }));
}

const updateWinner = (winnerId: number) => {
    const winner = usersDb.getById(winnerId);
    if (!winner) return;

    winner.wins += 1;
    
    usersDb.update(winnerId, winner);
}

const signInUp = (messageData: string): SignInResponse => {
    const data = JSON.parse(messageData);

    if (!data && !ensureSignInRequest(data)) {
        return { name: data?.name || 'unknown', index: -1, error: true, errorText: "Invalid request body" };
    }

    const { name, password } = data;
    const existingUser = usersDb.getByNameAndPassword(name, password);

    if (!existingUser && usersDb.existsByName(name)) {
        return { name, index: -1, error: true, errorText: "User name already in use" };
    }

    const user = existingUser || usersDb.create(name, password);

    return { name: user.name, index: user.id, error: false };
}

export const usersService ={
    getWinners,
    updateWinner,
    signInUp
}

