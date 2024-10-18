import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../routes'; 

const AppContent = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ 
        width: '100%', 
        height: '100%', // Fa in modo che il contenitore occupi il 100% dell'AppContent
        flexGrow: 1 
      }}
    >
      <Suspense fallback={<CircularProgress color="primary" />}>
        <Routes>
          {routes.map((route, idx) => (
            route.component && (
              <Route
                key={route.path || idx} 
                path={route.path}
                element={<Box sx={{ width: '100%', height: '100%' }}>
                           <route.component />
                         </Box>} 
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
