import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Autocomplete, Chip, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { useOverlay } from '../context/OverlayContext';

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
  const { showSnackbar, showLoading, hideLoading } = useOverlay();

  const [formValues, setFormValues] = useState({
    selectedDate: dayjs(),
    device_types: [],
  });

  const deviceTypesFetch = () => {
    if(authTokens) {
      fetch('http://127.0.0.1:8000/api/deviceTypes/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
        }
      })
      .then((response) => {
        if(!response.ok) {
          throw new Error()
        }
        return response.json()
      })
      .then((data) => {
        const platforms = data.results.map(item => ({
          device_type_id: item.device_type_id,
          model: item.make + ' ' + item.model
        }));
        setPlatformsPicker(platforms);
      })
      .catch((error) => {
        showSnackbar('Błąd podczas pobierania danych', 'error')
      })
    }
  }

  const hoursLeftFetch = () => {
    fetch('http://127.0.0.1:8000/api/user/hoursLeft/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      }
    })
    .then((response) => {
      if(!response.ok){
        throw new Error()
      }
      return response.json()
    })
    .then((data) => {
      setHoursLeft(data.hours_left)
      if(data.hours_left != 0 && data.hours_left != null) {
        setDisableSubmit(false)
      } else {
        setDisableSubmit(true)
      }
    })
    .catch((error) => {
      showSnackbar('Błąd podczas pobierania danych', 'error')
    })
  }

  const calendarFetch = (newMonth) => {
    if(formValues.device_types == []) {
      console.log('calendarFetch has been activated, but device types are empty')
      return null
    }
    const queryParams = new URLSearchParams({
      year: formValues.selectedDate.year(),
      month: newMonth ? newMonth : formValues.selectedDate.month()+1,
      device_types: formValues.device_types.join('&device_types='),
    });

    fetch(`http://127.0.0.1:8000/api/availability/?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`
      }
    })
    .then((response) => {
      if(!response.ok){
        throw new Error()
      }
      return response.json()
    })
    .then((data) => {
      // console.log(data)
      setCalendarData(data)
    })
    .catch((error) => {
      showSnackbar('Błąd podczas pobierania danych', 'error')
    })
  }

  const dataGridFetch = () => {
    const queryParams = new URLSearchParams({
      year: formValues.selectedDate.year(),
      month: formValues.selectedDate.month()+1,
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
    .then((response) => {
      if(!response.ok){
        throw new Error()
      }
      return response.json()
    })
    .then((data) => {
      console.log(data)
      setDataGridData(data)
    })
    .catch((error) => {
      showSnackbar('Błąd podczas pobierania danych', 'error')
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

  useEffect(() => {
    console.log('platform id has been changed')
    console.log(formValues)
    if(formValues.device_types.length > 0){
      calendarFetch()
      dataGridFetch()
    }
  }, [formValues.device_types]);

  useEffect(() => {
    console.log('selected date has been changed')
    console.log(formValues)
    if(formValues.device_types.length > 0){
      dataGridFetch()
    }
  }, [formValues.selectedDate]);

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
                  device_types: value.map((item) => item.device_type_id)
              }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Urządzenia" />
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
          localeText={{ 
            noRowsLabel: 
              formValues.selectedDate === null 
              ? 'Nie wybrano daty' 
              : (formValues.device_types && formValues.device_types.length === 0 
                ? 'Nie wybrano urządzeń' 
                : 'Brak danych')
          }}
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