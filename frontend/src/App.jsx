import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import { AuthProvider } from './context/AuthContext'
import AdminRoute from './utils/AdminRoute'
import UserRoute from './utils/UserRoute'
import { OverlayProvider } from './context/OverlayContext';
import SideNavWrapper from './wrappers/SideNavWrapper';

import LandingPage from './pages/LandingPage';
import HarmonogramPage from './pages/HarmonogramPage'
import AdminReservationModal from './pages/AdminReservationsPage'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      <OverlayProvider>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/admin" element={
              <AdminRoute>
                <SideNavWrapper>
                  <HarmonogramPage/>
                </SideNavWrapper>
              </AdminRoute>
            }/>
            <Route path="/admin_reservations" element={
              <AdminRoute>
                <SideNavWrapper>
                  <AdminReservationModal/>
                </SideNavWrapper>
              </AdminRoute>
            }/>
            <Route path="/user" element={
              <UserRoute>
                <SideNavWrapper>
                    <HarmonogramPage/>
                </SideNavWrapper>
              </UserRoute>
            }/>
        </Routes>
      </AuthProvider>
      </OverlayProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
