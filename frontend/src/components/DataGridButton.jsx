import React from 'react'
import { Button } from '@mui/material'

const DataGridButton = ({children, onClick}) => {

    return(
        <Button
            color='text'
            onClick={onClick}
        >
            { children }
        </Button>
        
    )
}

export default DataGridButton