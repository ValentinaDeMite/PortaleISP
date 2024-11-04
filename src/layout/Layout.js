import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';
import AppContent from '../components/AppContent';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Stato per gestire il collasso della sidebar

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
          width: isCollapsed ? '100px' : '240px', // Collassa la sidebar in base a isCollapsed
          transition: 'width 0.3s ease',
          flexShrink: 0,
        }}
      >
        <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> {/* Passa lo stato e la funzione */}
      </Box>

      {/* Main Content Area */}
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
        <Box sx={{ flexShrink: 0, height: '10%', paddingX: '2%', paddingTop: '2%' }}>
          <AppHeader />
        </Box>

        {/* AppContent with Outlet for nested routes */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '2% 2%' }}>
          <AppContent>
            <Outlet /> {/* Le route figlie saranno renderizzate qui */}
          </AppContent>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
