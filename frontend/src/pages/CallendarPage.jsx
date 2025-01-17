/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';;
import StudentMenu from '../components/Menu';
import Harmonogram from '../components/Harmonogram';


function CallendarPage(){
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
            <Typography variant="h4" component="h1" gutterBottom> 
                Harmonogram
            </Typography>
            <Harmonogram/>
        </Box>
    </Box>
    );
}

export default CallendarPage;