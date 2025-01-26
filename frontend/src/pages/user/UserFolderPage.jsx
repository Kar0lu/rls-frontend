import React, { useState, useEffect, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import AuthContext from '../../context/AuthContext';
import DownloadIcon from '@mui/icons-material/Download';
import DataGridButton from '../../components/DataGridButton';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useOverlay } from '../../context/OverlayContext';

const UserFolderPage = () => {
    const columns = [
        {
            field: 'name',
            headerName: 'Nazwa',
            width: 200,
            renderCell: (params) => {
                const isBack = params.row.name === '../';
                const isFolder = params.row.name.includes('/');
                return (
                    <span
                        style={{
                            cursor: isFolder || isBack ? 'pointer' : 'default',
                            textDecoration: isFolder || isBack ? 'underline' : 'none',
                            color: 'white',
                        }}
                        onClick={() => (isFolder || isBack) && handleRowClick(params.row.name)}
                    >
                        {params.row.name}
                    </span>
                );
            },
        },
        { 
            field: 'created',
            headerName: 'Data utworzenia',
            width: 150,
            valueFormatter: (params) => {
                if (params == undefined){
                    return 'N/A'
                } else {
                    const date = dayjs(params)
                    return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : 'Invalid Date';
                }
            },
        },
        { 
            field: 'modified',
            headerName: 'Data modyfikacji',
            width: 150,
            valueFormatter: (params) => {
                if (params == undefined){
                    return 'N/A'
                } else {
                    const date = dayjs(params)
                    return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : 'Invalid Date';
                }
            },
        },
        { 
            field: 'size',
            headerName: 'Rozmiar',
            width: 100,
            valueFormatter: (params) => {
                const sizeInBytes = params; // Assuming the value is in bytes

                if (sizeInBytes === null || sizeInBytes === undefined) {
                return 'N/A';
                }

                const units = ['B', 'KB', 'MB', 'GB', 'TB'];
                let size = sizeInBytes;
                let unitIndex = 0;

                while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
                }

                // Format size with two decimal places
                return `${size.toFixed(2)} ${units[unitIndex]}`;
              },
        },
        {
            field: 'download',
            headerName: 'Pobierz',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const isFile = !params.row.name.includes('/');
                return isFile ? (
                    <DataGridButton onClick={() => fileDownloadFetch(params.row.folder, params.row.name)}>
                        <DownloadIcon />
                    </DataGridButton>
                ) : null;
            },
        },
    ];

    const [dataGridData, setDataGridData] = useState([])
    const { authTokens } = useContext(AuthContext);
    const [activePath, setActivePath] = useState('/')
    const { showSnackbar, showLoading, hideLoading } = useOverlay();

    const handleRowClick = (name) => {
        if (name === "../") {
            // Navigate up one level
            const newPath = activePath.split("/").slice(0, -1).join("/") || "/";
            setActivePath(newPath);
        } else {
            // Navigate into the folder
            const newPath = activePath === "/" ? `${name}` : `${activePath}${name}`;
            setActivePath(newPath);
        }
    };

    const filteredData = (path) => {
        if(dataGridData) {
            const getFolders = () => {
                const folders = dataGridData
                    .map(item => item.folder) // Extract folders
                    .filter(folder => folder?.startsWith(activePath) && folder !== activePath) // Keep subfolders of the active path
                    .map(folder => {
                        const relativePath = folder.replace(activePath, ''); // Remove activePath prefix
                        return relativePath.split('/').filter(Boolean)[0]; // Get first folder segment
                    });
            
                return [...new Set(folders)]; // Remove duplicates
            };
        
            // Function to get files directly under the current path
            const getFiles = () => {
                return dataGridData.filter((item) => {
                    return item?.folder === activePath; // Files under the current path
                });
            };
        
            // Create the rows for folders and files
            const folders = getFolders().map((folder, index) => ({
                id: -(index + 2),  // Use negative ids for folders to avoid collision
                name: '/'+folder,
            }));
        
            const files = getFiles();
        
            // Add the "../" row for navigation if not at the root folder
            const dataWithBackButton = path !== "/" ? [{ id: -1, name: "../", folder: path }] : [];
        
            // Combine the back button, folders, and files
            return [...dataWithBackButton, ...folders, ...files];
        } else {
            return []
        }
    };
    
    const fileListFetch = () => {
        fetch("http://127.0.0.1:8000/api/user/files/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            }
        })
        .then((response) => {
            if(!response.ok) {
                showSnackbar('Błąd podczas pobierania danych', 'error')
            }
            return response.json()
        })
        .then((data) => {
            if(data.files != []) {
                setDataGridData(data.files)
            }
        })
        .catch((error)=> {
            showSnackbar('Błąd poczas komunikacji z serwerem', 'error')
        })
    }

    const fileDownloadFetch = (folder, name) => {
        showLoading()

        const path = (folder + '/' + name).replace(/^\/+/, '');
        fetch(`http://127.0.0.1:8000/api/user/file/?filepath=${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.blob();
        })
        .then(blob => {
            showSnackbar(`Rozpoczęto pobieranie ${name}`, 'success')
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            showSnackbar('Nie znaleziono pliku', 'error')
        })
        .finally(
            hideLoading()
        );
    }
    
    useEffect(() => {
        showLoading()
        fileListFetch()
        hideLoading()
    }, []);

    useEffect(() => {
        if(activePath != '/') {
            setDataGridData(prevDataGridData => [
                { id: -1, name: '../' },
                ...prevDataGridData
            ]);
        }
    }, [activePath]);

    return(
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>Folder: {activePath}</Typography>
            <DataGrid
                rows={filteredData(activePath)}
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
                localeText={{ noRowsLabel: "Brak plików" }}
                sx={{ flexGrow: 1 }}
            />
        </Box>
        
    )
}

export default UserFolderPage