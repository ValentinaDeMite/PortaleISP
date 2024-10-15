/*ottima
import React from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AppSidebar = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <Box
      sx={{
        height: '100%',
        
        '& .pro-sidebar': {
          background: 'transparent !important', 
          border: 'none !important',
        },
        '& .pro-sidebar-inner': {
          background: 'transparent !important', 
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important', 
        },
        '& .pro-inner-item:hover': {
          background: 'rgba(255, 255, 255, 0.7) !important',
          borderRadius: '5px', 
        },
        '& .pro-inner-item.active': {
          backgroundColor: 'rgba(255, 255, 255, 0.7) !important', 
          borderRadius: '5px',
        },
        '& .pro-inner-item': {
          padding: '5px 10px', 
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIcon /> : undefined}
            style={{
              color: 'white',
              margin: '10px 0 20px 0',
            }}
           
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{
                    color: 'white',
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <MenuItem icon={<HomeIcon />} style={{ color: 'white' }}>
            Home
          </MenuItem>
          <MenuItem icon={<DashboardIcon />} style={{ color: 'white' }}>
            Dashboard
          </MenuItem>
          <MenuItem icon={<FeedbackOutlinedIcon />} style={{ color: 'white' }}>
            Richieste
          </MenuItem>
          <MenuItem icon={<InsertChartOutlinedIcon />} style={{ color: 'white' }}>
            Stock
          </MenuItem>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AppSidebar;
*/




//

