import React, { Suspense } from 'react';
import { Container, CircularProgress, Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../routes'; // Importa le rotte configurate

const AppContent = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p="30px 40px">
      <Suspense fallback={<CircularProgress color="primary" />}>
        <Routes>
          {routes.map((route, idx) => (
            route.component && (
              <Route
                key={route.path || idx} 
                path={route.path}
                element={<route.component />} 
              />
            )
          ))}

          {/* Reindirizza dalla root a /homepage */}
          <Route path="/" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

export default React.memo(AppContent);
