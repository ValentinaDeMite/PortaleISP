import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApiRest from '../../service-API/ApiRest';
import { useDispatch, useSelector } from 'react-redux';

const NewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPN');
  const [notes, setNotes] = useState('');
  const [refOrder, setRefOrder] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const api = new ApiRest();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !description || !status || !notes || !refOrder || !projectManager || !startDate || !endDate) {
      alert('Complete all fields before submitting!');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert('La data di fine deve essere successiva alla data di inizio.');
      return;
    }

    try {
      const response = await api.iuProject(token, {
        projectName,
        description,
        status,
        notes,
        refOrder,
        projectManager,
        startDate,
        endDate,
      });
      if (response.idprogetto) {
        const idprogetto = response.idprogetto;
        const newData = await api.getDashboard();
        dispatch({ type: 'set', projects: newData.values });
        dispatch({ type: 'set', id: { id: idprogetto } });
        navigate(`/dashboard/projectitems${idprogetto}`, { state: { id: idprogetto } });
      }
    } catch (error) {
      alert('Something went wrong. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      alignItems: 'center',
      '& .MuiInputBase-input ':{
        fontSize:{
          xs: '0.5rem !important',  
          sm: '0.7rem !important',   
          md: '0.8rem !important',  
          lg: '0.9rem !important',   
          xl: '1rem !important',  
        },
        fontFamily: 'Poppins !important',

      },
      '& .MuiInputLabel-root ':{
        fontSize:{
          xs: '0.5rem !important',  
          sm: '0.7rem !important',   
          md: '0.8rem !important',  
          lg: '0.9rem !important',   
          xl: '1rem !important',  
        },
        fontFamily: 'Poppins !important',
      }
    }}>
      <Box sx={{ width: '100%', height: '10%' }}>
        <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', textAlign: 'left', fontSize: {
          xs: '0.5rem',
          sm: '0.8rem',
          md: '1rem',
          lg: '1.2rem',
          xl: '1.5rem',
          },
          fontFamily: 'Poppins !important',

        }}>
          Nuovo progetto
        </Typography>
      </Box>
      <Box sx={{
        width: '100%',
        height:'80%',

      }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#4CAF50',
              padding: {
                xs: '0.5rem',  
                sm: '0.7rem',   
                md: '0.8rem',  
                lg: '0.9rem',   
                xl: '1rem',     
              },
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            }}
          >
            <Typography variant="h6" color="white" align="left" 
            sx={{
               fontSize: {
                xs: '0.5rem',  
                sm: '0.7rem',   
                md: '0.8rem',  
                lg: '0.9rem',   
                xl: '1rem',     
              },
              fontFamily: 'Poppins !important',
            }}>
              Carica un nuovo progetto:
            </Typography>
          </Box>

          {/* Form */}
          <Box
            sx={{
              padding: {
                xs: '0.5rem',  
                sm: '0.8rem',   
                md: '1rem',  
                lg: '1.5rem',   
                xl: '2rem',     
              },
              heigth:'70%'
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Nome progetto:"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  fullWidth
                  required
                  sx={{ borderColor: '#999', '& .MuiOutlinedInput-root': { borderRadius: '8px'}}}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Descrizione:"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  fullWidth
                  required
                  sx={{ borderColor: '#999', '& .MuiOutlinedInput-root': { borderRadius: '8px' }}}
                />
              </Stack>

              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Note:"
                  onChange={(e) => setNotes(e.target.value)}
                  value={notes}
                  fullWidth
                  required
                  multiline
                  sx={{ borderColor: '#999', '& .MuiOutlinedInput-root': { borderRadius: '8px' }}}
                />
                <FormControl sx={{ width: '30%',  '& .MuiOutlinedInput-root': { borderRadius: '8px' }, ' input ':{ width: '30%',  '& .MuiOutlinedInput-root': { borderRadius: '8px'}} }}> 
                  <InputLabel>Stato:</InputLabel>
                  <Select
                    label="Stato:"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    required
                    sx={{fontSize: {
                      xs: '0.5rem',  
                      sm: '0.7rem',   
                      md: '0.8rem',  
                      lg: '0.9rem',   
                      xl: '1rem ' },
                    }}
                  >
                    <MenuItem value="OPN" sx={{fontSize: {
                    xs: '0.5rem',  
                    sm: '0.7rem',   
                    md: '0.8rem',  
                    lg: '0.9rem',   
                    xl: '1rem ' },
                    fontFamily: 'Poppins !important',
                    }}>Open</MenuItem>
                    <MenuItem value="CLO" disabled  sx={{fontSize: {
                    xs: '0.5rem',  
                    sm: '0.7rem',   
                    md: '0.8rem',  
                    lg: '0.9rem',   
                    xl: '1rem ' },
                    fontFamily: 'Poppins !important',
                    }}>
                      Closed
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Stack spacing={2} direction="row" sx={{ marginBottom: 4, '& .MuiOutlinedInput-root': { borderRadius: '8px' }}}>
                <FormControl fullWidth>
                  <InputLabel>Project Manager</InputLabel>
                  <Select
                    label="Project Manager"
                    value={projectManager}
                    onChange={(e) => setProjectManager(e.target.value)}
                    fullWidth
                    required
                  >
                    <MenuItem value="PM1" sx={{
                       fontFamily: 'Poppins !important',
                    }}>Manager 1</MenuItem>
                    <MenuItem value="PM2"sx={{
                       fontFamily: 'Poppins !important',
                    }}>Manager 2</MenuItem>
                    <MenuItem value="PM3" sx={{
                       fontFamily: 'Poppins !important',
                    }}>Manager 3</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  variant="outlined"
                  color="primary"
                  label="Data Inizio"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  fullWidth
                  required
                  />

                <TextField
                  type="date"
                  variant="outlined"
                  color="primary"
                  label="Data Fine"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                  fullWidth
                  required
                  
                /> 
              </Stack>

              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="Riferimento Ordine:"
                onChange={(e) => setRefOrder(e.target.value)}
                value={refOrder}
                fullWidth
                required
                sx={{ borderColor: '#999', width:'50%', '& .MuiOutlinedInput-root': { borderRadius: '8px' }}}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#FF8C00',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#323232',
                    },
                    fontSize: {
                      xs: '0.5rem',  
                      sm: '0.7rem',   
                      md: '0.8rem',  
                      lg: '0.9rem',   
                      xl: '1rem',     
                    },
                  }}
                  type="submit"
                >
                  Crea il progetto
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewProject;
