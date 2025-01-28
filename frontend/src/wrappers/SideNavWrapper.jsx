import React, {useContext} from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AuthContext from '../context/AuthContext'
import { useNavigate, useLocation  } from 'react-router-dom';

const MenuButton = styled(({ active, ...rest }) => <Button {...rest} />)(({ theme, active }) => ({
  justifyContent: 'left',
  paddingLeft: '15px',
  borderColor: 'primary',
  ...(active && {
    backgroundColor: theme.palette.action.selected,
  }),
}));

const SideNavWrapper = ({ children }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return(
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          height: '100vh',
          minWidth: '150px',
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
          <MenuButton color="secondary" onClick={() => handleClick('/harmonogram')} active={isActive('/harmonogram')}>Harmonogram</MenuButton>
          {user=='user' && (<>
            <MenuButton color="secondary" onClick={() => handleClick('/user-reservations')} active={isActive('/user-reservations')}>Rezerwacje</MenuButton>
            <MenuButton color="secondary" onClick={() => handleClick('/user-folder')} active={isActive('/user-folder')}>Folder domowy</MenuButton>
            <MenuButton color="secondary" onClick={() => handleClick('/user-profile')} active={isActive('/user-profile')}>Profil</MenuButton>
          </>)}
          {user=='admin' && (<>
            <MenuButton color="secondary" onClick={() => handleClick('/admin-reservations')} active={isActive('/admin-reservations')}>Rezerwacje</MenuButton>
            <MenuButton color="secondary" onClick={() => handleClick('/admin-users')} active={isActive('/admin-users')}>Użytkownicy</MenuButton>
            <MenuButton color="secondary" onClick={() => handleClick('/admin-profile')} active={isActive('/admin-profile')}>Profil</MenuButton>
          </>)}
          <MenuButton color="secondary" onClick={logoutUser}>Wyloguj</MenuButton>
        </Box>
      </Box>

      <Box sx={{ pt: 2, pl: 2, pr:2, overflow: 'auto', flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  )
};

export default SideNavWrapper