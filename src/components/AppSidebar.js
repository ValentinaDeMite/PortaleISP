import React, { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Hook per navigazione dinamica
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
  const navigate = useNavigate();  // Inizializzazione del hook useNavigate
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
        width:'100%',
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
        '& .pro-menu': {
        },
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
            {/* Logo per sidebar chiusa */}
            <a href="https://www.intesasanpaolo.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={logo_s_isp}
                alt="Logo ISP"
                style={{
                  width: '70px',
                  height: '70px',
                  display: isCollapsed ? 'block' : 'none', 
                }}
              />
            </a>
            {/* Logo per sidebar aperta */}
            <a href="https://www.intesasanpaolo.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={logo_intesa_san_paolo_2}
                alt="Logo ISP"
                style={{
                  width: '200px',
                  height: '100px',
                  display: isCollapsed ? 'none' : 'block', 
                }}
              />
            </a>
          </Box>
          <Menu iconShape="square">
            <Box sx={{
               height: '%',
               transition: 'width 0.3s ease', 
            }}>
              {/* Home */}
              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton onClick={handleIconClick} sx={{ backgroundColor: '#ff9800', 
                    color: 'white',
                    transition: 'height .8s ease',
                    '&:hover': {
                      backgroundColor: '#ff9800', 
                    }, }}
                  >
                    <HomeIcon />
                  </IconButton>
                }
                onClick={() => navigate("/homepage")} 
              >
                {!isCollapsed && <Typography>Home</Typography>}
              </MenuItem>
              {/* Dashboard */}
              <MenuItem
                style={{
                  color: 'white',
                  margin: '10px 0',
                  backgroundColor: isDropdownOpen ? 'rgba(217, 217, 217, 0.7)' : 'transparent',
                  borderRadius: '8px',
                }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#ff9800',
                      },
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
                    sx={{
                      width: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontFamily: '"Poppins" !important',
                        fontSize: 15,
                      }}
                    >
                      Dashboard
                    </Typography>
                    {isDropdownOpen ? (
                      <KeyboardArrowUpIcon
                        sx={{ color: 'white', cursor: 'pointer', margin: 0 }}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ color: 'white', cursor: 'pointer' }}
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
                    <div>
                      <CircleIcon
                        sx={{ color: 'white', marginRight: '10px', fontSize: '10px' }}
                      />
                      Nuovo Progetto
                    </div>
                  </MenuItem>
                </Box>
              </Collapse>
              {/* Richieste */}
              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#ff9800',
                      },
                    }}
                  >
                    <FeedbackOutlinedIcon />
                  </IconButton>
                }
                onClick={() => navigate("/richieste")}  
              >
                {!isCollapsed && <Typography>Richieste</Typography>}
              </MenuItem>
              {/* Stock */}
              <MenuItem
                style={{ color: 'white', margin: '10px 0' }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#ff9800',
                      },
                    }}
                  >
                    <InsertChartOutlinedIcon />
                  </IconButton>
                }
                onClick={() => navigate("/stock")}
              >
                {!isCollapsed && <Typography>Stock</Typography>}
              </MenuItem>
            </Box>
            
          </Menu>
        </Box>
        {/* Account */}
        <Box
          style={{
            width: isCollapsed ? '80px' : '220px',
            transition: 'width 0.5s ease',
            marginTop: 'auto',
          }}
        >
          <Menu>
            <MenuItem
              style={{ color: 'white'}}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: 'white',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                    }}
                  >
                    <img
                      src={mvs_nobg}
                      alt="contatti MVS"
                      style={{ width: '24px', height: '24px' }}
                    />
                  </IconButton>
              }
              onClick={() => navigate("/contatti")} 
            >
              {!isCollapsed && <Typography>Contatti</Typography>}
            </MenuItem>
            <MenuItem
                style={{
                  color: 'white',
                  pointerEvents: 'none', 
                  backgroundColor: 'transparent', 
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <Typography
                  
                  sx={{
                    opacity: isCollapsed ? 0 : 1, 
                    visibility: isCollapsed ? 'hidden' : 'visible',  
                    height: '15px', 
                    transition: 'opacity 0.5s ease, visibility 0.5s ease',
                    fontWeight:'200',
                    fontSize:'13px',
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