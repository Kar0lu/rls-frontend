import React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';

const ReservationModal = ({open, handleClose, date, start, end, platform, position, name}) => {
    
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

             }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rezerwacja
          </Typography>
            <TimeField
            label="Data rezerwacji"
            value={date}
             format="DD/MM/YYYY"
            readOnly
            sx={{marginBottom:3, marginTop:3}}
            />
            <Box sx={{display: 'flex'}}>
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
        </Box>
      </Modal>
    )
};

export default ReservationModal