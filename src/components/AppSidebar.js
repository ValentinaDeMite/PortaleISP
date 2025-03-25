import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CircleIcon from "@mui/icons-material/Circle";
import mvs_nobg from "../assets/img/mvs_nobg.png";
import logo_intesa_san_paolo_2 from "../assets/img/logo_intesa_san_paolo_2.png";
import logo_s_isp from "../assets/img/logo_s_isp.png";
import logo from "../assets/img/il-tuo-logo-qui-150x150-removebg-preview.png";

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
        height: "95vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        "& .pro-sidebar": {
          backgroundColor: "transparent !important",
          border: "none !important",
        },
        "& .pro-sidebar-inner": {
          backgroundColor: "transparent !important",
          border: "none !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 10px",
          borderRadius: "8px",
        },
        "& .pro-inner-item:hover:not(.MuiCollapse-wrapperInner *)": {
          backgroundColor: "rgba(217, 217, 217, 0.7)",
          color: "white",
        },
        "& .pro-inner-item.active": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        },
        "& .css-1vzr61b-MuiTypography-root": {
          height: "auto !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Box
          style={{
            width: isCollapsed ? "80px" : "220px",
            height: "100%",
            transition: "width 0.3s ease",
          }}
        >
          {/* Logo */}
          {/* <Box
            display="flex"
            alignItems="center"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            sx={{
              height: "15%",
              width: "100%",
              transition: "height .8s ease",
            }}
          >
            <a
              href="https://www.intesasanpaolo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo_s_isp}
                alt="Logo ISP"
                style={{
                  display: isCollapsed ? "block" : "none",
                  width: "70px",
                  height: "70px",
                  "@media (max-width: 1200px)": {
                    width: "50px",
                    height: "50px",
                  },
                  "@media (max-width: 900px)": {
                    width: "40px",
                    height: "40px",
                  },
                  "@media (max-width: 600px)": {
                    width: "35px",
                    height: "35px",
                  },
                }}
              />
            </a>

            <a
              href="https://www.intesasanpaolo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo_intesa_san_paolo_2}
                alt="Logo ISP"
                style={{
                  display: isCollapsed ? "none" : "block",
                  width: "180px",
                  height: "90px",
                  "@media (max-width: 1200px)": {
                    width: "140px",
                    height: "70px",
                  },
                  "@media (max-width: 900px)": {
                    width: "120px",
                    height: "60px",
                  },
                  "@media (max-width: 600px)": {
                    width: "100px",
                    height: "50px",
                  },
                }}
              />
            </a>
          </Box> */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            sx={{
              height: "15%",
              width: "100%",
              transition: "height .8s ease",
            }}
          >
            <a
              href="https://www.intesasanpaolo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                //src={logo_s_isp}
                src={logo}
                alt="Logo ISP"
                style={{
                  display: isCollapsed ? "block" : "none",
                  width: "70px",
                  height: "70px",
                  "@media (max-width: 1200px)": {
                    width: "50px",
                    height: "50px",
                  },
                  "@media (max-width: 900px)": {
                    width: "40px",
                    height: "40px",
                  },
                  "@media (max-width: 600px)": {
                    width: "35px",
                    height: "35px",
                  },
                }}
              />
            </a>

            <a
              //href="https://www.intesasanpaolo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                //src={logo_intesa_san_paolo_2}
                src={logo}
                alt="Logo ISP"
                style={{
                  display: isCollapsed ? "none" : "block",
                  width: "180px",
                  //height: "90px",
                  height: "130px",
                  "@media (max-width: 1200px)": {
                    width: "140px",
                    height: "70px",
                  },
                  "@media (max-width: 900px)": {
                    width: "120px",
                    height: "60px",
                  },
                  "@media (max-width: 600px)": {
                    width: "100px",
                    height: "50px",
                  },
                }}
              />
            </a>
          </Box>
          <Menu iconShape="square">
            <Box sx={{ height: "100%", transition: "width 0.3s ease" }}>
              <MenuItem
                style={{
                  color: "white",
                  margin: "10px 0",
                  fontFamily: "Poppins!important",
                }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                }
              >
                {!isCollapsed && (
                  <Typography
                    onClick={() => navigate("/homepage")}
                    sx={{
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                        lg: "0.9rem",
                        xl: "1rem",
                      },
                      fontFamily: "Poppins!important",
                      "&:hover": {
                        color: "white !important",
                      },
                    }}
                  >
                    Home
                  </Typography>
                )}
              </MenuItem>

              <MenuItem
                style={{
                  color: "white",
                  margin: "10px 0",
                  backgroundColor: isDropdownOpen
                    ? "rgba(217, 217, 217, 0.7)"
                    : "transparent",
                  borderRadius: "8px",
                }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  >
                    <DashboardIcon />
                  </IconButton>
                }
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Typography
                      onClick={() => navigate("/dashboard")}
                      sx={{
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.8rem",
                          md: "0.9rem",
                          lg: "0.9rem",
                          xl: "1rem",
                        },
                        fontFamily: "Poppins!important",
                        "&:hover": {
                          color: "white !important",
                        },
                      }}
                    >
                      Dashboard
                    </Typography>
                    {isDropdownOpen ? (
                      <KeyboardArrowUpIcon
                        sx={{
                          color: "white",
                          cursor: "pointer",
                          margin: 0,
                          "&:hover": {
                            color: "white !important",
                          },
                        }}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{
                          color: "white",
                          cursor: "pointer",
                          "&:hover": {
                            color: "white !important",
                          },
                        }}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                      />
                    )}
                  </Box>
                )}
              </MenuItem>

              <Collapse in={isDropdownOpen}>
                <Box sx={{ backgroundColor: "transparent" }}>
                  <MenuItem
                    onClick={() => navigate("/nuovo-progetto")}
                    style={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                    }}
                    icon={
                      <CircleIcon
                        sx={{
                          color: "white",
                          marginRight: "10px",
                          fontSize: "8px",
                        }}
                      />
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.8rem",
                          md: "0.9rem",
                          lg: "0.9rem",
                          xl: "1rem",
                        },
                        fontFamily: "Poppins!important",
                        "&:hover": {
                          color: "white !important",
                        },
                      }}
                    >
                      Nuovo Progetto
                    </Typography>
                  </MenuItem>
                </Box>
              </Collapse>

              <MenuItem
                style={{ color: "white", margin: "10px 0" }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  >
                    <FeedbackOutlinedIcon />
                  </IconButton>
                }
              >
                {!isCollapsed && (
                  <Typography
                    onClick={() => navigate("/richieste")}
                    sx={{
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                        lg: "0.9rem",
                        xl: "1rem",
                      },
                      fontFamily: "Poppins!important",
                      "&:hover": {
                        color: "white !important",
                      },
                    }}
                  >
                    Richieste
                  </Typography>
                )}
              </MenuItem>

              <MenuItem
                style={{ color: "white", margin: "10px 0" }}
                icon={
                  <IconButton
                    onClick={handleIconClick}
                    sx={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff9800",
                      },
                    }}
                  >
                    <InsertChartOutlinedIcon />
                  </IconButton>
                }
              >
                {!isCollapsed && (
                  <Typography
                    onClick={() => navigate("/stock")}
                    sx={{
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                        lg: "0.9rem",
                        xl: "1rem",
                      },
                      fontFamily: "Poppins!important",
                      "&:hover": {
                        color: "white !important",
                      },
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
            width: isCollapsed ? "80px" : "220px",
            transition: "width 0.5s ease",
            marginTop: "auto",
          }}
        >
          <Menu>
            <MenuItem
              style={{ color: "white" }}
              icon={
                <IconButton
                  sx={{
                    backgroundColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  <img
                    src={mvs_nobg}
                    alt="contatti MVS"
                    style={{ width: "20px", height: "20px" }}
                  />
                </IconButton>
              }
              onClick={() => navigate("/contatti")}
            >
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.65rem",
                      sm: "0.8rem",
                      md: "0.9rem",
                      lg: "0.9rem",
                      xl: "1rem",
                    },
                    fontFamily: "Poppins!important",
                    "&:hover": {
                      color: "white !important",
                    },
                  }}
                >
                  Contatti
                </Typography>
              )}
            </MenuItem>

            <MenuItem
              style={{
                color: "white",
                pointerEvents: "none",
                backgroundColor: "transparent",
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  visibility: isCollapsed ? "hidden" : "visible",
                  height: "15px",
                  transition: "opacity 0.5s ease, visibility 0.5s ease",
                  fontWeight: "200",
                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.7rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                    xl: "0.9rem",
                  },
                }}
              >
                MVS Italy © 2025
              </Typography>
              <Typography
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  visibility: isCollapsed ? "hidden" : "visible",
                  height: "15px",
                  transition: "opacity 0.5s ease, visibility 0.5s ease",
                  fontWeight: "200",
                  fontSize: {
                    xs: "0.65rem",
                    sm: "0.7rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                    xl: "0.9rem",
                  },
                }}
              >
                Versione Demo
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </ProSidebar>
    </Box>
  );
};

export default AppSidebar;
