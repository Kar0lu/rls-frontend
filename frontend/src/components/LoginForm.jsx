import React from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Tooltip } from '@mui/material';

const sendGetRequest = async () => {
  try {
    const response = await fetch("http://localhost:8000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Response:", responseData);
    } else {
      console.log("Failed to send GET request");
    }
  } catch (error) {
    console.error("Error sending GET request:", error);
  }
};

function LoginForm() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        mt: 4,
      }}
    >
      <Card sx={{ backgroundColor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Box
            component="form"
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
              }}
              onClick={sendGetRequest}
            >
              Login
            </Button>
            <Typography variant="caption" gutterBottom>
              <Tooltip title="Lorem ipsum dolor sit amet, consectetur adipiscing elit,
               sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." arrow enterDelay={500} leaveDelay={200}>
                <Button
                color="secondary"
                >
                Skąd wziąć hasło?
                </Button>
              </Tooltip>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginForm;
