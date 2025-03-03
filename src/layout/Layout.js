import React, { useState } from "react";
import { Box } from "@mui/material";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import AppContent from "../components/AppContent";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        width: "98vw",
        height: "95vh",
        margin: "auto",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: {
            sm: isCollapsed ? "80px" : "200px",
            md: isCollapsed ? "100px" : "200px",
            lg: isCollapsed ? "100px" : "220px",
            xl: isCollapsed ? "100px" : "240px",
          },
          transition: "width 0.3s ease",
          flexShrink: 0,
        }}
      >
        <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: "white",
          borderRadius: "15px",
          boxSizing: "border-box",
          padding: "2% 2%",
          gap: "2%",
        }}
      >
        {/* AppHeader */}
        <Box
          sx={{
            flexShrink: 0,
            height: "5%",
            paddingBottom: "0.7%",
            boxShadow: "0px 6px 6px -6px rgba(0, 0, 0, 0.2)",
          }}
        >
          <AppHeader />
        </Box>

        {/* AppContent with Outlet for nested routes */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <AppContent>
            <Outlet /> {/* Le route figlie saranno renderizzate qui */}
          </AppContent>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
