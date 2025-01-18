import React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const HarmonogramModal = ({open, handleClose, selectedDate}) => {
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
                }}
            >
                <Typography variant="h6" component="h2">
                    Rezerwacja
                </Typography>
                <DatePicker
                    value={selectedDate}
                    format="LL"
                    disabled
                />
            </Box>
        </Modal>
    );
};

export default HarmonogramModal