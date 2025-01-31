import { DataGrid, GridToolbar,   GridActionsCellItem, renderActionsCell,} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState, } from 'react';
import {Box} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ReservationModal from '../../modals/AdminReservationModal.jsx';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import AuthContext from '../../context/AuthContext.jsx';
import { useOverlay } from '../../context/OverlayContext.jsx';
import { useLocation } from 'react-router-dom';
import DataGridButton from '../../components/DataGridButton.jsx';


const AdminReservationsPage = () => {
  const[allReservations, setAllReservations] = useState([]);
  const[selectedReservation, setSelectedReservation] = useState([]);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const { studentId } = useParams();

  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { authTokens } = useContext(AuthContext);
  const { showSnackbar, showLoading, hideLoading } = useOverlay();

  const fetchData = () => {
    showLoading();
    fetch('http://127.0.0.1:8000/api/reservations/?extra=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        showSnackbar('Nastąpił problem z połączeniem z bazą danych', 'error');
        hideLoading();
        return Promise.reject('Error with response');
      }
      return response.json();
    })
    .then((reservationsData) => {
      const processedReservations = reservationsData.results.map((row) => {
        const user = row.user || {};
        const devices = row.devices || [];
        const fullName = user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Brak danych';
        let platforms = 'Brak urządzenia';
        if (devices.length > 0) {
          platforms = devices.map(device => device.device_type.model).join(', ');
        }
              
        return {
          id: row.reservation_id,
          studentID: user.id,
          studentFullName: fullName,
          startHour: row.valid_since,
          endHour: row.valid_until,
          date: row.valid_since,
          position: row.container.container_id,
          adress: `${row.container.ip_address}:${row.container.port}`,
          password: row.root_password,
          status: row.status,
          platform: platforms,
        };
      });
      setAllReservations(processedReservations);
      if (studentId) {
        const filteredReservations = processedReservations.filter(
          (reservation) => reservation.studentID === parseInt(studentId) // Konwertujemy studentId z URL na liczbę
        );
        setAllReservations(filteredReservations);
      } else {
        setAllReservations(processedReservations);
      }
      hideLoading();
    })
    .catch((error) => {
      showSnackbar('Wystąpił nieoczekiwany błąd', 'error');
      hideLoading();
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

      
const columns = [
  { field: "date", headerName: "Data", width: 100, valueFormatter: (params) => {
    const date = dayjs(params)
    return date.isValid() ? date.format('YYYY-MM-DD') : 'Invalid Date';
  }},
  { field: "startHour", headerName: "Rozpoczęcie", width: 100, valueFormatter: (params) => {
    const date2 = dayjs(params)
    return date2.isValid() ? date2.format('HH:mm') : 'Invalid Date';
  }
  },
  { field: "endHour", headerName: "Zakończenie", width: 100, valueFormatter: (params) => {
    const date = dayjs(params)
    return date.isValid() ? date.format('HH:mm') : 'Invalid Date';
  }},
  { field: "studentFullName", headerName: "Student", width: 150 },
  { field: "status", headerName: "Status", width: 120,
    valueFormatter: (params) => {
      switch(params){
        case 'IP':
          return 'W realizacji'
        case 'FI':
          return 'Zakończone'
        case 'PD':
          return 'Zaplanowane'
    }}
  },
  { field: "information",
    headerName: "Informacje",
    width: 100,
    renderCell: (params) => {
      return(
        <DataGridButton onClick={() => {
          setSelectedReservation(params.row);
          handleOpen();
        }}>
          <InfoIcon />
        </DataGridButton>
      )
    },
  },
];

  return(
    <Box>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DataGrid
        rows={allReservations}
        columns={columns}
        pageSizeOptions={[10,15]}
        initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            sx: {
              "& .MuiButton-root": {
              color: "#fff",
            }},
          },
        }}
        disableRowSelectionOnClick
      />
      {selectedReservation && (
        <ReservationModal
          open={open}
          onClose={handleClose}
          fetchData = {fetchData}
          reservation={selectedReservation}
        />
      )}
    </LocalizationProvider>
    </Box>
  )
};
export default AdminReservationsPage