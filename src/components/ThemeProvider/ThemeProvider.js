import React, { createContext, useContext } from "react";
import { useEffect } from "react";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return (
    <ThemeContext.Provider value={{ toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
