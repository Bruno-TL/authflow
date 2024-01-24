import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

import { ThemeProvider as ThemeProviderStyled } from "styled-components";
import { darkTheme } from "./darkTheme";
import { lightTheme } from "./lightTheme";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export enum ThemeType {
  light = "light",
  dark = "dark",
}

const themes = {
  [ThemeType.light]: lightTheme,
  [ThemeType.dark]: darkTheme,
};

export const ThemeContext = createContext({
  theme: ThemeType.light,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(ThemeType.light);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const savedTheme = await AsyncStorage.getItem("@theme");
    const theme: ThemeType = savedTheme ? JSON.parse(savedTheme) : "light";

    if (savedTheme) {
      setTheme(theme);
    }
  }

  function toggleTheme() {
    let newTheme;
    if (theme === ThemeType.light) {
      newTheme = ThemeType.dark;
    } else {
      newTheme = ThemeType.light;
    }

    AsyncStorage.setItem("@theme", newTheme);
    setTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProviderStyled theme={themes[theme]}>
        {children}
      </ThemeProviderStyled>
    </ThemeContext.Provider>
  );
};
