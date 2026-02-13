import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";

type Params = {
  params: Promise<{ chatId: string }>;
};

const messageRoles = new Set(["user", "assistant", "system"] as const);

type MessageRole = "user" | "assistant" | "system";

function parseMessage(body: unknown): { role: MessageRole; content: string } | null {
  const input = body as {
    message?: {
      role?: unknown;
      content?: unknown;
    };
  };

  const role = input?.message?.role;
  const rawContent = input?.message?.content;
  const content = typeof rawContent === "string" ? rawContent.trim() : "";

  if (typeof role !== "string" || !messageRoles.has(role as MessageRole) || !content) {
    return null;
  }

  return { role: role as MessageRole, content };
}

export async function GET(_: Request, { params }: Params) {
  const { chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "Chat id is required." }, { status: 400 });
  }

  await connectToDatabase();
  const chat = await Chat.findById(chatId).lean();
  if (!chat) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  return NextResponse.json({ chat });
}

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

export async function POST(request: Request, { params }: Params) {
  const { chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "Chat id is required." }, { status: 400 });
  }

  const body = await request.json();
  const message = parseMessage(body);
  if (!message) {
    return NextResponse.json(
      { error: "A valid message with role and content is required." },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        messages: {
          role: message.role,
          content: message.content,
          createdAt: new Date(),
        },
      },
    },
    { new: true }
  ).lean();

  if (!chat) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  return NextResponse.json({ chat }, { status: 201 });
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
