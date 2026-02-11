import mongoose, { Schema } from "mongoose";

export type ProjectDocument = mongoose.Document & {
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
};

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project =
  (mongoose.models.Project as mongoose.Model<ProjectDocument>) ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);
