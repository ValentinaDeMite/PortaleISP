/*import React, { useState, useRef } from 'react';
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

  const [pendingRequests, setPendingRequests] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    let newRequests = [...pendingRequests];

    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:')); 
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:')); 
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:')); 
      newRequests.push(`Note progetto aggiornate: ${value}`);
    }

    setPendingRequests(newRequests);
  };

  const handleModify = () => {
    project[11] = editableData.projectName;
    project[14] = editableData.projectDescription;
    console.log('Modifiche salvate nel mock JSON:', project);
    alert('Modifiche salvate con successo!');
    setPendingRequests([]); 
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
            position: 'relative',
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

  const [pendingRequests, setPendingRequests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    let newRequests = [...pendingRequests];

    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:')); 
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:')); 
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:')); 
      newRequests.push(`Note progetto aggiornate: ${value}`);
    }

    setPendingRequests(newRequests);
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    if (dateType === 'startDate') {
      setStartDate(value);
      setDateError(endDate && value > endDate);
    } else if (dateType === 'endDate') {
      setEndDate(value);
      setDateError(startDate && value < startDate);
    }
  };

  const handleModify = () => {
    project[11] = editableData.projectName;
    project[14] = editableData.projectDescription;
    console.log('Modifiche salvate nel mock JSON:', project);
    alert('Modifiche salvate con successo!');
    setPendingRequests([]); 
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
                type="date"
                label="Data Inizio"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'startDate')}
                value={startDate}
                fullWidth
                required
                sx={{
                  borderRadius: '8px',
                }}
              />
              <TextField 
                type="date"
                label="Data Fine"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'endDate')}
                value={endDate}
                fullWidth
                required
                error={dateError}
                helperText={dateError && "La data di fine deve essere successiva a quella di inizio"}
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
          Dettagli Prodotto:
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

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={StockData.values} onAdd={handleAddItem} modalMode={true} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems; *


// giusta
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import projectItems from '../../service-API/data-projects-items.json';
import projectsData from '../../service-API/projects.json';
import AddIcon from '@mui/icons-material/Add';
import StockData from '../../service-API/stock.json';
import CloseIcon from '@mui/icons-material/Close';

const ProjectItems = () => {
  const ref = useRef();
  const project = projectsData.values[0];
  const stock = useSelector((state) => state.stock || StockData.values);
  const [openModal, setOpenModal] = useState(false);

  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17].split(' ')[0],
    endDate: project[18].split(' ')[0],
    request: project[15]
  });
  const pendingRequestsCount = project[15] ? parseInt(project[15]) : 0;


  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }
    setPendingRequests(newRequests);
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    setEditableData(prev => ({ ...prev, [dateType]: value }));

    let newRequests = [...pendingRequests];
    if (dateType === 'startDate') {
      newRequests = newRequests.filter(req => !req.startsWith('Data Inizio aggiornata:'));
      newRequests.push(`Data Inizio aggiornata: ${value}`);
      setDateError(editableData.endDate && value > editableData.endDate);
    } else if (dateType === 'endDate') {
      newRequests = newRequests.filter(req => !req.startsWith('Data Fine aggiornata:'));
      newRequests.push(`Data Fine aggiornata: ${value}`);
      setDateError(editableData.startDate && value < editableData.startDate);
    }
    setPendingRequests(newRequests);
  };

  const handleModify = () => {
    project[8] = editableData.projectName;
    project[9] = editableData.projectDescription;
    project[10] = editableData.projectNotes;
    project[16] = editableData.projectManager;
    project[17] = `${editableData.startDate} 00:00:00.0`;
    project[18] = `${editableData.endDate} 00:00:00.0`;
    alert('Modifiche salvate con successo!');
    setPendingRequests([]);
  };

  const customBackgroundColor = '#D8D8D8';
  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show;
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: Object.keys(f)[0],
    headerName: f[Object.keys(f)[0]].description,
    flex: 1,
  }));

  const handleRowDoubleClick = (row) => {
    console.log("Riga selezionata", row);
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

  const handleAddItem = (id, quantity) => {
    console.log(`Added item with ID: ${id}, Quantity: ${quantity}`);
    handleCloseModal();
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto', alignItems: 'center',  '& .MuiInputBase-input ':{
      fontSize:{
        xs: '0.5rem !important',  
        sm: '0.7rem !important',   
        md: '0.8rem !important',  
        lg: '0.9rem !important',   
        xl: '1rem !important',  
      },
      fontFamily: 'Poppins !important',

    },
    '.body2':{
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
    } }}>
      <Box sx={{ width: '98%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', fontSize: '1.3rem', fontFamily: 'Poppins!important', fontSize: {
                xs: '0.5rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.2rem',
                xl: '1.5rem',
              }, }}>
          {project[8]}
        </Typography>
        <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', color: '#555', minWidth: '200px', "& .MuiTypography-body2": {
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
              fontFamily:'Poppins'
            }, }}>
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[8]}</Typography>
          <Typography variant="body2">Modificato da: {project[9]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '99%', height: 'auto' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Allocato" value={project[12]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Evaso" value={project[13]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Residuo" value={project[14]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Nome Progetto" name="projectName" value={editableData.projectName} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Descrizione Progetto" name="projectDescription" value={editableData.projectDescription} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Note Progetto" name="projectNotes" value={editableData.projectNotes} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Project Manager" name="projectManager" value={editableData.projectManager} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField
                type="date"
                label="Data Inizio"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'startDate')}
                value={editableData.startDate}
                fullWidth
                sx={{ borderRadius: '8px' }}
              />
              <TextField
                type="date"
                label="Data Fine"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'endDate')}
                value={editableData.endDate}
                fullWidth
                error={dateError}
                helperText={dateError && "La data di fine deve essere successiva a quella di inizio"}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Pending"
                value={pendingRequests.length > 0 ? pendingRequests.join('\n') : "Nessuna richiesta in attesa"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={pendingRequests.length > 0 ? pendingRequests.length : 1}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              {pendingRequestsCount > 0 ? (
                <>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#FF8C00', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      marginRight: '10px' 
                    }} 
                    onClick={handleModify}>
                    Conferma
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#FF8C00', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '8px' 
                    }} 
                    onClick={handleModify}>
                    Elimina
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#FF8C00', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '8px' 
                  }} 
                  onClick={handleModify}>
                  Modifica
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: 'Poppins!important',fontSize: {
                xs: '0.5rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.2rem',
                xl: '1.5rem',
              }, }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title='Aggiungi un nuovo Item'>
          <IconButton
            sx={{
              backgroundColor: '#FFA500',
              color: 'white',
              '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' },
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
          showActions={true}
          disableCheckboxSelection={true}
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={StockData.values} onAdd={handleAddItem} modalMode={true} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;





// ultima v.




import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import projectItems from '../../service-API/data-projects-items.json';
import projectsData from '../../service-API/projects.json';
import AddIcon from '@mui/icons-material/Add';
import StockData from '../../service-API/stock.json';
import CloseIcon from '@mui/icons-material/Close';

const ProjectItems = () => {
  const ref = useRef();
  const project = projectsData.values[0];
  const stock = useSelector((state) => state.stock || StockData.values);
  const [openModal, setOpenModal] = useState(false);

  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17].split(' ')[0],
    endDate: project[18].split(' ')[0],
    request: project[15]
  });

  const pendingRequestsCount = project[15] ? parseInt(project[15]) : 0;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);

  const isModified = pendingRequestsCount > 0 || pendingRequests.length > 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }
    setPendingRequests(newRequests);
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    setEditableData(prev => ({ ...prev, [dateType]: value }));

    let newRequests = [...pendingRequests];
    if (dateType === 'startDate') {
      newRequests = newRequests.filter(req => !req.startsWith('Data Inizio aggiornata:'));
      newRequests.push(`Data Inizio aggiornata: ${value}`);
      setDateError(editableData.endDate && value > editableData.endDate);
    } else if (dateType === 'endDate') {
      newRequests = newRequests.filter(req => !req.startsWith('Data Fine aggiornata:'));
      newRequests.push(`Data Fine aggiornata: ${value}`);
      setDateError(editableData.startDate && value < editableData.startDate);
    }
    setPendingRequests(newRequests);
  };

  const handleModify = () => {
    project[8] = editableData.projectName;
    project[9] = editableData.projectDescription;
    project[10] = editableData.projectNotes;
    project[16] = editableData.projectManager;
    project[17] = `${editableData.startDate} 00:00:00.0`;
    project[18] = `${editableData.endDate} 00:00:00.0`;
    alert('Modifiche salvate con successo!');
    setPendingRequests([]);
  };

  const customBackgroundColor = '#D8D8D8';
  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show;
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: Object.keys(f)[0],
    headerName: f[Object.keys(f)[0]].description,
    flex: 1,
  }));

  const handleRowDoubleClick = (row) => {
    console.log("Riga selezionata", row);
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

  const handleAddItem = (id, quantity) => {
    console.log(`Added item with ID: ${id}, Quantity: ${quantity}`);
    handleCloseModal();
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto', alignItems: 'center',  '& .MuiInputBase-input ':{
      fontSize:{
        xs: '0.5rem !important',  
        sm: '0.7rem !important',   
        md: '0.8rem !important',  
        lg: '0.9rem !important',   
        xl: '1rem !important',  
      },
      fontFamily: 'Poppins !important',

    },
    '.body2':{
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
    } }}>
      <Box sx={{ width: '98%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4" sx={{
          color: '#333', fontWeight: 'bold', fontSize: {
            xs: '0.5rem',
            sm: '0.8rem',
            md: '1rem',
            lg: '1.2rem',
            xl: '1.5rem',
          }, fontFamily: 'Poppins!important'
        }}>
          {project[8]}
        </Typography>
        <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', color: '#555', minWidth: '200px', "& .MuiTypography-body2": {
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
              fontFamily: 'Poppins'
            } }}>
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[5]}</Typography>
          <Typography variant="body2">Modificato da: {project[4]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '99%', height: 'auto' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Allocato" value={project[12]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Evaso" value={project[13]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Residuo" value={project[14]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Nome Progetto" name="projectName" value={editableData.projectName} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Descrizione Progetto" name="projectDescription" value={editableData.projectDescription} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Note Progetto" name="projectNotes" value={editableData.projectNotes} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Project Manager" name="projectManager" value={editableData.projectManager} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField
                type="date"
                label="Data Inizio"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'startDate')}
                value={editableData.startDate}
                fullWidth
                sx={{ borderRadius: '8px' }}
              />
              <TextField
                type="date"
                label="Data Fine"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'endDate')}
                value={editableData.endDate}
                fullWidth
                error={dateError}
                helperText={dateError && "La data di fine deve essere successiva a quella di inizio"}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                onChange={(e) => setPendingRequests(e.target.value.split('\n'))}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
            </Stack>

            {isModified && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#FF8C00',
                    '&:hover': {
                      backgroundColor: '#323232',
                    }, 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    marginRight: '10px',
                    fontSize: {
                      xs: '0.5rem',  
                      sm: '0.6rem',   
                      md: '0.7rem',  
                      lg: '0.8rem',   
                      xl: '0.9rem',      
                    },
                  }} 
                  onClick={handleModify}>
                  Conferma
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#108CCB', 
                    '&:hover': {
                      backgroundColor: '#323232',
                    },
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    fontSize: {
                      xs: '0.5rem',  
                      sm: '0.6rem',   
                      md: '0.7rem',  
                      lg: '0.8rem',   
                      xl: '0.9rem',     
                    },

                  }} 
                  onClick={() => setPendingRequests([])}>
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold', fontSize: {
            xs: '0.5rem',
            sm: '0.8rem',
            md: '1rem',
            lg: '1.2rem',
            xl: '1.5rem',
          }, fontFamily: 'Poppins!important'
        }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title='Aggiungi un nuovo Item'>
          <IconButton
            sx={{
              backgroundColor: '#FFA500',
              color: 'white',
              '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' },
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
          showActions={true}
          disableCheckboxSelection={true}
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={StockData.values} onAdd={handleAddItem} modalMode={true} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;


import React, { useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import projectItems from '../../service-API/data-projects-items.json';
import projectsData from '../../service-API/projects.json';
import AddIcon from '@mui/icons-material/Add';
import StockData from '../../service-API/stock.json';
import CloseIcon from '@mui/icons-material/Close';

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject); // Recupera i dettagli del progetto selezionato
  const location = useLocation();
  console.log('progetto sing', project);
  
  const stock = useSelector((state) => state.stock || StockData.values);
  const [openModal, setOpenModal] = useState(false);

  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17].split(' ')[0],
    endDate: project[18].split(' ')[0],
    request: project[15]
  });

  const [pendingRequestsCount, setPendingRequestsCount] = useState(parseInt(project[15]) || 0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);

  const isModified = pendingRequestsCount > 0 || pendingRequests.length > 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }
    setPendingRequests(newRequests);
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    setEditableData(prev => ({ ...prev, [dateType]: value }));

    let newRequests = [...pendingRequests];
    if (dateType === 'startDate') {
      newRequests = newRequests.filter(req => !req.startsWith('Data Inizio aggiornata:'));
      newRequests.push(`Data Inizio aggiornata: ${value}`);
      setDateError(editableData.endDate && value > editableData.endDate);
    } else if (dateType === 'endDate') {
      newRequests = newRequests.filter(req => !req.startsWith('Data Fine aggiornata:'));
      newRequests.push(`Data Fine aggiornata: ${value}`);
      setDateError(editableData.startDate && value < editableData.startDate);
    }
    setPendingRequests(newRequests);
  };

  const handleConfirm = () => {
    setPendingRequestsCount(0);
    project[15] = "0";
    alert('Tutte le richieste sono state accettate!');
    setPendingRequests([]);
  };

  const handleDelete = () => {
    if (pendingRequests.length > 0) {
      setPendingRequests(prev => prev.slice(1)); 
    } else if (pendingRequestsCount > 0) {
      setPendingRequestsCount(0); 
      project[15] = "0";
    }
  };

  const customBackgroundColor = '#D8D8D8';
  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show;
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: Object.keys(f)[0],
    headerName: f[Object.keys(f)[0]].name,
    flex: 1,
  }));

  const handleRowDoubleClick = (row) => {
    console.log("Riga selezionata", row);
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

  const handleAddItem = (id, quantity) => {
    console.log(`Added item with ID: ${id}, Quantity: ${quantity}`);
    handleCloseModal();
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto', alignItems: 'center',  '& .MuiInputBase-input ':{
      fontSize:{
        xs: '0.5rem !important',  
        sm: '0.7rem !important',   
        md: '0.8rem !important',  
        lg: '0.9rem !important',   
        xl: '1rem !important',  
      },
      fontFamily: 'Poppins !important',

    },
    '.body2':{
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
    } }}>
      <Box sx={{ width: '98%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4" sx={{
          color: '#333', fontWeight: 'bold', fontSize: {
            xs: '0.5rem',
            sm: '0.8rem',
            md: '1rem',
            lg: '1.2rem',
            xl: '1.5rem',
          }, fontFamily: 'Poppins!important'
        }}>
          {project[8]}
        </Typography>
        <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '1rem', color: '#555', minWidth: '200px', "& .MuiTypography-body2": {
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
              fontFamily: 'Poppins'
            } }}>
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[5]}</Typography>
          <Typography variant="body2">Modificato da: {project[4]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '99%', height: 'auto' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Allocato" value={project[12]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Evaso" value={project[13]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
              <TextField label="Residuo" value={project[14]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: customBackgroundColor, borderRadius: '8px' }} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Nome Progetto" name="projectName" value={editableData.projectName} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Descrizione Progetto" name="projectDescription" value={editableData.projectDescription} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Note Progetto" name="projectNotes" value={editableData.projectNotes} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Project Manager" name="projectManager" value={editableData.projectManager} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField
                type="date"
                label="Data Inizio"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'startDate')}
                value={editableData.startDate}
                fullWidth
                sx={{ borderRadius: '8px' }}
              />
              <TextField
                type="date"
                label="Data Fine"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'endDate')}
                value={editableData.endDate}
                fullWidth
                error={dateError}
                helperText={dateError && "La data di fine deve essere successiva a quella di inizio"}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? pendingRequestsCount : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                onChange={(e) => setPendingRequests(e.target.value.split('\n'))}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
            </Stack>

            {isModified && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#FF8C00',
                    '&:hover': {
                      backgroundColor: '#323232',
                    }, 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    marginRight: '10px',
                    fontSize: {
                      xs: '0.5rem',  
                      sm: '0.6rem',   
                      md: '0.7rem',  
                      lg: '0.8rem',   
                      xl: '0.9rem',      
                    },
                  }} 
                  onClick={handleConfirm}>
                  Conferma
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#108CCB', 
                    '&:hover': {
                      backgroundColor: '#323232',
                    },
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    fontSize: {
                      xs: '0.5rem',  
                      sm: '0.6rem',   
                      md: '0.7rem',  
                      lg: '0.8rem',   
                      xl: '0.9rem',     
                    },

                  }} 
                  onClick={handleDelete}>
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{
          fontWeight: 'bold', fontSize: {
            xs: '0.5rem',
            sm: '0.8rem',
            md: '1rem',
            lg: '1.2rem',
            xl: '1.5rem',
          }, fontFamily: 'Poppins!important'
        }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title='Aggiungi un nuovo Item'>
          <IconButton
            sx={{
              backgroundColor: '#FFA500',
              color: 'white',
              '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' },
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
          showActions={true}
          disableCheckboxSelection={true}
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={StockData.values} onAdd={handleAddItem} modalMode={true} />
        </Box>
      </Modal>
    </Box>
      </Box>
   
  );
};

export default ProjectItems;

// funzionano gli import
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button } from '@mui/material';

const ProjectItems = () => {
  const project = useSelector((state) => state.selectedProject);

  // Stato per i dati modificabili e per l'errore della data
  const [editableData, setEditableData] = useState({
    id: project[0],
    stato: project[1],
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    allocato: project[12],
    evaso: project[13],
    residuo: project[14],
    richiestePending: project[15],
    projectManager: project[16],
    startDate: project[17] ? project[17].split(' ')[0] : "",  // Gestione data solo
    endDate: project[18] ? project[18].split(' ')[0] : ""     // Gestione data solo
  });

  const [dateError, setDateError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    setEditableData((prev) => ({ ...prev, [dateType]: value }));

    if (dateType === 'startDate') {
      setDateError(editableData.endDate && value > editableData.endDate);
    } else if (dateType === 'endDate') {
      setDateError(editableData.startDate && value < editableData.startDate);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Dettagli Progetto
      </Typography>

      <Stack spacing={2} direction="row" sx={{ width: '100%', maxWidth: '800px' }}>
        <TextField
          label="ID Progetto"
          name="id"
          value={editableData.id}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Stato"
          name="stato"
          value={editableData.stato}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Allocato"
          name="allocato"
          value={editableData.allocato}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Evaso"
          name="evaso"
          value={editableData.evaso}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Residuo"
          name="residuo"
          value={editableData.residuo}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Stack>

      <Stack spacing={2} direction="row" sx={{ width: '100%', maxWidth: '800px', mt: 2 }}>
        <TextField
          label="Nome Progetto"
          name="projectName"
          value={editableData.projectName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Descrizione Progetto"
          name="projectDescription"
          value={editableData.projectDescription}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Note Progetto"
          name="projectNotes"
          value={editableData.projectNotes}
          onChange={handleInputChange}
          fullWidth
        />
      </Stack>

      <Stack spacing={2} direction="row" sx={{ width: '100%', maxWidth: '800px', mt: 2 }}>
        <TextField
          label="Project Manager"
          name="projectManager"
          value={editableData.projectManager}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Richieste Pendenti"
          name="richiestePending"
          value={editableData.richiestePending}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Stack>

      <Stack spacing={2} direction="row" sx={{ width: '100%', maxWidth: '800px', mt: 2 }}>
        <TextField
          label="Data Inizio"
          type="date"
          value={editableData.startDate}
          onChange={(e) => handleDateChange(e, 'startDate')}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Data Fine"
          type="date"
          value={editableData.endDate}
          onChange={(e) => handleDateChange(e, 'endDate')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          error={dateError}
          helperText={dateError ? "La data di fine deve essere successiva alla data di inizio" : ""}
        />
      </Stack>
    </Box>
  );
};

export default ProjectItems;


// funziona e ha tutto lo stile
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import projectItems from '../../service-API/data-projects-items.json';
import StockData from '../../service-API/stock.json';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const stock = useSelector((state) => state.stock || StockData.values);
  const [openModal, setOpenModal] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(' ')[0] || '',
    endDate: project[18]?.split(' ')[0] || '',
  });
  const pendingRequestsCount = project[15] ? parseInt(project[15]) : 0;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);
  const isModified = pendingRequestsCount > 0 || pendingRequests.length > 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });

    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }
    setPendingRequests(newRequests);
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    setEditableData((prev) => ({ ...prev, [dateType]: value }));

    if (dateType === 'startDate') {
      setDateError(editableData.endDate && value > editableData.endDate);
    } else if (dateType === 'endDate') {
      setDateError(editableData.startDate && value < editableData.startDate);
    }

    setPendingRequests((prev) => {
      const newRequests = prev.filter((req) => !req.startsWith(`Data ${dateType} aggiornata:`));
      return [...newRequests, `Data ${dateType} aggiornata: ${value}`];
    });
  };

  const handleConfirm = () => {
    setPendingRequests([]);
    alert('Tutte le richieste sono state accettate!');
  };

  const handleDelete = () => {
    setPendingRequests((prev) => prev.slice(1));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show;
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: Object.keys(f)[0],
    headerName: f[Object.keys(f)[0]].name,
    flex: 1,
  }));

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
        overflowY: 'auto',
        alignItems: 'center',
        padding: 3,
        '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
        '.body2': {
          fontFamily: 'Poppins !important',
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
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
            fontSize: {
              xs: '0.5rem',
              sm: '0.8rem',
              md: '1rem',
              lg: '1.2rem',
              xl: '1.5rem',
            },
            fontFamily: 'Poppins!important',
          }}
        >
          {editableData.projectName}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
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
              fontFamily: 'Poppins',
            },
          }}
        >
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[5]}</Typography>
          <Typography variant="body2">Modificato da: {project[4]}</Typography>
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
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Allocato" value={project[12]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Evaso" value={project[13]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Residuo" value={project[14]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField label="Nome Progetto" name="projectName" value={editableData.projectName} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Descrizione Progetto" name="projectDescription" value={editableData.projectDescription} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField label="Note Progetto" name="projectNotes" value={editableData.projectNotes} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField label="Project Manager" name="projectManager" value={editableData.projectManager} onChange={handleInputChange} fullWidth sx={{ borderRadius: '8px' }} />
              <TextField
                type="date"
                label="Data Inizio"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'startDate')}
                value={editableData.startDate}
                fullWidth
                sx={{ borderRadius: '8px' }}
              />
              <TextField
                type="date"
                label="Data Fine"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, 'endDate')}
                value={editableData.endDate}
                fullWidth
                error={dateError}
                helperText={dateError && "La data di fine deve essere successiva a quella di inizio"}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>

            <Stack spacing={2} direction="row">
            <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                onChange={(e) => setPendingRequests(e.target.value.split('\n'))}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px', width: '50%' }}
              />

            </Stack>

            {pendingRequests.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#FF8C00', color: 'white', marginRight: '10px' }}
                  onClick={handleConfirm}
                >
                  Conferma
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#108CCB', color: 'white' }}
                  onClick={handleDelete}
                >
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '0.5rem', sm: '0.8rem', md: '1rem', lg: '1.2rem', xl: '1.5rem' }, fontFamily: 'Poppins!important' }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton sx={{ backgroundColor: '#FFA500', color: 'white', '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' } }} onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', mt: '2rem' }}>
        <AppTable ref={ref} columns={columnDefs} rows={projectItems.values} showActions={true}
          disableCheckboxSelection={true} onRowDoubleClick={() => {}} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={stock} onAdd={() => {}} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;






// not bad


import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal } from '@mui/material';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import projectItems from '../../service-API/data-projects-items.json';
import StockData from '../../service-API/stock.json';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const stock = useSelector((state) => state.stock || StockData.values);
  const [openModal, setOpenModal] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(' ')[0] || '',
    endDate: project[18]?.split(' ')[0] || '',
  });
  const [initialData] = useState({ ...editableData });
  const pendingRequestsCount = project[15] ? parseInt(project[15]) : 0;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }
    setPendingRequests(newRequests);
  };

  const handleCancelChange = (field) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: initialData[field],
    }));
    setPendingRequests((prevRequests) => prevRequests.filter((req) => !req.startsWith(`Campo ${field} aggiornato`)));
  };

  const handleDateChange = (e, dateType) => {
    const value = e.target.value;
    setEditableData((prev) => ({ ...prev, [dateType]: value }));

    if (dateType === 'startDate') {
      setDateError(editableData.endDate && value > editableData.endDate);
    } else if (dateType === 'endDate') {
      setDateError(editableData.startDate && value < editableData.startDate);
    }

    setPendingRequests((prev) => {
      const newRequests = prev.filter((req) => !req.startsWith(`Data ${dateType} aggiornata:`));
      return [...newRequests, `Data ${dateType} aggiornata: ${value}`];
    });
  };

  const handleConfirm = () => {
    setPendingRequests([]);
    alert('Tutte le richieste sono state accettate!');
  };

  const handleDelete = () => {
    setPendingRequests((prev) => prev.slice(1));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fieldsToShow = projectItems.fields.filter(field => {
    const fieldKey = Object.keys(field)[0];
    return field[fieldKey].show;
  });

  const columnDefs = fieldsToShow.map(f => ({
    field: Object.keys(f)[0],
    headerName: f[Object.keys(f)[0]].name,
    flex: 1,
  }));

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
        overflowY: 'auto',
        alignItems: 'center',
        padding: 3,
        '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
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
            fontSize: {
              xs: '0.5rem',
              sm: '0.8rem',
              md: '1rem',
              lg: '1.2rem',
              xl: '1.5rem',
            },
            fontFamily: 'Poppins!important',
          }}
        >
          {editableData.projectName}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
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
              fontFamily: 'Poppins',
            },
          }}
        >
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
          <Typography variant="body2">Modificato: {project[5]}</Typography>
          <Typography variant="body2">Modificato da: {project[4]}</Typography>
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
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {['projectName', 'projectDescription', 'projectNotes', 'projectManager', 'startDate', 'endDate'].map((field, index) => (
              <Stack spacing={1} direction="row" alignItems="center" key={index}>
                <TextField
                  label={field === 'startDate' || field === 'endDate' ? `Data ${field === 'startDate' ? 'Inizio' : 'Fine'}` : `Nome ${field.replace('project', '').toUpperCase()}`}
                  name={field}
                  value={editableData[field]}
                  onChange={field === 'startDate' || field === 'endDate' ? (e) => handleDateChange(e, field) : handleInputChange}
                  fullWidth
                  type={field === 'startDate' || field === 'endDate' ? 'date' : 'text'}
                  InputLabelProps={{ shrink: true }}
                  error={field === 'endDate' && dateError}
                  helperText={field === 'endDate' && dateError ? "La data di fine deve essere successiva a quella di inizio" : ''}
                  sx={{ borderRadius: '8px' }}
                />
                <IconButton
                  onClick={() => handleCancelChange(field)}
                  sx={{ padding: '4px' }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                onChange={(e) => setPendingRequests(e.target.value.split('\n'))}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px', width: '50%' }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      {pendingRequests.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#FF8C00', color: 'white', marginRight: '10px' }}
            onClick={handleConfirm}
          >
            Conferma
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#108CCB', color: 'white' }}
            onClick={handleDelete}
          >
            Elimina
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '0.5rem', sm: '0.8rem', md: '1rem', lg: '1.2rem', xl: '1.5rem' }, fontFamily: 'Poppins!important' }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton sx={{ backgroundColor: '#FFA500', color: 'white', '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' } }} onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', mt: '2rem' }}>
        <AppTable ref={ref} columns={columnDefs} rows={projectItems.values} showActions={true}
          disableCheckboxSelection={true} onRowDoubleClick={() => {}} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={stock} onAdd={() => {}} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;


import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import StockData from '../../service-API/stock.json';
import ApiRest from '../../service-API/ApiRest'; // Assicurati che il percorso sia corretto

const api = new ApiRest();

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const stock = useSelector((state) => state.stock || StockData.values);
  
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(' ')[0] || '',
    endDate: project[18]?.split(' ')[0] || '',
  });
  const [initialData] = useState({ ...editableData });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [projectItemsData, setProjectItemsData] = useState([]); // Stato per i dati degli items
  const token = useSelector((state) => state.token); // Ottieni il token dallo stato

  useEffect(() => {
    const fetchProjectItems = async () => {
      try {
        const items = await api.getItems(token, project[0]); // Passa il token e l'ID del progetto
        setProjectItemsData(items);
      } catch (error) {
        console.error('Errore nel recuperare i project items:', error);
      }
    };

    fetchProjectItems();
  }, [token, project]); // Effettua la chiamata quando il token o il progetto cambiano

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    // Logica per confermare le modifiche
    setPendingRequests([]);
    alert('Tutte le richieste sono state accettate!');
  };

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

  const handleDelete = () => {
    setEditableData(initialData);
    setPendingRequests([]);
    setOpenDeleteConfirm(false);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const pendingRequestsCount = pendingRequests.length; // Calcola il numero di richieste pendenti

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

  const columnDefs = projectItemsData.fields?.filter(field => field.show).map(f => ({
    field: f.name,
    headerName: f.label,
    flex: 1,
  })) || [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        alignItems: 'center',
        paddingX: 1,
        '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
      }}
    >
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
            fontSize: {
              xs: '0.5rem',
              sm: '0.8rem',
              md: '1rem',
              lg: '1.2rem',
              xl: '1.5rem',
            },
            fontFamily: 'Poppins!important',
          }}
        >
          {editableData.projectName}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
            color: '#555',
            minWidth: '200px',
          }}
        >
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 'auto' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
            </Stack>

            <Stack spacing={2} direction="row">
              {['projectName', 'projectDescription', 'projectNotes', 'projectManager', 'startDate', 'endDate'].map((field, index) => (
                <TextField
                  key={index}
                  label={field === 'startDate' ? 'Data Inizio' : field === 'endDate' ? 'Data Fine' : `Nome ${field.replace('project', '').toUpperCase()}`}
                  name={field}
                  value={editableData[field]}
                  onChange={handleInputChange}
                  fullWidth
                  type={field === 'startDate' || field === 'endDate' ? 'date' : 'text'}
                  InputLabelProps={{ shrink: true }}
                  error={field === 'endDate' && dateError}
                  helperText={field === 'endDate' && dateError ? "La data di fine deve essere successiva a quella di inizio" : ''}
                  sx={{ borderRadius: '8px' }}
                />
              ))}
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ borderRadius: '8px' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>

            {pendingRequests.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#FF8C00', color: 'white', marginRight: '10px' }} onClick={handleConfirm}>
                  Conferma
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#108CCB', color: 'white' }} onClick={handleDeleteConfirmOpen}>
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare tutte le modifiche non salvate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">Annulla</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Elimina</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Dettagli articoli:</Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton sx={{ backgroundColor: '#FFA500', color: 'white' }} onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', mt: '2rem' }}>
        <AppTable ref={ref} columns={columnDefs} rows={projectItemsData.values} showActions={true} disableCheckboxSelection={true} onRowDoubleClick={() => {}} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={stock} onAdd={() => {}} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;


import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Stack, Button, IconButton, Tooltip, Modal, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import StockData from '../../service-API/stock.json';
import ApiRest from '../../service-API/ApiRest';

const api = new ApiRest();

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const stock = useSelector((state) => state.stock || StockData.values);
  
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(' ')[0] || '',
    endDate: project[18]?.split(' ')[0] || '',
  });
  const [initialData] = useState({ ...editableData });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [projectItemsData, setProjectItemsData] = useState([]); // Stato per i dati degli items
  const [columnDefs, setColumnDefs] = useState([]); // Stato per le colonne della tabella
  const token = useSelector((state) => state.token); // Ottieni il token dallo stato

  useEffect(() => {
    const fetchProjectItems = async () => {
      try {
        const items = await api.getItems(token, project[0]); // Passa il token e l'ID del progetto
        setProjectItemsData(items.values); // Imposta i dati degli articoli

        // Imposta le colonne dinamicamente
        const columns = items.fields.filter(field => {
          const fieldKey = Object.keys(field)[0];
          return field[fieldKey].show; // Solo i campi che devono essere mostrati
        }).map(field => {
          const fieldKey = Object.keys(field)[0];
          return {
            field: fieldKey,
            headerName: field[fieldKey].name,
            flex: 1,
          };
        });

        setColumnDefs(columns); // Imposta le colonne
      } catch (error) {
        console.error('Errore nel recuperare i project items:', error);
      }
    };

    fetchProjectItems();
  }, [token, project]); // Effettua la chiamata quando il token o il progetto cambiano

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Aggiornamento delle richieste pendenti
    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }

    setPendingRequests(newRequests);
  };

  const handleCancelChange = (field) => {
    // Ripristina il valore originale del campo
    setEditableData((prevData) => ({
      ...prevData,
      [field]: initialData[field],
    }));

    // Rimuove la richiesta specifica associata al campo annullato dalle `pendingRequests`
    setPendingRequests((prevRequests) => {
      const requestLabel = `${getFieldLabel(field)} aggiornato: ${initialData[field]}`;
      return prevRequests.filter(req => req !== requestLabel);
    });
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case 'projectName':
        return 'Nome progetto';
      case 'projectDescription':
        return 'Descrizione progetto';
      case 'projectNotes':
        return 'Note progetto';
      case 'projectManager':
        return 'Project Manager';
      case 'startDate':
        return 'Data Inizio';
      case 'endDate':
        return 'Data Fine';
      default:
        return '';
    }
  };

  const handleConfirm = () => {
    // Logica per confermare le modifiche
    setPendingRequests([]);
    alert('Tutte le richieste sono state accettate!');
  };

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

  const handleDelete = () => {
    setEditableData(initialData); // Ripristina i dati originali
    setPendingRequests([]); // Resetta le richieste pendenti
    setOpenDeleteConfirm(false);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const pendingRequestsCount = pendingRequests.length; // Calcola il numero di richieste pendenti

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
        overflowY: 'auto',
        alignItems: 'center',
        paddingX: 1,
        '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
      }}
    >
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
            fontSize: {
              xs: '0.5rem',
              sm: '0.8rem',
              md: '1rem',
              lg: '1.2rem',
              xl: '1.5rem',
            },
            fontFamily: 'Poppins!important',
          }}
        >
          {editableData.projectName}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
            color: '#555',
            minWidth: '200px',
          }}
        >
          <Typography variant="body2">Creato: {project[6]}</Typography>
          <Typography variant="body2">Creato da: {project[7]}</Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 'auto' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
            </Stack>

            <Stack spacing={2} direction="row">
              {['projectName', 'projectDescription', 'projectNotes', 'projectManager', 'startDate', 'endDate'].map((field, index) => (
                <TextField
                  key={index}
                  label={field === 'startDate' ? 'Data Inizio' : field === 'endDate' ? 'Data Fine' : `Nome ${field.replace('project', '').toUpperCase()}`}
                  name={field}
                  value={editableData[field]}
                  onChange={handleInputChange}
                  fullWidth
                  type={field === 'startDate' || field === 'endDate' ? 'date' : 'text'}
                  InputLabelProps={{ shrink: true }}
                  error={field === 'endDate' && dateError}
                  helperText={field === 'endDate' && dateError ? "La data di fine deve essere successiva a quella di inizio" : ''}
                  sx={{ borderRadius: '8px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleCancelChange(field)} edge="end" size="small">
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ borderRadius: '8px' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>

            {pendingRequests.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#FF8C00', color: 'white', marginRight: '10px' }} onClick={handleConfirm}>
                  Conferma
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#108CCB', color: 'white' }} onClick={handleDeleteConfirmOpen}>
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare tutte le modifiche non salvate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">Annulla</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Elimina</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '0.5rem', sm: '0.8rem', md: '1rem', lg: '1.2rem', xl: '1.5rem' }, fontFamily: 'Poppins!important' }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton sx={{ backgroundColor: '#FFA500', color: 'white', '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' } }} onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', mt: '2rem' }}>
        <AppTable ref={ref} columns={columnDefs} rows={projectItemsData || []} showActions={true} disableCheckboxSelection={true} onRowDoubleClick={() => {}} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={stock} onAdd={() => {}} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;



//// giusta
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import StockData from '../../service-API/stock.json';
import ApiRest from '../../service-API/ApiRest';

const api = new ApiRest();

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const token = useSelector((state) => state.token);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(' ')[0] || '',
    endDate: project[18]?.split(' ')[0] || '',
  });
  const [initialData] = useState({ ...editableData });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [projectItemsData, setProjectItemsData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [stockData, setStockData] = useState([]);

  const fetchStockData = async () => {
    try {
      const response = await api.getStock(token);
      setStockData(response.values);
    } catch (error) {
      console.error('Errore nel recuperare i dati di stock:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    fetchStockData();
  };

  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const fetchProjectItems = async () => {
      try {
        const items = await api.getItems(token, project[0]);
        setProjectItemsData(items.values);

        const columns = items.fields
          .filter(field => {
            const fieldKey = Object.keys(field)[0];
            return field[fieldKey].show;
          })
          .map(field => {
            const fieldKey = Object.keys(field)[0];
            return {
              field: fieldKey,
              headerName: field[fieldKey].name,
              flex: 1,
            };
          });

        setColumnDefs(columns);
      } catch (error) {
        console.error('Errore nel recuperare i project items:', error);
      }
    };

    fetchProjectItems();
  }, [token, project]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let newRequests = [...pendingRequests];
    if (name === 'projectName') {
      newRequests = newRequests.filter(req => !req.startsWith('Nome progetto aggiornato:'));
      newRequests.push(`Nome progetto aggiornato: ${value}`);
    } else if (name === 'projectDescription') {
      newRequests = newRequests.filter(req => !req.startsWith('Descrizione progetto aggiornata:'));
      newRequests.push(`Descrizione progetto aggiornata: ${value}`);
    } else if (name === 'projectNotes') {
      newRequests = newRequests.filter(req => !req.startsWith('Note progetto aggiornate:'));
      newRequests.push(`Note progetto aggiornate: ${value}`);
    } else if (name === 'projectManager') {
      newRequests = newRequests.filter(req => !req.startsWith('Project Manager aggiornato:'));
      newRequests.push(`Project Manager aggiornato: ${value}`);
    }

    setPendingRequests(newRequests);
  };

  const handleCancelChange = (field) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: initialData[field],
    }));

    setPendingRequests((prevRequests) => {
      const requestLabel = `${getFieldLabel(field)} aggiornato: ${initialData[field]}`;
      return prevRequests.filter(req => req !== requestLabel);
    });
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case 'projectName':
        return 'Nome progetto';
      case 'projectDescription':
        return 'Descrizione progetto';
      case 'projectNotes':
        return 'Note progetto';
      case 'projectManager':
        return 'Project Manager';
      case 'startDate':
        return 'Data Inizio';
      case 'endDate':
        return 'Data Fine';
      default:
        return '';
    }
  };

  const handleConfirm = () => {
    setPendingRequests([]);
    alert('Tutte le richieste sono state accettate!');
  };

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

  const handleDelete = () => {
    setEditableData(initialData);
    setPendingRequests([]);
    setOpenDeleteConfirm(false);
  };

  const pendingRequestsCount = pendingRequests.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        alignItems: 'center',
        paddingX: 1,
        '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
      }}
    >
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
            fontSize: {
              xs: '0.5rem',
              sm: '0.8rem',
              md: '1rem',
              lg: '1.2rem',
              xl: '1.5rem',
            },
            fontFamily: 'Poppins!important',
          }}
        >
          {project[8]}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
            color: '#555',
            minWidth: '200px',
          }}
        >
          <Typography variant="body2">Creato il: {project[3]}</Typography>
          <Typography variant="body2">Creato da: {project[4]}</Typography>
          <Typography variant="body2">Ultima Modifica: {project[5]}</Typography>
          <Typography variant="body2">Modificato da: {project[6]}</Typography>

        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 'auto' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Allocato" value={project[12]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Evaso" value={project[13]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Residuo" value={project[14]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
            </Stack>

            <Stack spacing={2} direction="row">
              {['projectName', 'projectDescription', 'projectNotes', 'projectManager', 'startDate', 'endDate'].map((field, index) => (
                <TextField
                  key={index}
                  label={field === 'startDate' ? 'Data Inizio' : field === 'endDate' ? 'Data Fine' : `Nome ${field.replace('project', '').toUpperCase()}`}
                  name={field}
                  value={editableData[field]}
                  onChange={handleInputChange}
                  fullWidth
                  type={field === 'startDate' || field === 'endDate' ? 'date' : 'text'}
                  InputLabelProps={{ shrink: true }}
                  error={field === 'endDate' && dateError}
                  helperText={field === 'endDate' && dateError ? "La data di fine deve essere successiva a quella di inizio" : ''}
                  sx={{ borderRadius: '8px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleCancelChange(field)} edge="end" size="small">
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Stack>

            <Stack spacing={2} direction="row">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>

            {pendingRequests.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#FF8C00', color: 'white', marginRight: '10px' }} onClick={handleConfirm}>
                  Conferma
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#108CCB', color: 'white' }} onClick={handleDeleteConfirmOpen}>
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare tutte le modifiche non salvate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">Annulla</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Elimina</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '0.5rem', sm: '0.8rem', md: '1rem', lg: '1.2rem', xl: '1.5rem' }, fontFamily: 'Poppins!important' }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton sx={{ backgroundColor: '#FFA500', color: 'white', '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' } }} onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', mt: '2rem' }}>
        <AppTable ref={ref} columns={columnDefs} rows={projectItemsData || []} showActions={true} disableCheckboxSelection={true} onRowDoubleClick={() => {}} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={stockData} onAdd={() => {}} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;

*/

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import AppTable from '../../components/AppTable';
import AppModalTable from '../../components/AppModalTable';
import StockData from '../../service-API/stock.json';
import ApiRest from '../../service-API/ApiRest';

