import React from 'react';
import { Box, Typography, useMediaQuery, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import mvs from "../assets/img/mvs.png"; 
import logo from "../assets/img/mvs_logo.gif"
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

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

const Contacts = () => {
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  return (
    <Grid container height="100%" width="100%" alignItems="center" justifyContent="space-evenly">
      <Grid xs={4} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <Box>
            <Box textAlign="left" marginBottom='10px'> 
              <img 
                src={logo}
                alt="Logo"
              />
            </Box>
           
            <Typography
              fontSize={{ xs: '10px', sm: '15px', md: '20px', lg: '25px', xl: '30px' }}
              fontWeight="bold"
              align="left"
              marginBottom='10px'
            >
              MVS Italy SRL
            </Typography>
            <Box display="flex" alignItems="center" marginBottom="10px">
              <HomeIcon sx={{
              color:"#108CCB"   
              }}/>
              <Typography marginLeft="10px">
              Via Lecco 61 – 20871 – Vimercate (MB)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" marginBottom="10px">
              <LanguageIcon  sx={{
              color:"#108CCB"   
              }} />
              <Typography marginLeft="10px">
                <a href="https://multivendorservice.it/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  www.mvsitaly.com
                </a>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" marginBottom="10px">
              <EmailIcon  sx={{
              color:"#108CCB"   
              }} />
              <Typography marginLeft="10px">
              <a href="mailto:info@mvsitaly.com?subject=Richiesta%20Informazioni&body=Caro%20MVS%20Italy," style={{ textDecoration: 'none', color: 'inherit' }}>
                info@mvsitaly.com
              </a>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" marginBottom="10px">
              <PhoneIcon  sx={{
              color:"#108CCB"   
              }} />
              <Typography marginLeft="10px">
              800.180.976
              </Typography>
            </Box>
            <Box display="flex" marginTop="40px" gap='10px'>
              <IconButton href="https://www.facebook.com/multivendorservice/" target="_blank" sx={{
                      backgroundColor: '#4267B2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#5495ff',
                      },
                    }}>
                <FacebookIcon color="white" />
              </IconButton>
              <IconButton href="https://www.instagram.com/multivendorservice/" target="_blank"
                sx={{
                  backgroundColor: '#cf2872',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#E1306C',
                  },
                }}
              >
                <InstagramIcon color="white" />
              </IconButton>
              <IconButton href="https://www.linkedin.com/company/multivendor-service-srl/" target="_blank"
                sx={{
                  backgroundColor: '#0072ae',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#5495ff',
                  },
                }}
              >
                <LinkedInIcon color="white" />
              </IconButton>
            </Box>
          </Box>
        </Item>
      </Grid>
      <Grid xs={8} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <a href="https://www.google.it/maps/place/Via+Lecco,+61,+20871+Vimercate+MB/@45.6297076,9.356277,17z/data=!3m1!4b1!4m6!3m5!1s0x4786b0f475803815:0x2c5e2e1469e9c3de!8m2!3d45.6297039!4d9.3588519!16s%2Fg%2F11c4h27fl5?entry=ttu&g_ep=EgoyMDI0MTAxNC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
            <Box
              component="img"
              sx={{
                height: { xs: '200px', sm: '250px', md: '300px', lg: '350px', xl: '400px' }, 
                width: { xs: '200px', sm: '250px', md: '300px', lg: '350px', xl: '400px' }, 
                objectFit: 'cover',
              }}
              alt="Mappa"
              src={mvs}
            />
          </a>
        </Item>
      </Grid>
    </Grid>
  );
};

export default Contacts;
