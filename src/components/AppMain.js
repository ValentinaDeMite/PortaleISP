import React from 'react';
import AppHeader from './AppHeader';
import AppContent from './AppContent';



function AppMain() {
  return (
    <div style={{
     height:'70vh'
    }}>
      <AppHeader />
      <AppContent />
    </div>
  );
}

export default AppMain;
