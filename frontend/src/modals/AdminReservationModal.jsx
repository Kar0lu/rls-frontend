import React, { useContext} from 'react';
import { Box,TextField, Button} from '@mui/material';
import GenericModal from './GenericModal';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext'
import dayjs from 'dayjs';

const ReservationModal = ({reservation, onClose, open, fetchData}) => {

  const { showSnackbar} = useOverlay();
  const { authTokens } = useContext(AuthContext);
  const handleClick = () => {};

  const DeleteRecord = (id) => {
    fetch(`http://127.0.0.1:8000/api/reservations/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        showSnackbar(`Nastąpił błąd w wyborze rezerwacji. Status: ${response.status}`, 'error');
      }
      return response.status === 204 ? null : response.json();
    })
    .then(() => {
      fetchData();
      onClose(); 
    })
    .catch((error) => {
      showSnackbar('Nieoczekiwany błąd', 'error');
    });

  };

  return (  
    <GenericModal open={open} onClose={onClose} title={'Rezerwacja'} width={500}>

      <Box sx={{display: 'flex', gap: 2}}>
        <TextField label='Data rezerwacji' value={dayjs(reservation.date).format('DD/MM/YYYY')} disabled />
        <TextField label='Rozpoczęcie' value={dayjs(reservation.startHour).format('HH:mm')} disabled />
        <TextField label='Zakończenie' value={dayjs(reservation.endHour).format('HH:mm')} disabled />
      </Box>

      <TextField  label='Imię i nazwisko' value={reservation.studentFullName} disabled sx={{textAlign: 'center'}}/>

      <Box sx={{display: 'flex', gap: 2}}>
        {reservation.status !== 'FI' && (
          <>
            <TextField label='Adres IP' value={reservation.adress} disabled />
            <TextField label='Hasło' value={reservation.password} disabled />
          </>
        )}
        <TextField label='Stanowisko' value={`Stanowisko ${reservation.position}`} disabled />
      </Box>

      <TextField label='Urządzenia' value={`${reservation.platform}`} readOnly />

      <Box sx={{display: 'flex', gap: 2, justifyContent: 'space-between'}}>
        {reservation.status == 'PD' && (
          <Button variant="contained" onClick={() => DeleteRecord(reservation.id)} color='error'>
            Usuń Rezerwacje
          </Button>
        )}
        <Button variant="contained" onClick={handleClick}>
          Profil Użytkownika
        </Button>
      </Box>

    </GenericModal>
  );
};

export default ReservationModal