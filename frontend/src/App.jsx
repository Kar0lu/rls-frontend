import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import HomePage from './pages/LandingPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#383ecc',
    },
    secondary: {
      main: '#BCBCC0',
    },
    background: {
      default: '#1e1e2f',
      paper: '#2a2a3b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#BCBCC0',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontWeight: 'bold'
    },
    h6: {
      fontWeight: 400,
      opacity: 0.7,
    },
    caption: {
      fontSize: '0.8rem',
      textAlign: 'center',
      opacity: 0.7,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            border: `10px solid primary`,
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              border: `1px solid primary`,
            },
          }
        }
      }
  }}
});



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
