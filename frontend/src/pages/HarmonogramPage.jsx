import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Autocomplete, Chip, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

import AuthContext from '../context/AuthContext';

import HarmonogramModal from '../modals/HarmonogramModal';

const HarmonogramPage = () => {  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  dayjs.locale('pl');

  const { user, authTokens } = useContext(AuthContext);
  const [platformsPicker, setPlatformsPicker] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [hoursLeft, setHoursLeft] = useState(null);

  const [calendarData, setCalendarData] = useState(null);
  const [dataGridData, setDataGridData] = useState(null);

  const [formValues, setFormValues] = useState({
    selectedDate: dayjs(),
    platforms_id: [],
  });

  const deviceTypesFetch = async () => {
    fetch('http://127.0.0.1:8000/api/deviceTypes/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      const platforms = data.results.map(item => ({
        device_type_id: item.device_type_id,
        model: item.make + ' ' + item.model
      }));
      setPlatformsPicker(platforms);
    })
  }

  const hoursLeftFetch = async () => {
    fetch('http://127.0.0.1:8000/api/user/hoursLeft/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      setHoursLeft(data.hours_left)
      if(data.hours_left != 0 && data.hours_left != null) {
        setDisableSubmit(false)
      } else {
        setDisableSubmit(true)
      }
    })
  }

  const calendarFetch = async (newMonth) => {
    const queryParams = new URLSearchParams({
      year: formValues.selectedDate.year(),
      month: newMonth ? newMonth : formValues.selectedDate.month(),
      device_types: formValues.device_types.join('&device_types='),
    });

    fetch(`http://127.0.0.1:8000/api/availability/?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setCalendarData(data)
    })
  }

  const dataGridFetch = async () => {
    const queryParams = new URLSearchParams({
      year: formValues.selectedDate.year(),
      month: formValues.selectedDate.month(),
      day: formValues.selectedDate.day(),
      device_types: formValues.device_types,
    });

    fetch(`http://127.0.0.1:8000/api/availability/?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setDataGridData(data)
    })
  }

  // Loading deviceTypes and hoursLeft on mount
  useEffect(() => {
    deviceTypesFetch()
    hoursLeftFetch()
  }, []);

  // Setting up columns when dataGridData is changed
  // TODO: adjust when API is ready
  const [columns, setColumns] = useState([])
  useEffect(() => {
    if(dataGridData) {
      const staticColumns = {
        field: 'hour',
        headerName: 'Godzina',
        width: 100,
      };
  
      const dynamicColumns = Object.keys(dataGridData.containers).map(key => ({
        field: key,
        headerName: 'Stanowisko ' + key,
        width: 150,
      }));
  
      setColumns([staticColumns, ...dynamicColumns]);
    }
  }, [dataGridData]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Autocomplete
          multiple
          options={platformsPicker}
          getOptionLabel={(option) => option.model}
          onChange={(event, value) => {
            if (value) {
              setFormValues((prevValues) => ({
                  ...prevValues,
                  platforms_id: value.map((item) => item.device_type_id)
              }));
              calendarFetch()
              dataGridFetch()
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Platforma" />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.device_type_id}>
              {option.model}
            </li>
          )}
        />
        <DataGrid
          rows={dataGridData}
          columns={columns}
          disableRowSelectionOnClick
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
          value={formValues.selectedDate}
          minDate={dayjs()}
          defaultValue={dayjs()}
          onMonthChange={(newMonth) => {
            calendarFetch(newMonth)
          }}
          shouldDisableDate={(date) => {
            // TODO: adjust calendarData for this format
            // return calendarData.some((d) => d.isSame(date, "day"))
          }}
          onChange={(newDate) => {
            setFormValues((prevValues) => ({
              ...prevValues,
              selectedDate: newDate,
            }))
            dataGridFetch()
          }}
        />
        
        <Button variant="contained" onClick={handleOpen} disabled={disableSubmit}>
          Zarezerwuj
        </Button>
      </Box>
    </Box>
    <HarmonogramModal open={open} onClose={handleClose} selectedDate={formValues.selectedDate}/>
    </LocalizationProvider>
  );
};

export default HarmonogramPage