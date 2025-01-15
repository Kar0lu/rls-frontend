import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Create the context
const SnackbarContext = createContext();

// Provider component
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

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

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
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
    </SnackbarContext.Provider>
  );
};

// Custom hook to use the snackbar context
export const useSnackbar = () => useContext(SnackbarContext);
