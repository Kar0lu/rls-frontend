import React, {useContext} from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import GenericModal from './GenericModal';
import { TextField, Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';
import { jwtDecode } from 'jwt-decode';

const HarmonogramModal = ({open, onClose, selectedDate, startHour, endHour, selectedDevices, container}) => {

    const { authTokens, user } = useContext(AuthContext);
    const { showSnackbar, showLoading, hideLoading } = useOverlay();

    const fetchReservation = () => {
        showLoading()
        fetch(`http://127.0.0.1:8000/api/reservations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
            },
            body: JSON.stringify({
                "reservation_id": null,
                "created_at": null,
                "valid_since": `${dayjs(selectedDate).format('YYYY-MM-DD')}T${dayjs(startHour).format('HH:mm:ss')}`,
                "valid_until": `${dayjs(selectedDate).format('YYYY-MM-DD')}T${dayjs(endHour).format('HH:mm:ss')}`,
                "container": container.toString(),
                "devices": [
                    "322f894d39c14eab94e00d528b3ef6e5" // Wyciągnąć z Harmonogramu jakieś jedne wspólne id dla wybranych dat, a jeżeli takiego nie ma to hamsko odrzucić rezerwację
                ],
                "user": jwtDecode(authTokens.access).user_id,
                "root_password": "root", // Dodać pole w modalu do customizacji
                "status": "PD"
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then((data) => {
            showSnackbar(`Pomyślnie przesłano rezerwację`, 'success')
        })
        .catch(error => {
            showSnackbar('Wystąpił nieoczekiwany błąd', 'error')
        })
        .finally(
            hideLoading()
        );
    }
    
    return ( 
        <GenericModal open={open} onClose={onClose} title={'Rezerwacja'} width={550}>
            <Box sx={{display: 'flex', gap:2}}>
            <DatePicker label='Data' disabled value={dayjs(selectedDate)}/>
            <TextField label='Godzina rozpoczęcia' disabled value={dayjs(startHour).format('HH:mm')}/>
            <TextField label='Godzina zakończenia' disabled value={dayjs(endHour).format('HH:mm')}/>
            </Box>
            <TextField label='Wybrane urządzenia' disabled value={selectedDevices?.join(', ')}/>
            <Button variant='contained' size='small' onClick={fetchReservation}>Zarezerwuj</Button>
        </GenericModal>
    );
};

export default HarmonogramModal