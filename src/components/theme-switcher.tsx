"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ThemeName } from "@/lib/theme";

export function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode, themes, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="flex w-full items-center justify-end gap-2">
        <div className="h-10 w-40 rounded-md bg-muted" />
        <div className="h-10 w-10 rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={theme} onValueChange={(value) => setTheme(value as ThemeName)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((themeOption) => (
            <SelectItem key={themeOption.name} value={themeOption.name}>
              {themeOption.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Toggle color mode"
        onClick={toggleMode}
      >
        {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
