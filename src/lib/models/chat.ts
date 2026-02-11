import mongoose, { Schema } from "mongoose";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
};

export type ChatDocument = mongoose.Document & {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

const ChatMessageSchema = new Schema<ChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSchema = new Schema<ChatDocument>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    title: { type: String, required: true, trim: true },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true }
);

export const Chat =
  (mongoose.models.Chat as mongoose.Model<ChatDocument>) ||
  mongoose.model<ChatDocument>("Chat", ChatSchema);
