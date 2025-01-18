import React from 'react';
import {Box } from '@mui/material';
import Reservations from '../components/Reservations';

const AdminReservationsPage = () => {
    return(
    <Box
        sx={{
            minHeight: '100vh',
            display: 'flex',
            float:'left',
            marginLeft:0,
            padding:0
        }}
         >
        <Box maxWidth="md">
            <Reservations/>
        </Box>
    </Box>
    );
}
export default AdminReservationsPage