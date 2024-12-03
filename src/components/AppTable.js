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
} from "@mui/material";
import { DataGridPremium, useGridApiRef } from "@mui/x-data-grid-premium";
import { alpha, styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import { useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import * as XLSX from "xlsx";

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
  disableCheckboxSelection,
  onDeleteRow,
  onEditRow,
  enableSearch = false,
  enableExcelExport = false,
}) => {
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
    XLSX.writeFile(workbook, "lista_projects.xlsx");
  };

  {
    /*Edit */
  }
  const handleEditConfirm = (params) => {
    if (onEditRow) {
      const updatedRow = { ...editedRow };
      updatedRow[12] = editedRow.allocato;
      onEditRow(updatedRow);
    }
    setOpenEditDialog(false);
    setSelectedRow(null);
  };

  const handleEditClick = (params) => {
    setSelectedRow(params.row);
    setEditedRow({
      ...params.row,
      allocato: params.row["allocato"] || Object.values(params.row)[12],
      residuo: params.row["residuo"] || Object.values(params.row)[17],
    });
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedRow(null);
  };

  const handleEditFieldChange = (field, value) => {
    setEditedRow((prev) => {
      const updatedRow = {
        ...prev,
        [field]: value,
      };

      if (field === "allocato") {
        updatedRow.residuo =
          parseInt(prev.residuo) + parseInt(value) - parseInt(prev.allocato);
        updatedRow["allocato"] = value;
        updatedRow[12] = value;
      }

      return updatedRow;
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

  const renderActionButtons = (params) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100%",
        gap: "0.5rem",
      }}
    >
      <Tooltip title="Modifica">
        <IconButton
          sx={{
            backgroundColor: "#108CCB",
            color: "white",
            "&:hover": { backgroundColor: "#6CACFF" },
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
      <Tooltip title="Elimina">
        <IconButton
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": { backgroundColor: "rgba(244, 67, 54, .7)" },
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

    if (col.headerName === "Richieste Pending") {
      return {
        ...col,
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => renderRichiestePendingIcon(params),
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
        <Tooltip title={`Richieste Pending: ${params.value}`}>
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
        <Tooltip title="Nessuna richiesta pendente">
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
    <Box sx={{ height: "100%", width: "100%" }} ref={tableRef}>
      {(enableSearch || enableExcelExport) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            height: "15%",
          }}
        >
          {enableSearch && (
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
          )}
          {enableExcelExport && (
            <Tooltip title="Scarica in formato Excel">
              <DownloadForOfflineRoundedIcon
                sx={{
                  color: "orange",
                  cursor: "pointer",
                  fontSize: {
                    xs: "20px",
                    sm: "25px",
                    md: "30px",
                    lg: "32px",
                    xl: "35px",
                  },
                  "&:hover": {
                    color: "rgbA(50, 50, 50, .9)",
                  },
                }}
                onClick={exportToExcel}
              />
            </Tooltip>
          )}
        </Box>
      )}

      <Box sx={{ height: "76.5%", width: "100%" }}>
        <StripedDataGrid
          apiRef={apiRef}
          rowHeight={isSmallScreen ? 35 : 40}
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
            renderCell: (params) => (
              <Tooltip title={params.value || ""} arrow>
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
            ),
          }))}
          pageSize={10}
          onRowDoubleClick={onRowDoubleClick}
          getRowId={(row) => row.id || rows.indexOf(row)}
          pagination
          paginationMode="client"
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            rowGrouping: { model: rowGroupingModel },
          }}
          pageSizeOptions={[10, 25, 50]}
          sortingOrder={["asc", "desc"]}
          checkboxSelection={!disableCheckboxSelection}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          rowSelectionModel={selectedRows}
          groupRowsByColumn="status"
          rowGroupingModel={rowGroupingModel}
          onRowGroupingModelChange={setRowGroupingModel}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
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
            <Box>
              <TextField
                label="Stato"
                fullWidth
                margin="normal"
                value={selectedRow ? Object.values(selectedRow)[2] : ""}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
              <TextField
                label="Nome Prodotto"
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
                label="Evaso"
                fullWidth
                margin="normal"
                value={selectedRow ? Object.values(selectedRow)[16] : ""}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#D8D8D8", borderRadius: "8px" }}
              />
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
                label="Allocato"
                type="number"
                fullWidth
                margin="normal"
                value={editedRow.allocato}
                onChange={(e) =>
                  handleEditFieldChange("allocato", e.target.value)
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="error">
            Annulla
          </Button>
          <Button onClick={handleEditConfirm} color="primary">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppTable;
