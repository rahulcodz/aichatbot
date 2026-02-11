"use client";

import * as React from "react";
import { Bot, Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/app/u/_components/workspace-context";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { projects, activeProjectId, activeModuleId, activeChatId } = useWorkspace();

  const activeProject = React.useMemo(
    () => projects.find((project) => project._id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );
  const activeModule = React.useMemo(
    () => activeProject?.modules.find((moduleItem) => moduleItem._id === activeModuleId) ?? null,
    [activeProject, activeModuleId]
  );
  const activeChat = React.useMemo(
    () => activeModule?.chats.find((chat) => chat._id === activeChatId) ?? null,
    [activeModule, activeChatId]
  );

  const messages = activeChat?.messages ?? [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Chat workspace</CardTitle>
          <CardDescription>
            {activeProject ? (
              <>
                {activeProject.name}
                {activeModule ? ` · ${activeModule.name}` : ""}
                {activeChat ? ` · ${activeChat.title}` : ""}
              </>
            ) : (
              "Create a project and module to begin."
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {!activeChat && (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Select a chat from the sidebar or create a new one to start the conversation.
        </div>
      )}

      {activeChat && (
        <>
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
                No messages yet. Start the conversation below.
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "flex gap-3",
                  message.role === "assistant" ? "items-start" : "items-end justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="max-w-xl rounded-2xl border bg-card px-4 py-3 text-sm shadow-sm">
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="rounded-2xl border bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Attach file">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                className="border-0 focus-visible:ring-0"
                placeholder="Ask about project context, tasks, or updates..."
              />
              <Button size="icon" aria-label="Send" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
