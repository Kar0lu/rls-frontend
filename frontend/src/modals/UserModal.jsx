import React, {useState, useContext} from 'react'
import { Box, TextField, Button } from '@mui/material'
import GenericModal from './GenericModal'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from '../context/OverlayContext'
import AuthContext from '../context/AuthContext'

const UserModal = ({open, onClose, row, removeUserFetch }) => {

    const navigate = useNavigate();
    const { showSnackbar} = useOverlay();
    const {authTokens} = useContext(AuthContext);

    const [newPassword, setNewPassword] = useState('')
    
    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const newPasswordFetch = () => {
        if(newPassword == '') {
            showSnackbar(`Hasło nie może być puste`, 'warning');
            return null
        }
        if(newPassword.length < 8) {
            showSnackbar(`Hasło musi zawierać conajmniej 8 znaków`, 'warning');
            return null
        }
        fetch(`http://127.0.0.1:8000/api/changePassword/${row?.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authTokens.access}`,
            },
            body: JSON.stringify({
                "new_password": newPassword
            })
                
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error()
              }
              return response.json();
            })
            .then(() => {
                showSnackbar(`Pomyślnie zmieniono nazwę użytkownika ${row.username}`, 'success');
                setNewPassword('')
            })
            .catch(() => {
              showSnackbar('Wystąpił nieoczekiwany bład', 'error');
            });
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