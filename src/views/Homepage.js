import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import logo_s_isp from '../assets/img/logo_s_isp.png';

const Homepage = () => {
  const isLargeScreen = useMediaQuery('(min-width:1281px)');
  const isMediumScreen = useMediaQuery('(min-width:1000px) and (max-width:1280px)');
  const isSmallScreen = useMediaQuery('(max-width:1000px)');

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center" 
      height="70vh"
      width="100%"
      margin="auto"
      flexDirection={isSmallScreen ? 'column' : 'row'}
    >
      {/* Colonna del testo */}
      <Box
        display="flex"
        width={isSmallScreen ? '100%' : '40%'} 
        height="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems={isSmallScreen ? 'center' : 'flex-start'}  
        padding={isLargeScreen ? '0 40px' : '0 20px'} 
        textAlign={isSmallScreen ? 'center' : 'left'} 
        paddingBottom={isSmallScreen ? '20px' : '0'}
      >
        <Typography
          variant={isSmallScreen ? "h5" : isMediumScreen ? "h3" : "h2"} 
          fontWeight="bold"
          color="#2C2C2C"
        >
          Bentornato,
        </Typography>
        <Typography
          variant={isSmallScreen ? "h5" : isMediumScreen ? "h3" : "h2"}
          fontWeight="bold"
          color="#2C2C2C"
        >
          Nome Utente
        </Typography>
        <Typography
          variant="subtitle1"
          color="#999999"
          marginTop={isSmallScreen ? '5px' : '10px'}
        >
          Role: Supervisor
        </Typography>
        <Typography
          variant="subtitle1"
          color="#999999"
        >
          Ultimo accesso: 01/10/2024 11:37
        </Typography>
      </Box>

      {/* Colonna dell'immagine */}
      <Box
        display="flex"
        width={isSmallScreen ? '100%' : '50%'} 
        height="100%"
        justifyContent="center"
        alignItems="center"
        marginTop={isSmallScreen ? '20px' : '0'} 
      >
        <img
          src={logo_s_isp}
          alt="Logo"
          style={{
            width: isMediumScreen ? '90%' : '50%', 
            height: 'auto',
            objectFit:'contain'
          }}
        />
      </Box>
    </Box>
  );
};

export default Homepage;
