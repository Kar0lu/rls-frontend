import { DataGrid, GridToolbar,   GridActionsCellItem,} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState, } from 'react';
import {Box} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ReservationModal from '../../modals/AdminReservationModal.jsx';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import AuthContext from '../../context/AuthContext.jsx';
import { useOverlay } from '../../context/OverlayContext.jsx';
import { useLocation } from 'react-router-dom';


const AdminReservationsPage = () => {
    const[allReservations, setAllReservations] = useState([]);
    const[selectedReservation, setSelectedReservation] = useState([]);
    const [open, setOpen] = useState(false);

    const location = useLocation();

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
                    platform: platforms,
                    status: row.status,
          };
          });
          setAllReservations(processedReservations);
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

useEffect(() => {
  if (location.state?.filterByStudentId) {
    const filteredReservations = allReservations.filter(
        (reservation) => reservation.studentID === location.state.filterByStudentId
    );
    setAllReservations(filteredReservations);
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

      
const columns = [
    { field: "date", headerName: "Data", width: 200, valueFormatter: (params) => {
          const date = dayjs(params)
          return date.isValid() ? date.format('YYYY-MM-DD') : 'Invalid Date';
      }},
  { field: "startHour", headerName: "Godzina rozpoczęcia", width: 200, valueFormatter: (params) => {
        const date2 = dayjs(params)
        return date2.isValid() ? date2.format('HH:mm') : 'Invalid Date';
    }
  },
  { field: "endHour", headerName: "Godzina zakończenia", width: 200, valueFormatter: (params) => {
        const date = dayjs(params)
        return date.isValid() ? date.format('HH:mm') : 'Invalid Date';
    }},
    
    { field: "studentFullName", headerName: "Student", width: 150 },
    { field: "information",
      headerName: "Informacje",
      type: 'actions',
      cellClassName: 'actions',
      width: 150,
      getActions: ({ id }) => {
        const student = allReservations.find((student)=> student.id === id)
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
                    rows={allReservations}
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
export default AdminReservationsPage