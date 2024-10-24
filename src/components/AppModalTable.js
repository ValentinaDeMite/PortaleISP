import React, { useState, useEffect } from 'react'; 
import { Box, Stack, TextField, Button, Typography } from '@mui/material'; 
import { styled } from '@mui/material/styles'; 
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium'; 
import StockData from '../service-API/stock.json';

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
    backgroundColor: theme.palette.primary.light,
  },
  [`& .MuiDataGrid-row.Mui-selected`]: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const AppModalTable = ({ columns, row, onAdd }) => {
  const [quantities, setQuantities] = useState({});
  const apiRef = useGridApiRef();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowGroupingModel, setRowGroupingModel] = useState([]);
  const getRowId = (row) => {
    return row.id || row.uniqueKey || rows.indexOf(row);
  };


  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: value,
    });
  };

  const handleAdd = (id) => {
    const quantity = quantities[id] || 0;
    onAdd(id, quantity);
  };

  const stockColumnDefs = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Azioni',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <TextField
            type="number"
            size="small"
            label="QTY"
            value={quantities[params.row.id] || ''}
            onChange={(e) => handleQuantityChange(params.row.id, e.target.value)}
            sx={{ width: '60px' }}
          />
          
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Tabella Stock
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <StripedDataGrid
          apiRef={apiRef}
          rows={rows}
          columns={stockColumnDefs}
          rowHeight={40}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-columnHeaderTitle': {
              fontFamily: 'Poppins !important',
            },
            '& .MuiDataGrid-cell': {
              textAlign: 'center',
              fontFamily: 'Poppins !important',
            },
          }}
          getRowId={(row) => row.id}
          pagination
          paginationMode="client"
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          pageSizeOptions={[10, 25, 50]}
          sortingOrder={['asc', 'desc']}
          checkboxSelection={false}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
        />
      </Box>
    </Box>
  );
};

export default AppModalTable;