const api = new ApiRest();

const createNewRowObject = (item, project, isSupervisor, projectItemsDataLength) => {
  return {
    0: project[0],
    1: projectItemsDataLength + 1,
    2: 'PEN',
    3: '',
    4: '',
    6: '',
    7: '0',
    8: project[8],
    9: item.material['1'],
    10: item.material['2'],
    11: item.material['3'],
    12: isSupervisor ? item.quantity : 0,
    13: isSupervisor ? 0 : item.quantity,
    14: 0,
    15: 0,
    16: 0,
    17: isSupervisor ? item.quantity : 0,
    18: '',
    19: '',
    20: 'No Edit',
    21: 'No Delete',
  };
};

const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const token = useSelector((state) => state.token);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(' ')[0] || '',
    endDate: project[18]?.split(' ')[0] || '',
  });
  const [initialData] = useState({ ...editableData });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [projectItemsData, setProjectItemsData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [stockData, setStockData] = useState([]);

  const [editedRows, setEditedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);

  const handleDeleteRow = (deletedRow) => {
    // Salva il dato della riga eliminata nello stato
    setDeletedRows((prevDeletedRows) => [...prevDeletedRows, deletedRow]);
    console.log('Riga eliminata:', deletedRow);

    setPendingRequests((prevRequests) => [...prevRequests, `Articolo da eliminare => Part Number ${deletedRow[9]}`]);
  };

  const handleEditRow = (editedRow) => {
    // Salva il dato della riga eliminata nello stato
    setEditedRows((prevEditedRows) => [...prevEditedRows, editedRow]);
    console.log('Riga eliminata:', editedRow);

    setPendingRequests((prevRequests) => [...prevRequests, `Modifica => Part Number:  ${editedRow[9]} Allocato: ${editedRow[12]}`]);
  };

  const fetchStockData = async () => {
    try {
      const response = await api.getStock(token);
      setStockData(response.values.slice(0, 10)); // Load the first 10 items initially

      // Load the rest of the data in the background
      setTimeout(() => {
        setStockData(response.values);
      }, 0);
    } catch (error) {
      console.error('Errore nel recuperare i dati di stock:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    fetchStockData();
  };

  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const fetchProjectItems = async () => {
      try {
        const items = await api.getItems(token, project[0]);
        setProjectItemsData(items.values);

        const columns = items.fields
          .filter(field => {
            const fieldKey = Object.keys(field)[0];
            return field[fieldKey].show;
          })
          .map(field => {
            const fieldKey = Object.keys(field)[0];
            return {
              field: fieldKey,
              headerName: field[fieldKey].name,
              flex: 1,
            };
          });

        setColumnDefs(columns);
      } catch (error) {
        console.error('Errore nel recuperare i project items:', error);
      }
    };

    fetchProjectItems();
  }, [token, project]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setPendingRequests((prevRequests) => {
      const updatedRequests = prevRequests.filter(req => !req.startsWith(`${getFieldLabel(name)} aggiornato:`));
      if (value) {
        updatedRequests.push(`${getFieldLabel(name)} aggiornato: ${value}`);
      }
      return updatedRequests;
    });
  };

  const handleCancelChange = (field) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: initialData[field],
    }));

    setPendingRequests((prevRequests) => {
      return prevRequests.filter(req => !req.startsWith(`${getFieldLabel(field)} aggiornato:`));
    });
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case 'projectName':
        return 'Nome progetto';
      case 'projectDescription':
        return 'Descrizione progetto';
      case 'projectNotes':
        return 'Note progetto';
      case 'projectManager':
        return 'Project Manager';
      case 'startDate':
        return 'Data Inizio';
      case 'endDate':
        return 'Data Fine';
      default:
        return '';
    }
  };

  const handleConfirm = () => {
    setPendingRequests([]);
    alert('Tutte le richieste sono state accettate!');
  };

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

  const handleDelete = () => {
    setEditableData(initialData);
    setPendingRequests([]);
    setOpenDeleteConfirm(false);
  };

  const pendingRequestsCount = pendingRequests.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        alignItems: 'center',
        paddingX: 1,
        '& .MuiInputBase-input': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
        '& .MuiInputLabel-root': {
          fontSize: {
            xs: '0.5rem !important',
            sm: '0.7rem !important',
            md: '0.8rem !important',
            lg: '0.9rem !important',
            xl: '1rem !important',
          },
          fontFamily: 'Poppins !important',
        },
      }}
    >
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
            fontSize: {
              xs: '0.5rem',
              sm: '0.8rem',
              md: '1rem',
              lg: '1.2rem',
              xl: '1.5rem',
            },
            fontFamily: 'Poppins!important',
          }}
        >
          {project[8]}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            padding: '1rem',
            color: '#555',
            minWidth: '200px',
          }}
        >
          <Typography variant="body2">Creato il: {project[3]}</Typography>
          <Typography variant="body2">Creato da: {project[4]}</Typography>
          <Typography variant="body2">Ultima Modifica: {project[5]}</Typography>
          <Typography variant="body2">Modificato da: {project[6]}</Typography>

        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 'auto' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ backgroundColor: '#4CAF50', padding: '1rem' }}>
            <Typography variant="h6" color="white" align="left" sx={{ fontSize: '1rem', fontFamily: 'Poppins!important' }}>
              Dettagli progetto:
            </Typography>
          </Box>
          <Box sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={2} direction="row">
              <TextField label="ID Progetto" value={project[0]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Stato" value={project[1]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Allocato" value={project[12]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Evaso" value={project[13]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
              <TextField label="Residuo" value={project[14]} InputProps={{ readOnly: true }} fullWidth sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }} />
            </Stack>


            <Stack spacing={2} direction="row">
              {['projectName', 'projectDescription', 'projectNotes', 'projectManager', 'startDate', 'endDate'].map((field, index) => (
                <TextField
                  key={index}
                  label={field === 'startDate' ? 'Data Inizio' : field === 'endDate' ? 'Data Fine' : `Nome ${field.replace('project', '').toUpperCase()}`}
                  name={field}
                  value={editableData[field]}
                  onChange={handleInputChange}
                  fullWidth
                  type={field === 'startDate' || field === 'endDate' ? 'date' : 'text'}
                  InputLabelProps={{ shrink: true }}
                  error={field === 'endDate' && dateError}
                  helperText={field === 'endDate' && dateError ? "La data di fine deve essere successiva a quella di inizio" : ''}
                  sx={{ borderRadius: '8px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleCancelChange(field)} edge="end" size="small">
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Stack>

            <Stack spacing={2} direction="row" alignItems="flex-start">
              <TextField
                label="Richiesta Iniziale"
                value={pendingRequestsCount > 0 ? project[15] : "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ backgroundColor: '#D8D8D8', borderRadius: '8px' }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join('\n')}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{ borderRadius: '8px' }}
              />
            </Stack>


            {pendingRequests.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#FF8C00', color: 'white', marginRight: '10px' }} onClick={handleConfirm}>
                  Conferma
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#108CCB', color: 'white' }} onClick={handleDeleteConfirmOpen}>
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare tutte le modifiche non salvate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">Annulla</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Elimina</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '98%', marginTop: '2rem', padding: '1rem 0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '0.5rem', sm: '0.8rem', md: '1rem', lg: '1.2rem', xl: '1.5rem' }, fontFamily: 'Poppins!important' }}>
          Dettagli articoli:
        </Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton sx={{ backgroundColor: '#FFA500', color: 'white', '&:hover': { transform: 'scale(1.2)', backgroundColor: '#FFB84D' } }} onClick={handleOpenModal}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: '99%', mt: '2rem' }}>
        <AppTable ref={ref} columns={columnDefs} rows={projectItemsData || []}  
        onDeleteRow={handleDeleteRow} 
        onEditRow={handleEditRow}
        showActions={true} 
        disableCheckboxSelection={true} 
        onRowDoubleClick={() => {}} />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Stock Item
          </Typography>
          <AppModalTable columns={getModalColumnDefs()} rows={stockData} onAdd={() => {}} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;
