/*import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import logoIntesa from '../../assets/img/intesa-sanpaolo.png';
import logoMvs from '../../assets/img/logo-MVS.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApiRest from '../../service-API/ApiRest';
import Cookies from 'js-cookie'


// TO DO: fare le mediaquery


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const token = Cookies.get('LtpaToken')
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === '' || password === '') {
      setErrorMessage('Username e Password sono obbligatori');
      return;
    }
    try {
    setIsLoading(true);
      const request = new ApiRest();
      const response = await request.login(username, password);

      if (!response.token) {
        setErrorMessage('ID utente o password errati');
        setIsLoading(false);
        return;
      }

      dispatch({ type: 'set', user: response.user });
      dispatch({ type: 'set', token: response.token });
      navigate('/homepage');
    } catch (error) {
      setErrorMessage('ID utente o password errati');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Box
      sx={{
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#4BA83D',
      }}
      >
        <img src={logoIntesa} alt="logo intesa" style={{ flex: 1, maxWidth: '40%', height: 'auto' }} />
        <img src={logoMvs} alt="mvs logo" style={{ flex: 1, maxWidth: '30%', height: '30%' }} />
      </Box>


    <Box
      sx={{
        width: '100vw',
        height: '50vh',
        backgroundColor: '#f5f5f5',
      }}
    />

    
    <Card
      elevation={3}
      sx={{
        maxWidth: '400px',
        width: '90%',
        borderRadius: '12px',
        textAlign: 'center',
        padding: '2rem',
        position: 'absolute',
        top: '60%',
        transform: 'translateY(-50%)',
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{
          fontFamily:'Poppins'
        }}>
          Inserisci la tua Email e Password
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Password"
          type="password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" >
                <LockIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <Typography color="error" sx={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {errorMessage}
          </Typography>
        )}

        <Box sx={{ marginTop: '1.5rem' }}>
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={handleLogin}
            disabled={isLoading}
            sx={{
              paddingY: '0.75rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              width:'40%',
              fontFamily:'Poppins'
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </CardContent>
    </Card>

    <Typography variant="body2" align="center" color="textSecondary" sx={{ position: 'absolute', bottom: '1rem', fontFamily:'Poppins' }}>
      MVS Italy © 2024
    </Typography>
  </Box>

  );
};

export default Login;
*/

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logoIntesa from '../../assets/img/intesa-sanpaolo.png';
import logoMvs from '../../assets/img/logo-MVS.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApiRest from '../../service-API/ApiRest';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Stato per gestire la visibilità della password
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === '' || password === '') {
      setErrorMessage('Username e Password sono obbligatori');
      return;
    }
    try {
      setIsLoading(true);
      const request = new ApiRest();
      const response = await request.login(username, password);

      if (!response.token) {
        setErrorMessage('ID utente o password errati');
        setIsLoading(false);
        return;
      }

      dispatch({ type: 'set', user: response.user });
      dispatch({ type: 'set', token: response.token });
      navigate('/homepage');
    } catch (error) {
      setErrorMessage('ID utente o password errati');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Box
        sx={{
          width: '100vw',
          height: '50vh',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: '#4BA83D',
        }}
      >
        <img src={logoIntesa} alt="logo intesa" style={{ flex: 1, maxWidth: '40%', height: 'auto' }} />
        <img src={logoMvs} alt="mvs logo" style={{ flex: 1, maxWidth: '30%', height: '30%' }} />
      </Box>

      <Box
        sx={{
          width: '100vw',
          height: '50vh',
          backgroundColor: '#f5f5f5',
        }}
      />

      <Card
        elevation={3}
        sx={{
          maxWidth: '400px',
          width: '90%',
          borderRadius: '12px',
          textAlign: 'center',
          padding: '2rem',
          position: 'absolute',
          top: '60%',
          transform: 'translateY(-50%)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins' }}>
            Inserisci la tua Email e Password
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            type={showPassword ? 'text' : 'password'} // Cambia il tipo in base allo stato di visibilità
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={() => setShowPassword(!showPassword)} color="inherit">
                    {showPassword ? <VisibilityOff /> : <Visibility />} {/* Icona per il toggle della visibilità */}
                  </Button>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <Typography color="error" sx={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {errorMessage}
            </Typography>
          )}

          <Box sx={{ marginTop: '1.5rem' }}>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                paddingY: '0.75rem',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '8px',
                width: '40%',
                fontFamily: 'Poppins'
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography variant="body2" align="center" color="textSecondary" sx={{ position: 'absolute', bottom: '1rem', fontFamily: 'Poppins' }}>
        MVS Italy © 2024
      </Typography>
    </Box>
  );
};

export default Login;
