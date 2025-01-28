import React, { useContext} from 'react';
import { Box,TextField, Button} from '@mui/material';
import GenericModal from './GenericModal';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext'
import dayjs from 'dayjs';

const ReservationModal = ({reservation, onClose, open, fetchData}) => {

  const { showSnackbar} = useOverlay();
  const {authTokens} = useContext(AuthContext);
  console.log(reservation)

  const deleteRecord = (id) => {
    fetch(`http://127.0.0.1:8000/api/reservations/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        showSnackbar('Wystąpił błąd podczas komunikacji z serwerem', 'error');
      }
      return response.status === 204 ? null : response.json();
    })
    .then(() => {
      fetchData();
      onClose(); 
    })
    .catch((error) => {
      showSnackbar('Wystąpił nieoczekiwany błąd', 'error');
    });
  };

  return (  
    <GenericModal open={open} onClose={onClose} title={'Rezerwacja'} width={500}>

      <Box sx={{display: 'flex', gap: 2}}>
        <TextField label='Data rezerwacji' value={dayjs(reservation.date).format('DD/MM/YYYY')} disabled />
        <TextField label='Godzina rozpoczęcia' value={dayjs(reservation.startHour).format('HH:mm')} disabled />
        <TextField label='Godzina zakończenia' value={dayjs(reservation.endHour).format('HH:mm')} disabled />
      </Box>

      {reservation.status !== 'FI' && (
        <Box sx={{display: 'flex', gap: 2}}>
          <TextField label='Adres IP' value={reservation.adress} disabled fullWidth />
          <TextField label='Hasło' value={reservation.password} disabled fullWidth />
        </Box>
      )}

      <TextField label='Urządzenia' value={reservation.platform} readOnly />
      {reservation.status == 'PD' && (
        <Button
          variant="contained"
          onClick={() => deleteRecord(reservation.id)}
        >
          Usuń Rezerwacje
        </Button>
      )}
    </GenericModal>
  );
};

export default ReservationModal