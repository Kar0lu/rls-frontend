import React from 'react';
import { Box, Modal, Typography } from '@mui/material';

const GenericModal = ({ open, onClose, title, children }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {children}
                </Box>
            </Box>
        </Modal>
    );
};

export default GenericModal;