/*import * as React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


// Stato e colore dei chip
const statusMapping = {
  'OPN': { label: 'Open', color: green[500] },
  'CLS': { label: 'Closed', color: red[500] },
  'PEN': { label: 'Pending', color: orange[500] },
  'NEW': { label: 'New', color: blue[500] },
  'default': { label: 'Unknown', color: grey[500] },
};

const StatusChip = ({ status }) => {
  const chipProps = statusMapping[status]
    ? { label: statusMapping[status].label, style: { backgroundColor: statusMapping[status].color, color: 'white' } }
    : { label: statusMapping['default'].label, style: { backgroundColor: statusMapping['default'].color, color: 'white' } };
  return <Chip {...chipProps} 
  sx={{
    fontSize: {
      xs: '0.4rem',  
      sm: '0.5rem', 
      md: '0.6rem', 
      lg: '0.7rem', 
      xl: '0.8rem', 
    },
  }}
  />;
};

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

function Table2({ columns, rows = [], useChips = false }) { 
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);  
  const [page, setPage] = useState(0); 

  const apiRef = useGridApiRef(); 
  const [rowGroupingModel, setRowGroupingModel] = useState([]); 

  const filteredRows = Array.isArray(rows)
    ? rows.filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        );
      })
    : []; 

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

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

  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box 
        display="flex" 
        justifyContent="space-between"
        alignItems='center' 
        mb={2}
        sx={{
          height: '15%',  
        }}
      >
        <TextField
          variant="standard"
          placeholder="Cerca"
          fullWidth
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon 
                  sx={{ 
                    color: 'rgb(27, 158, 62, .9)',
                    fontSize: {
                      xs: '16px',  
                      sm: '18px',  
                      md: '20px',  
                      lg: '22px', 
                      xl: '24px',  
                    }
                  }} 
                />
              </InputAdornment>
            ),
          }}
          sx={{
            marginY: 3.5,
            width: '15%',
            "& .MuiInput-root": {
              fontSize: {
                xs: '0.7rem',  
                sm: '0.75rem',  
                md: '0.8rem',   
                lg: '0.85rem',  
                xl: '0.9rem',   
              },
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
              fontSize: {
                xs: '20px', 
                sm: '25px', 
                md: '30px', 
                lg: '32px', 
                xl: '35px',  
              },
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


      <Box sx={{ height: '80%', width: '100%' }}>  
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={40}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-columnHeaderTitle':{
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
          rows={filteredRows}
          columns={columns.map((col) => ({
            ...col,
            headerAlign: 'center',
            flex: 1,
            renderCell: (params) => {
              if (rowGroupingModel.length > 0) return params.value;
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
                    }}
                  >
                    <StatusChip status={params.value} />
                  </Box>
                );
              } else if (col.field === '15') {
                return params.value === '1' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  </Box>
                ) : (
                  <Tooltip title="Nessuna richiesta pendente">
                    <NotificationsOffIcon
                      sx={{
                        color: blue[500],
                        fontSize: '25px',
                        cursor: 'pointer',
                        margin: 'auto',
                        textAlign: 'center',
                        marginTop: '4px',
                      }}
                    />
                  </Tooltip>
                );
              } else if (col.field === '19') {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Edit">
                            <EditIcon 
                                sx={{ cursor: 'pointer', color: blue[500] }}
                                onClick={() => alert(`Edit ID: ${params.row.id}`)} 
                            />
                        </Tooltip>
                    </Box>
                );
            }
            else if (col.field === '20') {
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Delete">
                            <DeleteIcon 
                                sx={{ cursor: 'pointer', color: red[500] }}
                                onClick={() => alert(`Delete ID: ${params.row.id}`)} 
                            />
                        </Tooltip>
                    </Box>
                );
            }
              
              else {
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
    </Box>
  );
}

export default Table2; 

// giusta
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { green, red, orange, blue, grey } from '@mui/material/colors';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Tooltip from '@mui/material/Tooltip';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

// Stato e colore dei chip
const statusMapping = {
  'OPN': { label: 'Open', color: green[500] },
  'CLS': { label: 'Closed', color: red[500] },
  'PEN': { label: 'Pending', color: orange[500] },
  'NEW': { label: 'New', color: blue[500] },
  'default': { label: 'Unknown', color: grey[500] },
};

const StatusChip = ({ status }) => {
  const chipProps = statusMapping[status]
    ? { label: statusMapping[status].label, style: { backgroundColor: statusMapping[status].color, color: 'white' } }
    : { label: statusMapping['default'].label, style: { backgroundColor: statusMapping['default'].color, color: 'white' } };
  return <Chip {...chipProps} 
  sx={{
    fontSize: {
      xs: '0.4rem',  
      sm: '0.5rem', 
      md: '0.6rem', 
      lg: '0.7rem', 
      xl: '0.8rem', 
    },
  }}
  />;
};

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

function Table2({ columns, rows = [], useChips = false, onRowDoubleClick , action = false }) { 
  const [pageSize, setPageSize] = useState(10);  
  const [page, setPage] = useState(0); 

  const apiRef = useGridApiRef(); 
  const [rowGroupingModel, setRowGroupingModel] = useState([]); 

  const getRowId = (row) => {
    return row.id || row.uniqueKey || rows.indexOf(row);
  };

  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ height: 'auto', width: '100%' }}>  
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={40}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-columnHeaderTitle':{
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
          columns={columns.map((col) => ({
            ...col,
            headerAlign: 'center',
            flex: 1,
            renderCell: (params) => {
              if (rowGroupingModel.length > 0) return params.value;
              
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
                    }}
                  >
                    <StatusChip status={params.value} />
                  </Box>
                );
              }
          
              else if (col.field === '15') {
                return params.value === '1' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  </Box>
                ) : (
                  <Tooltip title="Nessuna richiesta pendente">
                    <NotificationsOffIcon
                      sx={{
                        color: blue[500],
                        fontSize: '25px',
                        cursor: 'pointer',
                        margin: 'auto',
                        textAlign: 'center',
                        marginTop: '4px',
                      }}
                    />
                  </Tooltip>
                );
              }
          
              if (action && col.field === 'actions') {
                return (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',  
                      alignItems: 'center',     
                      height: '100%',           
                    }}
                  >
                    <Tooltip title="Modifica">
                      <IconButton
                        sx={{
                          backgroundColor: '#108CCB',  
                          color: 'white',                  
                          '&:hover': {
                            backgroundColor: '#6CACFF', 
                          },
                        }}
                        onClick={() => alert(`Edit ID: ${params.row.id}`)}
                      >
                        <EditIcon
                          sx={{
                            fontSize: {
                              xl: '16px',  
                              lg: '14px',  
                              md: '12px',  
                              sm: '10px',  
                              xs: '8px',  
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
                          marginLeft: 1,                     
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, .7)',
                          },
                        }}
                        onClick={() => alert(`Delete ID: ${params.row.id}`)}
                      >
                        <DeleteIcon
                          sx={{
                            fontSize: {
                              xl: '16px',  
                              lg: '14px',  
                              md: '12px',  
                              sm: '10px',  
                              xs: '8px',  
                            },
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                );
              } else {
                return params.value;
              }
            },
          }))}
          onRowDoubleClick={(params) => onRowDoubleClick(params.row)} 
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
    </Box>
  );
}

export default Table2; */

