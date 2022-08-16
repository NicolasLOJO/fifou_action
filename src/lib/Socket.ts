import socketio, { Server } from "socket.io";
import http from "http";

export class Socket {
    io: Server;
    sockets: { [user: string]: socketio.Socket } = {};
    constructor(app: http.Server) {
        this.io = new Server(app, {
            cors: {
                origin: "*"
            }
        });
    }

    init() {
        this.io.on('connection', (socket) => {
            console.log('Connected to Socket.io');
            socket.emit('connected');
            socket.on('set user', (user: string) => {
                if (!this.sockets[user]) {
                    this.sockets[user] = socket;
                }
            })
        });
    }

    getByUser(username: string) {
        if (!this.sockets[username]) {
            throw new Error('No socket for this user');
        }
        return this.sockets[username];
    }
}