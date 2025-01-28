import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Autocomplete, Chip, TextField, Checkbox, Typography } from '@mui/material';
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
  const { showSnackbar, showLoading, hideLoading } = useOverlay();

  const [hoursLeft, setHoursLeft] = useState(null);
  const [platformsPicker, setPlatformsPicker] = useState([]);

  const [calendarData, setCalendarData] = useState(null);
  const [dataGridData, setDataGridData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);

  const [checkedState, setCheckedState] = useState({});
  const [disableSubmit, setDisableSubmit] = useState(true);

  const [formValues, setFormValues] = useState({
    selectedDate: dayjs(),
    device_types: [],
  });

  const fetchDeviceTypes = () => {
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

  const fetchHoursLeft = () => {
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

  const fetchCalendar = (newMonth) => {
    if(formValues.device_types.length == 0) {
      // console.log('fetchCalendar has been activated, but device types are empty')
      return null
    }
    const queryParams = new URLSearchParams({
      year: formValues.selectedDate.year(),
      month: newMonth ? newMonth.month()+1 : formValues.selectedDate.month() + 1,
    });
  
    formValues.device_types.forEach((deviceType) => {
      queryParams.append('device_types', deviceType);
    });
  
    const queryString = queryParams.toString();

    fetch(`http://127.0.0.1:8000/api/availability/?${queryString}`, {
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
      setCalendarData(Object.values(data)[0])
      // console.log('calendarData:', Object.values(data)[0])
    })
    .catch((error) => {
      showSnackbar('Błąd podczas pobierania danych', 'error')
    })
  }

  const fetchDataGrid = () => {
    const queryParams = new URLSearchParams({
      year: formValues.selectedDate.year(),
      month: formValues.selectedDate.month() + 1,
      day: formValues.selectedDate.date()
    });
  
    formValues.device_types.forEach((deviceType) => {
      queryParams.append('device_types', deviceType);
    });
  
    const queryString = queryParams.toString();

    fetch(`http://127.0.0.1:8000/api/availability/?${queryString}`, {
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
      const fdata = Object.values(data)[0]
      setDataGridData(fdata)
    })
    .catch((error) => {
      showSnackbar('Błąd podczas pobierania danych', 'error')
    })
  }

  useEffect(() => {
    fetchDeviceTypes()
    fetchHoursLeft()
  }, []);

  const [columns, setColumns] = useState([])
  useEffect(() => {
    if(dataGridData){
      const containerColumns = Object.keys(dataGridData[0].containers).map(containerId => ({
        field: containerId,
        headerName: `Stanowisko ${containerId}`,
        width: 120,
        renderCell: (params) => {
          return(<Checkbox disabled={!params.row.containers[containerId]}/>)
        }
      }));
  
      setColumns([
        { 
          field: 'id', 
          headerName: 'Godzina', 
          width: 80,
          renderCell: (params) => {
            return(params.value.toString() + ':00')
          }
        },
        
        ...containerColumns],
      )
    }
  }, [dataGridData]);

  useEffect(() => {
    if(formValues.device_types.length > 0){
      fetchCalendar()
      fetchDataGrid()
    } else {
      setAvailabilityData(null)
      setDataGridData(null)
      setColumns([])
    }
  }, [formValues.device_types]);

  useEffect(() => {
    if(formValues.device_types.length > 0){
      fetchDataGrid()
    }
  }, [formValues.selectedDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 2}}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, overflow: 'auto'}}>
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
          // sx={{ overflow: 'auto', minWidth: '500px', maxWidth: '100%'}}
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

      <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <DateCalendar
          value={formValues.selectedDate}
          minDate={dayjs()}
          defaultValue={dayjs()}
          onMonthChange={(newMonth) => {
            fetchCalendar(newMonth)
          }}
          shouldDisableDate={(date) => {
            // return calendarData.some((d) => d.isSame(date, "day"))
          }}
          onChange={(newDate) => {
            setFormValues((prevValues) => ({
              ...prevValues,
              selectedDate: newDate,
            }))
          }}
        />
        
        <Button variant="contained" onClick={handleOpen} disabled={disableSubmit || formValues.device_types.length == 0}>
          Zarezerwuj
        </Button>
      </Box>
    </Box>
    <HarmonogramModal open={open} onClose={handleClose} selectedDate={formValues.selectedDate}/>
    </LocalizationProvider>
  );
};

export default HarmonogramPage