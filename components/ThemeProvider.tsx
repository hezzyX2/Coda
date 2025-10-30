"use client";
import { ReactNode, useEffect, useState } from "react";
import { loadPreferences, savePreferences } from "@/lib/storage";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>("lilac-mist");

  useEffect(() => {
    const prefs = loadPreferences();
    const next = prefs?.theme ?? "lilac-mist";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const prefs = loadPreferences() ?? {} as any;
    savePreferences({ ...prefs, theme });
  }, [theme]);

  return (
    <div>
      {children}
    </div>
  );
}


