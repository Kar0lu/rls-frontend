import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const MenuButton = styled(Button)(() => ({
  justifyContent: 'left',
  paddingLeft: '15px',
  borderColor: 'primary',
}));

const SideNavWrapper = ({ children }) => {
  return(
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          height: '100vh',
          width: '250px',
          textAlign: 'left',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography pl={2} variant="h3" component="h1" gutterBottom pt={2}>
          RLS
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: 1,
            borderBottom: 1,
            borderColor: '#383ecc',
          }}
        >
          <MenuButton color="secondary">Harmonogram</MenuButton>
          <MenuButton color="secondary">Rezerwacje</MenuButton>
          <MenuButton color="secondary">Folder domowy</MenuButton>
          <MenuButton color="secondary">Profil</MenuButton>
        </Box>
      </Box>

      <Box sx={{ pt: 2, pl: 2 }}>
        {children}
      </Box>
    </Box>
  )
};

export default SideNavWrapper