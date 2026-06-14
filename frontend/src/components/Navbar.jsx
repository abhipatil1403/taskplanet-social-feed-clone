import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = ({ username, onLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer', color: 'primary.main', display: 'flex', alignItems: 'center' }}
          onClick={() => navigate('/')}
        >
          🚀 TaskPlanet Clone
        </Typography>

        {username ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                {username[0].toUpperCase()}
              </Avatar>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                {username}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<ExitToAppIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button variant="text" color="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
