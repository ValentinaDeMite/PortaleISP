import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTable from '../../components/AppTable'; 
import projectItems from '../../service-API/data-projects-items.json'; 
import AddIcon from '@mui/icons-material/Add';

const ProjectItems = () => {
  const ref = useRef(); 
  const project = projectItems.values[0];

  const [editableData, setEditableData] = useState({
    projectName: project[11], 
    projectDescription: project[14], 
    projectNotes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  const handleModify = () => {
    project[11] = editableData.projectName;
    project[14] = editableData.projectDescription;
    console.log('Modifiche salvate nel mock JSON:', project);
    alert('Modifiche salvate con successo!');
  };

  const handleDelete = (rowIndex) => {
    console.log(`Elimina progetto all'indice: ${rowIndex}`);
  };

  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show && field[fieldKey].forcount !== 19 && field[fieldKey].forcount !== 20; 
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: f[Object.keys(f)[0]].name,
    headerName: f[Object.keys(f)[0]].description, 
    flex: 1, 
  }));

  columnDefs.push({
    field: 'actions',
    headerName: 'Azioni',
    flex: 1,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Modifica">
          <IconButton
            sx={{
              backgroundColor: '#108CCB',
              color: 'white',
              '&:hover': { backgroundColor: '#6CACFF' },
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem',
                lg: '1rem',
                xl: '1.1rem',
              },
            }}
            onClick={() => handleModify(params.rowIndex)}
          >
            <EditIcon sx={{
              fontSize: {
                xs: '16px',
                sm: '18px',
                md: '20px',
                lg: '22px',
                xl: '24px',
              },
            }}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Elimina">
          <IconButton
            sx={{
              backgroundColor: 'red',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, .7)' },
              fontSize: {
                xs: '0.7rem',
                sm: '0.8rem',
                md: '0.9rem',
                lg: '1rem',
                xl: '1.1rem',
              },
            }}
            onClick={() => handleDelete(params.rowIndex)}
          >
            <DeleteIcon sx={{
              fontSize: {
                xs: '16px',
                sm: '18px',
                md: '20px',
                lg: '22px',
                xl: '24px',
              },
            }}/>
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  });

  const formattedData = projectItems.values.map(item => {
    const formattedItem = {};
    projectItems.fields.forEach(field => {
      const key = Object.keys(field)[0];
      if (field[key].show && field[key].forcount !== 19 && field[key].forcount !== 20) { 
        formattedItem[field[key].name] = item[key]; 
      }
    });
    return formattedItem;
  });

  const handleRowDoubleClick = (row) => {
    console.log("Riga selezionata", row);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        overflowY: 'auto'
      }}
    >
      <Box
        sx={{
          width: '98%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#333',
            fontWeight: 'bold',
            textAlign: 'left',
            fontSize: {
              xs: '0.8rem',
              sm: '1rem',
              md: '1.2rem',
              lg: '1.5rem',
              xl: '2rem',
            },
          }}
        >
          Nome Progetto
        </Typography>

        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'left',
            fontSize: '0.8rem',
            color: '#555',
            minWidth: '200px',
            "& .MuiTypography-body2": {
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
            },
          }}
        >
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[8]}</Typography>
          <Typography variant="body2">Modificato da: {project[9]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '99%', height: 'auto' }}>
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
            <Typography
              variant="h6"
              color="white"
              align="left"
              sx={{
                fontSize: {
                  xs: '0.5rem',
                  sm: '0.7rem',
                  md: '0.8rem',
                  lg: '0.9rem',
                  xl: '1rem',
                },
              }}
            >
              Nome progetto
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
              display: 'flex',
              flexDirection: 'column',
              gap: 3, 
            }}
          >
            <Stack spacing={2} direction="row" sx={{boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',}}>
              <TextField
                label="ID Progetto"
                value={project[0]}  
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, 
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Stato"
                value={project[3]} 
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' },
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Elaborazione"
                value={project[2]}  
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, 
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Errore"
                value={project[10]}  
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, 
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Installati"
                value={project[16]}  
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, 
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Nome Progetto"
                name="projectName"
                value={editableData.projectName}  
                onChange={handleInputChange}  
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Descrizione Progetto"
                name="projectDescription"
                value={editableData.projectDescription}  
                onChange={handleInputChange}  
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Note Progetto"
                name="projectNotes"
                value={editableData.projectNotes}  
                onChange={handleInputChange}  
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Riferimento Ordine"
                value={project[12]}  
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, 
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
              <TextField
                label="Ultimo File Caricato"
                value={project[12]}  
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, 
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: '0.5rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem',
                    },
                  },
                }}
              />
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, }}>
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
                    backgroundColor: '#FF9F1A',
                  },
                  fontSize: {
                    xs: '0.5rem',
                    sm: '0.7rem',
                    md: '0.8rem',
                    lg: '0.9rem',
                    xl: '1rem',
                  },
                }}
                onClick={handleModify} 
              >
                Modifica
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '98%',
            marginTop: '2rem', 
            padding: '1rem 0',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              textAlign: 'left',
              fontSize: {
                xs: '0.8rem',
                sm: '1rem',
                md: '1.2rem',
                lg: '1.5rem',
                
              },
            }}
          >
            Dettagli Progetto:
          </Typography>
          <Tooltip title='Aggiungi un nuovo Item'>
            <IconButton
            sx={{
              backgroundColor: '#FFA500',
              color: 'white',
              '&:hover': { transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  backgroundColor: '#FFB84D'}, },
              cursor: 'pointer',
              fontSize: {
                xs: '15px',  
                sm: '20px',  
                md: '25px', 
                lg: '30px', 
                xl: '32px',  
              },
              
            }}
            onClick={() => console.log('Aggiungi nuovo progetto')}
          >
            <AddIcon />
          </IconButton>
          </Tooltip>
          
        </Box>


      <Box sx={{ width: '99%', marginTop: '2rem' }}>
        <AppTable 
            ref={ref} 
            columns={columnDefs} 
            rows={formattedData}  
            onRowDoubleClick={handleRowDoubleClick}  
            action={true} 
        />
      </Box>
    </Box>
  );
};

export default ProjectItems;

