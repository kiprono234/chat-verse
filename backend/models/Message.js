import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  avatar: { type: String, required: true },
  text: { type: String, default: "" },
  file: { type: String, default: null },
  fileType: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  archived: { type: Boolean, default: false },
});

export default mongoose.model("Message", MessageSchema);
