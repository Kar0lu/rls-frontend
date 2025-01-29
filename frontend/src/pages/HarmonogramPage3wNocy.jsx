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
  const [columns, setColumns] = useState([])
  const [dataGridData, setDataGridData] = useState(null);

  const [disableSubmit, setDisableSubmit] = useState(true);

  const [formValues, setFormValues] = useState({
    selected_date: dayjs(),
    selected_device_types: [],
    selected_hours: [],
    selected_container: null,
    selected_devices: [],
  });

  const [checkboxDisabled, setCheckboxDisabled] = useState();
  const [checkboxChecked, setCheckboxChecked] = useState(new Array(24).fill(false));

useEffect(() => {
  console.log(checkboxChecked)
}, [checkboxChecked]);

  const handleCheck = (container, row) => {
    // Avoid triggering a loop by updating only the necessary state
    console.log('changing container to', container)
    console.log(checkboxDisabled)
    if(formValues.selected_container == null){
      setFormValues(prev => ({
        ...prev,
        selected_container: container,
      }));

      const updatedCheckboxChecked = checkboxChecked
      updatedCheckboxChecked[row.id] = true
      setCheckboxChecked(updatedCheckboxChecked)

      const updatedCheckboxDisabled = checkboxDisabled
      Object.keys(updatedCheckboxDisabled).forEach(key => updatedCheckboxDisabled[key] = true);
      updatedCheckboxDisabled[container] = false
      setCheckboxDisabled(updatedCheckboxDisabled)
      // console.log(updatedCheckboxDisabled)
    } else {
      const updatedCheckboxChecked = checkboxChecked
      updatedCheckboxChecked[row.id] = true
      setCheckboxChecked(updatedCheckboxChecked)
      console.log(updatedCheckboxChecked)
    }
  }

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
    if(formValues.selected_device_types.length == 0) {
      // console.log('fetchCalendar has been activated, but device types are empty')
      return null
    }
    const queryParams = new URLSearchParams({
      year: formValues.selected_date.year(),
      month: newMonth ? newMonth.month()+1 : formValues.selected_date.month() + 1,
    });
  
    formValues.selected_device_types.forEach((deviceType) => {
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
    showLoading()
    const queryParams = new URLSearchParams({
      year: formValues.selected_date.year(),
      month: formValues.selected_date.month() + 1,
      day: formValues.selected_date.date()
    });
  
    formValues.selected_device_types.forEach((deviceType) => {
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

      const disabledState = {};
  
      // Initialize both states with false for each containerId
      Object.keys(fdata[0].containers).forEach(containerId => {
        disabledState[containerId] = false;
      });
  
      // Set the state
      console.log(disabledState)
      setCheckboxDisabled(disabledState);    
    })
    .catch((error) => {
      showSnackbar('Błąd podczas pobierania danych', 'error')
    })
    .finally(
      hideLoading()
    )
  }

  // download device types and available hours
  useEffect(() => {
    fetchDeviceTypes()
    fetchHoursLeft()
  }, []);

  // set up columns when dataGridData is updated
  useEffect(() => {
    if(dataGridData){
      console.log('bef', checkboxDisabled)
      const containerColumns = Object.keys(dataGridData[0].containers).map(containerId => ({
        field: containerId,
        headerName: `Stanowisko ${containerId}`,
        width: 120,
        renderCell: (params) => {
          return(
            <Checkbox
              disabled={checkboxDisabled[params.field] || !params.row.containers[containerId]}
              checked={checkboxChecked[params.row.id] && !(checkboxDisabled[params.field] || !params.row.containers[containerId])}
              onChange={() => handleCheck(params.field, params.row)}
            />
          )
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
        }, ...containerColumns],
      )


    }
  }, [dataGridData]);

  // update dataGridData and calendarData when device types are changed
  useEffect(() => {
    if(formValues.selected_device_types.length > 0){
      fetchCalendar()
      fetchDataGrid()
    } else {
      setDataGridData(null)
      setColumns([])
    }
  }, [formValues.selected_device_types]);

  // update dataGridData when device types are changed
  useEffect(() => {
    if(formValues.selected_device_types.length > 0){
      fetchDataGrid()
    }
  }, [formValues.selected_date]);

  useEffect(() => {
    console.log(dataGridData)
  }, [dataGridData]);

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
                  selected_device_types: value.map((item) => item.device_type_id)
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
          localeText={{ 
            noRowsLabel: 
              formValues.selected_date === null 
              ? 'Nie wybrano daty' 
              : (formValues.selected_device_types && formValues.selected_device_types.length === 0 
                ? 'Nie wybrano urządzeń' 
                : 'Brak danych')
          }}
        />
      </Box>

      <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <DateCalendar
          value={formValues.selected_date}
          minDate={dayjs('01/01/2025')}
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
        
        <Button variant="contained" onClick={handleOpen} disabled={disableSubmit || formValues.selected_device_types.length == 0}>
          Zarezerwuj
        </Button>
      </Box>
    </Box>
    <HarmonogramModal open={open} onClose={handleClose} selected_date={formValues.selected_date}/>
    </LocalizationProvider>
  );
};

export default HarmonogramPage