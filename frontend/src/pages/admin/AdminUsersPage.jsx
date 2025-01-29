import React, { useState, useEffect, useContext } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import AuthContext from '../../context/AuthContext';
import InfoIcon from '@mui/icons-material/Info';
import DataGridButton from '../../components/DataGridButton';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useOverlay } from '../../context/OverlayContext';
import AdminUsersModal from '../../modals/AdminUsersModal';

const AdminUsersPage = () => {


    const [studentsList, setStudentsList] = useState([]);

    const { authTokens } = useContext(AuthContext);
    const { showSnackbar, showLoading, hideLoading } = useOverlay();
    const [activeUser, setActiveUser] = useState(null)
    const { studentId } = useParams(); 
    
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpenModal = (row) => {
        setActiveUser(row)
        setModalOpen(true)
    }
    const handleCloseModal = () => setModalOpen(false)

    useEffect(() => {
        fetchUsers()
    }, []);

    useEffect(() => {
        if (studentId && studentsList.length > 0) {
            const user = studentsList.find((student) => student.id.toString() === studentId);
            if (user) {
                setActiveUser(user);
                setModalOpen(true);
            }
        }
    }, [studentId, studentsList]);

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
            setStudentsList(data.results || []); 
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

    const columns = [
        { field: 'first_name', headerName: 'Imię', width: 150},
        { field: 'last_name', headerName: 'Nazwisko', width: 150},
        { field: 'username', headerName: 'Nazwa użytkownika', width: 150},
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

    return(
        <Box>
            <DataGrid
                rows={studentsList}
                columns={columns}
                disableRowSelectionOnClick
                localeText={{ noRowsLabel: "Brak użytkowników" }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                    sx: {
                        "& .MuiButton-root": {
                        color: "#fff",
                    }},
                    },
                }}
            />
            <AdminUsersModal open={modalOpen} onClose={handleCloseModal} row={activeUser} removeUserFetch={removeUserFetch}/>
        </Box>
    )
}

export default AdminUsersPage