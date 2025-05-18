import { WebSocketServer } from "ws";
import {roomsService}  from "./service/rooms.js";
import { MessageType, type UserWebSocket } from "./types/messaging.js";
import { respond } from "./utils.js";
import { controller } from "./controller.js";

let sockets: UserWebSocket[] = [];

export const startWsServer = () => {
    const websocketServer = new WebSocketServer({ port: 3000 }, () => {
        console.log('WebSocket server listening on ws://localhost:3000');
    });

    websocketServer.on('connection', (ws: UserWebSocket) => {
        ws.userId = -1;
        sockets.push(ws);

        ws.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message);
            const type = parsedMessage.type;

            switch (type) {
                case MessageType.reg: {
                    controller.register(ws, parsedMessage.data);
                }
                case MessageType.createRoom: () => {
                    controller.createRoom(ws, websocketServer);
                };
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            sockets = sockets.filter(socket => socket !== ws)
        });
    });
}