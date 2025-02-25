import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Tooltip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGridPremium, useGridApiRef } from "@mui/x-data-grid-premium";
import { alpha, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import * as XLSX from "xlsx";
import CloseIcon from "@mui/icons-material/Close";

const ODD_COLOR = "rgba(217, 217, 217, 0.7)";
const EVEN_COLOR = "rgba(255, 255, 255, 1)";

const StripedDataGrid = styled(DataGridPremium)(({ theme }) => ({
  [`& .MuiDataGrid-row.even`]: {
    backgroundColor: EVEN_COLOR,
  },
  [`& .MuiDataGrid-row.odd`]: {
    backgroundColor: ODD_COLOR,
  },
  [`& .MuiDataGrid-row:hover`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
  [`& .MuiDataGrid-row.Mui-selected`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.6),
    },
  },
  [`& .MuiDataGrid-columnHeaderTitle`]: {
    fontFamily: "Poppins !important",
    color: "white",
    fontSize: {
      xs: "0.5rem",
      sm: "0.6rem",
      md: "0.7rem",
      lg: "0.8rem",
      xl: "0.9rem",
    },
  },
  [`& .MuiDataGrid-columnHeaderRow`]: {
    textAlign: "center",
    backgroundColor: "rgb(75, 168, 61, .9) !important",
  },
}));

const AppModalTable = ({ columns, rows = [], onAdd, onRowDoubleClick }) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");

  const apiRef = useGridApiRef();
  const [quantities, setQuantities] = useState(
    rows.reduce((acc, row) => ({ ...acc, [row[0]]: 0 }), {})
  );

  // Filtra le righe in base alla ricerca
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Esporta i dati filtrati in Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");
    XLSX.writeFile(workbook, "ExportedData.xlsx");
  };

  const handleEditFieldChange = (row, newQuantity) => {
    const id = row[1];
    const max = row[8];

    if (newQuantity > max) {
      alert(
        `Quantità non disponibile. Disponibilità massima per l'articolo ${id}: ${max}`
      );
      return;
    }

    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
  };

  const renderAllocateColumn = (params) => {
    const quantity = quantities[params.row];

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <TextField
          size="small"
          type="number"
          value={quantity}
          onBlur={(e) => handleEditFieldChange(params.row, e.target.value)}
          sx={{
            width: "50%",
            "& input": {
              textAlign: "center",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.9rem",
              },
              padding: "8px 0",
            },
            "& .MuiOutlinedInput-root": {
              height: "35px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
          InputProps={{
            inputProps: {
              min: 0,
              step: 1,
            },
          }}
        />
      </Box>
    );
  };

  const updatedColumns = columns.map((col) => {
    return {
      ...col,
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <Tooltip
          title={`${col.headerName}: ${params.value}`}
          disableInteractive
          enterTouchDelay={700}
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
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              textAlign: "center",
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    };
  });

  updatedColumns.push({
    field: "allocate",
    headerName: "ALLOCARE",
    flex: 1,
    headerAlign: "center",
    renderCell: (params) => renderAllocateColumn(params),
    sortable: false,
    filterable: false,
    align: "center",
  });

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {/* Search Bar e Export */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        {/* Search Bar */}
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
                  sx={{
                    color: searchText ? "red" : "rgba(0, 0, 0, 0.26)",
                  }}
                  disabled={!searchText}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "20%",
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

        {/* Export Icon */}
        <Tooltip
          title="Esporta in Excel"
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
          <DownloadForOfflineRoundedIcon
            sx={{
              color: "orange",
              cursor: "pointer",
              fontSize: "30px",
              "&:hover": {
                color: "rgba(50, 50, 50, 0.9)",
              },
            }}
            onClick={exportToExcel}
          />
        </Tooltip>
      </Box>

      {/* Tabella */}
      <Box sx={{ height: "auto", width: "100%" }}>
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={40}
          sx={{
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaderTitle": {
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
            },
            "& .MuiDataGrid-columnHeaderTitleContainerContent": {
              color: "white",
            },
            "& .MuiDataGrid-columnHeaderRow>.MuiButtonBase-root": {
              color: "white",
            },
            "& .MuiDataGrid-container--top [role=row]": {
              backgroundColor: "rgb(75, 168, 61, .9) !important",
            },
            "& .MuiDataGrid-withBorderColor": {
              backgroundColor: "rgb(75, 168, 61, .9) !important",
            },
            "& .MuiTablePagination-root": {
              color: "white",
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
            },
            "& .MuiTablePagination-displayedRows": {
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
            },
            "& .MuiTablePagination-selectLabel": {
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
            },
            "& .MuiTablePagination-selectIcon ": {
              color: "white !important",
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center",
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
            },
            "& .MuiDataGrid-sortIcon": {
              color: "white",
              opacity: ".9 !important",
            },
            "& .MuiDataGrid-menuIconButton": {
              color: "white",
              opacity: ".9 !important",
            },
            "& .MuiDataGrid-topContainer ": {
              textAlign: "center !important",
            },
            "&.MuiDataGrid-virtualScrollerContent": {
              height: "100%",
            },
          }}
          rows={filteredRows}
          columns={updatedColumns}
          pageSize={pageSize}
          onCellClick={(params) => {
            console.log("Cella cliccata:", params); // Debug dell'evento
            if (onRowDoubleClick) onRowDoubleClick(params);
          }}
          getRowId={(row) => row["0"]}
          pagination
          paginationMode="client"
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          sortingOrder={["asc", "desc"]}
        />
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF8700",
            "&:hover": {
              backgroundColor: "#323232",
            },
          }}
          onClick={() => {
            const validQnts = Object.values(quantities)
              .map((value) => Number(value))
              .some((value) => value > 0);

            if (!validQnts) {
              alert("Inserisci almeno una quantità valida");
              return;
            }

            const filteredQnt = Object.entries(quantities)
              .filter(([key, value]) => Number(value) > 0)
              .reduce((acc, [key, value]) => {
                acc[key] = Number(value);
                return acc;
              }, {});

            console.log(filteredQnt);
            onAdd(filteredQnt);
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "0.6rem",
                sm: "0.7rem",
                md: "0.8rem",
                lg: "0.8rem",
                xl: "0.9rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Aggiungi
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default AppModalTable;
