import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import AppContent from '../components/AppContent';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '98vw',
        height: '95vh', 
        margin: 'auto',
        background: '#4BA83D',
      }}
    >
      {/* Sidebar */}
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
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          backgroundColor: 'white',
          borderRadius: '15px',
          boxSizing: 'border-box', 
        }}
      >
        {/* AppHeader */}
        <Box
          sx={{
            flexShrink: 0, 
            height: '10%',
            boxSizing: 'border-box', 
            padding: '2% 2%', 

          }}
        >
          <AppHeader />
        </Box>

        {/* AppContent */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto', 
            padding: '2% 2%', 
            minHeight: '90%', 
            boxSizing: 'border-box', 
          }}
        >
          <AppContent />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
