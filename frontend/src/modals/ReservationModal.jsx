import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { DatePicker, TimeField } from '@mui/x-date-pickers';
import { use } from 'react';

const ReservationModal = ({open, handleClose, date, start, end, platform, position, name, id}) => {

    const [reservations, setReservations] = useState([]);

    useEffect(() => {
      const data = JSON.parse(localStorage.getItem('usertemporary.json')) || [];
      setReservations(data);
    }, []);

    const handleClick = () => {};

    const DeleteRecord = (id) => {
      const updatedReservations = reservations.filter((reservation) => reservation.reservationID !== id);
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      handleClose();
    };

    return ( 
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box 
             sx={{
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 width: 400,
                 bgcolor: 'background.paper',
                 border: '2px solid #000',
                 boxShadow: 24,
                 p: 4,
                 fontSize:8,
                 display: 'flex',
                 borderRadius: '10px',
             }}>
        
          <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rezerwacja
          </Typography>
            <DatePicker
            variant="standard" 
            label="Data rezerwacji"
            value={date}
             format="DD/MM/YYYY"
            readOnly
            sx={{marginBottom:3, marginTop:3, width:'300px'}}
            />
            <Box sx={{display: 'flex', width:'300px', marginBottom:'10px'}}>
                    <TimeField
                    label="Godzina rozpoczęcia"
                    value={start}
                    readOnly
                    sx={{marginRight:3}}
                    />
                    <TimeField
                    label="Godzina zakończenia"
                    value={end}
                    readOnly
                    />
            </Box>
                <TextField  label='Imię i nazwisko' value={name}
                variant="standard" sx={{width:'300px', marginBottom:3}} color='primary' readOnly focused />
                  <TextField  label='Stanowisko' value={`Stanowisko ${position}`}
                  variant="standard" sx={{width:'150px'}} color='primary' readOnly focused />
                    <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 1,
                      marginLeft:3,
                      width:'130px'
                    }}
                    onClick={handleClick} //jeszcze nic nie robi, tak jak było ustalone
                    >
                      Profil
                    </Button>
                <Select
                    sx={{width:'150px', marginTop:3}}
                    label="Platforma"
                    value={platform}
                    renderValue={(value) => `${value}`}
                    disabled
                    color='primary'>
                    <MenuItem value="CoraZ">CoraZ</MenuItem>
                    <MenuItem value="Pynq">Pynq</MenuItem>
                    <MenuItem value="Digital Analog">Digital Analog</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 1,
                      marginLeft:3,
                      width:'130px'
                    }}
                    onClick={() => DeleteRecord(id)} //jeszcze nic nie robi, tak jak było ustalone
                    >
                      Usuń Rezerwacje
                </Button>
            </Box>
        </Box>
      </Modal>
    )
};

export default ReservationModal