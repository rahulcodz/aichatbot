import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/lib/models/chat";
import { Module } from "@/lib/models/module";

type Params = {
  params: Promise<{ moduleId: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { moduleId } = await params;
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!moduleId) {
    return NextResponse.json({ error: "Module id is required." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  await connectToDatabase();
  const moduleItem = await Module.findByIdAndUpdate(
    moduleId,
    { name },
    { new: true }
  ).lean();

  return NextResponse.json({ module: moduleItem });
}

export async function DELETE(_: Request, { params }: Params) {
  const { moduleId } = await params;
  if (!moduleId) {
    return NextResponse.json({ error: "Module id is required." }, { status: 400 });
  }

  await connectToDatabase();
  await Chat.deleteMany({ moduleId });
  await Module.findByIdAndDelete(moduleId);

  return NextResponse.json({ ok: true });
}
