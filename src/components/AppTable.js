import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { alpha, styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const ODD_COLOR = 'rgba(217, 217, 217, 0.7)';
const EVEN_COLOR = 'rgba(255, 255, 255, 1)';

const StripedDataGrid = styled(DataGridPremium)(({ theme }) => ({
  [`& .MuiDataGrid-row.even`]: {
    backgroundColor: EVEN_COLOR,
  },
  [`& .MuiDataGrid-row.odd`]: {
    backgroundColor: ODD_COLOR,
  },
  [`& .MuiDataGrid-row:hover`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
  [`& .MuiDataGrid-row.Mui-selected`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.6),
    },
  },
  [`& .MuiDataGrid-columnHeader`]: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'rgb(75, 168, 61, .9) !important',
  },
  [`& .MuiDataGrid-columnHeaderTitle`]: {
    fontFamily: 'Poppins !important',
    color: 'white',
    fontSize: {
      xs: '0.5rem',
      sm: '0.6rem',
      md: '0.7rem',
      lg: '0.8rem',
      xl: '0.9rem',
    },
  },
  [`& .MuiDataGrid-columnHeaderRow`]: {
    textAlign: 'center',
    backgroundColor: 'rgb(75, 168, 61, .9) !important',
  },
}));

const AppTable = ({ columns, rows = [], onRowDoubleClick, showActions = false, disableCheckboxSelection, onDeleteRow }) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const apiRef = useGridApiRef();
  const [rowGroupingModel, setRowGroupingModel] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const tableRef = useRef(null); 

  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setRowSelectionModel([]); 
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = (params) => {
    setSelectedRow(params.row);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteRow) {
      onDeleteRow(selectedRow);
    }
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const renderStatusChip = (params) => {
    let chipColor;
    let label;

    switch (params.value) {
      case 'OPN':
        chipColor = 'success';
        label = 'Open';
        break;
      case 'CLO':
        chipColor = 'error';
        label = 'Closed';
        break;
      case 'NEW':
        chipColor = 'primary';
        label = 'New';
        break;
      case 'REQ':
        chipColor = 'secondary';
        label = 'Pending';
        break;
      
      default:
        chipColor = 'default';
    }

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Chip
          label={label}
          color={chipColor}
          sx={{
            fontSize: {
              xs: '0.4rem',
              sm: '0.5rem',
              md: '0.6rem',
              lg: '0.7rem',
              xl: '0.8rem',
            },
          }}
        />
      </Box>
    );
  };

  const renderActionButtons = (params) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Tooltip title="Modifica">
        <IconButton
          sx={{
            backgroundColor: '#108CCB',
            color: 'white',
            '&:hover': { backgroundColor: '#6CACFF' },
            padding: {
              xs: '2px',
              sm: '3px',
              md: '4px',
              lg: '5px',
              xl: '6px',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="edit"
          onClick={() => console.log("Modifica riga con ID:", params.id)}
        >
          <EditIcon
            sx={{
              fontSize: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '18px',
                xl: '20px',
              },
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Elimina">
        <IconButton
          sx={{
            backgroundColor: 'red',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(244, 67, 54, .7)' },
            padding: {
              xs: '2px',
              sm: '3px',
              md: '4px',
              lg: '5px',
              xl: '6px',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="delete"
          onClick={() => handleDeleteClick(params)}
        >
          <DeleteIcon
            sx={{
              fontSize: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '18px',
                xl: '20px',
              },
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const filteredColumns = columns.filter((col) => col.headerName !== 'Delete row' && col.headerName !== 'Edit');

  const updatedColumns = filteredColumns.map((col) => {
    if (col.headerName === 'Stato' || col.headerName === 'Stato Item' || col.headerName === "Stato Richiesta") {
      return {
        ...col,
        headerAlign: 'center',
        flex: 1,
        renderCell: (params) => renderStatusChip(params),
      };
    }

    if (col.headerName === 'Richieste Pending') {
      return {
        ...col,
        headerAlign: 'center',
        flex: 1,
        renderCell: (params) => renderRichiestePendingIcon(params),
      };
    }

    return {
      ...col,
      headerAlign: 'center',
      flex: 1,
    };
  });

  if (showActions) {
    updatedColumns.push({
      field: 'action',
      headerName: 'Azioni',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => renderActionButtons(params),
      sortable: false,
      filterable: false,
      align: 'center',
    });
  }

  const renderRichiestePendingIcon = (params) => {
    if (params.value > 0) {
      return (
        <Tooltip title={`Richieste Pending: ${params.value}`}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <NotificationImportantIcon
              sx={{
                color: '#d32f2f',
                fontSize: '25px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
              onClick={() => alert(`Richieste Pending ID: ${params.row.id}`)}
            />
          </Box>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="Nessuna richiesta pendente">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <NotificationsOffIcon
              sx={{
                color: '#108CCB',
                fontSize: '25px',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Tooltip>
      );
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }} ref={tableRef}> 
      <Box sx={{ height: 'auto', width: '100%' }}>
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={40}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-columnHeaderTitle': {
              fontFamily: 'Poppins !important',
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky"
            },
            '& .MuiDataGrid-columnHeaderRow': {
              textAlign: 'center',
              color: 'white !important',
            },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': {
              color: 'white',
            },
            '& .MuiDataGrid-columnHeaderRow>.MuiButtonBase-root': {
              color: 'white',
            },
            '& .MuiDataGrid-container--top [role=row]': {
              backgroundColor: 'rgb(75, 168, 61, .9) !important',
            },
            '& .MuiDataGrid-withBorderColor': {
              backgroundColor: 'rgb(75, 168, 61, .9) !important',
            },
            '& .MuiTablePagination-root': {
              color: 'white',
              fontFamily: 'Poppins !important',
              fontSize: {
                xs: '0.5rem',
                sm: '0.6rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
            },
            '& .MuiTablePagination-selectIcon ': {
              color: 'white !important',
            },
            '& .MuiDataGrid-cell': {
              textAlign: 'center',
              fontFamily: 'Poppins !important',
              fontSize: {
                xs: '0.4rem',
                sm: '0.5rem',
                md: '0.6rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
            },
            '& .MuiDataGrid-sortIcon': {
              color: 'white',
              opacity: '.9 !important',
            },
            '& .MuiDataGrid-menuIconButton': {
              color: 'white',
              opacity: '.9 !important',
            },
            '& .MuiDataGrid-topContainer ': {
              textAlign: 'center !important',
            },
            '&.MuiDataGrid-virtualScrollerContent': {
              height: '100%',
            },
          }}
          rows={rows}
          columns={updatedColumns}
          pageSize={10}
          onRowDoubleClick={onRowDoubleClick}
          getRowId={(row) => row.id || rows.indexOf(row)}
          pagination
          paginationMode="client"
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            rowGrouping: { model: rowGroupingModel },
          }}
          pageSizeOptions={[10, 25, 50]}
          sortingOrder={['asc', 'desc']}
          checkboxSelection={!disableCheckboxSelection} 
          onRowSelectionModelChange={handleRowSelectionModelChange}
          rowSelectionModel={rowSelectionModel}
          groupRowsByColumn="status"
          rowGroupingModel={rowGroupingModel}
          onRowGroupingModelChange={setRowGroupingModel}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Conferma Eliminazione"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare la riga con valore: {selectedRow ? Object.values(selectedRow)[9] : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppTable;
