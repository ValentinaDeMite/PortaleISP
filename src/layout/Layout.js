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
        height: '95vh', // Altezza totale massima
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

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // Organizza AppHeader e AppContent in verticale
          flexGrow: 1, // Prendi tutto lo spazio rimanente
          backgroundColor: 'white',
          borderRadius: '15px',
          boxSizing: 'border-box', // Importante per includere il padding nel calcolo dell'altezza totale
        }}
      >
        {/* AppHeader */}
        <Box
          sx={{
            flexShrink: 0, // Mantieni l'altezza fissa
            height: '10%', // Altezza in percentuale rispetto al contenitore padre
            boxSizing: 'border-box', // Includi il padding nel calcolo della dimensione
            padding: '2% 2%', // Usa una percentuale di padding minore o dinamica

          }}
        >
          <AppHeader />
        </Box>

        {/* AppContent che occupa tutto lo spazio rimanente */}
        <Box
          sx={{
            flexGrow: 1, // Questo fa sì che AppContent prenda tutto lo spazio disponibile
            overflowY: 'auto', // Scrollabile solo se il contenuto è troppo lungo
            padding: '2% 2%', // Usa una percentuale di padding minore o dinamica
            height: '90%', // Altezza impostata al 90% del contenitore padre
            boxSizing: 'border-box', // Assicurati che il padding sia incluso nell'altezza totale
          }}
        >
          <AppContent />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
