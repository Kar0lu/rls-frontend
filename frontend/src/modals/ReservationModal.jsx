import React, { useContext} from 'react';
import { Box,TextField, Button} from '@mui/material';
import GenericModal from './GenericModal';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext'


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

              <TextField  label='Data rezerwacji' value={reservation.date}
              sx={{width:300}} color='primary' disabled focused />

          <Box sx={{display: 'flex', width:300, marginBottom:1}}>

              <TextField  label='Godzina rozpoczęcia' value={reservation.startHour}
              sx={{width:150}} color='primary' disabled focused />

              <TextField  label='Godzina zakończenia' value={reservation.endHour}
              sx={{width:150, marginLeft:3}} color='primary' disabled />

          </Box>

              <TextField  label='Imię i nazwisko' value={reservation.studentFullName}
              sx={{width:300, marginBottom:1,}} color='primary' disabled />

              <Box sx ={{display:'flex'}}>

                <Box sx={{ width:150}}>
                      <TextField  label='Stanowisko' value={`Stanowisko ${reservation.position}`}
                      sx={{width:150, marginBottom:2}} color='primary' disabled />

                      <TextField  label='Platforma' value={` ${reservation.platform}`}
                      sx={{width:150}} color='primary' readOnly />
                </Box>

                <Box sx={{ width:150, marginBottom:3}}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          mt: 1,
                          marginLeft:3,
                          width:130
                        }}
                        onClick={() => DeleteRecord(reservation.id)}
                        >
                          Usuń Rezerwacje
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                          sx={{
                            mt: 1,
                            marginLeft:3,
                            width:130
                          }}
                        onClick={handleClick} 
                        >
                          Profil
                    </Button>
                </Box>
            </Box>
        </GenericModal>
    );
 
};

export default ReservationModal