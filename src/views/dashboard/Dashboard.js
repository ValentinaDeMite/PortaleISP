/*import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiRest from '../../service-API/ApiRest';
import AppTable from "../../components/AppTable";
import { Box, Container, Typography } from '@mui/material'; // Import da Material-UI
import projects from '../../service-API/projects.json'

const Dashboard = (props) => {
  const [columnDefs, setColumnDefs] = useState([]); // Colonne
  const date = useSelector((state) => state.date);
  const projects = useSelector((state) => state.projects);
  const projectFields = useSelector((state) => state.fieldsProject);
  const token = useSelector((state) => state.token); 
  const dispatch = useDispatch();
  const ref = useRef(); 

  // Funzione per salvare i filtri
  const saveFilters = () => {
    let state = ref.current.savestate();
    localStorage.setItem('dashboardFilters', JSON.stringify(state));
  };

  // Funzione per caricare i filtri
  const loadFilters = () => {
    const state = localStorage.getItem('dashboardFilters');
    if (state) {
      const parsedState = JSON.parse(state);
    }
  };
  
  const checkForDuplicateKeys = (rows) => {
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
    checkForDuplicateKeys(projects.values); 
  }, []);

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
      .map((field, index) => ({
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
      try {
       const api = new ApiRest();
       const data = await api.getDashboard(token); // Chiamata API per ottenere i dati
        dispatch({ type: 'set', date: new Date().getTime() });
        dispatch({ type: 'set', projects: data.values });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: 'set', fieldsProject: columns });
      } catch (error) {
        console.error("API error, using mocked data", error);

        // Usa dati mockati in caso di errore
        const columns = setColumns(projects.fields.map(field => Object.values(field)[0]));
        setColumnDefs(columns);
        dispatch({ type: 'set', projects: projects.values });
        dispatch({ type: 'set', fieldsProject: columns });
      }

      loadFilters(); 
    };

    getDashboard();
  }, [dispatch, token]);

  // Effetto per gestire i filtri alla chiusura o ricaricamento della pagina
  useEffect(() => {
    loadFilters();
    window.addEventListener('beforeunload', saveFilters);
    return () => {
      window.removeEventListener('beforeunload', saveFilters);
    };
  }, []);

  return (
    <Container
      //sx={{ width: props.isModal ? '55vw' : '60vw', marginBottom: '180px' }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard - Lista di tutti i progetti
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Last update:{' '}
        {date !== undefined
          ? new Date(date).toLocaleString('it-IT', { hour12: false })
          : '--/--/----, --:--:--'}
      </Typography>
   
      <AppTable ref={ref} columns={columnDefs} rows={projects || []} useChips={true} />
    </Container>
  );
};

export default Dashboard;
*/

import React from 'react';

const Dashboard = () => {
  return <div>Dashboard</div>;
};

export default Dashboard;