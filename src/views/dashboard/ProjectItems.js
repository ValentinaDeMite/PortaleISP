import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Stack, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTable from '../../components/AppTable'; // Assumiamo che tu abbia il componente AppTable
import projectItems from '../../service-API/data-projects-items.json'; // Importiamo i dati mockati

const ProjectItems = () => {
  const ref = useRef(); // Ref per AppTable

  // Estrarre il primo set di dati dall'array "values"
  const project = projectItems.values[0];

  // Stato locale per i campi editabili
  const [editableData, setEditableData] = useState({
    projectName: project[11], // Nome Progetto
    projectDescription: project[14], // Descrizione Progetto
    projectNotes: '', // Note Progetto (campo vuoto inizialmente)
  });

  // Funzione per gestire il cambiamento di stato nei campi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  // Simulazione della modifica dei dati
  const handleModify = () => {
    // Aggiorna i dati fittizi (qui è solo un esempio di come fare)
    project[11] = editableData.projectName;
    project[14] = editableData.projectDescription;
    console.log('Modifiche salvate nel mock JSON:', project);
    alert('Modifiche salvate con successo!');
  };

  // Funzione per gestire la cancellazione
  const handleDelete = (rowIndex) => {
    console.log(`Elimina progetto all'indice: ${rowIndex}`);
  };

  // Estrai solo i campi che hanno "show": true, escludendo i campi "Edit" e "Delete row"
  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show && field[fieldKey].forcount !== 19 && field[fieldKey].forcount !== 20; // Escludi i campi 19 e 20
  });

  // Estrarre i nomi delle colonne da fieldsToShow
  const columnDefs = fieldsToShow.map(f => ({
    field: f[Object.keys(f)[0]].name,
    headerName: f[Object.keys(f)[0]].description, // Descrizione del campo per l'header della tabella
    flex: 1, // Per gestire la larghezza dinamica delle colonne
  }));

  // Aggiungi una colonna per le azioni
  columnDefs.push({
    field: 'actions',
    headerName: 'Azioni',
    flex: 1,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <IconButton onClick={() => handleModify(params.rowIndex)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(params.rowIndex)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ),
  });

  // Formattare i dati per la tabella, escludendo i campi "Edit" e "Delete row"
  const formattedData = projectItems.values.map(item => {
    const formattedItem = {};
    projectItems.fields.forEach(field => {
      const key = Object.keys(field)[0];
      if (field[key].show && field[key].forcount !== 19 && field[key].forcount !== 20) { // Escludi i campi 19 e 20
        formattedItem[field[key].name] = item[key]; // Mappa i valori a nome del campo
      }
    });
    return formattedItem;
  });

  const handleRowDoubleClick = (row) => {
    console.log("Riga selezionata", row);
    // Implementa l'azione del doppio click sulla riga
  };

  console.log('Dati da mostrare nella tabella:', formattedData); // Controlla i dati formattati

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
      {/* Titolo e specchietto in alto a destra */}
      <Box
        sx={{
          width: '100%',
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

        {/* Box dinamico con le informazioni */}
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

      <Box sx={{ width: '100%', height: '80%' }}>
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

          {/* Form con i campi simili alla foto */}
          <Box
            sx={{
              padding: {
                xs: '0.5rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
              },
              height: 'auto',
            }}
          >
            <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <TextField
                label="ID Progetto"
                value={project[0]}  // Popolazione dinamica del campo ID
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
              <TextField
                label="Stato"
                value={project[3]}  // Popolazione dinamica del campo Stato
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
              <TextField
                label="Elaborazione"
                value={project[2]}  // Popolazione dinamica del campo Elaborazione
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
              <TextField
                label="Errore"
                value={project[10]}  // Popolazione dinamica del campo Errore
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
              <TextField
                label="Installati"
                value={project[16]}  // Popolazione dinamica del campo Installati
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
              <TextField
                label="Totale P."
                value={project[16]}  // Popolazione dinamica del campo Totale P
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
            </Stack>

            {/* Campi editabili */}
            <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <TextField
                label="Nome Progetto"
                name="projectName"
                value={editableData.projectName}  // Stato gestito dinamicamente
                onChange={handleInputChange}  // Modifica il valore dello stato
                fullWidth
              />
              <TextField
                label="Descrizione Progetto"
                name="projectDescription"
                value={editableData.projectDescription}  // Stato gestito dinamicamente
                onChange={handleInputChange}  // Modifica il valore dello stato
                fullWidth
              />
              <TextField
                label="Note Progetto"
                name="projectNotes"
                value={editableData.projectNotes}  // Stato gestito dinamicamente
                onChange={handleInputChange}  // Modifica il valore dello stato
                fullWidth
              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <TextField
                label="Riferimento Ordine"
                value={project[12]}  // Popolazione dinamica del campo Riferimento Ordine
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
              <TextField
                label="Ultimo File Caricato"
                value={project[12]}  // Popolazione dinamica del campo Ultimo File Caricato
                InputProps={{
                  readOnly: true,
                  style: { backgroundColor: '#E0E0E0' }, // Campo grigio
                }}
                fullWidth
              />
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
                onClick={handleModify}  // Simulazione modifica
              >
                Modifica
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* AppTable che mostra i campi con "show": true */}
      <Box sx={{ width: '100%', marginTop: '2rem' }}>
        <AppTable 
            ref={ref} 
            columns={columnDefs} 
            rows={formattedData}  // Usa i dati formattati qui
            onRowDoubleClick={handleRowDoubleClick}  
            action={true} 

        />
      </Box>
    </Box>
  );
};

export default ProjectItems;
