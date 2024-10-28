import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiRest from '../service-API/ApiRest';
import AppTable from "../components/AppTable";
import { Box, Typography, CircularProgress, TextField, InputAdornment, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import * as XLSX from 'xlsx';
import RequestsData from '../service-API/request.json';

const RequestList = (props) => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const date = useSelector((state) => state.date);
  const stock = useSelector((state) => state.request || RequestsData.values);
  const token = useSelector((state) => state.request);
  const dispatch = useDispatch();
  const ref = useRef();

  const filteredRequests = Array.isArray(stock)
    ? stock.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRequests); 
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
    XLSX.writeFile(workbook, 'lista_richieste.xlsx');
  };

  const convertTypeColumn = (type) => {
    switch (type) {
      case 'T':
        return 'text';
      case 'N':
        return 'number';
      case 'D':
        return 'date';
      case 'B':
        return 'button';
      default:
        return 'text';
    }
  };

  const setColumns = (fields) => {
    return fields
      .filter(field => field.show)
      .map((field) => ({
        field: field.forcount.toString(),
        headerName: field.name,
        width: field.type === 'N' ? 60 : props.isModal ? 200 : 250,
        type: convertTypeColumn(field.type),
        editable: field.editable,
      }));
  };

  useEffect(() => {
    const getRequests = async () => {
      setLoading(true);
      try {
        const api = new ApiRest();
        const data = await api.getRequests(token);
        dispatch({ type: 'set', payload: { date: new Date().getTime(), stock: data.values } });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: 'set', payload: { fieldsStock: columns } });
      } catch (error) {
        console.error("API error, using mocked data", error);
        const columns = setColumns(RequestsData.fields.map(field => Object.values(field)[0]));
        setColumnDefs(columns);
        dispatch({ type: 'set', payload: { stock: RequestsData.values, fieldsRequests: columns } });
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, [dispatch, token]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Box
          sx={{
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h5"
            align="start"
            gutterBottom
            sx={{
              fontSize: {
                xs: '0.5rem',
                sm: '0.8rem',
                md: '1rem',
                lg: '1.2rem',
                xl: '1.5rem',
              },
            }}
          >
            Lista Richieste
          </Typography>
          <Typography
            variant="subtitle1"
            align="start"
            color="textSecondary"
            gutterBottom
            sx={{
              fontSize: {
                xs: '0.4rem',
                sm: '0.5rem',
                md: '0.7rem',
                lg: '0.8rem',
                xl: '0.9rem',
              },
            }}
          >
            Ultimo aggiornamento: {date !== undefined
              ? new Date(date).toLocaleString('it-IT', { hour12: false })
              : '--/--/----, --:--:--'}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginY: 5,
              paddingX:2
            }}
          >
            <TextField
              variant="standard"
              placeholder="Cerca"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgb(27, 158, 62, .9)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '20%',
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
                  color: 'orange',
                  cursor: 'pointer',
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
                }}
                onClick={exportToExcel}  
              />
            </Tooltip>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {!loading && (
          <AppTable
            ref={ref}
            columns={columnDefs}
            rows={filteredRequests || []} 
            useChips={false}
            showAddItem={true}
          />
        )}
      </Box>
    </Box>
  );
};
export default RequestList;