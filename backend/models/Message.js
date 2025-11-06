import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String,
  avatar: String,
  content: String,
  time: String,
});

export default mongoose.model("Message", MessageSchema);
