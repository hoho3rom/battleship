import type { Message, SignInRequest } from "./types/messaging.js";
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
