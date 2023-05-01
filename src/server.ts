import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";
import { SocketServer } from "./socket";

dotenv.config();
console.log("");
console.log("===================================");

const port = process.env.PORT || 9000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) =>
  res.status(200).json({ status: "running...", api: "0.1.3" })
);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const socketServer = new SocketServer(io);

app.post("/send-message", (req, res) => {
  const { message } = req.body;
  socketServer.sendMessage(message);
  return res.status(200).json({ message: "Message sent" });
});

httpServer.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
  console.log("===================================");
  console.log("");
});
