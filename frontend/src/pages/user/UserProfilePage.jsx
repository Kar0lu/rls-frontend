import React, { useState, useContext, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
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

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nazwa użytkownika" value={userData.username} disabled />
            <TextField label="Status" value={userData.is_staff} disabled />
            <TextField label="Imię" value={userData.first_name} disabled />
            <TextField label="Nazwisko" value={userData.last_name} disabled />
            <TextField label="Pozostałe godziny" value={userData.hours_left} disabled />
        </Box>
    );
};

export default UserProfilePage;