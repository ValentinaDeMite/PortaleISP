import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { alpha, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

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

  // Stato per gestire le quantità
  const [quantities, setQuantities] = useState(
    rows.reduce((acc, row) => ({ ...acc, [row[0]]: 0 }), {})
  );

  // Funzione per gestire le modifiche delle quantità
  const handleQuantityChange = (id, value, availableQuantity) => {
    const newValue = Math.min(Math.max(0, value), availableQuantity);
    setQuantities((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  // Funzione per aggiungere gli articoli
  const handleAddClick = () => {
    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalQuantity > 0) {
      onAdd(quantities); // Passa le quantità al metodo `onAdd`
      setQuantities(
        rows.reduce((acc, row) => ({ ...acc, [row[0]]: 0 }), {})
      ); // Resetta le quantità
    } else {
      alert('Inserisci almeno una quantità valida!');
    }
  };

  // Colonna personalizzata per "Allocare"
  const renderAllocateColumn = (params) => {
    const quantity = quantities[params.row[0]] || 0;
    const availableQuantity = params.row[9]; // Quantità disponibile

    return (
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          size="small"
          type="number"
          value={quantity}
          onChange={(e) =>
            handleQuantityChange(params.row[0], parseInt(e.target.value) || 0, availableQuantity)
          }
          InputProps={{
            inputProps: {
              min: 0,
              max: availableQuantity,
              step: 1,
              onKeyDown: (event) => {
                if (quantity >= availableQuantity && event.key === 'ArrowUp') {
                  event.preventDefault();
                }
              },
            },
          }}
          sx={{
            width: {
              xs: '40px',
              sm: '45px',
              md: '50px',
              lg: '55px',
              xl: '60px',
            },
            '& input': {
              textAlign: 'center',
              fontSize: {
                xs: '0.6rem',
                sm: '0.65rem',
                md: '0.7rem',
                lg: '0.75rem',
                xl: '0.8rem',
              },
            },
          }}
        />
      </Box>
    );
  };

  // Aggiorna le colonne per includere "Allocare"
  const updatedColumns = columns.map((col) => {
    if (col.headerName === 'Stato' || col.headerName === 'Stato singolo Item ') {
      return {
        ...col,
        headerAlign: 'center',
        renderCell: (params) => <Chip label={params.value} color="success" />,
      };
    }

    return {
      ...col,
      headerAlign: 'center',
      flex: 1,
    };
  });

  updatedColumns.push({
    field: 'allocate',
    headerName: 'Allocare',
    flex: 1,
    headerAlign: 'center',
    renderCell: (params) => renderAllocateColumn(params),
    sortable: false,
    filterable: false,
    align: 'center',
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
          }}          rows={rows}
          columns={updatedColumns}
          pageSize={pageSize}
          getRowId={(row) => row[0]} // Usa la prima colonna come ID
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
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF8700',
            '&:hover': {
              backgroundColor: '#323232',
            },
          }}
          onClick={handleAddClick} // Gestione dell'aggiunta
        >
          <Typography
            sx={{
              fontSize: {
                xs: '0.6rem',
                sm: '0.7rem',
                md: '0.8rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
              fontFamily: 'Poppins!important',
            }}
          >
            Aggiungi
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default AppModalTable;
