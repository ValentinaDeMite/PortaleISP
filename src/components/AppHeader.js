import React, { useState, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ApiRest from "../service-API/ApiRest";
import { useDispatch, useSelector } from "react-redux";

function AppHeader() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [iconColor, setIconColor] = useState("#777");
  const [visitedDashboard, setVisitedDashboard] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIconColor("#ff9800");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIconColor("#777");
  };

  const handleBreadcrumbClick = (event, to) => {
    event.preventDefault();
    if (to === "/nuovo-progetto" && !visitedDashboard) {
      alert("Devi passare prima dalla Dashboard!");
      navigate("/dashboard");
    } else {
      navigate(to);
    }
  };

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setVisitedDashboard(true);
    }
  }, [location.pathname]);

  const formatBreadcrumbName = (name) => {
    if (name === "projectitems") {
      return "Dettagli Progetto";
    }
    return name
      .replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleLogout = async () => {
    try {
      const api = new ApiRest();
      await api.logout(token); // Effettua la chiamata API per il logout
    } catch (error) {
      console.error("Errore durante il logout:", error);
    } finally {
      // Rimuove i dati dallo stato Redux
      dispatch({ type: "set", info: "" });

      Cookies.remove("LtpaToken", { path: "", domain: ".mvsitaly.com" });

      navigate("/login");
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator=" / "
          sx={{
            fontSize: {
              xs: "0.6rem",
              sm: "0.7rem",
              md: "0.8rem",
              lg: "0.9rem",
              xl: "1rem",
            },
            fontFamily: "Poppins!important",
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/homepage"
            onClick={(event) => handleBreadcrumbClick(event, "/homepage")}
          >
            Home
          </Link>

          {location.pathname === "/nuovo-progetto" && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to="/dashboard"
              onClick={(event) => handleBreadcrumbClick(event, "/dashboard")}
            >
              Dashboard
            </Link>
          )}

          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            if (value === "homepage") {
              return null;
            }

            return (
              <Link
                underline="true"
                color={index === pathnames.length - 1 ? "#4BA83D" : "inherit"}
                fontWeight="700"
                component={RouterLink}
                to={to}
                key={to}
                aria-current={
                  index === pathnames.length - 1 ? "page" : undefined
                }
                onClick={(event) => handleBreadcrumbClick(event, to)}
              >
                {formatBreadcrumbName(value)}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>

      <Box display="flex" alignItems="center" m="0">
        <IconButton
          id="account-button"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            cursor: "pointer",
          }}
        >
          <AccountCircleOutlinedIcon
            sx={{
              color: iconColor,
              fontSize: {
                xs: "15px",
                sm: "15px",
                md: "18px",
                lg: "20px",
                xl: "25px",
              },
            }}
          />
        </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "account-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              borderRadius: 10,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "5px 10px",
              fontSize: {
                xs: "0.7rem",
                sm: "0.8rem",
                md: "0.9rem",
                lg: "0.9rem",
                xl: "0.9rem",
              },
            },
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{ fontFamily: "Poppins!important" }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default AppHeader;
