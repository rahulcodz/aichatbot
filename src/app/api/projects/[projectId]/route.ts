import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";
import { Module } from "@/lib/models/module";
import { Project } from "@/lib/models/project";

type Params = {
  params: Promise<{ projectId: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { projectId } = await params;
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!projectId) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(
    projectId,
    { name },
    { new: true }
  ).lean();

  return NextResponse.json({ project });
}

export async function DELETE(_: Request, { params }: Params) {
  const { projectId } = await params;
  if (!projectId) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  await connectToDatabase();
  const modules = await Module.find({ projectId }).select("_id").lean();
  const moduleIds = modules.map((moduleItem) => moduleItem._id);

  if (moduleIds.length) {
    await Chat.deleteMany({ moduleId: { $in: moduleIds } });
  }
  await Module.deleteMany({ projectId });
  await Project.findByIdAndDelete(projectId);

  return NextResponse.json({ ok: true });
}
