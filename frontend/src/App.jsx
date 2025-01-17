import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LandingPage from './pages/LandingPage';
import CallendarPage from './pages/CallendarPage'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminRoute from './utils/AdminRoute'
import UserRoute from './utils/UserRoute'

import { AuthProvider } from './context/AuthContext'
import { SnackbarProvider } from './context/SnackbarContext';

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
    h3: {
      fontWeight: 400,
      fontSize: '2,5rem',
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
      <SnackbarProvider>
      <Router>
      <AuthProvider>
          <Routes>
              <Route path="/" element={<LandingPage/>}/>
              <Route path="/admin" element={<AdminRoute><CallendarPage/></AdminRoute>} />
              <Route path="/user" element={<UserRoute><CallendarPage/></UserRoute>} />
          </Routes>
      </AuthProvider>
      </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
