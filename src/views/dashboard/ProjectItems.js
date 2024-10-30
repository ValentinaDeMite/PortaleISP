import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable'; 
import AppModalTable from '../../components/AppModalTable'; 
import projectItems from '../../service-API/data-projects-items.json'; 
import AddIcon from '@mui/icons-material/Add';
import StockData from '../../service-API/stock.json';
import CloseIcon from '@mui/icons-material/Close';

const ProjectItems = () => {
  const ref = useRef(); 
  const project = projectItems.values[0];
  const stock = useSelector((state) => state.stock || StockData.values);
  const [openModal, setOpenModal] = useState(false);

  const [editableData, setEditableData] = useState({
    projectName: project[11], 
    projectDescription: project[14], 
    projectNotes: '',
  });

  const [pendingRequests, setPendingRequests] = useState([]); // Array per le richieste pending

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    // Aggiornare il messaggio di richiesta pending
    let newRequests = [...pendingRequests];

    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:')); // Rimuovere eventuali precedenti modifiche sul nome
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:')); // Rimuovere eventuali precedenti modifiche sulla descrizione
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:')); // Rimuovere eventuali precedenti modifiche sulle note
      newRequests.push(`Note progetto aggiornate: ${value}`);
    }

    setPendingRequests(newRequests);
  };

  const handleModify = () => {
    project[11] = editableData.projectName;
    project[14] = editableData.projectDescription;
    console.log('Modifiche salvate nel mock JSON:', project);
    alert('Modifiche salvate con successo!');
    setPendingRequests([]); // Resetta le richieste pending dopo il salvataggio
  };

  const customBackgroundColor = '#D8D8D8'; 
  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show && field[fieldKey].forcount !== 19 && field[fieldKey].forcount !== 20; 
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: Object.keys(f)[0],
    headerName: f[Object.keys(f)[0]].description, 
    flex: 1, 
  }));

  const handleRowDoubleClick = (row) => {
    console.log("Riga selezionata", row);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleAddItem = (id, quantity) => {
    console.log(`Added item with ID: ${id}, Quantity: ${quantity}`);
    handleCloseModal();
  };

  const getModalColumnDefs = () => {
    return StockData.fields
      .filter(field => {
        const fieldKey = Object.keys(field)[0];
        return field[fieldKey].show;
      })
      .map(f => ({
        field: Object.keys(f)[0],
        headerName: f[Object.keys(f)[0]].description,
        flex: 1,
      }));
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
              xs: '0.7rem',
              sm: '0.9rem',
              md: '1rem',
              lg: '1.3rem',
              xl: '1.8rem',
            },
            fontFamily:'Poppins!important'
          }}
        >
          {project[8]} 
        </Typography>

        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'left',
            color: '#555',
            minWidth: '200px',
            '& .MuiTypography-body2': {
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
              fontFamily:'Poppins!important'
            },
          }}
        >
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[8]}</Typography>
          <Typography variant="body2">Modificato da: {project[9]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '99%', height: 'auto',  '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.6rem',
            sm: '0.7rem',
            md: '0.8rem',
            lg: '0.9rem',
            xl: '1rem',
          },
          fontFamily:'Poppins!important'
        }, }}>
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
              padding: '1rem',
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
                  xs: '0.7rem',
                  sm: '0.9rem',
                  md: '1rem',
                  lg: '1.1rem',
                  xl: '1.2rem',
                },
                fontFamily:'Poppins!important'
              }}
            >
              Nome progetto
            </Typography>
          </Box>

          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField 
                label="ID Progetto" 
                value={project[0]} 
                InputProps={{ readOnly: true }} 
                fullWidth
                sx={{
                  backgroundColor: customBackgroundColor,
                  borderRadius: '8px',
                }}
              />
              <TextField 
                label="Stato" 
                value={project[2]} 
                InputProps={{ readOnly: true }} 
                fullWidth
                sx={{
                  backgroundColor: customBackgroundColor,
                  borderRadius: '8px',
                }}
              />
              <TextField 
                label="Allocato" 
                value={project[12]} 
                InputProps={{ readOnly: true }} 
                fullWidth
                sx={{
                  backgroundColor: customBackgroundColor,
                  borderRadius: '8px',
                }}
              />
              <TextField 
                label="Evaso" 
                value={project[16]} 
                InputProps={{ readOnly: true }} 
                fullWidth
                sx={{
                  backgroundColor: customBackgroundColor,
                  borderRadius: '8px',
                }}
              />
              <TextField 
                label="Residuo" 
                value={project[1]} 
                InputProps={{ readOnly: true }} 
                fullWidth
                sx={{
                  backgroundColor: customBackgroundColor,
                  borderRadius: '8px',
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
                  borderRadius: '8px',
                }}
              />
              <TextField 
                label="Descrizione Progetto" 
                name="projectDescription" 
                value={editableData.projectDescription} 
                onChange={handleInputChange} 
                fullWidth
                sx={{
                  borderRadius: '8px',
                }}
              />
              <TextField 
                label="Note Progetto" 
                name="projectNotes" 
                value={editableData.projectNotes} 
                onChange={handleInputChange} 
                fullWidth
                sx={{
                  borderRadius: '8px',
                }}
              />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField 
                label="Richiesta Pending" 
                value={pendingRequests.join('\n')} 
                InputProps={{ readOnly: true }} 
                fullWidth
                sx={{
                  borderRadius: '8px',
                  width:'50%'
                }}
                multiline 
                rows={pendingRequests.length || 1} 
              />
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF8C00',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  fontSize: {
                    xs: '0.5rem',
                    sm: '0.6rem',
                    md: '0.7rem',
                    lg: '0.8rem',
                    xl: '0.9rem',
                  },
                  fontFamily:'Poppins!important',

                  '&:hover': {
                    backgroundColor: '#FF9F1A',
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

      {/* Sezione Dettagli Progetto con Icona "+" */}
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
              xs: '0.7rem',
              sm: '0.9rem',
              md: '1rem',
              lg: '1.3rem',
            },
            fontFamily:'Poppins!important'
          }}
        >
          Dettagli Progetto:
        </Typography>
        <Tooltip title='Aggiungi un nuovo Item'>
          <IconButton
            sx={{
              backgroundColor: '#FFA500',
              color: 'white',
              '&:hover': {
                transform: 'scale(1.2)',
                backgroundColor: '#FFB84D',
              },
              cursor: 'pointer',
            }}
            onClick={handleOpenModal}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', marginTop: '2rem' }}>
        <AppTable 
          ref={ref} 
          columns={columnDefs}  
          rows={projectItems.values}
          onRowDoubleClick={handleRowDoubleClick}  
          action={false}
          useChips={true}
          isProjectItems={true} 
          showActions={true}
          disableCheckboxSelection={true} 
        />
      </Box>

      {/* Modale */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            width: '80%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative', // Aggiunto per posizionare l'icona
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              fontSize: {
                xs: '0.5rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.2rem',
                xl: '1.5rem',
              },
              fontFamily: 'Poppins!important'
            }}
          >
            Stock Item
          </Typography>
          <AppModalTable
            columns={getModalColumnDefs()}
            rows={StockData.values}
            onAdd={handleAddItem}
            modalMode={true}
          />
          
        </Box>
      </Modal>

    </Box>
  );
};

export default ProjectItems;
