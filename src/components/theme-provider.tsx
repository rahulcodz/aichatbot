"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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

function applyTheme(theme: ThemeName, mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as ThemeName | null;
    const storedMode = window.localStorage.getItem("mode") as ThemeMode | null;

    setThemeState(storedTheme ?? DEFAULT_THEME);
    setModeState(storedMode ?? DEFAULT_MODE);
    setMounted(true);
  }, []);

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
