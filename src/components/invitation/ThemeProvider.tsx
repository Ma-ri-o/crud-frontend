"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { ThemeName } from "@/types/event";
import { themes } from "@/lib/themes";

const ThemeContext = createContext<ThemeName>("elegant");
export const useInvitationTheme = () => useContext(ThemeContext);

export function ThemeProvider({ theme, customColors, children }: { theme: ThemeName; customColors?: { primary?: string; accent?: string; background?: string; text?: string }; children: ReactNode }) {
  const selected = themes[theme] ?? themes.elegant;
  const colors = { ...selected.colors, ...customColors };
  const style = {
    "--event-bg": colors.background,
    "--event-surface": colors.surface,
    "--event-text": colors.text,
    "--event-muted": colors.muted,
    "--event-primary": colors.primary,
    "--event-accent": colors.accent,
    "--event-line": colors.line,
    "--event-display": selected.fonts.display,
    "--event-body": selected.fonts.body,
    "--event-background": selected.background,
  } as CSSProperties;

  return (
    <ThemeContext.Provider value={theme}>
      <div className="event-theme min-h-screen" data-theme={theme} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
