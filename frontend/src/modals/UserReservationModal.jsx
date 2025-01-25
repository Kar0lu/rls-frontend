import React, { useContext} from 'react';
import { Box,TextField, Button} from '@mui/material';
import GenericModal from './GenericModal';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext'
import dayjs from 'dayjs';


const ReservationModal = ({reservation, onClose, open, fetchData}) => {

  const { showSnackbar} = useOverlay();
  const {authTokens} = useContext(AuthContext);
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
        <GenericModal open={open} onClose={onClose} title={'Rezerwacja'}>

              <TextField  label='Data rezerwacji' value={dayjs(reservation.date).format('DD/MM/YYYY')}
              sx={{width:300}} color='primary' disabled focused />

          <Box sx={{display: 'flex', width:300, marginBottom:1}}>

              <TextField  label='Godzina rozpoczęcia' value={dayjs(reservation.startHour).format('HH:mm')}
              sx={{width:150}} color='primary' disabled focused />

              <TextField  label='Godzina zakończenia' value={dayjs(reservation.endHour).format('HH:mm')}
              sx={{width:150, marginLeft:3}} color='primary' disabled />

          </Box>

          {reservation.status !== 'FI' && (
                    <>
                        <TextField  label='Adres IP' value={reservation.adress}
                        sx={{width:300, marginBottom:1,}} color='primary' disabled />
        
                        <TextField  label='Hasło' value={reservation.password}
                        sx={{width:300, marginBottom:1,}} color='primary' disabled />
                        </>
                )}


              <TextField  label='Urządzenia' value={reservation.platform}
              sx={{width:300, marginBottom:1,}} color='primary' readOnly />

              <Box sx ={{display:'flex'}}>


                    <Box sx={{ width:300, marginBottom:3}}>
                        {reservation.status == 'PD' && (
                            <>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    mt: 1,
                                    marginLeft:3,
                                    width:270
                                }}
                                onClick={() => DeleteRecord(reservation.id)}
                                >
                                    Usuń Rezerwacje
                            </Button>
                            </>
                        )}

                    </Box>
                </Box>
        </GenericModal>
    );
 
};

export default ReservationModal