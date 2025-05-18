import { roomsService } from "./service/rooms";
import { usersService} from "./service/users";
import { MessageType, UserWebSocket } from "./types/messaging";
import { respond } from "./utils";

const register = (currentSocket: UserWebSocket, data: string) => {
    const userDTO = usersService.signInUp(data);
    if (!userDTO.error) {
        currentSocket.userId = userDTO.index;
    }

    respond(currentSocket, MessageType.reg, userDTO);

    const availableRooms = roomsService.getAvailableRooms();
    respond(currentSocket, MessageType.updateRoom, availableRooms);

    const winners = usersService.getWinners();
    respond(currentSocket, MessageType.updateWinners, winners);
}

const createRoom = (currentSocket: UserWebSocket) => {
    roomsService.createMyRoom(currentSocket.userId);
    currentSocket.
}


export const controller = {
    register
}