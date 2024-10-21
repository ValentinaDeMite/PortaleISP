import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiRest from '../service-API/ApiRest';
import AppTable from "../components/AppTable";
import { Box, Typography, CircularProgress } from '@mui/material'; 
import StockData from '../service-API/stock.json';

const Stock = (props) => {
  const [columnDefs, setColumnDefs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const date = useSelector((state) => state.date);
  const stock = useSelector((state) => state.stock || StockData.values);
  const stockFields = useSelector((state) => state.stockFields);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ref = useRef();

  const checkForDuplicateKeys = (rows) => {
    if (!Array.isArray(rows)) {
      console.warn('rows is not an array:', rows);
      return;
    }
    const seen = new Set();
    rows.forEach((row) => {
      const key = row[0];
      if (seen.has(key)) {
        console.warn(`Duplicate key found: ${key}`);
      } else {
        seen.add(key);
      }
    });
  };

  const saveFilters = () => {
    let state = ref.current.savestate();
    localStorage.setItem('stockFilters', JSON.stringify(state));
  };

  const loadFilters = () => {
    const state = localStorage.getItem('stockFilters');
    if (state) {
      const parsedState = JSON.parse(state);
    }
  };
  

  useEffect(() => {
    if (Stock && Array.isArray(stock.values)) {
      checkForDuplicateKeys(Stock.values);
    } else {
      console.warn('Stock.values is not an array or is undefined', Stock);
    }
  }, [Stock]);

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
        hide: !(field.show || (props.isModal && field.name === 'Allocare')),
        type: convertTypeColumn(field.type),
        editable: field.editable,
      }));
  };

  useEffect(() => {
    const getStock = async () => {
      setLoading(true); 
      try {
       const api = new ApiRest();
       const data = await api.getStock(token); 
        dispatch({ type: 'set', payload: { date: new Date().getTime(), stock: data.values } });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: 'set', payload: { fieldsStock: columns } });
      } catch (error) {
        console.error("API error, using mocked data", error);
        const columns = setColumns(StockData.fields.map(field => Object.values(field)[0]));
        setColumnDefs(columns);
        dispatch({ type: 'set', payload: { stock: StockData.values, fieldsStock: columns } });
      } finally {
        setLoading(false); 
      }
    };

    getStock();
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
            minHeight: '5%',
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
                lg: '1rem',      
                xl: '1.2rem',    
              },
            }}
          >
            Stock - Lista items disponibili
          </Typography>
          <Typography
            variant="subtitle1"
            align="start"
            color="textSecondary"
            gutterBottom
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
            Last update: {date !== undefined
              ? new Date(date).toLocaleString('it-IT', { hour12: false })
              : '--/--/----, --:--:--'}
          </Typography>
        </Box>
      )}

    
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {!loading && ( 
          <AppTable ref={ref} columns={columnDefs} rows={stock || []} useChips={false} />
        )}
      </Box>
    </Box>
  );

};

export default Stock;