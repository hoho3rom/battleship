import type { Coord, Player, Ship, ShipCoords } from "./db/games.js";
import type { AttackRequest, AttackResponse, Message, SignInRequest } from "./types/messaging.js";
import { WebSocket } from "ws";

export const respond = (ws: WebSocket, type: string, data: any) => {
    const response: Message<string> = {
        type: type,
        data: JSON.stringify(data),
        id: data.id,
    };

    ws.send(JSON.stringify(response));
}

export const ensureSignInRequest = (message: any): message is SignInRequest => {
    return typeof message === "object"
        && message !== null
        && message.type
        && message.data?.name
        && message.data.password
}

const typeToSize = {
    'huge': 4,
    'large': 3,
    'medium': 2,
    "small": 1
}

export const convertShips = (ships: Ship[]): ShipCoords[] => {
    return ships.map(ship => {
        const size = typeToSize[ship.type];
        const { x, y } = ship.position;

        const coords = [];
        for (let k = 0, i = ship.direction ? y : x; k < size; i++, k++) {
            const coord = ship.direction 
                ? { x, y: i, shot: false }
                : { x: i, y, shot: false }

            console.log(coord);
            coords.push(coord);
        }
        return coords;
    })
}

export const getMissedCoords = (coords: ShipCoords) => {
    const minX = coords[0].x - 1;
    const minY = coords[0].y - 1;
    const maxX = coords.at(-1)?.x + 1;
    const maxY = coords.at(-1)?.y + 1;

    const missedCoords = [];

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (coords.some(coord => (coord.x === x && coord.y === y) || outOfField(x) || outOfField(y))) {
                break;
            }
            missedCoords.push({x, y})
        }
    }

    return missedCoords;
}

const outOfField = (coord: number) => coord < 0 || coord > 9;

// export const getAttackResponse = (position: Coord, player: Player): AttackResponse => {
//     return {
//         position,
//         currentPlayer: player.id,
//         status
//     }

// }