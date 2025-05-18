import { WebSocketServer } from "ws";
import {roomsService}  from "./service/rooms.js";
import { MessageType, type UserWebSocket } from "./types/messaging.js";
import { respond } from "./utils.js";
import { controller } from "./controller.js";
import { socketsHub } from "./db/sockets.js";

export const startWsServer = () => {
    const websocketServer = new WebSocketServer({ port: 3000 }, () => {
        console.log('WebSocket server listening on ws://localhost:3000');
    });

    websocketServer.on('connection', (socket: UserWebSocket) => {
        socket.userId = -1;
        socketsHub.add(socket);

        socket.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message.toString());
            const { type, data } = parsedMessage;

            switch (type) {
                case MessageType.reg: {
                    controller.register(socket, websocketServer, data);
                    break;
                }
                case MessageType.createRoom: {
                    controller.createRoom(socket, websocketServer);
                    break;
                };
                case MessageType.addUserToRoom: {
                    controller.addUserToRoom(socket, websocketServer, data);
                    break;
                }
                case MessageType.addShips: {
                    controller.addShips(data);
                    break;
                }
            }
        });

        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
}