/*import React from 'react';
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
      height="100%"
      width="100%"
      margin="auto"
      flexDirection={isSmallScreen ? 'column' : 'row'}
    >
      { Colonna del testo }
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
            width: isMediumScreen ? '100%' : '50%', 
            height: '100%',
            objectFit:'contain'
          }}
        />
      </Box>
    </Box>
  );
};

export default Homepage;
*/


import React from 'react';
import { Box, Typography } from '@mui/material';
import logo_s_isp from '../assets/img/logo_s_isp.png';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: 'none',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
}));

const Homepage = () => {
  return (
    <Grid container height="100%" width="100%" spacing={2} alignItems="center" justifyContent="space-evenly">
      <Grid xs={6} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <Box>
            <Typography
              fontSize={{ xs: '40px', sm: '50px', md: '60px', lg: '70px', xl: '80px' }}
              fontWeight="bold"
              align="left"
              lineHeight="1.1"
            >
              Bentornato,
            </Typography>
            <Typography
              fontSize={{ xs: '40px', sm: '50px', md: '60px', lg: '70px', xl: '80px' }}
              fontWeight="bold"
              align="left"
              lineHeight="1.1"
            >
              Nome Utente
            </Typography>
            <Typography
              fontSize={{ xs: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' }}
              align="left"
              gutterBottom
              lineHeight="1.2"
            >
              Role: Supervisor <br />
              Ultimo accesso: 01/10/2024 11:37
            </Typography>
          </Box>
        </Item>
      </Grid>
      <Grid xs={6} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <Box
            component="img"
            sx={{
              height: { xs: '150px', sm: '200px', md: '250px', lg: '300px', xl: '400px' },
              width: { xs: '150px', sm: '200px', md: '250px', lg: '300px', xl: '400px' },
            }}
            alt="Logo"
            src={logo_s_isp}
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export default Homepage;
