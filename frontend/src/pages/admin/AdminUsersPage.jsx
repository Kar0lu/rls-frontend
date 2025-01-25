import React, { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import AuthContext from '../../context/AuthContext';
import InfoIcon from '@mui/icons-material/Info';
import DataGridButton from '../../components/DataGridButton';
import { Box } from '@mui/material';
import { useOverlay } from '../../context/OverlayContext';
import UserModal from '../../modals/UserModal';

const AdminUsersPage = () => {
    const columns = [
        { field: 'first_name', headerName: 'Imię', width: 150},
        { field: 'last_name', headerName: 'Nazwisko', width: 150},
        { field: 'username', headerName: 'Nazwa użytkownika', width: 200},
        { field: 'email', headerName: 'E-mail', width: 150},
        {
            field: 'informations',
            headerName: 'Informacje',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return(
                    <DataGridButton onClick={() => handleOpenModal(params.row)}>
                        <InfoIcon />
                    </DataGridButton>
                );
            },
        },
    ];

    const [studentsList, setStudentsList] = useState()

    const { authTokens } = useContext(AuthContext);
    const { showSnackbar, showLoading, hideLoading } = useOverlay();
    const [activeUser, setActiveUser] = useState(null)
    
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpenModal = (row) => {
        setActiveUser(row)
        setModalOpen(true)
    }
    const handleCloseModal = () => setModalOpen(false)

    useEffect(() => {
        fetchUsers()
    }, []);

    const fetchUsers = () => {
        showLoading()
        fetch(`http://127.0.0.1:8000/api/users/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
            }
        })
        .then((response) => {
            if(!response.ok){
                throw new Error()
            }
            return response.json()
        })
        .then((data) => {
            setStudentsList(data.results)
        })
        .catch((error) => {
            showSnackbar('Błąd podczas pobierania danych', 'error')
        })
        .finally(
            hideLoading()
        )
    }

    const removeUserFetch = () => {
        showLoading()
        fetch(`http://127.0.0.1:8000/api/users/${activeUser.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
            }
        })
        .then((response) => {
            if(!response.ok){
                throw new Error()
            }
            setActiveUser(null)
            showSnackbar('Pomyślnie usunięto użytkownika', 'success')
            fetchUsers()
            setModalOpen(false)
        })
        .catch((error) => {
            showSnackbar('Błąd podczas pobierania danych', 'error')
        })
        .finally(
            hideLoading()
        )
    }

    return(<>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DataGrid
                rows={studentsList}
                columns={columns}
                disableRowSelectionOnClick
                localeText={{ noRowsLabel: "Brak użytkowników" }}
            />
        </Box>
        <UserModal open={modalOpen} onClose={handleCloseModal} row={activeUser} removeUserFetch={removeUserFetch}/>
    </>)
}

export default AdminUsersPage