import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AppContent = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ 
        width: '100%', 
        height: '100%', 
        flexGrow: 1,
      }}
    >
      <Outlet />
    </Box>
  );
};

export default React.memo(AppContent);
