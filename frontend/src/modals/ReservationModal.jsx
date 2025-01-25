import React, { useContext} from 'react';
import { Box,TextField, Button} from '@mui/material';
import GenericModal from './GenericModal';
import AuthContext from '../context/AuthContext';


const ReservationModal = ({reservation, onClose, open, fetchData}) => {

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
          throw new Error('Failed to delete reservation');
        }
        fetchData();
        onClose();
      })
      .catch((error) => {
        console.error('Error deleting reservation:', error);
      });

  };


    return (  
        <GenericModal open={open} onClose={onClose} title={'Rezerwacja'}>

              <TextField  label='Data rezerwacji' value={reservation.date}
              variant="standard" sx={{width:300}} color='primary' disabled focused />

          <Box sx={{display: 'flex', width:300, marginBottom:1}}>

              <TextField  label='Godzina rozpoczęcia' value={reservation.startHour}
              variant="standard" sx={{width:150}} color='primary' disabled focused />

              <TextField  label='Godzina zakończenia' value={reservation.endHour}
              variant="standard" sx={{width:150, marginLeft:3}} color='primary' disabled />

          </Box>

              <TextField  label='Imię i nazwisko' value={reservation.studentFullName}
              variant="standard" sx={{width:300, marginBottom:1,}} color='primary' disabled />

              <Box sx ={{display:'flex'}}>

                <Box sx={{ width:150}}>
                      <TextField  label='Stanowisko' value={`Stanowisko ${reservation.position}`}
                      variant="standard" sx={{width:150, marginBottom:2}} color='primary' disabled />

                      <TextField  label='Platforma' value={` ${reservation.platform}`}
                      variant="standard" sx={{width:150}} color='primary' disabled />
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