/*import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
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

    // Creazione dell'istanza di ApiRest all'interno di handleSubmit
    const api = new ApiRest();

    try {
      const response = await api.iuProject(token, {
        projectName: [8],
        description: [9],
        status: [1],
        notes:[10],
        projectManager:[16],
        startDate:[17],
        endDate:[18],
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
              }}
            >
              Carica un nuovo progetto:
            </Typography>
          </Box>

          <Box
            sx={{
              padding: {
                xs: '0.5rem',  
                sm: '0.8rem',   
                md: '1rem',  
                lg: '1.5rem',   
                xl: '2rem',     
              },
              height:'70%',
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
                <FormControl sx={{ width: '30%', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}> 
                  <InputLabel>Stato:</InputLabel>
                  <Select
                    label="Stato:"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    required
                    sx={{ fontSize: {
                      xs: '0.5rem',  
                      sm: '0.7rem',   
                      md: '0.8rem',  
                      lg: '0.9rem',   
                      xl: '1rem ' },
                    }}
                  >
                    <MenuItem value="OPN">Open</MenuItem>
                    <MenuItem value="CLO" disabled>Closed</MenuItem>
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
                    <MenuItem value="PM1">Manager 1</MenuItem>
                    <MenuItem value="PM2">Manager 2</MenuItem>
                    <MenuItem value="PM3">Manager 3</MenuItem>
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
*/
import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiRest from "../../service-API/ApiRest";
import { useDispatch, useSelector } from "react-redux";

const inputs = [
  { key: "8", name: "Project", type: "text" },
  { key: "9", name: "Description", type: "text" },
  { key: "1", name: "Status", type: "select" },
  { key: "10", name: "Note", type: "text" },
  { key: "11", name: "Project Manager", type: "select-pms" },
  { key: "12", name: "Date Begin", type: "date" },
  { key: "13", name: "Date End", type: "date" },
];

const NewProject = () => {
  const [state, setState] = useState({
    0: -1,
    9: "",
    8: "",
    11: "",
    1: "OPN",
  });
  const buttonRef = useRef(null);
  const info = useSelector((state) => state.info);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const api = new ApiRest();
  const history = useNavigate();

  const handleOnChange = (event, target) => {
    setState({ ...state, [target]: event.target.value });
    if (state[11] === "") {
      setState((prevState) => ({ ...prevState, [11]: info.pms.split(";")[0] }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    buttonRef.current.disabled = true;
    if (Object.values(state).some((value) => value === "")) {
      console.log(state);
      console.log("Complete all fields before submitting!");
      alert("Attention!\nComplete all fields before submitting!");
      buttonRef.current.disabled = false;
      return;
    }
    try {
      const payload = {
        new: {},
        edits: {},
        project: state,
      };
      const response = await api.iuProject(token, payload);
      if (response && response.idprogetto) {
        const idprogetto = response.idprogetto;
        console.log(idprogetto);
        const newData = await api.getDashboard(token);
        dispatch({ type: "set", projects: newData.values });
        dispatch({ type: "set", id: { id: idprogetto } });
        history(`/dashboard/projectitems/${idprogetto}`, {
          state: { id: idprogetto },
        });
      }
    } catch (error) {
      console.log(
        "Error in newProject component while submitting data: " + error
      );
      alert(
        "Something went wrong.\n" +
          (error.response?.data?.message || "Unknown error occurred") +
          "\n Please try again or retry later."
      );
      buttonRef.current.disabled = false;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        alignItems: "center",
        "& .MuiInputBase-input ": {
          fontSize: {
            xs: "0.5rem !important",
            sm: "0.7rem !important",
            md: "0.8rem !important",
            lg: "0.9rem !important",
            xl: "1rem !important",
          },
          fontFamily: "Poppins !important",
        },
        "& .MuiInputLabel-root ": {
          fontSize: {
            xs: "0.5rem !important",
            sm: "0.7rem !important",
            md: "0.8rem !important",
            lg: "0.9rem !important",
            xl: "1rem !important",
          },
          fontFamily: "Poppins !important",
        },
      }}
    >
      <Box sx={{ width: "100%", height: "10%" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#333",
            fontWeight: "600",
            textAlign: "left",
            fontSize: {
              xs: "0.5rem",
              sm: "0.8rem",
              md: "1rem",
              lg: "1.2rem",
              xl: "1.5rem",
            },
            fontFamily: "Poppins !important",
          }}
        >
          Nuovo progetto
        </Typography>
      </Box>
      <Box sx={{ width: "100%", height: "80%" }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#4CAF50",
              padding: {
                xs: "0.5rem",
                sm: "0.7rem",
                md: "0.8rem",
                lg: "0.9rem",
                xl: "1rem",
              },
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography
              variant="h6"
              color="white"
              align="left"
              sx={{
                fontSize: {
                  xs: "0.5rem",
                  sm: "0.7rem",
                  md: "0.8rem",
                  lg: "0.9rem",
                  xl: "1rem",
                },
                fontFamily: "Poppins !important",
              }}
            >
              Carica un nuovo progetto:
            </Typography>
          </Box>

          <Box
            sx={{
              padding: {
                xs: "0.5rem",
                sm: "0.8rem",
                md: "1rem",
                lg: "1.5rem",
                xl: "2rem",
              },
              height: "70%",
            }}
          >
            <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="Nome Progetto"
                onChange={(e) => handleOnChange(e, "8")}
                value={state["8"]}
                fullWidth
                required
                sx={{
                  borderColor: "#999",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              />
              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="Descrizione"
                onChange={(e) => handleOnChange(e, "9")}
                value={state["9"]}
                fullWidth
                required
                sx={{
                  borderColor: "#999",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <FormControl
                sx={{
                  width: "30%",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              >
                <InputLabel>Stato</InputLabel>
                <Select
                  label="Status"
                  value={state["1"]}
                  onChange={(e) => handleOnChange(e, "1")}
                  fullWidth
                  required
                  sx={{
                    fontSize: {
                      xs: "0.5rem",
                      sm: "0.7rem",
                      md: "0.8rem",
                      lg: "0.9rem",
                      xl: "1rem ",
                    },
                  }}
                >
                  <MenuItem value="OPN">Open</MenuItem>
                  <MenuItem value="CLO" disabled>
                    Closed
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="Note"
                onChange={(e) => handleOnChange(e, "10")}
                value={state["10"]}
                fullWidth
                required
                sx={{
                  borderColor: "#999",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Project Manager</InputLabel>
                <Select
                  label="Project Manager"
                  value={state["11"]}
                  onChange={(e) => handleOnChange(e, "11")}
                  fullWidth
                  required
                >
                  {info.pms.split(";").map((pm, index) => (
                    <MenuItem key={index} value={pm}>
                      {pm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="date"
                variant="outlined"
                color="primary"
                label="Data Inizio"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleOnChange(e, "12")}
                value={state["12"]}
                fullWidth
                required
              />
              <TextField
                type="date"
                variant="outlined"
                color="primary"
                label="Data Fine"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleOnChange(e, "13")}
                value={state["13"]}
                fullWidth
                required
              />
            </Stack>

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                ref={buttonRef}
                variant="contained"
                sx={{
                  backgroundColor: "#FF8C00",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#323232",
                  },
                  fontSize: {
                    xs: "0.5rem",
                    sm: "0.7rem",
                    md: "0.8rem",
                    lg: "0.9rem",
                    xl: "1rem",
                  },
                }}
                type="submit"
              >
                Crea il progetto
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewProject;
