"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { DEFAULT_MODE, DEFAULT_THEME, type ThemeMode, type ThemeName, THEMES } from "@/lib/theme";

type ThemeContextValue = {
  theme: ThemeName;
  mode: ThemeMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  themes: typeof THEMES;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeNameSet = new Set(THEMES.map((theme) => theme.name));
const modeSet = new Set<ThemeMode>(["light", "dark"]);

function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }
  const value = window.localStorage.getItem("theme");
  if (value && themeNameSet.has(value as ThemeName)) {
    return value as ThemeName;
  }
  return DEFAULT_THEME;
}

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_MODE;
  }
  const value = window.localStorage.getItem("mode");
  if (value && modeSet.has(value as ThemeMode)) {
    return value as ThemeMode;
  }
  return DEFAULT_MODE;
}

const subscribe = () => () => {};

function applyTheme(theme: ThemeName, mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => getStoredTheme());
  const [mode, setModeState] = useState<ThemeMode>(() => getStoredMode());
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme, mode);
    window.localStorage.setItem("theme", theme);
    window.localStorage.setItem("mode", mode);
  }, [theme, mode, mounted]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setTheme: setThemeState,
      setMode: setModeState,
      toggleMode: () => setModeState((prev) => (prev === "dark" ? "light" : "dark")),
      themes: THEMES,
      mounted,
    }),
    [theme, mode, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
