import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import GenericModal from './GenericModal';

const HarmonogramModal = ({open, onClose, selectedDate}) => {
    return ( 
        <GenericModal open={open} onClose={onClose} title={'Rezerwacja'}>
            <DatePicker
                value={selectedDate}
                format="LL"
                disabled
            />
        </GenericModal>
    );
};

export default HarmonogramModal