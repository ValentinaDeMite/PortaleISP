import React, { useState } from 'react';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { alpha, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
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

const AppModalTable = ({ columns, rows = [], onAdd }) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const apiRef = useGridApiRef();
  
  // Stato per le quantità
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddClick = (id) => {
    const quantity = quantities[id] || 0; // Usa la quantità memorizzata o 0 se non presente
    if (quantity > 0) {
      onAdd(id, quantity);
      setQuantities(prev => ({ ...prev, [id]: 0 })); // Resetta la quantità dopo l'aggiunta
    } else {
      alert("Inserisci una quantità valida!");
    }
  };

  const renderAddAction = (params) => {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          type="number"
          value={quantities[params.id] || ''} // Imposta il valore dell'input
          onChange={(e) => handleQuantityChange(params.id, e.target.value)}
          sx={{ width: '70px' }}
        />
        <Button
          variant="contained"
          onClick={() => handleAddClick(params.id)}
          sx={{ textTransform: 'none' }}
        >
          Aggiungi
        </Button>
      </Box>
    );
  };

  const updatedColumns = columns.map((col) => {
    if (col.headerName === 'Stato' || col.headerName === "Stato singolo Item ") {
      return {
        ...col,
        headerAlign: 'center',
        renderCell: (params) => <Chip label={params.value} color="success" />,
      };
    }

    if (col.field === 'action') {
      return {
        ...col,
        headerName: 'Azione',
        renderCell: (params) => renderAddAction(params),
        sortable: false,
        filterable: false,
        align: 'center',
      };
    }

    return {
      ...col,
      headerAlign: 'center',
      flex: 1,
    };
  });

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
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
          pageSize={pageSize}
          onRowDoubleClick={(params) => console.log(params.row)}
          getRowId={(row) => row.id || rows.indexOf(row)}
          pagination
          paginationMode="client"
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          sortingOrder={['asc', 'desc']}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default AppModalTable;
