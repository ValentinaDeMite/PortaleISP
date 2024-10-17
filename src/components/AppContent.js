import React, { Suspense } from 'react';
import { Container, CircularProgress, Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../routes'; 

const AppContent = () => {
  return (
    <Box display="flex" justifyContent="space-between"  height='100%' width="100%" >
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
