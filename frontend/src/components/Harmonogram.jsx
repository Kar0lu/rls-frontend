/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, Button, Modal, Autocomplete, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

//todo snackbar type warning text
export default function Harmonogram() {
  const [formValues, setFormValues] = useState({
    position: '',
    platform: ''
});
  const [postData, setPostData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("PynqZ2");
  const [selectedPlatform, setSelectedPlatform] = useState("Vivado");
  const [platforms, setPlatforms] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState({});
  const [start, setStart]=useState([]);
  const [end, setEnd]=useState([]);
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

  const handleAutocompleteChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (field === 'position') {
      setSelectedPosition(value);
    } else if (field === 'platform') {
      setSelectedPlatform(value);
    }
  };

  // Funkcja do znajdywania wierszy pomiędzy (nie działa jakby co, work in progress itp)
  // const selectMiddleRows = () => {
  //   const middleRows = rows.filter(({id}) => (id)<=end && (id)>=start).map(row => row.id);
  //   setSelectedRows(middleRows);
  // };

  useEffect(() => {
    setSelectedDate(dayjs());
  }, []);


  useEffect(() => {
    fetch('/boardtemporary.json')
      .then((response) => response.json())
      .then((data) => {
          const uniqueTypes = Array.from(new Set(data.boards.map((board) => board.type)));
          const mappedPlatforms = uniqueTypes.map((type, index) => ({
            id: index + 1,
            name: `${type}`,
          }));
          
          setPlatforms(mappedPlatforms);
        }
      )
      .catch((error) => console.error('Error loading boards:', error));
  }, []);

useEffect(() => {
  fetch('/positiontemporary.json')
    .then((response) => response.json())
    .then((data) => {
      const mappedPositions = data.platforms.map((platform) => ({
        id: platform.platformID,
        name: `Stanowisko ${platform.platformID}`,
      }));
      setPositions(mappedPositions);
      if (!selectedPosition && mappedPositions.length > 0) {
        setSelectedPosition(mappedPositions[0]);
      }
    })
    .catch((error) => console.error('Error loading platforms:', error));
}, [selectedPosition]);
      
  useEffect(() => {
    fetch("/userstemporary.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.reservations) {
          throw new Error("Invalid data format: 'reservations' key not found.");
        }
        const formattedData = data.reservations.map((row, index) => ({
          id: index + 1,
          reservationID: row.reservationID,
          studentID: row.studentID,
          hour: `${row.hour}:00`,
          date: row.date,
          position: row.infrastructure.find((item) => item.Board)?.Board || "",
          platform: row.infrastructure.find((item) => item.Program)?.Program || "",
          login: row.login,
          password: row.password
        }));
        setPostData(formattedData);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00:00`);

      const filtered = hours.map((hour) => {
        const matches = postData.filter((row) => row.date === formattedDate && row.hour === hour);

        const isPositionAvailable = matches.every((row) => row.position !== selectedPosition);
        const isPlatformAvailable = matches.every((row) => row.platform !== selectedPlatform);

        return {
          id: hour,
          hour,
          position: isPositionAvailable ? "Dostępne" : "Niedostępne",
          platform: isPlatformAvailable ? "Dostępne" : "Niedostępne"
        };
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [selectedDate, selectedPosition, selectedPlatform, postData]);



  const columns = [
    { field: "hour", headerName: "Hour", width: 150 },
    { field: "position", headerName: "Position", width: 150 },
    { field: "platform", headerName: "Platform", width: 150 }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ width: '100%', border: 0, display: 'flex', flexDirection: 'column' }}>
  <Container sx={{ paddingTop: 1, paddingBottom: 3, display: 'flex'}}>
      <Autocomplete
      sx={{width:'200px', paddingRight:3}}
      onChange={(event, value) => {
        handleAutocompleteChange(setSelectedPosition(value ? value.id : null));
  }}
      options={positions}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField {...params} label="Stanowisko" variant="outlined" fullWidth />
      )}
    />
    <Autocomplete
      sx={{width:'200px'}}
      onChange={(event, value) => {
        handleAutocompleteChange(setSelectedPlatform(value ? value.id : null));
        value=selectedPlatform;
  }}
      options={platforms}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField {...params} label="Platforma" variant="outlined" fullWidth />
      )}
    />
  </Container>

  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Box sx={{ flex: 3, width:"530px"}}>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        rows={filteredData}
        columns={columns}
        pageSizeOptions={[8, 24]} 
        initialState={{
          pagination: {
            paginationModel: { pageSize: 8, page: 0 }, 
          }
        }}
        checkboxSelection
        disableRowSelectionOnClick
        isRowSelectable={(params) => params.row.platform === "Dostępne" && params.row.position ==="Dostępne"}
      // Tutaj jest początek funkcji do sortowania
      //   onRowSelectionModelChange={(newSelection) => {
      //     setSelectedRows(newSelection);
      //     setStart(Math.min(selectedRows));
      //     setEnd(Math.max(selectedRows));
      //     selectMiddleRows()
      // }}
      />
    </Box>
    <Box sx={{ flex: 1, marginLeft: 2 }}>
        <DateCalendar
          value={selectedDate}
          minDate={dayjs()}
          defaultValue={dayjs()}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
    </Box>
    <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rezerwacja
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <DatePicker
            value={selectedDate}
            format="LL"/>
          </Typography>
        </Box>
      </Modal>
  </Box>
</Box>
</LocalizationProvider>

  );
}
