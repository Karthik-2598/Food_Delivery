// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProviderWrapper');
  }
  return context;
};

const lightTheme = createTheme({
    typography: {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700, letterSpacing: '-0.5px' },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  body1: { fontWeight: 400, lineHeight: 1.6 },
  button: { 
    fontWeight: 600, 
    textTransform: 'none',
    letterSpacing: '0.5px'
  },
},
  palette: {
    mode: 'light',
    primary: { main: '#ff6b6b' },
    secondary: { main: '#feca57' },
    background: {
      default: '#fffaf0',
      paper: 'rgba(255, 255, 255, 0.92)',
    },
  },
});

const darkTheme = createTheme({
    typography: {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700, letterSpacing: '-0.5px' },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  body1: { fontWeight: 400, lineHeight: 1.6 },
  button: { 
    fontWeight: 600, 
    textTransform: 'none',
    letterSpacing: '0.5px'
  },
},
  palette: {
    mode: 'dark',
    primary: { main: '#ff8a80' },
    secondary: { main: '#ffd180' },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(30, 30, 30, 0.95)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});

export const ThemeProviderWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};