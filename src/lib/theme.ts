export type ThemeName =
  | "default"
  | "ocean"
  | "violet"
  | "sand"
  | "twitter"
  | "claude"
  | "vercel"
  | "gibli"
  | "luxery"
  | "modern"
  | "perplexity"
  | "slack"
  | "spotify"
  | "vscode";

export const THEMES: { name: ThemeName; label: string }[] = [
  { name: "default", label: "Default" },
  { name: "ocean", label: "Ocean" },
  { name: "violet", label: "Violet" },
  { name: "sand", label: "Sand" },
  { name: "twitter", label: "Twitter" },
  { name: "claude", label: "Claude" },
  { name: "vercel", label: "Vercel" },
  { name: "gibli", label: "Ghibli Studio" },
  { name: "luxery", label: "Luxury" },
  { name: "modern", label: "Modern" },
  { name: "perplexity", label: "Perplexity" },
  { name: "slack", label: "Slack" },
  { name: "spotify", label: "Spotify" },
  { name: "vscode", label: "VS Code" },
];

export type ThemeMode = "light" | "dark";

export const DEFAULT_THEME: ThemeName = "default";
export const DEFAULT_MODE: ThemeMode = "light";
