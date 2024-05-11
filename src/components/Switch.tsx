import React, { useContext } from 'react';
import { Switch } from 'react-native';
import ThemeContext from '../context/ThemeContext';

const Switcher = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return null; // Вернуть null или компонент заглушку, если контекст не определен
  }

  const { theme, setTheme } = themeContext;

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <Switch value={theme === 'dark'} onValueChange={toggleTheme} />;
};

