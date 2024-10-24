import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable'; 
import AppModalTable from '../../components/AppModalTable'; 
import projectItems from '../../service-API/data-projects-items.json'; 
import AddIcon from '@mui/icons-material/Add';
import StockData from '../../service-API/stock.json';

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

  // Funzione per creare le colonne della modale da StockData.fields
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
              padding: '1rem',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            }}
          >
            <Typography
              variant="h6"
              color="white"
              align="left"
            >
              Nome progetto
            </Typography>
          </Box>

          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Stato" value={project[3]} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Elaborazione" value={project[2]} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Errore" value={project[10]} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Installati" value={project[16]} InputProps={{ readOnly: true }} fullWidth />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField label="Nome Progetto" name="projectName" value={editableData.projectName} onChange={handleInputChange} fullWidth />
              <TextField label="Descrizione Progetto" name="projectDescription" value={editableData.projectDescription} onChange={handleInputChange} fullWidth />
              <TextField label="Note Progetto" name="projectNotes" value={editableData.projectNotes} onChange={handleInputChange} fullWidth />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField label="Riferimento Ordine" value={project[12]} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Ultimo File Caricato" value={project[12]} InputProps={{ readOnly: true }} fullWidth />
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF8C00',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
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
        />
      </Box>

      {/* Modale per Aggiungere Item */}
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
          }}
        >
          <AppModalTable 
            columns={getModalColumnDefs()} 
            rows={StockData.values} 
            onAdd={handleAddItem} 
            modalMode={true} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="contained" color="primary" onClick={handleCloseModal}>
              Chiudi
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;
