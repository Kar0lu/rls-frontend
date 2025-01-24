import { DataGrid, GridToolbar,   GridActionsCellItem,} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState, } from 'react';
import {Box} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ReservationModal from '../../modals/ReservationModal.jsx';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import AuthContext from '../../context/AuthContext.jsx';
import { useOverlay } from '../../context/OverlayContext.jsx';


const AdminReservationsPage = () => {
    const[names, setNames] = useState([]);
    const[devices,setDevices] =useState([]);
    const[types, setTypes] =useState([]);
    const[allReservations, setAllReservations] = useState([]);
    const[selectedReservation, setSelectedReservation] = useState([]);
    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { authTokens } = useContext(AuthContext);
    const { showSnackbar, showLoading, hideLoading } = useOverlay();

    const fetchData = () => {
      showLoading();
    try{
      
      Promise.all([
        fetch('http://127.0.0.1:8000/api/users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        }),
        fetch('http://127.0.0.1:8000/api/devices/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        }),
        fetch('http://127.0.0.1:8000/api/deviceTypes/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        }),
        fetch('http://127.0.0.1:8000/api/reservations/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        }),
      ])
      .then(([usersResponse, devicesResponse, typesResponse, reservationsResponse]) => {
        if (
          !usersResponse.ok ||
          !devicesResponse.ok ||
          !typesResponse.ok ||
          !reservationsResponse.ok
        ) {
          showSnackbar('Nastąpił problem z połączeniem z bazą danych', 'error');
          hideLoading();
          return;
        }

        return Promise.all([
          usersResponse.json(),
          devicesResponse.json(),
          typesResponse.json(),
          reservationsResponse.json(),
        ]);
      })   
        
        .then(([usersData, devicesData, typesData, reservationsData]) => {
          
          const transformedUsersData = usersData.results.map((user, index) => ({
            id: index + 1,
            studentID: user.id,
            name: user.first_name,
            surname: user.last_name,
          }));
          setNames(transformedUsersData);
    
          const transformedDevicesData = devicesData.results.map((device) => ({
            id: device.device_id,
            deviceType: device.device_type,
          }));
          setDevices(transformedDevicesData);
    
          const transformedtypesData = typesData.results.map((type) => ({
            id: type.device_type_id,
            model: type.model,
          }));
          setTypes(transformedtypesData);
    
          const reservations = reservationsData.results || [];
          const processedReservations = reservations.map((row) => {
            const student = transformedUsersData.find((student) => student.studentID === row.user);
            let deviceModels = [];
            if (row.devices?.length > 0) {
              row.devices.forEach((deviceId) => {
                const device = transformedDevicesData.find((device) => device.id === deviceId);
                if (device) {
                  const deviceType = transformedtypesData.find((type) => type.id === device.deviceType);
                  if (deviceType) {
                    deviceModels.push(deviceType.model);
                  }
                }
              });
            }
            const platform = deviceModels.length > 0 ? deviceModels.join(', ') : 'Brak urządzeń';
            return {
              id: row.reservation_id,
              studentID: row.user,
              studentFullName: student ? `${student.name} ${student.surname}` : 'Unknown',
              startHour: dayjs(row.valid_since).format('HH:mm'),
              endHour: dayjs(row.valid_until).format('HH:mm'),
              date: dayjs(row.valid_since).format('DD/MM/YYYY'),
              griddate: `${dayjs(row.valid_since).format('DD/MM/YYYY')} ${dayjs(row.valid_since).format('HH:mm')}-${dayjs(row.valid_until).format('HH:mm')}`,
              position: row.container,
              platform: platform,
              status: row.status,
            };
          });
          setAllReservations(processedReservations);
          hideLoading();
        })
      }
      catch (error) {
        showSnackbar('Wystąpił nieoczekiwany błąd', 'error');
        hideLoading();
    }
    };

    useEffect(() => {
      fetchData();
    }, []);
      
const columns = [
    { field: "griddate", headerName: "Data", width: 200 },
    { field: "studentFullName", headerName: "Student", width: 150 },
    { field: "information",
      headerName: "Informations",
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