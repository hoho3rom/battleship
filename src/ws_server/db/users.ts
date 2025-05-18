const users: User[] = [];

const getById = (id: number): User | undefined => {
    return users.find(user => user.id === id);
}

const list = () => {
    return [...users];
}

const listByRoom = (roomId: string) => {
    return users.filter(user => user.roomId === roomId);
}

const getByNameAndPassword = (name: string, password: string) => {
    return users.find(user => user.name === name && user.password === password);
}

const existsByName = (name: string): boolean => {
    return users.some(user => user.name === name);
}

const create = (name: string, password: string): User => {
    const newUser: User = {
        id: getNextId(),
        name: name,
        password,
        wins: 0
    };

    users.push(newUser);
    return newUser;
}

const update = (id: number, user: User): void => {
    const userIndex = users.findIndex(existingUser => existingUser.id === id);

    if (userIndex > -1) {
        user.id = id;
        users.splice(userIndex, 1, user);
    }
}

export const usersDb = {
    getById,
    getByNameAndPassword,
    list,
    listByRoom,
    existsByName,
    create,
    update
};

const getNextId = () => {
    const lastUserId = users.at(-1)?.id;
    return lastUserId ? lastUserId + 1 : 1;
}
