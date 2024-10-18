import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiRest from '../../service-API/ApiRest';
import AppTable from "../../components/AppTable";
import { Box, Typography, CircularProgress } from '@mui/material'; // Importa CircularProgress
import projectsData from '../../service-API/projects.json';

const Dashboard = (props) => {
  const [columnDefs, setColumnDefs] = useState([]); // Colonne
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const date = useSelector((state) => state.date);
  const projects = useSelector((state) => state.projects);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ref = useRef();

  // Funzione per controllare chiavi duplicate
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

  useEffect(() => {
    if (projects && Array.isArray(projects.values)) {
      checkForDuplicateKeys(projects.values);
    } else {
      console.warn('projects.values is not an array or is undefined', projects);
    }
  }, [projects]);

  // Funzione per convertire i tipi di colonne
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

  // Funzione per impostare le colonne in base ai campi
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

  // Effetto per caricare i dati della dashboard
  useEffect(() => {
    const getDashboard = async () => {
      setLoading(true); // Imposta lo stato di caricamento
      try {
        const api = new ApiRest();
        const data = await api.getDashboard(token); // Chiamata API per ottenere i dati
        dispatch({ type: 'set', payload: { date: new Date().getTime(), projects: data.values } });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: 'set', payload: { fieldsProject: columns } });
      } catch (error) {
        console.error("API error, using mocked data", error);
        const columns = setColumns(projectsData.fields.map(field => Object.values(field)[0]));
        setColumnDefs(columns);
        dispatch({ type: 'set', payload: { projects: projectsData.values, fieldsProject: columns } });
      } finally {
        setLoading(false); // Fine del caricamento
      }
    };

    getDashboard();
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
      {/* Mostra CircularProgress se lo stato di caricamento è true */}
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

      {/* Box con grandezza fissa per le scritte */}
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
                xs: '0.5rem',   // Schermi molto piccoli
                sm: '0.8rem',    // Schermi piccoli
                md: '1rem',      // Schermi medi
                lg: '1rem',      // Schermi grandi
                xl: '1.2rem',    // Schermi extra-grandi
              },
            }}
          >
            Dashboard - Lista di tutti i progetti
          </Typography>
          <Typography
            variant="subtitle1"
            align="start"
            color="textSecondary"
            gutterBottom
            sx={{
              fontSize: {
                xs: '0.5rem',   // Schermi molto piccoli
                sm: '0.7rem',   // Schermi piccoli
                md: '0.8rem',   // Schermi medi
                lg: '0.9rem',   // Schermi grandi
                xl: '1rem',     // Schermi extra-grandi
              },
            }}
          >
            Last update: {date !== undefined
              ? new Date(date).toLocaleString('it-IT', { hour12: false })
              : '--/--/----, --:--:--'}
          </Typography>
        </Box>
      )}

      {/* Tabella che si adatta allo spazio rimanente */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {!loading && (  // Mostra la tabella solo quando il caricamento è completato
          <AppTable ref={ref} columns={columnDefs} rows={projects || []} useChips={true} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
