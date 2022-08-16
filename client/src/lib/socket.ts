import { io, Socket } from "socket.io-client";

let clientSocket: Socket | undefined;

function setSocket() {
    if (!clientSocket) {
        clientSocket = io('http://localhost:3005');
    }
}

function getSocket() {
    if (!clientSocket) {
        throw new Error('No socket connected')
    }
    return clientSocket;
}

function initSocket(onConnected: (socket: Socket) => void) {
    if (clientSocket) {
        clientSocket.on('connected', () => clientSocket && onConnected(clientSocket));
    }
}

export default {
    setSocket, initSocket, getSocket
}