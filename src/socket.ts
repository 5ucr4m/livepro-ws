import { Server, Socket } from "socket.io";

export class SocketServer {
  public isConnection: boolean = false;
  public socket: Socket | null = null;
  private io: Server;

  log = (data: any) => {
    console.log(data);
  };

  constructor(io: Server) {
    this.io = io;

    io.on("connection", (socket) => {
      this.isConnection = true;
      this.socket = socket;

      socket.emit("createMessage", socket.id);

      socket.on("userPeer", (payload) => {
        console.log("userPeer", payload);
      });

      socket.on("status", (payload) => {
        io.emit("status", payload);
        console.log("status", payload);
      });

      socket.on("createMessage", this.log);
      socket.on("join-room", this.joinRoom);
    });
  }

  async joinRoom(roomId: string, userId: string, userName: string) {
    if (this.isConnection && !!this.socket) {
      this.socket.join(roomId);

      this.socket?.to(roomId).emit("user-connected", userId);

      this.socket.on("message", (message) => {
        this.io.to(roomId).emit("createMessage", message, userName);
      });
    } else {
      console.log("Not connected");
    }
  }

  async sendMessage(message: string) {
    if (this.isConnection && this.socket) {
      this.socket.emit("createMessage", message);
    }
  }
}
