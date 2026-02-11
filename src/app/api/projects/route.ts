import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";
import { Module } from "@/lib/models/module";
import { Project } from "@/lib/models/project";

export async function GET() {
  await connectToDatabase();

  const projects = await Project.find().sort({ createdAt: 1 }).lean();
  if (projects.length === 0) {
    return NextResponse.json({ projects: [] });
  }

  const projectIds = projects.map((project) => project._id);
  const modules = await Module.find({ projectId: { $in: projectIds } }).sort({ createdAt: 1 }).lean();
  const moduleIds = modules.map((module) => module._id);
  const chats = moduleIds.length
    ? await Chat.find({ moduleId: { $in: moduleIds } }).sort({ createdAt: 1 }).lean()
    : [];

  const chatsByModule = new Map<string, typeof chats>();
  for (const chat of chats) {
    const key = chat.moduleId.toString();
    const current = chatsByModule.get(key);
    if (current) {
      current.push(chat);
    } else {
      chatsByModule.set(key, [chat]);
    }
  }

  const modulesByProject = new Map<string, typeof modules>();
  for (const moduleItem of modules) {
    const key = moduleItem.projectId.toString();
    const current = modulesByProject.get(key);
    if (current) {
      current.push(moduleItem);
    } else {
      modulesByProject.set(key, [moduleItem]);
    }
  }

  const payload = projects.map((project) => ({
    ...project,
    modules: (modulesByProject.get(project._id.toString()) ?? []).map((moduleItem) => ({
      ...moduleItem,
      chats: chatsByModule.get(moduleItem._id.toString()) ?? [],
    })),
  }));

  return NextResponse.json({ projects: payload });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const icon = typeof body?.icon === "string" ? body.icon.trim() : "";

  if (!name || !icon) {
    return NextResponse.json({ error: "Name and icon are required." }, { status: 400 });
  }

  await connectToDatabase();
  const project = await Project.create({ name, icon });

  return NextResponse.json({ project }, { status: 201 });
}
