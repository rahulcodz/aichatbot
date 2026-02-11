import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";

type Params = {
  params: { moduleId: string };
};

export async function GET(_: Request, { params }: Params) {
  if (!params?.moduleId) {
    return NextResponse.json({ error: "Module id is required." }, { status: 400 });
  }

  await connectToDatabase();
  const chats = await Chat.find({ moduleId: params.moduleId }).sort({ createdAt: 1 }).lean();
  return NextResponse.json({ chats });
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const moduleId =
    typeof params?.moduleId === "string"
      ? params.moduleId
      : typeof body?.moduleId === "string"
        ? body.moduleId.trim()
        : "";

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!moduleId) {
    return NextResponse.json({ error: "Module id is required." }, { status: 400 });
  }

  await connectToDatabase();
  const chat = await Chat.create({ moduleId, title });

  return NextResponse.json({ chat }, { status: 201 });
}
