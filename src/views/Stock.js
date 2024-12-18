import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiRest from "../service-API/ApiRest";
import AppTable from "../components/AppTable";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import StockData from "../service-API/stock.json";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

const Stock = (props) => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const date = useSelector((state) => state.date);
  const stock = useSelector((state) => state.stock || StockData.values);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ref = useRef();
  const [searchText, setSearchText] = useState("");

  const convertTypeColumn = (type) => {
    switch (type) {
      case "T":
        return "text";
      case "N":
        return "number";
      case "D":
        return "date";
      case "B":
        return "button";
      default:
        return "text";
    }
  };

  const filteredStock = Array.isArray(stock)
    ? stock.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];
  const exportToExcel = () => {
    const filteredForExport = filteredStock.map((item) => {
      const entries = Object.entries(item).filter(
        ([key, value], index) => index !== 20 && index !== 21
      );

      return Object.fromEntries(entries);
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articoli");
    XLSX.writeFile(workbook, "lista_articoli_stock.xlsx");
  };

  const setColumns = (fields) => {
    return fields
      .filter((field) => Object.values(field)[0].show)
      .map((field) => {
        const fieldData = Object.values(field)[0];
        return {
          field: fieldData.forcount.toString(),
          headerName: fieldData.name,
          width: fieldData.type === "N" ? 60 : props.isModal ? 200 : 250,
          hide: !fieldData.show,
          type: convertTypeColumn(fieldData.type),
          editable: fieldData.editable,
          renderCell: (params) => {
            if (
              fieldData.type === "N" &&
              ((typeof params.value === "number" && params.value < 0) ||
                String(params.value).includes("-"))
            ) {
              return (
                <Box sx={{ color: "red", fontWeight: "bold" }}>
                  {params.value}
                </Box>
              );
            }
            return params.value;
          },
        };
      });
  };

  useEffect(() => {
    const getStock = async () => {
      setLoading(true);
      try {
        const api = new ApiRest();
        const data = await api.getStock(token);
        dispatch({ type: "set", stock: data.values });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: "set", fieldsStock: columns });
      } catch (error) {
        console.error("API error, using mocked data", error);
        const columns = setColumns(StockData.fields);
        setColumnDefs(columns);
        dispatch({
          type: "set",
          payload: { stock: StockData.values, fieldsStock: columns },
        });
      } finally {
        setLoading(false);
      }
    };

    getStock();
  }, [dispatch, token]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {loading && (
        <Box
          sx={{
            height: "60%",
            margin: "auto",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "12%",
            margin: "2rem 0 2rem 0",
          }}
        >
          {/* Titolo */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontSize: {
                xs: "0.5rem",
                sm: "0.8rem",
                md: "1rem",
                lg: "1.2rem",
                xl: "1.5rem",
              },
              fontFamily: "Poppins!important",
              fontWeight: "600",
            }}
          >
            Stock - Lista articoli disponibili
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            {/* Barra di ricerca */}
            <TextField
              variant="standard"
              placeholder="Cerca"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgb(27, 158, 62, .9)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      onClick={() => setSearchText("")}
                      fontSize="small"
                      cursor="pointer"
                      sx={{
                        color: searchText ? "red" : "rgba(0, 0, 0, 0.26)",
                      }}
                      disabled={!searchText}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "70%",
                "& .MuiInput-root": {
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.8rem",
                    lg: "0.8rem",
                    xl: "0.9rem",
                  },
                  borderBottom: "1px solid rgb(27, 158, 62, .5)",
                  "&:before": {
                    borderBottom: "1px solid rgb(27, 158, 62, .5)",
                  },
                  "&:after": {
                    borderBottom: "2px solid rgb(27, 158, 62, .8)",
                  },
                  ":hover:not(.Mui-focused)": {
                    "&:before": {
                      borderBottom: "2px solid rgb(27, 158, 62, .9)",
                    },
                  },
                },
              }}
            />

            {/* Icona per esportare */}
            <Tooltip
              title="Scarica in formato Excel"
              enterTouchDelay={7000}
              disableInteractive
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              }}
            >
              <ArrowCircleDownIcon
                sx={{
                  color: "green",
                  cursor: "pointer",
                  fontSize: {
                    xs: "20px",
                    sm: "25px",
                    md: "30px",
                    lg: "32px",
                    xl: "35px",
                  },
                  "&:hover": {
                    color: "rgba(50, 50, 50, .9)",
                  },
                }}
                onClick={exportToExcel}
              />
            </Tooltip>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex", // Usa il layout flexbox
          justifyContent: "center", // Centra orizzontalmente
          alignItems: "center", // Centra verticalmente
          height: "90%", // Altezza piena per il contenitore
          width: "100%", // Larghezza piena per il contenitore
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {!loading && (
          <AppTable ref={ref} columns={columnDefs} rows={filteredStock || []} />
        )}
      </Box>
    </Box>
  );
};

export default Stock;
