import { Modal } from '@mui/material';
import { DataGrid, GridToolbar,   GridActionsCellItem,} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from 'react';
import { Box, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useFormStatus } from 'react-dom';
import ReservationModal from '../../modals/ReservationModal.jsx';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 


const AdminReservationsPage = () => {
    const[names, setNames] = useState([]);
    const[allReservations, setAllReservations] = useState([]);
    const[selectedReservation, setSelectedReservation] = useState([]);
    const [open, setOpen] = React.useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    
    useEffect(() => {
        const fetchData = async () => {
          const namesResponse = await fetch("/namestemporary.json");
          const namesData = await namesResponse.json();
          const namesList = namesData.students.map((row, index) => ({
            id: index + 1,
            studentID: row.studentID,
            name: row.firstName,
            surname: row.lastName,
          }));
          setNames(namesList);
    
          const reservationsResponse = await fetch("/userstemporary.json");
          const reservationsData = await reservationsResponse.json();
          const processedReservations = reservationsData.reservations.map((row, index) => {
            const student = namesList.find((student) => student.studentID === row.studentID);
            return {
              id: row.reservationID, 
              studentID: row.studentID,
              studentFullName: student ? `${student.name} ${student.surname}` : "Unknown",
              hour: dayjs(row.hour, 'hh:mm'),
              endHour: dayjs(row.endHour, 'hh:mm'),
              date: dayjs(row.date),
              griddate: `${row.date} ${row.hour}-${row.endHour}`,
              position: row.infrastructure.find((item) => item.Board)?.Board || "",
              platform: row.infrastructure.find((item) => item.Program)?.Program || "",
            };
          });
          setAllReservations(processedReservations);
        };
        fetchData();
      }, [names]);

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
          handleClose={handleClose}
          date={dayjs(selectedReservation.date)}
          start={selectedReservation.hour}
          end={selectedReservation.endHour}
          platform={selectedReservation.platform}
          position={selectedReservation.position}
          name={selectedReservation.studentFullName}
          id={selectedReservation.id}
        />
      )}
    </Box>
</LocalizationProvider>

)
}

export default AdminReservationsPage