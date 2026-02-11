import mongoose, { Schema } from "mongoose";

export type ModuleDocument = mongoose.Document & {
  projectId: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const ModuleSchema = new Schema<ModuleDocument>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Module =
  (mongoose.models.Module as mongoose.Model<ModuleDocument>) ||
  mongoose.model<ModuleDocument>("Module", ModuleSchema);
