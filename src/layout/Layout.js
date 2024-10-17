import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppSidebar from '../components/AppSidebar';
import AppMain from '../components/AppMain';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '98vw',
        height: '95vh',
        margin: 'auto',
        background:'#4BA83D'
      }}
    >
      <Box
        sx={{
          width: isCollapsed ? '100px' : '240px', 
          transition: 'width 0.3s ease', 
          flexShrink: 0,
          
        }}
        
      >
        <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: 'white',
          //padding: '20px',
          transition: 'margin-left 0.5s ease', 
          borderRadius:'15px',
          padding:'30px 40px'
        }}
      >
        <AppMain />
      </Box>
    </Box>
  );
};

export default Layout;
