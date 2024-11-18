import React from 'react';
import { Typography, Container, Box } from '@mui/material';
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
      <Container maxWidth="md" sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Remote Lab System
        </Typography>
        <Typography variant="h6" component="p">
          Explore and control your remote laboratory resources, manage experiments, and access data in a single integrated platform.
        </Typography>
      </Container>
      <LoginForm />
    </Box>
  );
}

export default LandingPage;