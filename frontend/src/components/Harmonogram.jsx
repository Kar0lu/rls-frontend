/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { InputLabel, FormControl, NativeSelect } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function Harmonogram() {
  const [postData, setPostData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("PynqZ2");
  const [selectedPlatform, setSelectedPlatform] = useState("Vivado");

  useEffect(() => {
    setSelectedDate(dayjs());
  }, []);

  useEffect(() => {
    fetch("/userstemporary.json")
      .then((response) => {
        console.log("Response object:", response);
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
    <Box sx={{ width: '100%', border: 0, display: 'flex', flexDirection: 'column' }}>
  <Container sx={{ paddingTop: 1, paddingBottom: 3, display: 'flex'}}>
    <FormControl sx={{ paddingRight: 3 }}>
      <InputLabel variant="standard" htmlFor="position-select">
        Stanowisko
      </InputLabel>
      <NativeSelect
          defaultValue={1}
          inputProps={{
            name: 'Stanowisko',
            id: 'position-select',  // Zgodność z htmlFor w InputLabel
          }}
          onChange={(e) => setSelectedPosition(Number(e.target.value))}
      >
        <option value={1}>Stanowisko 1</option>
        <option value={2}>Stanowisko 2</option>
        <option value={3}>Stanowisko 3</option>
        <option value={4}>Stanowisko 4</option>
        <option value={5}>Stanowisko 5</option>
        <option value={6}>Stanowisko 6</option>
      </NativeSelect>
    </FormControl>
    <FormControl>
      <InputLabel variant="standard" htmlFor="platform-select">
        Platforma
      </InputLabel>
      <NativeSelect
        defaultValue="Pynq"
        inputProps={{
          name: 'Platforma',
          id: 'platform-select',  // Zgodność z htmlFor w InputLabel
        }}
        onChange={(e) => setSelectedPlatform(e.target.value)}
      >
            <option value={"Pynq"}>Pynq</option>
            <option value={"CoraZ"}>CoraZ</option>
            <option value={"Diligent Anaglog"}>Diligent Anaglog</option>
      </NativeSelect>
    </FormControl>
  </Container>

  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Box sx={{ flex: 3 }}>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        rows={filteredData}
        columns={columns}
        pageSizeOptions={[8, 24]} // Dostępne opcje wyboru liczby wierszy na stronę
        initialState={{
          pagination: {
            paginationModel: { pageSize: 8, page: 0 }, // Domyślnie 8 wierszy na stronę
          }
  }}
      />
    </Box>
    <Box sx={{ flex: 1, marginLeft: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          minDate={dayjs()}
          defaultValue={dayjs()}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
      </LocalizationProvider>
    </Box>
  </Box>
</Box>

  );
}
