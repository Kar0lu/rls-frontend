/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import { TextField, Button, Typography, Box, Card, CardContent, Tooltip } from '@mui/material';
import AuthContext from '../context/AuthContext';

function LoginForm() {
  let {loginUser} = useContext(AuthContext)

  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    console.log(formValues)
  }, [formValues]);

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
              sx={{
                mt: 2,
              }}
              onClick={handleLogin}
            >
              Zaloguj
            </Button>
            <Typography variant="caption" gutterBottom>
              <Tooltip title="Skontaktuj się z kierownikiem swojego laboratorium" arrow enterDelay={500} leaveDelay={200}>
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
