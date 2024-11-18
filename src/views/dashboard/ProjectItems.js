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

  const [editedRows, setEditedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);

  const handleDeleteRow = (deletedRow) => {
    setDeletedRows((prevDeletedRows) => [...prevDeletedRows, deletedRow]);
    console.log('Riga eliminata:', deletedRow);

    setPendingRequests((prevRequests) => [...prevRequests, `Articolo da eliminare => Part Number ${deletedRow[9]}`]);
  };

  const handleEditRow = (editedRow) => {
    setEditedRows((prevEditedRows) => [...prevEditedRows, editedRow]);
    console.log('Riga eliminata:', editedRow);

    setPendingRequests((prevRequests) => [...prevRequests, `Modifica => Part Number:  ${editedRow[9]} Allocato: ${editedRow[12]}`]);
  };

  const fetchStockData = async () => {
    try {
      const response = await api.getStock(token);
      setStockData(response.values.slice(0, 10)); 

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
        useChips={true}
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
