"use client";

import * as React from "react";
import {
  Bell,
  Briefcase,
  Boxes,
  ChevronDown,
  ChevronsLeft,
  Folder,
  LayoutGrid,
  Menu,
  MessageSquare,
  MoreVertical,
  Plus,
  Rocket,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  ProjectRecord,
  WorkspaceProvider,
} from "@/app/u/_components/workspace-context";

const projectIconOptions = [
  { name: "folder", label: "Folder", icon: Folder },
  { name: "layout", label: "Layout", icon: LayoutGrid },
  { name: "messages", label: "Messages", icon: MessageSquare },
  { name: "briefcase", label: "Briefcase", icon: Briefcase },
  { name: "boxes", label: "Boxes", icon: Boxes },
  { name: "rocket", label: "Rocket", icon: Rocket },
  { name: "settings", label: "Settings", icon: Settings },
  { name: "user", label: "User", icon: User },
];

const projectIconMap = new Map(projectIconOptions.map((option) => [option.name, option.icon]));

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed] = React.useState(false);
  const [projects, setProjects] = React.useState<ProjectRecord[]>([]);
  const [, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = React.useState<string | null>(null);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [, setOpenProjectId] = React.useState<string | null>(null);
  const [openModuleId, setOpenModuleId] = React.useState<string | null>(null);

  const [projectName, setProjectName] = React.useState("");
  const [projectIcon, setProjectIcon] = React.useState(projectIconOptions[0]?.name ?? "folder");
  const [moduleName, setModuleName] = React.useState("");
  const [chatTitle, setChatTitle] = React.useState("");
  const [, setBusyKey] = React.useState<string | null>(null);
  const [projectEditName, setProjectEditName] = React.useState("");
  const [moduleEditName, setModuleEditName] = React.useState("");
  const [chatEditTitle, setChatEditTitle] = React.useState("");
  const [modalType, setModalType] = React.useState<
    | "createProject"
    | "editProject"
    | "deleteProject"
    | "createModule"
    | "editModule"
    | "deleteModule"
    | "createChat"
    | "editChat"
    | "deleteChat"
    | null
  >(null);
  const [modalProjectId, setModalProjectId] = React.useState<string | null>(null);
  const [modalModuleId, setModalModuleId] = React.useState<string | null>(null);
  const [modalChatId, setModalChatId] = React.useState<string | null>(null);

  const refreshProjects = React.useCallback(
    async (selection?: { projectId?: string; moduleId?: string; chatId?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load projects.");
        }
        const data = await response.json();
        setProjects(Array.isArray(data?.projects) ? data.projects : []);
        if (selection?.projectId) {
          setActiveProjectId(selection.projectId);
          setOpenProjectId(selection.projectId);
        }
        if (selection?.moduleId) {
          setActiveModuleId(selection.moduleId);
          setOpenModuleId(selection.moduleId);
        }
        if (selection?.chatId) {
          setActiveChatId(selection.chatId);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load projects.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  React.useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const activeProject = React.useMemo(
    () => projects.find((project) => project._id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  const activeModule = React.useMemo(
    () => activeProject?.modules?.find((moduleItem) => moduleItem._id === activeModuleId) ?? null,
    [activeProject, activeModuleId]
  );

  React.useEffect(() => {
    if (!projects.length) {
      setActiveProjectId(null);
      setActiveModuleId(null);
      setActiveChatId(null);
      return;
    }

    if (!activeProjectId || !projects.some((project) => project._id === activeProjectId)) {
      setActiveProjectId(projects[0]._id);
      setOpenProjectId(projects[0]._id);
    }
  }, [projects, activeProjectId]);

  React.useEffect(() => {
    if (!activeProject) {
      setActiveModuleId(null);
      setActiveChatId(null);
      return;
    }

    if (!activeModuleId || !activeProject.modules.some((moduleItem) => moduleItem._id === activeModuleId)) {
      const nextModuleId = activeProject.modules[0]?._id ?? null;
      setActiveModuleId(nextModuleId);
      setOpenModuleId(nextModuleId);
    }
  }, [activeProject, activeModuleId]);

  React.useEffect(() => {
    if (!activeModule) {
      setActiveChatId(null);
      return;
    }

    if (!activeChatId || !activeModule.chats.some((chat) => chat._id === activeChatId)) {
      setActiveChatId(activeModule.chats[0]?._id ?? null);
    }
  }, [activeModule, activeChatId]);

  const handleCreateProject = async () => {
    const name = projectName.trim();
    if (!name) {
      setError("Project name is required.");
      return;
    }

    setBusyKey("project");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon: projectIcon }),
      });
      if (!response.ok) {
        throw new Error("Failed to create project.");
      }
      const data = await response.json();
      setProjectName("");
      closeModal();
      await refreshProjects({ projectId: data?.project?._id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create project.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleCreateModule = async (projectId: string) => {
    const name = moduleName.trim();
    if (!name) {
      setError("Module name is required.");
      return;
    }

    setBusyKey(`module-${projectId}`);
    try {
      const response = await fetch(`/api/projects/${projectId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, projectId }),
      });
      if (!response.ok) {
        throw new Error("Failed to create module.");
      }
      const data = await response.json();
      setModuleName("");
      closeModal();
      await refreshProjects({ projectId, moduleId: data?.module?._id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create module.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleCreateChat = async (moduleId: string) => {
    const title = chatTitle.trim() || "New chat";
    setBusyKey(`chat-${moduleId}`);
    try {
      const response = await fetch(`/api/modules/${moduleId}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, moduleId }),
      });
      if (!response.ok) {
        throw new Error("Failed to create chat.");
      }
      const data = await response.json();
      setChatTitle("");
      closeModal();
      await refreshProjects({ moduleId, chatId: data?.chat?._id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create chat.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const openModal = (type: NonNullable<typeof modalType>, options?: {
    projectId?: string;
    moduleId?: string;
    chatId?: string;
  }) => {
    setModalType(type);
    setModalProjectId(options?.projectId ?? null);
    setModalModuleId(options?.moduleId ?? null);
    setModalChatId(options?.chatId ?? null);
    if (type === "createProject") {
      setProjectName("");
      setProjectIcon(projectIconOptions[0]?.name ?? "folder");
    }
    if (type === "editProject" && options?.projectId) {
      const project = projects.find((item) => item._id === options.projectId);
      setProjectEditName(project?.name ?? "");
    }
    if (type === "createModule") {
      setModuleName("");
    }
    if (type === "editModule" && options?.moduleId) {
      const moduleItem = projects
        .flatMap((project) => project.modules)
        .find((item) => item._id === options.moduleId);
      setModuleEditName(moduleItem?.name ?? "");
    }
    if (type === "createChat") {
      setChatTitle("");
    }
    if (type === "editChat" && options?.chatId) {
      const chat = projects
        .flatMap((project) => project.modules)
        .flatMap((moduleItem) => moduleItem.chats)
        .find((item) => item._id === options.chatId);
      setChatEditTitle(chat?.title ?? "");
    }
  };

  const closeModal = () => {
    setModalType(null);
    setModalProjectId(null);
    setModalModuleId(null);
    setModalChatId(null);
  };

  const handleUpdateProject = async (projectId: string) => {
    const name = projectEditName.trim();
    if (!name) {
      setError("Project name is required.");
      return;
    }
    setBusyKey(`project-update-${projectId}`);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to update project.");
      }
      closeModal();
      await refreshProjects({ projectId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update project.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setBusyKey(`project-delete-${projectId}`);
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete project.");
      }
      closeModal();
      setActiveProjectId(null);
      setActiveModuleId(null);
      setActiveChatId(null);
      await refreshProjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete project.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdateModule = async (moduleId: string) => {
    const name = moduleEditName.trim();
    if (!name) {
      setError("Module name is required.");
      return;
    }
    setBusyKey(`module-update-${moduleId}`);
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to update module.");
      }
      closeModal();
      await refreshProjects({ moduleId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update module.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    setBusyKey(`module-delete-${moduleId}`);
    try {
      const response = await fetch(`/api/modules/${moduleId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete module.");
      }
      closeModal();
      setActiveModuleId(null);
      setActiveChatId(null);
      await refreshProjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete module.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdateChat = async (chatId: string) => {
    const title = chatEditTitle.trim();
    if (!title) {
      setError("Chat name is required.");
      return;
    }
    setBusyKey(`chat-update-${chatId}`);
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Failed to update chat.");
      }
      closeModal();
      await refreshProjects({ chatId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update chat.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    setBusyKey(`chat-delete-${chatId}`);
    try {
      const response = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete chat.");
      }
      closeModal();
      setActiveChatId(null);
      await refreshProjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete chat.";
      setError(message);
    } finally {
      setBusyKey(null);
    }
  };

  const workspaceValue = React.useMemo(
    () => ({
      projects,
      activeProjectId,
      activeModuleId,
      activeChatId,
      refreshProjects,
      setActiveProjectId,
      setActiveModuleId,
      setActiveChatId,
    }),
    [projects, activeProjectId, activeModuleId, activeChatId, refreshProjects]
  );

  const modalProject = React.useMemo(
    () => projects.find((project) => project._id === modalProjectId) ?? null,
    [projects, modalProjectId]
  );
  const modalModule = React.useMemo(
    () =>
      projects
        .flatMap((project) => project.modules)
        .find((moduleItem) => moduleItem._id === modalModuleId) ?? null,
    [projects, modalModuleId]
  );
  const modalChat = React.useMemo(
    () =>
      projects
        .flatMap((project) => project.modules)
        .flatMap((moduleItem) => moduleItem.chats)
        .find((chat) => chat._id === modalChatId) ?? null,
    [projects, modalChatId]
  );

  const renderModal = () => {
    if (!modalType) {
      return null;
    }

    const isDelete = modalType.startsWith("delete");
    const isCreate = modalType.startsWith("create");
    const titleMap: Record<string, string> = {
      createProject: "Create project",
      editProject: "Rename project",
      deleteProject: "Delete project",
      createModule: "Create module",
      editModule: "Rename module",
      deleteModule: "Delete module",
      createChat: "Create chat",
      editChat: "Rename chat",
      deleteChat: "Delete chat",
    };

    const handleConfirm = async () => {
      if (modalType === "createProject") {
        await handleCreateProject();
      }
      if (modalType === "editProject" && modalProjectId) {
        await handleUpdateProject(modalProjectId);
      }
      if (modalType === "deleteProject" && modalProjectId) {
        await handleDeleteProject(modalProjectId);
      }
      if (modalType === "createModule" && modalProjectId) {
        await handleCreateModule(modalProjectId);
      }
      if (modalType === "editModule" && modalModuleId) {
        await handleUpdateModule(modalModuleId);
      }
      if (modalType === "deleteModule" && modalModuleId) {
        await handleDeleteModule(modalModuleId);
      }
      if (modalType === "createChat" && modalModuleId) {
        await handleCreateChat(modalModuleId);
      }
      if (modalType === "editChat" && modalChatId) {
        await handleUpdateChat(modalChatId);
      }
      if (modalType === "deleteChat" && modalChatId) {
        await handleDeleteChat(modalChatId);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-xl border border-border/60 bg-background p-4 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">{titleMap[modalType]}</h2>
              {(modalType === "deleteProject" || modalType === "deleteModule" || modalType === "deleteChat") && (
                <p className="mt-1 text-sm text-muted-foreground">
                  This action cannot be undone.
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeModal} aria-label="Close modal">
              <span className="text-lg leading-none">×</span>
            </Button>
          </div>

          <div className="mt-4 grid gap-3">
            {modalType === "createProject" && (
              <>
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Project name</Label>
                  <Input
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Project icon</Label>
                  <Select value={projectIcon} onValueChange={setProjectIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectIconOptions.map((option) => (
                        <SelectItem key={option.name} value={option.name}>
                          <span className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            <span className="max-w-[180px] truncate">{option.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {modalType === "editProject" && (
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Project name</Label>
                <Input
                  value={projectEditName}
                  onChange={(event) => setProjectEditName(event.target.value)}
                  placeholder={modalProject?.name ?? "Project name"}
                />
              </div>
            )}

            {modalType === "deleteProject" && (
              <p className="text-sm text-muted-foreground">
                Delete project <span className="font-semibold text-foreground">{modalProject?.name}</span> and all its modules and chats?
              </p>
            )}

            {modalType === "createModule" && (
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Module name</Label>
                <Input
                  value={moduleName}
                  onChange={(event) => setModuleName(event.target.value)}
                  placeholder="Enter module name"
                />
              </div>
            )}

            {modalType === "editModule" && (
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Module name</Label>
                <Input
                  value={moduleEditName}
                  onChange={(event) => setModuleEditName(event.target.value)}
                  placeholder={modalModule?.name ?? "Module name"}
                />
              </div>
            )}

            {modalType === "deleteModule" && (
              <p className="text-sm text-muted-foreground">
                Delete module <span className="font-semibold text-foreground">{modalModule?.name}</span> and all its chats?
              </p>
            )}

            {modalType === "createChat" && (
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Chat name</Label>
                <Input
                  value={chatTitle}
                  onChange={(event) => setChatTitle(event.target.value)}
                  placeholder="Enter chat name"
                />
              </div>
            )}

            {modalType === "editChat" && (
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Chat name</Label>
                <Input
                  value={chatEditTitle}
                  onChange={(event) => setChatEditTitle(event.target.value)}
                  placeholder={modalChat?.title ?? "Chat name"}
                />
              </div>
            )}

            {modalType === "deleteChat" && (
              <p className="text-sm text-muted-foreground">
                Delete chat <span className="font-semibold text-foreground">{modalChat?.title}</span>?
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="ghost" className="rounded-full" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant={isDelete ? "destructive" : "default"}
              className="rounded-full"
              onClick={handleConfirm}
            >
              {isDelete ? "Delete" : isCreate ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebarContent = (onNavigate?: () => void) => (
    <div className="flex flex-col gap-4">
      


      {!collapsed && error && <p className="text-xs text-destructive">{error}</p>}
      {!collapsed && (
        <div className="grid gap-2">
          {/* <Label className="text-xs text-muted-foreground">Select project</Label> */}
          <div className="flex items-center gap-2">
            <Select
              value={activeProjectId ?? ""}
              onValueChange={(value) => {
                if (value === "__new__") {
                  openModal("createProject");
                  return;
                }
                setActiveProjectId(value);
                setOpenProjectId(value);
                setOpenModuleId(null);
                setActiveModuleId(null);
                setActiveChatId(null);
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__new__">+ New project</SelectItem>
                <SelectSeparator />
                {projects.map((project) => {
                  const ProjectIcon = projectIconMap.get(project.icon) ?? Folder;
                  return (
                    <SelectItem key={project._id} value={project._id}>
                      <span className="flex items-center gap-2">
                        <ProjectIcon className="h-4 w-4" />
                        <span className="max-w-[180px] truncate">{project.name}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  disabled={!activeProject}
                  aria-label="Project actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={!activeProject}
                  onClick={() => activeProject && openModal("editProject", { projectId: activeProject._id })}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!activeProject}
                  className="text-destructive focus:text-destructive"
                  onClick={() => activeProject && openModal("deleteProject", { projectId: activeProject._id })}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <nav className={cn("flex flex-col gap-3", collapsed && "items-center")}>
        {!activeProject && (
          <p className="text-xs text-muted-foreground">Create a project to see modules.</p>
        )}
        {activeProject && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Modules</p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-full px-2 text-[11px]"
                onClick={() => {
                  openModal("createModule", { projectId: activeProject._id });
                }}
              >
                <Plus className="h-3 w-3" />
                New module
              </Button>
            </div>

            {activeProject.modules.length === 0 && (
              <p className="text-xs text-muted-foreground">No modules yet.</p>
            )}

            {activeProject.modules.map((moduleItem) => {
              const isModuleOpen = openModuleId === moduleItem._id;
              return (
                <div key={moduleItem._id} className="flex flex-col gap-2">
                  <div
                    className={cn(
                      "group flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all",
                      activeModuleId === moduleItem._id
                        ? "bg-background text-foreground shadow-sm ring-1 ring-primary/15"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <button
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      onClick={() => {
                        setActiveProjectId(activeProject._id);
                        setActiveModuleId(moduleItem._id);
                        setOpenProjectId(activeProject._id);
                        setOpenModuleId((prev) => (prev === moduleItem._id ? null : moduleItem._id));
                        setActiveChatId(null);
                      }}
                    >
                      <span className="flex-1 truncate">{moduleItem.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground",
                          isModuleOpen ? "rotate-180" : "rotate-0"
                        )}
                      />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Module actions">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openModal("editModule", { moduleId: moduleItem._id })}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => openModal("deleteModule", { moduleId: moduleItem._id })}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {isModuleOpen && (
                    <div className="ml-3 flex flex-col gap-2 border-l border-border/60 pl-3 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Chats</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 rounded-full px-2 text-[11px]"
                          onClick={() => {
                          openModal("createChat", { moduleId: moduleItem._id });
                          }}
                        >
                          New chat
                        </Button>
                      </div>

                      {moduleItem.chats.length === 0 && (
                        <p className="text-xs text-muted-foreground">No chats yet.</p>
                      )}
                      <div className="flex flex-col gap-1">
                        {moduleItem.chats.map((chat) => (
                          <div
                            key={chat._id}
                            className={cn(
                              "group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                              activeChatId === chat._id
                                ? "bg-primary/10 text-foreground ring-1 ring-primary/15"
                                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            )}
                          >
                            <button
                              className="flex min-w-0 flex-1 items-center gap-2 text-left"
                              onClick={() => {
                                setActiveProjectId(activeProject._id);
                                setActiveModuleId(moduleItem._id);
                                setActiveChatId(chat._id);
                                setOpenProjectId(activeProject._id);
                                setOpenModuleId(moduleItem._id);
                                onNavigate?.();
                              }}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full bg-muted-foreground/60 group-hover:bg-foreground/70",
                                  activeChatId === chat._id && "bg-primary"
                                )}
                              />
                              <span className="flex-1 truncate">{chat.title}</span>
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Chat actions">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openModal("editChat", { chatId: chat._id })}
                                >
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => openModal("deleteChat", { chatId: chat._id })}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <WorkspaceProvider value={workspaceValue}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Workspace</p>
                <h1 className="text-lg font-semibold">Unified Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm">
                Invite
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl gap-4 px-4 py-6">
          <aside
            className={cn(
              "hidden flex-col gap-4 rounded-xl border bg-card p-3 text-card-foreground shadow-sm md:flex",
              collapsed ? "w-16" : "w-72"
            )}
          >
            {/* <div className={cn("flex items-center justify-between", collapsed && "justify-center")}>
              {!collapsed && <p className="text-xs font-semibold uppercase text-muted-foreground">Navigation</p>}
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", collapsed && "hidden")}
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              {collapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCollapsed(false)}
                  aria-label="Expand sidebar"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Separator /> */}
            {renderSidebarContent()}
          </aside>

          <main className="flex min-w-0 flex-1 flex-col gap-6">{children}</main>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 bg-background p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Navigation</p>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <ChevronsLeft className="h-5 w-5" />
                </Button>
              </div>
              <Separator className="my-3" />
              {renderSidebarContent(() => setMobileOpen(false))}
            </div>
          </div>
        )}
        {renderModal()}
      </div>
    </WorkspaceProvider>
  );
}
