import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import AdminRoute from './utils/AdminRoute';
import UserRoute from './utils/UserRoute';
import LandingRoute from './utils/LandingRoute';
import LoggedRoute from './utils/LoggedRoute';

import { AuthProvider} from './context/AuthContext';
import { OverlayProvider } from './context/OverlayContext';
import SideNavWrapper from './wrappers/SideNavWrapper';

import LandingPage from './pages/LandingPage';
import HarmonogramPage from './pages/HarmonogramPage';

import UserReservationsPage from './pages/user/UserReservationsPage';
import UserFolderPage from './pages/user/UserFolderPage';
import UserProfilePage from './pages/user/UserProfilePage';

import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <OverlayProvider>
          <AuthProvider>
            <Routes>
              {/* Available for everyone */}
              <Route path="/" element={<LandingRoute><LandingPage /></LandingRoute>} />

              {/* Available for logged in */}
              <Route path="/harmonogram" element={<LoggedRoute><SideNavWrapper><HarmonogramPage /></SideNavWrapper></LoggedRoute>} />

              {/* Available only for admin */}
              <Route path="/admin-reservations" element={<AdminRoute><SideNavWrapper><AdminReservationsPage /></SideNavWrapper></AdminRoute>} />
              <Route path="/admin-users" element={<AdminRoute><SideNavWrapper><AdminUsersPage /></SideNavWrapper></AdminRoute>} />
              <Route path="/admin-profile" element={<AdminRoute><SideNavWrapper><AdminProfilePage /></SideNavWrapper></AdminRoute>} />

              {/* Available only for user */}
              <Route path="/user-reservations" element={<UserRoute><SideNavWrapper><UserReservationsPage /></SideNavWrapper></UserRoute>} />
              <Route path="/user-folder" element={<UserRoute><SideNavWrapper><UserFolderPage /></SideNavWrapper></UserRoute>} />
              <Route path="/user-profile" element={<UserRoute><SideNavWrapper><UserProfilePage /></SideNavWrapper></UserRoute>} />

              {/* Preventing unintended routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </OverlayProvider>
      </Router>
    </ThemeProvider>
  );
}


export default App;