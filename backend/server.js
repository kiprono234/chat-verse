import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import mongoose from "mongoose";

// Fix __dirname because ES Modules don't provide it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chatverse").then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

// === File upload configuration ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({ fileUrl });
});

// === Authentication Routes ===

// Signup
app.post("/signup", async (req, res) => {
  console.log("Signup request received with body:", req.body);
  try {
    const { username, email, password, photo, bio } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      photo: photo || "",
      bio: bio || "",
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "7d" });

    res.status(201).json({ user: { id: user._id, username, email, photo, bio }, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "7d" });

    res.json({ user: { id: user._id, username: user.username, email: user.email, photo: user.photo, bio: user.bio }, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// === Socket.IO Chat ===
let activeUsers = [];

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // New user joins
  socket.on("newUser", (user) => {
    const existingUser = activeUsers.find(u => u.email === user.email);

    if (!existingUser) {
      activeUsers.push({ socketId: socket.id, ...user });
    } else {
      existingUser.socketId = socket.id;
    }

    io.emit("activeUsers", activeUsers);
  });

  // Sending messages
  socket.on("sendMessage", (msgData) => {
    const messageWithTime = {
      ...msgData,
      timestamp: new Date().toISOString(),
    };

    io.emit("receiveMessage", messageWithTime);
  });

  // Typing indicator
  socket.on("typing", (typingData) => {
    socket.broadcast.emit("typing", typingData);
  });

  // Disconnect
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter(u => u.socketId !== socket.id);
    io.emit("activeUsers", activeUsers);
    console.log("❌ User disconnected:", socket.id);
  });
});

// Health check
app.get("/", (req, res) => res.send("Chat server running"));

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
