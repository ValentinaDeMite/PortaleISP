import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Tooltip,
  InputAdornment,
  Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AppTable from "../components/AppTable";
import ApiRest from "../service-API/ApiRest";
import StockData from "../service-API/stock.json";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";

const Stock = (props) => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const stock = useSelector((state) => state.stock || StockData.values);
  const ref = useRef();
  const [pnCliente, setPnCliente] = useState(null);
  const [allocationData, setAllocationData] = useState([]);
  const [allocationColumns, setAllocationColumns] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");

  const handleRowDoubleClick = (params) => {
    console.log("Doppio click sulla riga:", params);

    const selectedPnCliente = params.row["1"];
    const descriptionValue = params.row["2"];
    if (!selectedPnCliente) {
      console.warn("Nessun pnCliente trovato!");
      return;
    }

    setPnCliente(selectedPnCliente);
    setDescription(descriptionValue);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!pnCliente || !token) return;

    const getItemAllocation = async () => {
      const api = new ApiRest();
      try {
        const allocationData = await api.getItemAllocation(pnCliente, token);
        console.log("Fetched allocationData:", allocationData);

        dispatch({ type: "set", itemAllocationData: allocationData.values });

        setAllocationData(allocationData.values || []);

        setAllocationColumns(() => {
          const newColumns = setColumnsAllocatedItems(allocationData.fields);
          console.log("New allocationColumns:", newColumns);
          return newColumns;
        });
      } catch (error) {
        console.log("Error fetching allocation data:", error);
      }
    };

    getItemAllocation();
  }, [pnCliente, token]);

  // export
  const filteredStock = Array.isArray(stock)
    ? stock.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];

  const exportToExcel = () => {
    if (!filteredStock || filteredStock.length === 0 || !columnDefs) return;

    const fieldsToExport = columnDefs.map((col) => col.field);
    const headers = columnDefs.reduce((acc, col) => {
      acc[col.field] = col.headerName;
      return acc;
    }, {});

    const filteredForExport = filteredStock.map((item) => {
      const newItem = {};
      for (const key of fieldsToExport) {
        newItem[headers[key]] = item[key];
      }
      return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articoli");
    XLSX.writeFile(workbook, "lista_articoli_stock.xlsx");
  };

  const setColumnsAllocatedItems = (fields) => {
    return fields
      .filter((field) => Object.values(field)[0].show)
      .map((field) => {
        const fieldData = Object.values(field)[0];
        return {
          field: fieldData.forcount.toString(),
          headerName: fieldData.name,
          width: fieldData.type === "N" ? 100 : props.isModal ? 200 : 250,
          type: fieldData.type === "N" ? "number" : "text",
          editable: fieldData.editable,
          renderCell: (params) =>
            fieldData.type === "N" && params.value < 0 ? (
              <Box sx={{ color: "red", fontWeight: "bold" }}>
                {params.value}
              </Box>
            ) : (
              params.value
            ),
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
        setColumnDefs(setColumnsAllocatedItems(data.fields));
      } catch (error) {
        console.error("Errore API, utilizzo dati mockati", error);
        setColumnDefs(setColumnsAllocatedItems(StockData.fields));
        dispatch({ type: "set", stock: StockData.values });
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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress size={50} color="secondary" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "12%",
              margin: "2rem 0 2rem 0",
            }}
          >
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

          <Box sx={{ height: "90%", width: "100%", overflowY: "auto" }}>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  padding: "2rem",
                  backgroundColor: "white",
                  width: "50%",
                  margin: "auto",
                  borderRadius: "5px",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                  Dati Allocazione per: {description}
                </Typography>
                {loading ? (
                  <CircularProgress />
                ) : allocationData.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    Non ci sono progetti per questo articolo.
                  </Typography>
                ) : (
                  <AppTable
                    columns={allocationColumns}
                    rows={allocationData || []}
                  />
                )}
              </Box>
            </Modal>

            <AppTable
              ref={ref}
              columns={columnDefs}
              rows={filteredStock || []}
              onRowDoubleClick={handleRowDoubleClick}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Stock;
