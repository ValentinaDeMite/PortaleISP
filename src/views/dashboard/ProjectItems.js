import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Stack,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AppTable from "../../components/AppTable";
import AppModalTable from "../../components/AppModalTable";
import StockData from "../../service-API/stock.json";
import ApiRest from "../../service-API/ApiRest";

const api = new ApiRest();
const ProjectItems = () => {
  const ref = useRef();
  const project = useSelector((state) => state.selectedProject);
  const token = useSelector((state) => state.token);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [editableData, setEditableData] = useState({
    projectName: project[8],
    projectDescription: project[9],
    projectNotes: project[10],
    projectManager: project[16],
    startDate: project[17]?.split(" ")[0] || "",
    endDate: project[18]?.split(" ")[0] || "",
  });
  const [initialData] = useState({ ...editableData });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [projectItemsData, setProjectItemsData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [modalStockData, setModalStockData] = useState([]);
  const [modalColumnDefs, setModalColumnDefs] = useState([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [editedRows, setEditedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);

  const [payloadObj, setPayloadObj] = useState({});

  const info = useSelector((state) => state.info);
  let isSupervisor = info.ruolo === "Supervisor";

  // Delete

  const handleDeleteRow = (deletedRow) => {
    setDeletedRows((prevDeletedRows) => [...prevDeletedRows, deletedRow]);
    console.log("Riga eliminata:", deletedRow);

    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      edits: {
        ...(prevPayload.edits || {}),
        [deletedRow[9]]: "DELETED",
      },
    }));

    setPendingRequests((prevRequests) => [
      ...prevRequests,
      `Articolo da eliminare: ${deletedRow[9]}`,
    ]);
  };

  // Edit

  const handleEditRow = (editedRow) => {
    setEditedRows((prevEditedRows) => [...prevEditedRows, editedRow]);
    console.log("Riga eliminata:", editedRow);

    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      edits: {
        ...prevPayload.edits,
        [editedRow[9]]: +editedRow[12],
      },
    }));

    setPendingRequests((prevRequests, prevEditedRows) => [
      ...prevRequests,
      `Modifica articolo [${editedRow[9]}] nuovo allocato: ${editedRow[12]}`,
    ]);
  };

  // Modale

  const fetchStockDataForModal = async () => {
    try {
      setIsLoadingModal(true);
      const response = await api.getStock(token);

      setModalStockData(response.values.slice(0, 10));

      const modalColumns = response.fields
        .filter((field) => Object.values(field)[0].show)
        .map((field) => {
          const fieldData = Object.values(field)[0];
          return {
            field: fieldData.forcount.toString(),
            headerName: fieldData.name,
            width: fieldData.type === "N" ? 60 : 200,
            hide: !fieldData.show,
            type: fieldData.type === "N" ? "number" : "string",
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

      setModalColumnDefs(modalColumns);

      setTimeout(() => {
        setModalStockData(response.values);
        setIsLoadingModal(false);
      }, 500);
    } catch (error) {
      console.error(
        "Errore nel recuperare i dati di stock per la modale:",
        error
      );
      setIsLoadingModal(false);
    }
  };

  // Apri la modale e recupera i dati dello stock
  const handleOpenModal = () => {
    setOpenModal(true);
    fetchStockDataForModal();
  };

  // Chiudi la modale
  const handleCloseModal = () => setOpenModal(false);

  const getModalColumnDefs = () => {
    return columnDefs.map((column) => ({
      ...column,
      width: column.width || 150,
      sortable: true,
    }));
  };

  // Funzione per aggiungere un nuovo elemento dalla modale
  {
    /*const handleAddStockItemFromModal = (newRow) => {
    setStockData((prevStockData) => [...prevStockData, newRow]);
    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      new: {
        ...(prevPayload.new || {}),
        [newRow[9]]: Number(newRow[12]),
      },
    }));
    setPendingRequests((prevRequests) => [
      ...prevRequests,
      `Aggiunto nuovo articolo: Part Number ${newRow[9]}`,
    ]);
  };*/
  }
  const handleAddStockItemFromModal = (filteredQnt) => {
    setStockData((prevStockData) => [
      ...prevStockData,
      ...Object.entries(filteredQnt).map(([key, value]) => {
        const description = key.replace(/^\d+/, "").trim();
        return {
          projectDescription: description,
          quantity: value,
        };
      }),
    ]);

    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      new: {
        ...(prevPayload.new || {}),
        ...Object.fromEntries(
          Object.entries(filteredQnt).map(([key, value]) => {
            const description = key.replace(/^\d+/, "").trim();
            return [description, value];
          })
        ),
      },
    }));

    setPendingRequests((prevRequests) => [
      ...prevRequests,
      ...Object.entries(filteredQnt).map(([key, value]) => {
        const description = key.replace(/^\d+/, "").trim();
        return `Aggiunto articolo [${description}] quantità: ${value}`;
      }),
    ]);

    setOpenModal(false);
  };

  useEffect(() => {
    const fetchProjectItems = async () => {
      try {
        const items = await api.getItems(token, project[0]);
        setProjectItemsData(items.values);

        const columns = items.fields
          .filter((field) => {
            const fieldKey = Object.keys(field)[0];
            return field[fieldKey].show;
          })
          .map((field) => {
            const fieldKey = Object.keys(field)[0];
            const fieldData = field[fieldKey];

            return {
              field: fieldKey,
              headerName: fieldData.name,
              flex: 1,
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

        setColumnDefs(columns);
      } catch (error) {
        console.error("Errore nel recuperare i project items:", error);
      }
    };

    fetchProjectItems();
  }, [token, project]);

  // Form

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      project: {
        ...prevPayload.project,
        [name]: value,
      },
    }));

    setPendingRequests((prevRequests) => {
      const updatedRequests = prevRequests.filter(
        (req) => !req.startsWith(`${getFieldLabel(name)} aggiornato:`)
      );
      if (value) {
        updatedRequests.push(`${getFieldLabel(name)} aggiornato: ${value}`);
      }
      return updatedRequests;
    });
    console.log("Payload aggiornato:", payloadObj);
  };

  const handleCancelChange = (field) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: initialData[field],
    }));

    setPendingRequests((prevRequests) => {
      return prevRequests.filter(
        (req) => !req.startsWith(`${getFieldLabel(field)} aggiornato:`)
      );
    });
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "projectName":
        return "Nome progetto";
      case "projectDescription":
        return "Descrizione progetto";
      case "projectNotes":
        return "Note progetto";
      case "projectManager":
        return "Project Manager";
      case "startDate":
        return "Data Inizio";
      case "endDate":
        return "Data Fine";
      default:
        return "";
    }
  };

  const handleConfirm = () => {
    // setPayloadObj((prevPayload) => {

    // con operatore terniario esempio       isSupoervisor ? cancelRequests: true : cancelRequests: false
    //  console.log(updatedPayload);
    //   });

    project[8] = editableData.projectName;
    project[9] = editableData.projectDescription;
    project[10] = editableData.projectNotes;
    project[16] = editableData.projectManager;
    project[17] = editableData.startDate;
    project[18] = editableData.endDate;

    const updatedPayload = {
      new: payloadObj.new || {},
      edits: payloadObj.edits || {},
      project: project,
      cancelRequests: false,
    };

    console.log("Payload pronto per invio:", updatedPayload);

    // return;
    try {
      // setVisible(true)
      // setIsLoading(true)
      const api = new ApiRest();
      const data = api.iuProject(token, updatedPayload);
      if (data.code === 200) {
        // setIsLoading(false)
        // setErrorTitle('Success')
        // const text = isSupervisor
        //   ? `All your  ${editCounter()} request(s) have been correctly registered`
        //   : `All your ${editCounter()} request(s) have been correctly submitted to your supervisor`
        // setErrorMessage(text)
      } else {
        alert("Something went wrong, please try again submit your request(s)");
      }
    } catch (error) {
      // setIsLoading(false)
      console.log(error.response.data.message);
      // alert('Something went wrong, please try again submit your request(s)')
      // setErrorTitle('Error while updating project')
      // setErrorMessage(error.response.data.message)
      // setVisible(true)
    }

    return updatedPayload;
    alert("Tutte le richieste sono state accettate!");
  };

  useEffect(() => {
    console.log("PayloadObj after state update:", payloadObj);
  }, [payloadObj]);

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

  const handleDelete = () => {
    setEditableData(initialData);
    setPendingRequests([]);
    setOpenDeleteConfirm(false);
  };

  const pendingRequestsCount = pendingRequests.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        alignItems: "center",
        paddingX: 1,
        "& .MuiInputBase-input": {
          fontSize: {
            xs: "0.5rem !important",
            sm: "0.7rem !important",
            md: "0.8rem !important",
            lg: "0.9rem !important",
            xl: "1rem !important",
          },
          fontFamily: "Poppins !important",
        },
        "& .MuiInputLabel-root": {
          fontSize: {
            xs: "0.5rem !important",
            sm: "0.7rem !important",
            md: "0.8rem !important",
            lg: "0.9rem !important",
            xl: "1rem !important",
          },
          fontFamily: "Poppins !important",
        },
        "& .MuiInputBase-input": {
          fontSize: {
            xs: "0.5rem",
            sm: "0.6rem",
            md: "0.7rem",
            lg: "0.8rem",
            xl: "0.9rem",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#333",
              fontWeight: "600",
              fontSize: {
                xs: "0.5rem",
                sm: "1rem",
                md: "1.2rem",
                lg: "1.5rem",
                xl: "1.7rem",
              },
              fontFamily: "Poppins!important",
              marginRight: "1rem",
            }}
          >
            {project[8]}
          </Typography>
          <Tooltip title="Elimina progetto">
            <RemoveCircleIcon
              sx={{
                color: "#d32f2f",
                cursor: "pointer",
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                  md: "20px",
                  lg: "22px",
                  xl: "24px",
                },
                "&:hover": {
                  transform: "scale(1.2)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
              onClick={() => {
                console.log("Cliccato su elimina progetto:", project[8]);
              }}
            />
          </Tooltip>
        </Box>
        <Box
          sx={{
            backgroundColor: "#F5F5F5",
            borderRadius: "8px",
            padding: "1rem",
            color: "#555",
            minWidth: "200px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Creato il: {project[3]}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Creato da: {project[4]}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Ultima Modifica: {project[5]}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.8rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Modificato da: {project[6]}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: "auto" }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ backgroundColor: "#4CAF50", padding: "1rem" }}>
            <Typography
              variant="h6"
              color="white"
              align="left"
              sx={{
                fontSize: {
                  xs: "0.5rem",
                  sm: "0.5rem",
                  md: "0.6rem",
                  lg: "0.8rem",
                  xl: "1rem",
                },
                fontFamily: "Poppins!important",
              }}
            >
              Dettagli progetto:
            </Typography>
          </Box>

          <Box
            sx={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Stack spacing={2} direction="row">
              {[
                { label: "ID Progetto", value: project[0] },
                { label: "Stato", value: project[1] },
                { label: "Allocato", value: project[12] },
                { label: "Evaso", value: project[13] },
                { label: "Residuo", value: project[14] },
              ].map((item, index) => (
                <TextField
                  key={index}
                  label={item.label}
                  value={item.value}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  sx={{
                    backgroundColor: "#D8D8D8",
                    borderRadius: "8px",
                    fontFamily: "Poppins!important",
                  }}
                />
              ))}
            </Stack>

            <Stack spacing={2} direction="row">
              {[
                "projectName",
                "projectDescription",
                "projectNotes",
                "startDate",
                "endDate",
                "projectManager",
              ].map((field, index) =>
                field === "projectManager" ? (
                  <FormControl key={index} fullWidth>
                    <InputLabel>Project Manager</InputLabel>
                    <Select
                      name={field}
                      value={editableData[field] || ""}
                      onChange={(e) => handleInputChange(e, field)}
                    >
                      {editableData[field] && (
                        <MenuItem value={editableData[field]}>
                          {editableData[field]}
                        </MenuItem>
                      )}
                      {info.pms
                        .split(";")
                        .filter((pm) => pm !== editableData[field])
                        .map((pm, idx) => (
                          <MenuItem key={idx} value={pm.trim()}>
                            {pm.trim()}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    key={index}
                    label={
                      field === "projectName"
                        ? "Nome Progetto"
                        : field === "projectDescription"
                        ? "Descrizione Progetto"
                        : field === "projectNotes"
                        ? "Note Progetto"
                        : field === "startDate"
                        ? "Data Inizio"
                        : field === "endDate"
                        ? "Data Fine"
                        : `Nome ${field.replace("project", "").toUpperCase()}`
                    }
                    name={field}
                    value={editableData[field] || ""}
                    onChange={(e) => handleInputChange(e, field)}
                    fullWidth
                    type={
                      field === "startDate" || field === "endDate"
                        ? "date"
                        : "text"
                    }
                    InputLabelProps={{ shrink: true }}
                    error={field === "endDate" && dateError}
                    helperText={
                      field === "endDate" && dateError
                        ? "La data di fine deve essere successiva a quella di inizio"
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={() => handleCancelChange(field)}
                            sx={{
                              padding: 0,
                              minWidth: "20px",
                              color: "gray",
                              "&:hover": { color: "black" },
                            }}
                          >
                            X
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      borderRadius: "8px",
                    }}
                  />
                )
              )}
            </Stack>

            <Stack spacing={2} direction="row" alignItems="flex-start">
              <TextField
                label="Richiesta Iniziale"
                value={project[15] || "Nessuna richiesta iniziale"}
                InputProps={{ readOnly: true }}
                fullWidth
                multiline
                rows={1}
                sx={{
                  backgroundColor: "#D8D8D8",
                  borderRadius: "8px",
                }}
              />
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join("\n")}
                fullWidth
                multiline
                rows={Math.max(pendingRequests.length, 1)}
                sx={{
                  borderRadius: "8px",
                }}
              />
            </Stack>

            {pendingRequests.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 2,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF8C00",
                    color: "white",
                    marginRight: "10px",
                    fontSize: {
                      xs: "0.4rem",
                      sm: "0.4rem",
                      md: "0.6rem",
                      lg: "0.8rem",
                      xl: "0.9rem",
                    },
                    fontFamily: "Poppins!important",
                  }}
                  onClick={handleConfirm}
                >
                  Conferma
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#108CCB",
                    color: "white",
                    fontSize: {
                      xs: "0.4rem",
                      sm: "0.4rem",
                      md: "0.6rem",
                      lg: "0.8rem",
                      xl: "0.9rem",
                    },
                    fontFamily: "Poppins!important",
                  }}
                  onClick={handleDeleteConfirmOpen}
                >
                  Elimina
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={openDeleteConfirm} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare tutte le modifiche non salvate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "98%",
          marginTop: "2rem",
          padding: "1rem 0",
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
          Dettagli articoli:
        </Typography>
        <Tooltip title="Aggiungi un nuovo Item">
          <IconButton
            sx={{
              backgroundColor: "#FFA500",
              color: "white",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: "#FFB84D",
              },
            }}
            onClick={handleOpenModal}
          >
            <AddIcon
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  md: "16px",
                  lg: "17px",
                  xl: "18px",
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ width: "99%", mt: "2rem" }}>
        <AppTable
          ref={ref}
          columns={columnDefs}
          rows={projectItemsData || []}
          onDeleteRow={handleDeleteRow}
          onEditRow={handleEditRow}
          useChips={true}
          showActions={true}
          disableCheckboxSelection={true}
          onRowDoubleClick={() => {}}
        />
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            width: "80%",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.8rem",
                md: "1rem",
                lg: "1.2rem",
                xl: "1.5rem",
              },
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Stock Item
          </Typography>
          {isLoadingModal ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <AppModalTable
              columns={modalColumnDefs}
              rows={modalStockData}
              onAdd={handleAddStockItemFromModal}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;
