import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';

function AppHeader() {
  const iconSize = '25px';

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [iconColor, setIconColor] = useState('#777');
  const [visitedDashboard, setVisitedDashboard] = useState(false); 
  const navigate = useNavigate(); 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIconColor('#ff9800');
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIconColor('#777');
  };

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x); 

  const handleBreadcrumbClick = (event, to) => {
    event.preventDefault();
    if (to === '/nuovo-progetto' && !visitedDashboard) {
      alert('Devi passare prima dalla Dashboard!');
      navigate('/dashboard');
    } else {
      navigate(to);
    }
  };

  React.useEffect(() => {
    if (location.pathname === '/dashboard') {
      setVisitedDashboard(true); 
    }
  }, [location.pathname]);

  // Funzione per formattare il nome della rotta
  const formatBreadcrumbName = (name) => {
    return name.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" height='5vh' marginBottom='40px'>
      
      {/* Breadcrumbs */}
      <Box display="flex" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb" separator=" / " sx={{ fontSize: '1rem' }}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
            onClick={(event) => handleBreadcrumbClick(event, '/')}>
            Home
          </Link>

          {location.pathname === '/nuovo-progetto' && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to="/dashboard"
              onClick={(event) => handleBreadcrumbClick(event, '/dashboard')}>
              Dashboard
            </Link>
          )}

          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            if (value === 'homepage') {
              return null; 
            }

            return (
              <Link
                underline="true"
                color={index === pathnames.length - 1 ? '#4BA83D' : 'inherit'}
                fontWeight='700'
                component={RouterLink}
                to={to}
                key={to}
                aria-current={index === pathnames.length - 1 ? 'page' : undefined}
                onClick={(event) => handleBreadcrumbClick(event, to)}>
                {formatBreadcrumbName(value)} 
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>

      {/* Account */}
      <Box display="flex" alignItems="center" m="0">
        <IconButton
          id="account-button"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{
            cursor: 'pointer', 
          }}>
          <AccountCircleOutlinedIcon sx={{ color: iconColor, fontSize: iconSize }} />
        </IconButton>

        <Menu 
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'account-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            style:{
              borderRadius: 10,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '5px 10px', 
            },
          }}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default AppHeader;
