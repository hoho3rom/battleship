import { usersDb } from "../db/users.js";
import type { SignInRequest, SignInResponse } from "../types/messaging.js";
import { ensureSignInRequest } from "../utils.js";

const getById = (userId: number) => {
    return usersDb.getById(userId);
}

const listByRoomId = (roomId: string) => {
    return usersDb.listByRoom(roomId);
}

const getWinners = () => {
    const users = usersDb.list();

    return users.map(user => ({ name: user.name, wins: user.wins }));
}

const update = (id: number, user: User) => {
    return usersDb.update(id, user);
}

const updateWinner = (winnerId: number) => {
    const winner = usersDb.getById(winnerId);
    if (!winner) return;

    winner.wins += 1;

    usersDb.update(winnerId, winner);
}

const signInUp = (signInRequest: SignInRequest | any): SignInResponse => {
    if (!signInRequest && !ensureSignInRequest(signInRequest)) {
        return { name: signInRequest?.name || 'unknown', index: -1, error: true, errorText: "Invalid request body" };
    }

    const { name, password } = signInRequest;
    const existingUser = usersDb.getByNameAndPassword(name, password);

    if (!existingUser && usersDb.existsByName(name)) {
        return { name, index: -1, error: true, errorText: "User name already in use" };
    }

    const user = existingUser || usersDb.create(name, password);

    return { name: user.name, index: user.id, error: false };
}

export const usersService = {
    getById,
    listByRoomId,
    getWinners,
    update,
    updateWinner,
    signInUp
}

