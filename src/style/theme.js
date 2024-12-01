/*import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#108CCB", // Colore principale
    },
    secondary: {
      main: "#6CACFF", // Colore per hover sui pulsanti
    },
    error: {
      main: "#d32f2f", // Colore per errori
    },
    warning: {
      main: "#FFA500", // Colore arancione
    },
    success: {
      main: "#4CAF50", // Colore verde
    },
    background: {
      default: "rgba(255, 255, 255, 1)",
      paper: "rgba(217, 217, 217, 0.7)",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    fontSize: 12,
    h6: {
      fontSize: "0.8rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.7rem",
    },
    button: {
      textTransform: "none", // Evita maiuscolo automatico
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "0.7rem", // Dimensione dei chip
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "4px",
          "&:hover": {
            backgroundColor: "rgba(16, 140, 203, 0.6)", // Hover su IconButton
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-row.even": {
            backgroundColor: "rgba(255, 255, 255, 1)",
          },
          "& .MuiDataGrid-row.odd": {
            backgroundColor: "rgba(217, 217, 217, 0.7)",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(16, 140, 203, 0.2)",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#108CCB",
            color: "white",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#108CCB",
            color: "white",
            fontFamily: "Poppins, Arial, sans-serif",
            fontSize: "0.8rem",
          },
          "& .MuiDataGrid-cell": {
            textAlign: "center",
            fontFamily: "Poppins, Arial, sans-serif",
            fontSize: "0.7rem",
          },
        },
      },
    },
  },
});

export default theme;*/

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4BA83D", // Verde per pulsanti e testi principali
    },
    secondary: {
      main: "#FF8700", // Arancione per pulsanti e azioni secondarie
    },
    error: {
      main: "#D32F2F", // Rosso per errori e notifiche
    },
    warning: {
      main: "#FF9800", // Giallo-arancione per azioni di avviso
    },
    info: {
      main: "#108CCB", // Blu per icone e testi informativi
    },
    success: {
      main: "#27AE60", // Verde chiaro per stati positivi
    },
    background: {
      default: "#f5f5f5", // Sfondo generale
      paper: "#FFFFFF", // Sfondo per card e contenitori
    },
    text: {
      primary: "#323232", // Colore predefinito per i testi
      secondary: "#777777", // Colore per testi secondari
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: "0.9rem",
      fontWeight: 400,
      color: "#777777",
    },
    subtitle2: {
      fontSize: "0.8rem",
      fontWeight: 400,
      color: "#777777",
    },
    body1: {
      fontSize: "1rem",
      color: "#323232",
    },
    body2: {
      fontSize: "0.9rem",
      color: "#777777",
    },
    button: {
      fontSize: "0.9rem",
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      color: "#777777",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontFamily: "Poppins",
          fontWeight: "bold",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontFamily: "Poppins",
          },
          "& .MuiInputLabel-root": {
            fontFamily: "Poppins",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontFamily: "Poppins",
            fontSize: "0.9rem",
          },
        },
      },
    },
    MuiDataGridPremium: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-row.even": {
            backgroundColor: "rgba(255, 255, 255, 1)",
          },
          "& .MuiDataGrid-row.odd": {
            backgroundColor: "rgba(217, 217, 217, 0.7)",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(75, 168, 61, 0.2)",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(75, 168, 61, 0.4)",
            "&:hover": {
              backgroundColor: "rgba(75, 168, 61, 0.6)",
            },
          },
          "& .MuiDataGrid-columnHeader": {
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "rgb(75, 168, 61, .9) !important",
            color: "white",
            fontFamily: "Poppins !important",
            fontSize: "0.8rem",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontFamily: "Poppins",
            fontSize: "0.9rem",
          },
          "& .MuiTablePagination-root": {
            color: "white",
            fontFamily: "Poppins",
            fontSize: "0.8rem",
          },
          "& .MuiDataGrid-cell": {
            fontFamily: "Poppins",
            fontSize: "0.8rem",
            textAlign: "center",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "white",
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins",
          fontSize: "0.9rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#4BA83D",
          color: "white",
          fontFamily: "Poppins",
          fontSize: "0.8rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": {
            color: "#FF8700",
          },
        },
      },
    },
  },
});

export default theme;
