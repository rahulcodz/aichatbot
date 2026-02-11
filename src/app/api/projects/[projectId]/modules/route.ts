import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";
import { Module } from "@/lib/models/module";

type Params = {
  params: { projectId: string };
};

export async function GET(_: Request, { params }: Params) {
  if (!params?.projectId) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  await connectToDatabase();

  const modules = await Module.find({ projectId: params.projectId }).sort({ createdAt: 1 }).lean();
  const moduleIds = modules.map((moduleItem) => moduleItem._id);
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

  const payload = modules.map((moduleItem) => ({
    ...moduleItem,
    chats: chatsByModule.get(moduleItem._id.toString()) ?? [],
  }));

  return NextResponse.json({ modules: payload });
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const projectId =
    typeof params?.projectId === "string"
      ? params.projectId
      : typeof body?.projectId === "string"
        ? body.projectId.trim()
        : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!projectId) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  await connectToDatabase();
  const moduleItem = await Module.create({ name, projectId });

  return NextResponse.json({ module: moduleItem }, { status: 201 });
}
