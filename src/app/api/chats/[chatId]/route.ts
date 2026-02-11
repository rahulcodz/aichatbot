import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";

type Params = {
  params: Promise<{ chatId: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { chatId } = await params;
  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!chatId) {
    return NextResponse.json({ error: "Chat id is required." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  await connectToDatabase();
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { title },
    { new: true }
  ).lean();

  return NextResponse.json({ chat });
}

export async function DELETE(_: Request, { params }: Params) {
  const { chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "Chat id is required." }, { status: 400 });
  }

  await connectToDatabase();
  await Chat.findByIdAndDelete(chatId);

  return NextResponse.json({ ok: true });
}
