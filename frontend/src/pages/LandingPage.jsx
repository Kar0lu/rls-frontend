import React from 'react';
import { Typography, Box } from '@mui/material';
import LoginForm from '../components/LoginForm';

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e1e2f, #1c1c25)',
      }}
    >
      <Box maxWidth="lg" sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h1" gutterBottom>
          Remote Lab System
        </Typography>
        <Typography variant="h6">
          Kontroluj zdalne zasoby laboratoryjne, zarządzaj eksperymentami i uzyskuj dostęp do danych na jednej zintegrowanej platformie.
        </Typography>
      </Box>
      <LoginForm />
    </Box>
  );
}

export default LandingPage;