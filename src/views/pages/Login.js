import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logoIntesa from "../../assets/img/isp-logo-removebg-preview.png";
import logoMvs from "../../assets/img/logo-MVS.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ApiRest from "../../service-API/ApiRest";
import Cookies from "js-cookie";
import logo from "../../assets/img/il-tuo-logo-qui-150x150-removebg-preview.png";

const Login = () => {
  useEffect(() => {
    // sessionStorage.clear();
    localStorage.clear();
    // document.cookie.split(";").forEach((c) => {
    //   document.cookie = c
    //     .replace(/^ +/, "")
    //     .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    // });
    console.log("Pulizia: localStorage.");
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === "" || password === "") {
      setErrorMessage("Username e Password sono obbligatori");
      return;
    }
    try {
      setIsLoading(true);
      const request = new ApiRest();
      const response = await request.login(username, password);

      if (!response.token) {
        setErrorMessage("ID utente o password errati");
        setIsLoading(false);
        return;
      }

      // dispatch({ type: "set", user: response.user });
      // dispatch({ type: "set", token: response.token });
      // localStorage.setItem("selectedProjectId", "");
      // navigate("/homepage");
      dispatch({ type: "set", user: response.user });
      dispatch({ type: "set", token: response.token });
      sessionStorage.setItem("user", response.user);
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("selectedProjectId", "");
      navigate("/homepage");
    } catch (error) {
      setErrorMessage("ID utente o password errati");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100vw",
          height: "50vh",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "#4BA83D",
        }}
      >
        <img
          src={logoIntesa}
          alt="logo intesa"
          style={{ flex: 1, maxWidth: "40%", height: "auto" }}
        />
        {/* <img
          src={logo}
          alt="logo intesa"
          style={{ flex: 1, maxWidth: "20%", height: "auto" }}
        /> */}
        <img
          src={logoMvs}
          alt="mvs logo"
          style={{ flex: 1, maxWidth: "20%", height: "30%" }}
        />
      </Box>

      <Box
        sx={{
          width: "100vw",
          height: "50vh",
          backgroundColor: "#f5f5f5",
        }}
      />

      <Card
        elevation={3}
        sx={{
          maxWidth: "400px",
          width: "90%",
          borderRadius: "12px",
          textAlign: "center",
          padding: "2rem",
          position: "absolute",
          top: "60%",
          transform: "translateY(-50%)",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "Poppins" }}>
            Inserisci la tua User e Password
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="User"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    color="inherit"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <Typography
              color="error"
              sx={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
            >
              {errorMessage}
            </Typography>
          )}

          <Box sx={{ marginTop: "1.5rem" }}>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                paddingY: "0.75rem",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "8px",
                width: "40%",
                fontFamily: "Poppins",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </CardContent>
        <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            // to="https://ws.mvsitaly.com/?changepassword&redirectto=https://hpf.mvsitaly.com/#/dashboard"
            to="https://rws.mvsitaly.com/?changepassword&redirectto=https://portale-isp.mvsitaly.com/#/homepage"
            style={{
              fontSize: 15,
              color: "#1976d2",
              fontFamily: "Poppins",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            Cambia Password
          </Link>
        </Box>
      </Card>

      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{ position: "absolute", bottom: "1rem", fontFamily: "Poppins" }}
      >
        MVS Italy © 2025
      </Typography>
    </Box>
  );
};

export default Login;
