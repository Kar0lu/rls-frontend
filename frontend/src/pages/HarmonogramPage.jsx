import React, { useState, useEffect } from 'react';
import { Box, Button, Autocomplete, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import HarmonogramModal from '../modals/HarmonogramModal';

const HarmonogramPage = () => {

  const [formValues, setFormValues] = useState({
    position: '',
    platform: ''
  });
  const [postData, setPostData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("PynqZ2");
  const [selectedPlatform, setSelectedPlatform] = useState("Vivado");
  const [positions, setPositions] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAutocompleteChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (field === 'position') {
      setSelectedPosition(value);
    } else if (field === 'platform') {
      setSelectedPlatform(value);
    }
  };

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
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Autocomplete
          onChange={(event, value) => {
            handleAutocompleteChange(
              setSelectedPlatform(value ? value.id : null)
            );
          }}
          options={platforms}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} label="Platforma" variant="outlined" />
          )}
        />
        <DataGrid
          rows={filteredData}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          isRowSelectable={(params) =>
            params.row.platform === "Dostępne" && params.row.position === "Dostępne"
          }
          pageSizeOptions={[8]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
              },
            },
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        
        <DateCalendar
          value={selectedDate}
          minDate={dayjs()}
          defaultValue={dayjs()}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
        
        <Button variant="contained" onClick={handleOpen}>
          Open modal
        </Button>
      </Box>
    </Box>
    <HarmonogramModal open={open} handleClose={handleClose} selectedDate={selectedDate}/>
    </LocalizationProvider>
  );
};

export default HarmonogramPage