import React from 'react';
import { Box } from '@mui/material';
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
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

const AppTable = ({ columns, rows = [], useChips, onRowDoubleClick }) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const apiRef = useGridApiRef();
  const [rowGroupingModel, setRowGroupingModel] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const renderStatusChip = (params) => {
    let chipColor;
    let label;
    switch (params.value) {
      case 'OPN':
        chipColor = 'success';
        label = 'Open';
        break;
      case 'CLS':
        chipColor = 'error';
        label = 'Closed';
        break;
      case 'NEW':
        chipColor = 'primary';
        label = 'New';
        break;
      case 'PEN':
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
        <Chip label={label} color={chipColor} />
      </Box>
    );
  };

  const renderActionButtons = (params) => {
    const handleEditClick = () => {
      console.log("Modifica riga con ID:", params.id);
    };

    const handleDeleteClick = () => {
      console.log("Elimina riga con ID:", params.id);
    };

    return (
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
  };

  const filteredColumns = columns.filter(col => col.headerName !== 'Cancella item');

  const updatedColumns = filteredColumns.map((col) => {
    if (col.headerName === 'Stato' || col.headerName === "Stato singolo Item ") {
      return {
        ...col,
        headerAlign: 'center',
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

    updatedColumns.push({
      field: 'action',
      headerName: 'Action',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => renderActionButtons(params),
      sortable: false,  
      filterable: false, 
      align: 'center',
    });

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
                color: 'red',
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
                color: 'blue',
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
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={40}
          sx={{
            boxShadow: 2,
            '& .MuiDataGrid-columnHeaderTitle':{
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
    </Box>
  );
};

export default AppTable;
