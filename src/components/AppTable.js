import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import Chip from '@mui/material/Chip';
import { green, red, orange, blue, grey } from '@mui/material/colors';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Tooltip from '@mui/material/Tooltip';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

// Stato e colore dei chip
const statusMapping = {
  'OPN': { label: 'Open', color: green[500] },
  'CLS': { label: 'Closed', color: red[500] },
  'PEN': { label: 'Pending', color: orange[500] },
  'NEW': { label: 'New', color: blue[500] },
  'default': { label: 'Unknown', color: grey[500] },
};

// Funzione per il rendering dei chip dinamici
const StatusChip = ({ status }) => {
  const chipProps = statusMapping[status]
    ? { label: statusMapping[status].label, style: { backgroundColor: statusMapping[status].color, color: 'white' } }
    : { label: statusMapping['default'].label, style: { backgroundColor: statusMapping['default'].color, color: 'white' } };
  return <Chip {...chipProps} />;
};

// Tabella con colori alternati per le righe
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
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
  [`& .MuiDataGrid-row.Mui-selected`]: {
    backgroundColor: alpha(
      theme.palette.primary.main,
      0.4,
    ),
    '&:hover': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        0.6,
      ),
      '@media (hover: none)': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          0.4,
        ),
      },
    },
  },
}));

function Table2({ columns, rows, useChips = false }) {
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);  
  const [page, setPage] = useState(0); 

  const apiRef = useGridApiRef(); 

  // Stato per il raggruppamento delle righe
  const [rowGroupingModel, setRowGroupingModel] = useState([]); 

  // Funzione per il filtraggio dei dati
  const filteredRows = rows.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Funzione per esportare in excel le righe selezionate
  const exportToExcel = () => {
    const selectedRows = filteredRows.filter((row) =>
      rowSelectionModel.includes(getRowId(row))
    );   
    if (selectedRows.length === 0) {
      alert('Seleziona almeno una riga da esportare');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(selectedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'selezione_tabella_dati.xlsx');
  };

  const getRowId = (row) => {
    return row.id || row.uniqueKey || rows.indexOf(row);
  };

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  // Verifica se il raggruppamento è attivo
  const isGroupingActive = rowGroupingModel.length > 0;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          variant="standard"
          placeholder="Cerca"
          fullWidth
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgb(27, 158, 62, .9)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            marginY: 3.5,
            width: '20%',
            "& .MuiInput-root": {
              borderBottom: '1px solid rgb(27, 158, 62, .5)',
              "&:before": {
                borderBottom: '1px solid rgb(27, 158, 62, .5)',
              },
              "&:after": {
                borderBottom: '2px solid rgb(27, 158, 62, .8)',
              },
              ":hover:not(.Mui-focused)": {
                "&:before": {
                  borderBottom: '2px solid rgb(27, 158, 62, .9)',
                },
              },
            }
          }}
        />
        <Tooltip title='Scarica in formato Excel'>
          <DownloadForOfflineRoundedIcon
            sx={{
              color: orange[500],
              marginX: '.5em',
              marginY: '.5em',
              fontSize: '40px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              cursor: 'pointer',
            }}
            onClick={exportToExcel}
          />
        </Tooltip>
      </Box>

      <StripedDataGrid
        autoHeight
        rowHeight={40}
        apiRef={apiRef}
        sx={{
          boxShadow: 2,
          '& p': {
            marginTop: 2,
          },
          '& .MuiDataGrid':{
            fontFamily: 'Poppins !important',
          },
          '& .MuiDataGrid-columnHeaderRow': {
            textAlign: 'center',
            color:'white !important'
          },
          '& .MuiDataGrid-columnHeaderTitleContainerContent':{
            color:'white'
          },

          '& .MuiDataGrid-columnHeaderRow>.MuiButtonBase-root':{
            color:'white'

          },

          '& .MuiDataGrid-container--top [role=row]': {
            backgroundColor: 'rgb(75, 168, 61, .9) !important',
          },

          '& .MuiDataGrid-withBorderColor':{
            backgroundColor: 'rgb(75, 168, 61, .9) !important',
          },
          '& .MuiTablePagination-root':{
            color:'white'
          },
          '& .MuiTablePagination-selectIcon ':{
            color:'white !important'

          },

          '& .MuiDataGrid-cell': {
            textAlign: 'center',
          },
          '& .MuiDataGrid-sortIcon': {
            color: 'white',
            opacity: '.9 !important'
          },
          '& .MuiDataGrid-menuIconButton': {
            color: 'white',
            opacity: '.9 !important',
          },
          '& .MuiDataGrid-topContainer ': {
            textAlign: 'center !important',
          },
          '&.MuiDataGrid-virtualScrollerContent':{
            height:'100%'
          },
         
        }}
        rows={filteredRows}
        columns={columns.map((col) => ({
          ...col,
          headerAlign: 'center',
          flex:  1,
          renderCell: (params) => {
           
            if (isGroupingActive) return params.value;

            if (['3', '4', '8', '9', '10'].includes(col.field)) {
              return (
                <Tooltip title={params.value || 'N/A'} placement="top">
                  <span>{params.value}</span>
                </Tooltip>
              );
            }
            if (col.field === '1' && useChips) {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    
                  }}>
                  <StatusChip status={params.value} />
                </Box>
              );
            } else if (col.field === '15') {
              if (params.value === '1') {
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                      <Tooltip title="Richieste Pending">
                        <NotificationImportantIcon
                          sx={{
                            color: blue[500],
                            fontSize: '25px',
                            cursor: 'pointer',
                            margin: 'auto',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.2)',
                            },
                          }}
                          onClick={() => alert(`Richieste Pending ID: ${params.row[0]}`)}
                        />
                      </Tooltip>
                    </div>
                  </Box>
                );
              } else {
                return  <div>
                          <Tooltip title="Nessuna richiesta pendente">
                            <NotificationsOffIcon
                              sx={{
                                color: blue[500],
                                fontSize: '25px',
                                cursor: 'pointer',
                                margin: 'auto',
                                textAlign: 'center',
                                marginTop:'4px'
                              }}
                            />
                          </Tooltip>
                        </div>;
              }
            } else {
              return params.value;
            }
          },
        }))}

        getRowId={getRowId}
        pagination
        paginationMode="client" 
        pageSize={pageSize} 
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} 
        page={page} 
        onPageChange={(newPage) => setPage(newPage)} 
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          rowGrouping: { model: rowGroupingModel }, 
        }}
        pageSizeOptions={[10, 25, 50]}
        sortingOrder={['asc', 'desc']}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        groupRowsByColumn="status" 
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={setRowGroupingModel}
        getRowClassName={(params) => 
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
      />
    </Box>
  );
}

export default Table2;
