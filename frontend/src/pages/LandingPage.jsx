import React, {useContext, useState} from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Tooltip } from '@mui/material';
import AuthContext from '../context/AuthContext';

const LandingPage = () => {
  let {loginUser} = useContext(AuthContext)

  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
    }));
  };

  const handleLogin = () => {
    loginUser(formValues.username, formValues.password)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ maxWidth: 'lg', textAlign: 'center', mb: 5 }}>
        <Typography variant="h1" gutterBottom>
          Remote Lab System
        </Typography>
        <Typography variant="h6">
          Kontroluj zdalne zasoby laboratoryjne, zarządzaj eksperymentami i uzyskuj dostęp do danych na jednej zintegrowanej platformie.
        </Typography>
      </Box>
      <Card sx={{ backgroundColor: 'background.paper', boxShadow: 3, minWidth: 400 }}>
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
              label="Nazwa użytkownika"
              type="text"
              variant="outlined"
              fullWidth
              name="username"
              onChange={handleInputChange}
            />
            <TextField
              label="Hasło"
              type="password"
              variant="outlined"
              fullWidth
              name="password"
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Zaloguj
            </Button>
            <Tooltip title="Skontaktuj się z kierownikiem swojego laboratorium" arrow enterDelay={500} leaveDelay={200}>
              <Typography
                variant="caption"
                sx={{ cursor: 'pointer', color: 'secondary.main', textAlign: 'center' }}
              >
                Skąd wziąć hasło?
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LandingPage;