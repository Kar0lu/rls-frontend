import React, {useState} from 'react'
import { Box, TextField, Button } from '@mui/material'
import GenericModal from './GenericModal'
import { useNavigate } from 'react-router-dom'

const UserModal = ({open, onClose, row, removeUserFetch }) => {

    const [newPassword, setNewPassword] = useState('')
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    // TODO: implement when API is ready
    const newPasswordFetch = () => {
        console.log('change password')
    }

    const studentReservations = () => {
        navigate('/admin-reservations', { state: { filterByStudentId: row?.id } });
    }

    return(
        <GenericModal open={open} onClose={onClose} title={'Student'}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="ID" value={row?.id} disabled />
                    <TextField label="Imię i nazwisko" value={row?.first_name + ' ' + row?.last_name} disabled />
                    <TextField label="Nazwa użytkownika" value={row?.username} disabled />
                    <TextField label="Nowe hasło" value={newPassword} onChange={handlePasswordChange} type='password' />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between'}}>
                    <Button variant='contained' size='small' onClick={studentReservations}>Rezerwacje studenta</Button>
                    <Button variant='contained' size='small' onClick={removeUserFetch}>Usuń studenta</Button>
                    <Button variant='contained' size='small' onClick={newPasswordFetch}>Zmień hasło</Button>
                </Box>
            </Box>
        </GenericModal>
    )
}

export default UserModal