import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGridPremium, useGridApiRef } from "@mui/x-data-grid-premium";
import { alpha, styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import * as XLSX from "xlsx";
import { format } from "date-fns";
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
  [`& .MuiDataGrid-columnHeader`]: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    backgroundColor: "rgb(75, 168, 61, .9) !important",
  },
  [`& .MuiDataGrid-columnHeaderTitle`]: {
    fontFamily: "Poppins !important",
    color: "white",
    fontSize: {
      xs: "0.5rem",
      sm: "0.5rem",
      md: "0.6rem",
      lg: "0.7rem",
      xl: "0.8rem",
    },
  },
  [`& .MuiDataGrid-columnHeaderRow`]: {
    textAlign: "center",
    backgroundColor: "rgb(75, 168, 61, .9) !important",
  },
}));

const AppTable = ({
  columns,
  rows = [],
  onRowDoubleClick,
  showActions = false,
  fetchDisponibile,
  disponibile,
  disableCheckboxSelection,
  onDeleteRow,
  onEditRow,
  enableSearch = false,
  enableExcelExport = false,
}) => {
  const [allocatoError, setAllocatoError] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const apiRef = useGridApiRef();
  const [rowGroupingModel, setRowGroupingModel] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRow, setEditedRow] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const tableRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width: 1600px)");
  const [searchText, setSearchText] = useState("");
  const [tableHeight, setTableHeight] = useState("auto");
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [showAllocField, setShowAllocField] = useState(false);
  const [visibleAllocFieldRowId, setVisibleAllocFieldRowId] = useState(null);

  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
    setSelectedRows(newRowSelectionModel);
  };

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setRowSelectionModel([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Tooltip per allocato
  const disponibileValue =
    disponibile !== null
      ? Number(disponibile)
      : selectedRow
      ? Number(Object.values(selectedRow)[17])
      : 0;
  const confermato =
    selectedRow && Object.values(selectedRow)[13]
      ? Number(Object.values(selectedRow)[13])
      : 0;

  const allocatoConfermato = selectedRow
    ? Number(Object.values(selectedRow)[13])
    : 0;

  let disponibileSumm = disponibileValue + allocatoConfermato;

  const tooltipText = `Disponibile: ${disponibileValue} + Allocato già Confermato: ${allocatoConfermato}`;

  //TODO per mettere colore al selezionato
  // useEffect(() => {
  //   console.log("ciao");

  //   let idProj = localStorage.getItem("selectedProjectId");
  //   if (idProj) {
  //     const selectedRow = rows.find(
  //       (row) => row[Object.keys(row)[0]] === idProj
  //     );
  //     console.log(selectedRow);

  //     if (selectedRow) {
  //       setRowSelectionModel([selectedRow[0]]); // Ensure 'id' exists in the row data
  //     }
  //   }
  // }, [rows]);

  const filteredRows = Array.isArray(rows)
    ? rows.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];
  const exportToExcel = () => {
    const getRowId = (row, index) => row.id || index;

    const selectedData = filteredRows.filter((row, index) =>
      selectedRows.includes(getRowId(row, index))
    );

    const dataToExport = selectedRows.length > 0 ? selectedData : filteredRows;

    if (dataToExport.length === 0) {
      console.warn("Nessuna riga selezionata per l'esportazione.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Progetti");
    XLSX.writeFile(workbook, "file_esportati.xlsx");
  };

  {
    /*Edit */
  }
  const handleEditConfirm = (params) => {
    if (onEditRow) {
      const updatedRow = { ...editedRow };
      // updatedRow[13] = editedRow.allocato;
      // SOLO SE modificato davvero:
      if (editedRow.allocato !== undefined && editedRow.allocato !== "") {
        updatedRow[13] = editedRow.allocato;
      }

      updatedRow[12] = editedRow.forecast;
      onEditRow(updatedRow);
    }
    setOpenEditDialog(false);
    setSelectedRow(null);
  };

  const handleEditClick = (params) => {
    setSelectedRow(params.row);
    setEditedRow({
      ...params.row,
      forecast: params.row["forecast"] || Object.values(params.row)[12],
      allocato: params.row["allocato"] || Object.values(params.row)[14],
      residuo: params.row["residuo"] || Object.values(params.row)[18],
    });

    // Estrai il PN (Part Number)
    const pn = params.row["9"];

    // Chiama la funzione passata da ProjectItems
    if (fetchDisponibile) {
      fetchDisponibile(pn);
    }

    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedRow(null);
  };

  // const handleEditFieldChange = (field, value) => {
  //   setEditedRow((prev) => {
  //     const updatedRow = {
  //       ...prev,
  //       [field]: value,
  //     };

  //     // if (field === "allocato") {
  //     //   updatedRow.residuo =
  //     //     parseInt(prev.residuo) + parseInt(value) - parseInt(prev.allocato);
  //     //   updatedRow["allocato"] = value;
  //     //   updatedRow[13] = value;
  //     // }
  //     // if (field === "forecast") {
  //     //   updatedRow.forecast = value;
  //     //   updatedRow[12] = value;
  //     // }

  //     return updatedRow;
  //   });
  // };

  const handleEditFieldChange = (field, value) => {
    setEditedRow((prev) => {
      if (typeof field === "number") {
        // Se field è un numero, aggiorna l'array immutabilmente
        const updatedRow = [...prev];
        updatedRow[field] = value;
        return updatedRow;
      } else {
        // Se field è una stringa, aggiorna l'oggetto normalmente
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  {
    /*Delete */
  }

  const handleDeleteClick = (params) => {
    setSelectedRow(params.row);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteRow) {
      onDeleteRow(selectedRow);
    }
    setOpenDialog(false);
    setSelectedRow(null);
  };
  {
    /* const sizeChangeTable = (pagination) => {
    if (pagination.pageSize == 10) {
      setTableHeight("auto");
    } else {
      setTableHeight("80%");
    }
  }; */
  }
  const renderStatusChip = (params) => {
    let chipColor;
    let label;

    switch (params.value) {
      case "OPN":
        chipColor = "success";
        label = "Open";
        break;
      case "CLO":
        chipColor = "error";
        label = "Closed";
        break;
      case "NEW":
        chipColor = "primary";
        label = "New";
        break;
      case "REQ":
        chipColor = "secondary";
        label = "Pending";
        break;

      default:
        chipColor = "default";
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Chip
          label={label}
          color={chipColor}
          sx={{
            fontSize: {
              xs: "0.4rem",
              sm: "0.5rem",
              md: "0.6rem",
              lg: "0.6rem",
              xl: "0.7rem",
            },
          }}
        />
      </Box>
    );
  };

  const renderActionButtons = (params) => {
    const isPending = params.row[2] === "REQ";
    const isDeleted = params.row[20].includes("Elimina");

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "100%",
          gap: "0.5rem",
        }}
      >
        <Tooltip
          title="Modifica"
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
          <IconButton
            sx={{
              backgroundColor: isDeleted ? "gray !important" : "#108CCB",
              color: "white !important",
              "&:hover": {
                backgroundColor: isDeleted ? "gray !important" : "#6CACFF",
              },
              padding: {
                xs: "2px",
                sm: "3px",
                md: "4px",
                lg: "5px",
                xl: "6px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="edit"
            onClick={() => handleEditClick(params)}
            disabled={isDeleted} //  Disable button if status is "REQ"
          >
            <EditIcon
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  md: "14px",
                  lg: "15px",
                  xl: "18px",
                },
              }}
            />
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Elimina"
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
          <IconButton
            sx={{
              backgroundColor: isPending ? "gray !important" : "red",
              color: "white !important",
              "&:hover": {
                backgroundColor: isPending
                  ? "gray !important"
                  : "rgba(244, 67, 54, .7)",
              },
              padding: {
                xs: "2px",
                sm: "3px",
                md: "4px",
                lg: "5px",
                xl: "6px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="delete"
            onClick={() => handleDeleteClick(params)}
            disabled={isPending} // 🔹 Disable button if status is "REQ"
          >
            <DeleteIcon
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  md: "14px",
                  lg: "15px",
                  xl: "18px",
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const filteredColumns = columns.filter(
    (col) => col.headerName !== "Delete row" && col.headerName !== "Edit"
  );

  const updatedColumns = filteredColumns.map((col) => {
    if (
      col.headerName === "Stato" ||
      col.headerName === "Stato Item" ||
      col.headerName === "Stato Richiesta"
    ) {
      return {
        ...col,
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => renderStatusChip(params),
      };
    }
    if (col.headerName === "UBI") {
      col.headerName = "STOCK";
    }
    if (col.headerName === "VAT") {
      col.headerName = "V.A.T";
    }

    if (col.headerName === "Richieste Pending") {
      return {
        ...col,
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => renderRichiestePendingIcon(params),
      };
    }
    if (
      col.type === "D" ||
      col.headerName.includes("Data") ||
      col.headerName.includes("Update")
    ) {
      return {
        ...col,
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          if (!params.value) return "";
          try {
            return format(new Date(params.value), "dd/MM/yy HH:mm");
          } catch (error) {
            console.error("Errore nel formattare la data:", error);
            return params.value;
          }
        },
      };
    }

    return {
      ...col,
      headerAlign: "center",
      flex: 1,
    };
  });

  if (showActions) {
    updatedColumns.push({
      field: "action",
      headerName: "Azioni",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => renderActionButtons(params),
      sortable: false,
      filterable: false,
      align: "center",
    });
  }

  const renderRichiestePendingIcon = (params) => {
    if (params.value > "0") {
      return (
        <Tooltip
          title={`Richieste: ${params.value}`}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <NotificationImportantIcon
              sx={{
                color: "#d32f2f",
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                  md: "20px",
                  lg: "22px",
                  xl: "24px",
                },
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)",
                },
              }}
              onClick={() => alert(`Richieste Pending ID: ${params.row.id}`)}
            />
          </Box>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          title="Nessuna richiesta pendente"
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <NotificationsOffIcon
              sx={{
                color: "#108CCB",
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                  md: "20px",
                  lg: "22px",
                  xl: "24px",
                },
                cursor: "pointer",
              }}
            />
          </Box>
        </Tooltip>
      );
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }} ref={tableRef}>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={isSmallScreen ? 35 : 37}
          sx={{
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaderTitle": {
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.9rem",
              },
              height: "auto",
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
                xl: "0.9rem",
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
                xl: "0.85rem",
              },
            },
            "& .MuiTablePagination-actions": {
              textAlign: "center",
              fontFamily: "Poppins !important",
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.9rem",
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
          rows={filteredRows || []}
          columns={updatedColumns.map((col) => ({
            ...col,
            editable: false,
            renderCell: (params) => {
              const excludedColumns = ["Azioni", "Richieste Pending"];
              if (excludedColumns.includes(params.colDef.headerName)) {
                return col.renderCell ? col.renderCell(params) : params.value;
              }
              return (
                <Tooltip
                  title={`${params.colDef.headerName}: ${
                    (col.type === "D" ||
                      col.headerName.includes("Data") ||
                      col.headerName.includes("Update")) &&
                    params.value &&
                    !isNaN(new Date(params.value))
                      ? format(new Date(params.value), "dd/MM/yy HH:mm")
                      : params.value
                  }`}
                  disableInteractive
                  enterTouchDelay={7000}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        maxWidth: "100%",
                      }}
                    >
                      {col.renderCell ? col.renderCell(params) : params.value}
                    </span>
                  </div>
                </Tooltip>
              );
            },
          }))}
          pageSize={10}
          onRowDoubleClick={onRowDoubleClick}
          getRowId={(row) => row.id || rows.indexOf(row)}
          pagination
          //onPaginationModelChange={(param) => sizeChangeTable(param)}
          paginationMode="client"
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            rowGrouping: { model: rowGroupingModel },
          }}
          pageSizeOptions={[10, 15, 20, 25]}
          sortingOrder={["asc", "desc"]}
          //checkboxSelection={!disableCheckboxSelection}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          rowSelectionModel={selectedRows}
          groupRowsByColumn="status"
          rowGroupingModel={rowGroupingModel}
          onRowGroupingModelChange={setRowGroupingModel}
          getRowClassName={(params) => {
            const baseClass =
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd";

            const selectedClass =
              params.row[0] === rowSelectionModel[0] ? "Mui-selected" : "";

            return `${baseClass} ${selectedClass} data-project-id-${params.row[0]}`.trim();
          }}
          //  rowCountChange={}
          disableColumnSelector={true}
          disableColumnMenu={true}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Conferma Eliminazione"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare l'articolo{" "}
            {selectedRow ? Object.values(selectedRow)[9] : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modifica */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">
          Modifica Articolo: {selectedRow ? Object.values(selectedRow)[9] : ""}
        </DialogTitle>
        <DialogContent>
          {editedRow && (
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <TextField
                label="Stato"
                fullWidth
                margin="normal"
                value={selectedRow ? Object.values(selectedRow)[2] : ""}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
              <TextField
                label="Part Number"
                fullWidth
                margin="normal"
                value={selectedRow ? Object.values(selectedRow)[10] : ""}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
              <TextField
                label="Descrizione"
                fullWidth
                margin="normal"
                value={selectedRow ? Object.values(selectedRow)[11] : ""}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />

              <TextField
                label="Spedito"
                fullWidth
                margin="normal"
                value={selectedRow ? Object.values(selectedRow)[17] : ""}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
              <Tooltip title={tooltipText} arrow placement="top">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Disponibile"
                  value={disponibileSumm}
                  InputProps={{ readOnly: true }}
                  sx={{
                    backgroundColor: "#D8D8D8",
                    borderRadius: "8px",
                    pointerEvents: "auto",
                  }}
                />
              </Tooltip>
              <TextField
                label="Residuo"
                fullWidth
                margin="normal"
                value={editedRow.residuo}
                onChange={(e) =>
                  handleEditFieldChange("residuo", e.target.value)
                }
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
              <TextField
                label="Forecast"
                type="number"
                fullWidth
                margin="normal"
                value={editedRow.forecast}
                onChange={(e) =>
                  handleEditFieldChange("forecast", e.target.value)
                }
              />
              <TextField
                label="Allocato Confermato"
                fullWidth
                margin="normal"
                value={confermato}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
              {/* {visibleAllocFieldRowId === selectedRow?.[9] ? (
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <TextField
                    label="Nuova allocazione"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={editedRow.allocato ?? ""}
                    onChange={(e) => {
                      let newValue = e.target.value;
                      if (newValue === "") {
                        handleEditFieldChange("allocato", 0);
                        return;
                      }
                      newValue = Number(newValue);
                      if (newValue < 0) {
                        newValue = 0;
                      }

                      if (newValue > disponibileSumm) {
                        setOpenAlert(false);
                        setTimeout(() => {
                          setOpenAlert(true);
                        }, 100);

                        setIsSaveDisabled(true);
                      } else {
                        setIsSaveDisabled(false);
                      }

                      handleEditFieldChange("allocato", newValue);
                    }}
                    inputProps={{ min: 0, max: disponibileSumm }}
                    sx={{
                      backgroundColor:
                        disponibileSumm === 0 ? "#f5f5f5" : "white",
                    }}
                  />

                  <Tooltip title="Resetta a 0">
                    <IconButton
                      onClick={() => {
                        const newValue = 0;
                        handleEditFieldChange("allocato", newValue);
                      }}
                      sx={{
                        marginTop: "8px",
                        border: "1px solid #ccc",
                        height: "40px",
                        width: "40px",
                      }}
                    >
                      <CloseIcon sx={{ color: "#ff0000" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Tooltip title="Aggiungi nuova allocazione">
                  <IconButton
                    onClick={() => {
                      // Se esiste già un valore, NON lo sovrascrivi. Se no, metti 0.
                      if (
                        editedRow.allocato === null ||
                        editedRow.allocato === undefined
                      ) {
                        handleEditFieldChange("allocato", 0);
                      }
                      setVisibleAllocFieldRowId(selectedRow?.[9]);
                    }}
                    sx={{
                      alignSelf: "center",
                      justifySelf: "center",
                      marginTop: "0.7rem",
                      border: "1px solid #bbb",
                      borderRadius: "8px",
                      padding: "5px",
                    }}
                  >
                    <AddIcon
                      sx={{
                        fontSize: "20px",
                        color: "#1976d2",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )} */}
              <TextField
                label="Variazione Nuova Allocazione"
                type="number"
                fullWidth
                margin="normal"
                value={editedRow.allocato === 0 ? "" : editedRow.allocato}
                onChange={(e) => {
                  let newValue = e.target.value;

                  if (newValue === "") {
                    handleEditFieldChange("allocato", "");
                    setAllocatoError("");
                    return;
                  }

                  newValue = Number(newValue);

                  if (newValue < -confermato) {
                    setAllocatoError(
                      `Non puoi allocare meno di -${confermato}`
                    );
                    newValue = -confermato;
                  } else if (newValue > disponibile) {
                    setAllocatoError(`Non puoi allocare più di ${disponibile}`);
                    newValue = disponibile;

                    setOpenAlert(false);
                    setTimeout(() => {
                      setOpenAlert(true);
                    }, 100);
                  } else {
                    setAllocatoError("");
                  }

                  handleEditFieldChange("allocato", newValue);
                }}
                inputProps={{
                  min: -confermato,
                  max: disponibile,
                }}
                error={!!allocatoError}
                helperText={allocatoError}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="error">
            Annulla
          </Button>
          <Button
            onClick={handleEditConfirm}
            color="primary"
            disabled={isSaveDisabled}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppTable;
