import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Autocomplete, TextField, Checkbox, Select, MenuItem, ListItemText } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { useOverlay } from '../context/OverlayContext';

import AuthContext from '../context/AuthContext';

import HarmonogramModal from '../modals/HarmonogramModal';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const HarmonogramPage = () => {  
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if(!startHour){
      showSnackbar('Godzina rozpoczęcie nie może być pusta', 'warning')
      return;
    }
    if(!endHour){
      showSnackbar('Godzina zakończenia nie może być pusta', 'warning')
      return;
    }
    if(startHour>endHour){
      showSnackbar('Godzina rozpoczęcie nie może być późniejsza od godziny zakończenia', 'warning')
      return;
    }
    if(endHour.diff(startHour, 'hour') > hoursLeft){
      showSnackbar('Przekroczono limit godzin', 'warning')
      return;
    }
    if(containersPicker == null){
      showSnackbar('Należy wybrać jedno stanowisko', 'warning')
    }
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    fetchDataGrid()
  }

  dayjs.locale('pl');

  const { user, authTokens } = useContext(AuthContext);
  const { showSnackbar, showLoading, hideLoading } = useOverlay();

  const [hoursLeft, setHoursLeft] = useState(null);
  const [platformsPicker, setPlatformsPicker] = useState([]);
  const [containersPicker, setContainersPicker] = useState([]);

  const [calendarData, setCalendarData] = useState(null);
  const [dataGridData, setDataGridData] = useState(null);

  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [devicesIDs, setDevicesIDs] = useState([]);

  const [formValues, setFormValues] = useState({
    selected_date: dayjs(),
    device_types: [],
  });
  const [platformNames, setPlatformNames] = useState(null)

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
      year: formValues.selected_date.year(),
      month: newMonth ? newMonth.month()+1 : formValues.selected_date.month() + 1,
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
      year: formValues.selected_date.year(),
      month: formValues.selected_date.month() + 1,
      day: formValues.selected_date.date()
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
      // console.log(error)
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
      setDataGridData(null)
      setColumns([])
    }
  }, [formValues.device_types]);

  useEffect(() => {
    if(formValues.device_types.length > 0){
      fetchDataGrid()
    }
  }, [formValues.selected_date]);

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
              const selectedPlatformNames = value.map((item) => item.model);
              setPlatformNames(selectedPlatformNames);
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
              formValues.selected_date === null 
              ? 'Nie wybrano daty' 
              : (formValues.device_types && formValues.device_types.length === 0 
                ? 'Nie wybrano urządzeń' 
                : 'Brak danych')
          }}
        />
      </Box>

      <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <DateCalendar
          value={formValues.selected_date}
          minDate={dayjs('2025/01/28')}
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
              selected_date: newDate,
            }))
          }}
        />
        <Box sx={{display: 'flex', gap: 2}}>
        <TimePicker
          flex={1}
          display='flex'
          label="Rozpoczęcie"
          value={startHour}
          onChange={(newValue) => {
            setStartHour(newValue)
            // console.log(dayjs(newValue).format('H'))
            // console.log(containersPicker)
            // console.log(Object.values(dataGridData[dayjs(newValue).format('H')]["devices"]).map(arr => arr[0]))
            setDevicesIDs(Object.values(dataGridData[dayjs(newValue).format('H')]["devices"]).map(arr => arr[0]))
          }}
          maxTime={dayjs().hour(23).minute(0)} // Maximum time: 23:00
          minutesStep={60}  // Only allow selection in 60-minute intervals (whole hours)
          inputFormat="HH:mm"  // Format the input as hour:minute (e.g., 1:00)
          // renderInput={(params) => <TextField {...params} />}
          slotProps={{
            layout: {
              sx: {
                ul: {
                  '::-webkit-scrollbar': {
                    width: '2px',
                  },
                },
              },
            }
          }}
        />
        <TimePicker
          flex={1}
          display='flex'
          label="Zakończenie"
          value={endHour}
          onChange={(newValue) => setEndHour(newValue)}
          maxTime={dayjs().hour(23).minute(0)} // Maximum time: 23:00
          minutesStep={60}  // Only allow selection in 60-minute intervals (whole hours)
          inputFormat="HH:mm"  // Format the input as hour:minute (e.g., 1:00)
          slotProps={{
            layout: {
              sx: {
                ul: {
                  '::-webkit-scrollbar': {
                    width: '2px',
                  },
                },
              },
            }
          }}
        />
        </Box>
        <Select
          value={containersPicker}
          onChange={(event) => setContainersPicker(event.target.value)}
          displayEmpty
          renderValue={(selected) => (selected ? 'Stanowisko '+selected : 'Wybierz stanowisko')}
        >
          <MenuItem value="" disabled>
            Wybierz stanowisko
          </MenuItem>
          {Object.keys(dataGridData?.[0]?.containers || {}).map((key) => (
            <MenuItem key={key} value={key}>
              Stanowisko {key}
            </MenuItem>
          ))}
        </Select>
        
        <Button variant="contained" onClick={handleOpen} disabled={disableSubmit || formValues.device_types.length == 0}>
          Zarezerwuj
        </Button>
      </Box>
    </Box>
    <HarmonogramModal open={open} onClose={handleClose} selectedDate={formValues.selected_date} startHour={startHour} endHour={endHour} container={containersPicker} selectedDevices={platformNames} devicesIDs={devicesIDs}/>
    </LocalizationProvider>
  );
};

export default HarmonogramPage