import React, { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';  
import HomeIcon from '@mui/icons-material/HomeOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircleIcon from '@mui/icons-material/Circle'; 
import mvs_nobg from '../assets/img/mvs_nobg.png';
import logo_intesa_san_paolo_2 from "../assets/img/logo_intesa_san_paolo_2.png";
import logo_s_isp from "../assets/img/logo_s_isp.png"; 

const AppSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();  

  const handleIconClick = () => {
    if (isDropdownOpen) {
      setDropdownOpen(false);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Box
      sx={{
        height: '95vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        '& .pro-sidebar': {
          backgroundColor: 'transparent !important', 
          border: 'none !important',
        },
        '& .pro-sidebar-inner': {
          backgroundColor: 'transparent !important', 
          border: 'none !important',
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important', 
        },
        '& .pro-inner-item': {
          padding: '5px 10px', 
          borderRadius: '8px',
        },
        '& .pro-menu': {},
        '& .pro-item-content :hover': {
          fontWeight: 600,
          color: 'white',
        },
        '& .pro-inner-item:hover:not(.MuiCollapse-wrapperInner *)': {
          backgroundColor: 'rgba(217, 217, 217, 0.7)',
          color: 'white',
        },
        '& .pro-inner-item.active': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}> 
        <Box
          style={{
            width: isCollapsed ? '80px' : '220px', 
            height: '100%',
            transition: 'width 0.3s ease', 
          }}
        >
        
          {/* Logo */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            sx={{
              height: '15%',
              width: '100%',
              transition: 'height .8s ease',
            }}
          >
            {/* Sidebar chiusa */}
            <a href="https://www.intesasanpaolo.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={logo_s_isp}
                alt="Logo ISP"
                style={{
                  width: '60px',  // Ristretto
                  height: '60px', // Ristretto
                  display: isCollapsed ? 'block' : 'none', 
                }}
              />
            </a>

            {/* Sidebar aperta */}
            <a href="https://www.intesasanpaolo.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={logo_intesa_san_paolo_2}
                alt="Logo ISP"
                style={{
                  width: '180px',  // Ristretto
                  height: '80px',  // Ristretto
                  display: isCollapsed ? 'none' : 'block', 
                }}
              />
            </a>
          </Box>

          <Menu iconShape="square">
            <Box sx={{ height: '100%', transition: 'width 0.3s ease' }}>
              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{ 
                      backgroundColor: '#ff9800', 
                      color: 'white',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '18px', sm: '20px', md: '26px' },  // Bilanciamento
                      }
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                }
                onClick={() => navigate("/homepage")} 
              >
                {!isCollapsed && (
                  <Typography
                    sx={{
                      fontFamily: '"Poppins" !important',
                      fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento dei font
                    }}
                  >
                    Home
                  </Typography>
                )}
              </MenuItem>

              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{ 
                      backgroundColor: '#ff9800', 
                      color: 'white',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '18px', sm: '20px', md: '26px' },  // Bilanciamento
                      }
                    }}
                  >
                    <DashboardIcon />
                  </IconButton>
                }
                onClick={() => navigate("/dashboard")}  
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Poppins" !important',
                        fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento dei font
                      }}
                    >
                      Dashboard
                    </Typography>
                    {isDropdownOpen ? (
                      <KeyboardArrowUpIcon
                        sx={{ 
                          color: 'white', 
                          cursor: 'pointer',
                          fontSize: { xs: '18px', sm: '20px', md: '26px' },  // Bilanciamento
                        }}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ 
                          color: 'white', 
                          cursor: 'pointer',
                          fontSize: { xs: '18px', sm: '20px', md: '26px' },  // Bilanciamento
                        }}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                      />
                    )}
                  </Box>
                )}
              </MenuItem>

              <Collapse in={isDropdownOpen}>
                <Box sx={{ backgroundColor: 'transparent' }}>
                  <MenuItem
                    onClick={() => navigate('/nuovo-progetto')}
                    style={{ color: 'white', display: 'flex', alignItems: 'center' }}
                  >
                    <CircleIcon sx={{ 
                      color: 'white', 
                      marginRight: '10px', 
                      fontSize: { xs: '8px', sm: '10px', md: '12px' },  // Bilanciamento
                    }} />
                    <Typography
                      sx={{
                        fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento del testo
                      }}
                    >
                      Nuovo Progetto
                    </Typography>
                  </MenuItem>
                </Box>
              </Collapse>

              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{ 
                      backgroundColor: '#ff9800', 
                      color: 'white',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '18px', sm: '20px', md: '26px' },  // Bilanciamento
                      }
                    }}
                  >
                    <FeedbackOutlinedIcon />
                  </IconButton>
                }
                onClick={() => navigate("/richieste")}
              >
                {!isCollapsed && (
                  <Typography
                    sx={{
                      fontFamily: '"Poppins" !important',
                      fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento dei font
                    }}
                  >
                    Richieste
                  </Typography>
                )}
              </MenuItem>

              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{ 
                      backgroundColor: '#ff9800', 
                      color: 'white',
                      '& .MuiSvgIcon-root': {
                        fontSize: { xs: '18px', sm: '20px', md: '26px' },  // Bilanciamento
                      }
                    }}
                  >
                    <InsertChartOutlinedIcon />
                  </IconButton>
                }
                onClick={() => navigate("/stock")}
              >
                {!isCollapsed && (
                  <Typography
                    sx={{
                      fontFamily: '"Poppins" !important',
                      fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento dei font
                    }}
                  >
                    Stock
                  </Typography>
                )}
              </MenuItem>
            </Box>
          </Menu>
        </Box>

        <Box
          style={{
            width: isCollapsed ? '80px' : '220px',
            transition: 'width 0.5s ease',
            marginTop: 'auto',
          }}
        >
          <Menu>
            <MenuItem
              style={{ color: 'white' }}
              icon={
                <IconButton
                  onClick={handleIconClick}
                  sx={{ 
                    backgroundColor: 'white', 
                    color: 'white',
                    '& img': {
                      width: { xs: '16px', sm: '18px', md: '20px' },  // Bilanciamento delle immagini
                      height: { xs: '16px', sm: '18px', md: '20px' },  // Bilanciamento delle immagini
                    }
                  }}
                >
                  <img src={mvs_nobg} alt="contatti MVS" />
                </IconButton>
              }
              onClick={() => navigate("/contatti")}
            >
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontFamily: '"Poppins" !important',
                    fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento dei font
                  }}
                >
                  Contatti
                </Typography>
              )}
            </MenuItem>

            <MenuItem
              style={{ color: 'white', pointerEvents: 'none', backgroundColor: 'transparent' }}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            >
              <Typography
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  visibility: isCollapsed ? 'hidden' : 'visible',
                  height: '15px',
                  transition: 'opacity 0.5s ease, visibility 0.5s ease',
                  fontSize: { xs: '10px', sm: '12px', md: '14px' }, // Bilanciamento dei font
                  fontWeight: 200,
                }}
              >
                MVS Italy © 2024
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </ProSidebar>
    </Box>
  );
};

export default AppSidebar;
