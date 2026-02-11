"use client";

import * as React from "react";

export type ChatRecord = {
  _id: string;
  title: string;
  messages?: { role: string; content: string; createdAt?: string }[];
};

export type ModuleRecord = {
  _id: string;
  name: string;
  chats: ChatRecord[];
};

export type ProjectRecord = {
  _id: string;
  name: string;
  icon: string;
  modules: ModuleRecord[];
};

export type WorkspaceState = {
  projects: ProjectRecord[];
  activeProjectId: string | null;
  activeModuleId: string | null;
  activeChatId: string | null;
  setActiveProjectId: (projectId: string | null) => void;
  setActiveModuleId: (moduleId: string | null) => void;
  setActiveChatId: (chatId: string | null) => void;
};

const WorkspaceContext = React.createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({
  value,
  children,
}: {
  value: WorkspaceState;
  children: React.ReactNode;
}) {
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider.");
  }
  return context;
}
