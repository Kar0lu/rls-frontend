import { DataGrid, GridToolbar,   GridActionsCellItem,} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState, } from 'react';
import {Box} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ReservationModal from '../../modals/UserReservationModal.jsx';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import AuthContext from '../../context/AuthContext.jsx';
import { useOverlay } from '../../context/OverlayContext.jsx';

const UserReservationsPage = () => {
    const[reservations, setReservations] = useState([]);
    const[selectedReservation, setSelectedReservation] = useState([]);
    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {authTokens } = useContext(AuthContext);
    const { showSnackbar, showLoading, hideLoading } = useOverlay();


const fetchData = () => {
    showLoading();
    
    fetch(`http://127.0.0.1:8000/api/user/reservations/`, {
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
            return Promise.reject('Nastąpił problem z połączeniem z bazą danych');
        }
        return response.json();
    })
    .then((reservationsResponse) => {
        const reservationsData = reservationsResponse.map((row) => {
            const devices = row.devices || [];
            let platforms = 'Brak urządzeń';
            if (devices.length > 0) {
                platforms = devices.map(device => device.device_type.model).join(', ');
            }
            return {
                id: row.reservation_id,
                startHour: dayjs(row.valid_since).format('HH:mm'),
                endHour: dayjs(row.valid_until).format('HH:mm'),
                date: dayjs(row.valid_since).format('DD/MM/YYYY'),
                griddate: `${dayjs(row.valid_since).format('DD/MM/YYYY')} ${dayjs(row.valid_since).format('HH:mm')}-${dayjs(row.valid_until).format('HH:mm')}`,
                position: row.container,
                platform: platforms,
                status: row.status,
            };
            });
        setReservations(reservationsData);
        console.log(reservations);
        })
    .catch((error) => {
        console.error(error);
        showSnackbar('Wystąpił błąd podczas pobierania danych', 'error');
    })
    .finally(() => {
        hideLoading(); 
    });
};
    
  
useEffect(() => {
    fetchData();
}, []);
        
  const columns = [
      { field: "griddate", headerName: "Data", width: 200 },
      { field: "platform", headerName: "Platforms", width: 200},
      { field: "information",
        headerName: "Informacje",
        type: 'actions',
        cellClassName: 'actions',
        width: 150,
        getActions: ({ id }) => {
          const student = reservations.find((student)=> student.id === id)
          return [
            <GridActionsCellItem
              icon={<InfoIcon />}
              onClick={()=>
                  {setSelectedReservation(student); 
                  handleOpen();
              }} 
              label="Save"
              color="primary"
            />,
          ];
        },
      },
    ];
      return(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                    <DataGrid
                    rows={reservations}
                    components={{ Toolbar: GridToolbar }}
                    columns={columns}
                    pageSizeOptions={[10,15]}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
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
                </Box>
            </LocalizationProvider>
  
  )
  };
export default UserReservationsPage