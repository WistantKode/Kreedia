"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // Force dark mode

  useEffect(() => {
    // Force dark mode only - ignore localStorage and system preference
    setTheme("dark");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const toggleTheme = () => {
    // Disable theme toggling - always stay in dark mode
    // Comment this out if you want to completely disable toggling
    // const newTheme = theme === "light" ? "dark" : "light";
    // setTheme(newTheme);
    // localStorage.setItem("theme", newTheme);
    // document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
