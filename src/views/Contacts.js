import React from 'react';
import { Box, Typography, useMediaQuery, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import  mvs  from "../assets/img/image.png";

const Contacts = () => {
  const isLargeScreen = useMediaQuery('(min-width:1281px)');
  const isMediumScreen = useMediaQuery('(min-width:800px) and (max-width:1280px)');
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  return (
    <Box
      display="flex"
      flexDirection={isSmallScreen ? 'column' : 'row'} 
      justifyContent="center" 
      alignItems="center"      
      width="90%"              
      margin="0 auto"          
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems={isSmallScreen ? 'center' : 'flex-start'}  
        width={isSmallScreen ? '100%' : '50%'}  
        marginY="150px"
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#2C2C2C"
          gutterBottom
        >
          Sito di MVS Italy
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#2C2C2C"
          gutterBottom
        >
          MVS Italy SRL
        </Typography>
        <Box display="flex" alignItems="center" marginBottom="10px">
          <LocationOnIcon color="primary" />
          <Typography marginLeft="10px">
            Via John Fitzgerald Kennedy, ingresso 2, 20871 Vimercate MB
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" marginBottom="10px">
          <PhoneIcon color="primary" />
          <Typography marginLeft="10px">
            (+39) 02 36 556243
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" marginBottom="10px">
          <EmailIcon color="primary" />
          <Typography marginLeft="10px">
            email@email.it
          </Typography>
        </Box>
        <Box display="flex" marginTop="10px">
          <IconButton href="https://www.facebook.com" target="_blank">
            <FacebookIcon color="primary" />
          </IconButton>
          <IconButton href="https://www.twitter.com" target="_blank">
            <TwitterIcon color="primary" />
          </IconButton>
          <IconButton href="https://www.youtube.com" target="_blank">
            <YouTubeIcon color="primary" />
          </IconButton>
        </Box>
      </Box>

      {!isSmallScreen && (  
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={isMediumScreen ? '40%' : '50%'} 
          padding="20px"
        >
          <a href="https://www.google.it/maps/place/MVS+Multivendor+Service/@45.6301997,9.3555853,17.25z/data=!3m1!5s0x4786b0f3e3831b03:0xddbac5f3fec1317b!4m16!1m9!3m8!1s0x4786b0f6ac982081:0x78108c53375e0465!2sMVS+Multivendor+Service!8m2!3d45.6286711!4d9.3580217!9m1!1b1!16s%2Fg%2F11b6dghsy1!3m5!1s0x4786b0f6ac982081:0x78108c53375e0465!8m2!3d45.6286711!4d9.3580217!16s%2Fg%2F11b6dghsy1?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
          <img src={mvs} style={{
            width: isMediumScreen ? '100%' : '50%', 
            height: '80%',
            objectFit:'cover'
          }}>

          </img>
          </a>
          
        </Box>
      )}
    </Box>
  );
};

export default Contacts;
