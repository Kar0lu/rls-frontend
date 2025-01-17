/* eslint-disable no-unused-vars */
import React from 'react';
import {  Typography, Button,  Box} from '@mui/material';
import { styled } from '@mui/material/styles';
const MenuButton = styled(Button)(() => ({
  justifyContent: 'left',
  paddingLeft: '15px',
  borderColor: 'primary'
  }
));
function StudentMenu() {
    return (
      <Box
        sx={{
          paddingTop:'10px',
          height: '100vh',
          width: '250px',
          margin: 0,
          marginRight:'30px',
          float:'left',
          textAlign:'left',
          backgroundColor:'background.paper'
        }}
      >
          <Typography pl={2} variant="h3" component="h1" gutterBottom>
            RLS
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                margin:0,
                padding:0,      
                borderTop:1,
                borderBottom:1,
                borderColor:'#383ecc'
              }}
            >
              <MenuButton color='secondary'>
                Harmonogram
              </MenuButton>
              <MenuButton color="secondary">
                Rezerwacje
              </MenuButton>
              <MenuButton color="secondary">
                Folder domowy
              </MenuButton>
              <MenuButton color="secondary">
                Profil
              </MenuButton>
            </Box>
      </Box>
    );
  }
  
  export default StudentMenu;