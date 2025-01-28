import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import AuthContext from '../../context/AuthContext';
import { useOverlay } from '../../context/OverlayContext';
import { jwtDecode } from 'jwt-decode';

const UserProfilePage = () => {
    const [userData, setUserData] = useState({
        username: '',
        is_staff: '',
        first_name: '',
        last_name: '',
        hours_left: ''
    });
    const [ newPassword, setNewPassword ] = useState('')
    const [ oldPassword, setOldPassword ] = useState('')
    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };
    const handleOldPasswordChange = (event) => {
        setOldPassword(event.target.value);
    };

    const { authTokens } = useContext(AuthContext);
    const { showSnackbar, showLoading, hideLoading } = useOverlay();

    useEffect(() => {
        const fetchData = async () => {
            showLoading();

            try {
                // Fetch user details
                const userResponse = await fetch(
                    `http://127.0.0.1:8000/api/users/${jwtDecode(authTokens.access).user_id}/`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authTokens.access}`,
                        },
                    }
                );

                if (!userResponse.ok) throw new Error('Failed to fetch user details');

                const userData = await userResponse.json();

                setUserData((prevValues) => ({
                    ...prevValues,
                    username: userData.username,
                    is_staff: userData.is_staff ? 'admin' : 'user',
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                }));

                // Fetch user hours
                const hoursResponse = await fetch('http://127.0.0.1:8000/api/user/hoursLeft/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });

                if (!hoursResponse.ok) throw new Error('Failed to fetch hours left');

                const hoursData = await hoursResponse.json();

                setUserData((prevValues) => ({
                    ...prevValues,
                    hours_left: hoursData.hours_left,
                }));
            } catch (error) {
                showSnackbar('Błąd podczas pobierania danych', 'error');
            } finally {
                hideLoading();
            }
        };

        fetchData();
    }, []);

    const newPasswordFetch = () => {
        const id = jwtDecode(authTokens.access).user_id

        if(oldPassword == '') {
            showSnackbar(`Stare hasło nie może być puste`, 'warning');
            return null
        }
        if(newPassword == '') {
            showSnackbar(`Nowe hasło nie może być puste`, 'warning');
            return null
        }
        if(oldPassword.length < 8) {
            showSnackbar(`Stare hasło musi zawierać conajmniej 8 znaków`, 'warning');
            return null
        }
        if(newPassword.length < 8) {
            showSnackbar(`Nowe hasło musi zawierać conajmniej 8 znaków`, 'warning');
            return null
        }
        if(newPassword == oldPassword) {
            showSnackbar(`Hasła nie mogą być takie same`, 'warning');
            return null
        }
        fetch(`http://127.0.0.1:8000/api/changePassword/${id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authTokens.access}`,
            },
            body: JSON.stringify({
                "password": oldPassword,
                "new_password": newPassword
            })
        })
        .then((response) => {
            if(response.status == 400) {
                throw new Error('Invalid Data')
            }
            if (!response.ok) {
                throw new Error()
            }
            return response.json();
        })
        .then(() => {
            showSnackbar(`Pomyślnie zmieniono hasło użytkownika ${userData.username}`, 'success');
        })
        .catch((error) => {
            if(error.message === 'Invalid Data') {
                showSnackbar('Nieprawidłowe hasło', 'error');
            } else {
                showSnackbar('Wystąpił nieoczekiwany bład', 'error');
            }
            
        })
        .finally(() => {
            setOldPassword('')
            setNewPassword('')
        }  )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <TextField label="Nazwa użytkownika" value={userData.username} disabled />
                <TextField label="Imię i nazwisko" value={userData.first_name + ' ' + userData.last_name} disabled />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <TextField label="Status" value={userData.is_staff} disabled />
                <TextField label="Pozostałe godziny" value={userData.hours_left} disabled />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <TextField label="Stare hasło" value={oldPassword} onChange={handleOldPasswordChange} type='password'/>
                <TextField label="Nowe hasło" value={newPassword} onChange={handleNewPasswordChange} type='password'/>
            </Box>
            <Box sx={{display: 'flex'}}>
                <Button variant='contained' onClick={newPasswordFetch}>Zmień hasło</Button>
            </Box>
        </Box>
    );
};

export default UserProfilePage;