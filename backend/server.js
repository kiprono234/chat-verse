import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"],
  },
});

// active users list
let activeUsers = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("newUser", (user) => {
    // Add new user
    const existing = activeUsers.find((u) => u.id === socket.id);
    if (!existing) {
      activeUsers.push({ socketId: socket.id, ...user });
    }
    io.emit("activeUsers", activeUsers);
  });

  socket.on("sendMessage", (msgData) => {
    io.emit("receiveMessage", msgData);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((u) => u.socketId !== socket.id);
    io.emit("activeUsers", activeUsers);
  });
});

server.listen(5000, () => console.log("✅ Server running on port 5000"));
