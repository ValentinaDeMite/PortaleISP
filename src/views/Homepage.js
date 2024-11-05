/*import React from 'react';
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
    <Grid container height="100%" width="100%" spacing={2} alignItems="center" justifyContent='space-around'>
      <Grid xs={6} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <Box>
            <Typography
              fontSize={{ xs: '30px', sm: '40px', md: '50px', lg: '60px', xl: '70px' }}
              fontWeight="bold"
              align="left"
              lineHeight="1.1"
            >
              Bentornato,
            </Typography>
            <Typography
              fontSize={{ xs: '30px', sm: '40px', md: '50px', lg: '60px', xl: '70px' }}
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
              marginTop={'1rem'}
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


import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApiRest from '../service-API/ApiRest';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import logo_intesa from '../assets/img/logo_s_isp.png';
import Cookies from 'js-cookie';

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
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const info = useSelector((state) => state.info);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {
    const getDashboard = async () => {
      const api = new ApiRest();
      try {
        setLoading(true);
        if (!info) {
          const data = await api.getInfo(token);
          dispatch({ type: 'set', info: data });
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
        Cookies.remove('LtpaToken', { path: '', domain: '.mvsitaly.com' });
        history('/login');
      }
    };
    getDashboard();
  }, [dispatch, history, info, token]);

  return (
    <Grid container height="100%" width="100%" spacing={2} alignItems="center" justifyContent="space-around">
      <Grid xs={6} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <Box>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                <Typography
                  fontSize={{ xs: '30px', sm: '40px', md: '50px', lg: '60px', xl: '70px' }}
                  fontWeight="bold"
                  align="left"
                  lineHeight="1.1"
                >
                  Bentornato,
                </Typography>
                <Typography
                  fontSize={{ xs: '30px', sm: '40px', md: '50px', lg: '60px', xl: '70px' }}
                  fontWeight="bold"
                  align="left"
                  lineHeight="1.1"
                >
                  {user || 'Nome Utente'}
                </Typography>
                <Typography
                  fontSize={{ xs: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' }}
                  align="left"
                  gutterBottom
                  lineHeight="1.2"
                  marginTop={'1rem'}
                >
                  Role: {loading ? info.ruolo : 'Loading...'} <br />
                  Ultimo accesso: {loading ? info.lastaccess : 'Loading...'}
                </Typography>
              </>
            )}
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
            src={logo_intesa}
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export default Homepage;
*/

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApiRest from '../service-API/ApiRest';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import logo_intesa from '../assets/img/logo_s_isp.png';
import Cookies from 'js-cookie';

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
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [role, setRole] = useState('');
  const [lastAccess, setLastAccess] = useState('');
  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {
    const getDashboard = async () => {
      const api = new ApiRest();
      try {
        setLoading(true);
        const data = await api.getInfo(token);
        setRole(data.ruolo);
        setLastAccess(data.lastaccess);
        dispatch({ type: 'set', info: data });
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
        Cookies.remove('LtpaToken', { path: '', domain: '.mvsitaly.com' });
        history('/login');
      }
    };
    getDashboard();
  }, [dispatch, history, token]);

  return (
    <Grid container height="100%" width="100%" spacing={2} alignItems="center" justifyContent="space-around">
      <Grid xs={6} item display="flex" alignItems="center" justifyContent="center">
        <Item>
          <Box>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <>
                <Typography
                  fontSize={{ xs: '30px', sm: '40px', md: '50px', lg: '60px', xl: '70px' }}
                  fontWeight="bold"
                  align="left"
                  lineHeight="1.1"
                >
                  Bentornato,
                </Typography>
                <Typography
                  fontSize={{ xs: '30px', sm: '40px', md: '50px', lg: '60px', xl: '70px' }}
                  fontWeight="bold"
                  align="left"
                  lineHeight="1.1"
                >
                  {user || 'Nome Utente'}
                </Typography>
                <Typography
                  fontSize={{ xs: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' }}
                  align="left"
                  gutterBottom
                  lineHeight="1.2"
                  marginTop={'1rem'}
                >
                  Role: {role || 'Loading...'} <br />
                  Ultimo accesso: {lastAccess || 'Loading...'}
                </Typography>
              </>
            )}
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
            src={logo_intesa}
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export default Homepage;
