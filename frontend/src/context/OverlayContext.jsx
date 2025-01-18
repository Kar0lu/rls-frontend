import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';

// Create the context
const OverlayContext = createContext();

// Provider component
export const OverlayProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  const [loading, setLoading] = useState(false);

  // Show the snackbar
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Hide the snackbar
  const hideSnackbar = useCallback((event, reason) => {
    // Ignore clickaway events to prevent accidental dismissal
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Show loading spinner
  const showLoading = useCallback(() => setLoading(true), []);

  // Hide loading spinner
  const hideLoading = useCallback(() => setLoading(false), []);

  return (
    <OverlayContext.Provider value={{ showSnackbar, showLoading, hideLoading }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </OverlayContext.Provider>
  );
};

// Custom hook to use the snackbar context
export const useOverlay = () => useContext(OverlayContext);
