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
  const [initialPayloadObj, setInitialPayloadObj] = useState({});
  const [initialPendingRequests, setInitialPendingRequests] = useState([]);

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

      response.values = response.values.filter(
        (item) =>
          !projectItemsData.some((projectItem) => projectItem[9] === item[1])
      );

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
  {
    /*const handleAddStockItemFromModal = (filteredQnt) => {
    setStockData((prevStockData) => [
      ...prevStockData,
      //...Object.entries(filteredQnt).map(([key, value]) => {
      //const partNumberStock = key.replace(/^\d+/, "").trim();
      // return {
      //   partNumberStock,
      //   quantity: value,
      ...Object.entries(filteredQnt).map(([key, value]) => ({
        partNumberStock: key,
        quantity: value,
      })),
    ]);

    // Se la quantità è già presente, aggiorna la quantità nel payload
    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      //new: {
      //  ...(prevPayload.new || {}),
      //  ...Object.fromEntries(
      //    Object.entries(filteredQnt).map(([key, value]) => {
      //      const partNumberStock = key.replace(/^\d+/, "").trim();
      //      return [partNumberStock, value];
      //    })
      //  ),},
      new: {
        ...(prevPayload.new || {}),
        ...filteredQnt,
      },
    }));

    setPendingRequests((prevRequests) => [
      ...prevRequests,
      //...Object.entries(filteredQnt).map(([key, value]) => {
      //  const partNumberStock = key.replace(/^\d+/, "").trim();
      //  return `Aggiunto articolo [${partNumberStock}] quantità: ${value}`;
      //}),
      ...Object.entries(filteredQnt).map(
        ([key, value]) => `Aggiunto articolo [${key}] quantità: ${value}`
      ),
    ]);

    console.log("Payload aggiornato:", payloadObj);
    setOpenModal(false);
  };*/
  }
  const handleAddStockItemFromModal = (filteredQnt) => {
    if (!filteredQnt || Object.keys(filteredQnt).length === 0) {
      console.error("filteredQnt è vuoto o non definito.");
      return;
    }

    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      new: {
        ...(prevPayload.new || {}),
        ...filteredQnt,
      },
    }));

    setPendingRequests((prevRequests) => [
      ...prevRequests,
      ...Object.entries(filteredQnt).map(
        ([key, value]) => `Aggiunto articolo [${key}] quantità: ${value}`
      ),
    ]);

    console.log("Payload aggiornato:", {
      ...payloadObj,
      new: {
        ...(payloadObj.new || {}),
        ...Object.fromEntries(
          Object.entries(filteredQnt).map(([key, value]) => [key, value])
        ),
      },
    });

    // Chiude la modale
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

  {
    /* useEffect(() => {
    // Funzione per aggiungere gli elementi con stato "REQ" nel payload e nelle richieste pendenti
    const handleReqItems = () => {
      if (projectItemsData.length > 0) {
        const reqItems = projectItemsData.filter(
          (item) => item[2] === "REQ" // Campo stato è item[2]
        );

        // Aggiorna pendingRequests con gli elementi "REQ"
        setPendingRequests((prevRequests) => [
          ...prevRequests,
          ...reqItems
            .map((item) => {
              const quantity = Number(item[12]); // Converti il valore in numero
              if (isNaN(quantity)) {
                console.error(
                  `La quantità per ${item[9]} non è un numero valido.`
                );
                return null;
              }
              return `Modifica articolo [${item[9]}] nuovo allocato: ${quantity}`;
            })
            .filter(Boolean), // Rimuovi eventuali valori null
        ]);

        // Aggiorna il payload con gli elementi "REQ"
        setPayloadObj((prevPayload) => ({
          ...prevPayload,
          edits: {
            ...(prevPayload.edits || {}),
            ...reqItems.reduce((acc, item) => {
              const quantity = Number(item[12]); // Converti il valore in numero
              if (!isNaN(quantity)) {
                acc[item[9]] = quantity; // Aggiungi solo se è un numero
              }
              return acc;
            }, {}),
          },
        }));
      }
    };

    handleReqItems();
  }, [projectItemsData]); // Trigger quando cambia projectItemsData



  useEffect(() => {
    const handleReqItems = () => {
      if (projectItemsData.length > 0) {
        const reqItems = projectItemsData.filter(
          (item) => item[2] === "REQ" && item[19]
        ); // Solo elementi REQ con descrizione in [19]

        const newPendingRequests = reqItems
          .map((item) => {
            const partNumber = item[9];
            const description = item[19];
            const pendingQuantity = Number(item[13]); // Valore da usare come "pending"
            const quantity = Number(item[12]); // Valore allocato

            if (description.includes("Elimina articolo")) {
              // Gestisci eliminazione
              return `Elimina articolo [${partNumber}]`;
            } else if (
              description.includes("Modifica articolo") &&
              !isNaN(pendingQuantity)
            ) {
              // Gestisci modifica con valore pending
              return `Modifica articolo [${partNumber}] nuovo allocato: ${pendingQuantity}`;
            }

            console.error(
              `Elemento non valido: ${partNumber}, descrizione: ${description}`
            );
            return null; // Ignora valori non validi
          })
          .filter(Boolean); // Rimuovi eventuali null

        setPendingRequests(newPendingRequests);

        // Aggiorna il payload
        setPayloadObj((prevPayload) => {
          const newEdits = { ...(prevPayload.edits || {}) };

          reqItems.forEach((item) => {
            const partNumber = item[9];
            const description = item[19];
            const pendingQuantity = Number(item[13]); // Valore pending
            const quantity = Number(item[12]); // Valore allocato

            if (description.includes("Elimina articolo")) {
              // Aggiungi come eliminazione
              newEdits[partNumber] = "DELETED";
            } else if (
              description.includes("Modifica articolo") &&
              !isNaN(pendingQuantity)
            ) {
              // Aggiungi come modifica con valore pending
              newEdits[partNumber] = pendingQuantity;
            }
          });

          return {
            ...prevPayload,
            edits: newEdits, // Aggiorna edits
          };
        });
      }
    };

    handleReqItems();
  }, [projectItemsData]); // Trigger quando cambia projectItemsData
*/
  }

  useEffect(() => {
    console.log("ciao");

    console.log(project);

    const handleReqItems = () => {
      if (projectItemsData.length > 0) {
        const reqItems = projectItemsData.filter(
          (item) => item[2] === "REQ" && item[19]
        );

        const newPendingRequests = reqItems
          .map((item) => {
            const partNumber = item[9];
            const description = item[19];
            const pendingQuantity = Number(item[13]);

            if (description.includes("Elimina articolo")) {
              return `Elimina articolo [${partNumber}]`;
            } else if (
              description.includes("Modifica articolo") &&
              !isNaN(pendingQuantity)
            ) {
              return `Modifica articolo [${partNumber}] nuovo allocato: ${pendingQuantity}`;
            } else if (
              description.includes("Aggiunto articolo") &&
              !isNaN(pendingQuantity)
            ) {
              return `Aggiunto articolo [${partNumber}] quantità: ${pendingQuantity}`;
            }

            console.error(
              `Elemento non valido: ${partNumber}, descrizione: ${description}`
            );
            return null;
          })
          .filter(Boolean);

        setPendingRequests(newPendingRequests);
        setInitialPendingRequests(newPendingRequests);

        // Aggiorna il payload
        setPayloadObj((prevPayload) => {
          const newEdits = { ...(prevPayload.edits || {}) };
          const newItems = { ...(prevPayload.new || {}) };

          reqItems.forEach((item) => {
            const partNumber = item[9];
            const description = item[19];
            const pendingQuantity = Number(item[13]);

            if (description.includes("Elimina articolo")) {
              // Aggiungi come eliminazione
              newEdits[partNumber] = "DELETED";
            } else if (
              description.includes("Modifica articolo") &&
              !isNaN(pendingQuantity)
            ) {
              // Aggiungi come modifica
              newEdits[partNumber] = pendingQuantity;
            } else if (
              description.includes("Aggiunto articolo") &&
              !isNaN(pendingQuantity)
            ) {
              // Aggiungi come nuovo articolo
              newItems[partNumber] = pendingQuantity;
            }
          });

          return {
            ...prevPayload,
            edits: newEdits,
            new: newItems,
          };
        });

        setInitialPayloadObj(payloadObj);
      }
    };

    handleReqItems();
  }, [projectItemsData]);

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

    const api = new ApiRest();
    api
      .iuProject(token, updatedPayload)
      .then((data) => {
        console.log("Codice restituito:", data.code); // Accedi a data.code

        if (data.code === 200) {
          if (isSupervisor) {
            alert("Tutte le richieste sono state accettate");
          } else {
            alert("La tua richiesta è stata inviata correttamente");
          }
        } else {
          alert("Errore durante l'invio delle richieste");
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("Errore durante l'invio del payload:", error);
      });

    return;
  };

  //try {
  //  const api = new ApiRest();
  //  const data = api.iuProject(token, updatedPayload);
  // if (data.code === 200) {
  //   console.log("Richieste salvate correttamente");
  // } else {
  // alert("Errore durante l'invio delle richieste");
  // }
  //} catch (error) {
  //  console.error("Errore durante l'invio del payload:", error);
  // }
  //return updatedPayload;
  // window.location.reload();}

  useEffect(() => {
    console.log("PayloadObj after state update:", payloadObj);
  }, [payloadObj]);

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);

  const handleDelete = () => {
    if (isSupervisor) {
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
        cancelRequests: true,
      };
      const api = new ApiRest();
      api
        .iuProject(token, updatedPayload)
        .then((data) => {
          alert("Tutte le richieste sono state eliminate");
          window.location.reload();
        })
        .catch((error) => {
          console.error(
            "Errore durante la cancellazione delle richieste",
            error
          );
        });
    } else {
      setEditableData(initialData);
      setPendingRequests([]);
      setPayloadObj([]);
      setPendingRequests(initialPendingRequests);
      setInitialPayloadObj(initialPayloadObj);
    }
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
                sx={{
                  borderRadius: "8px",
                }}
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 2,
                gap: "15px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FF8C00",
                  color: "white",
                  fontSize: {
                    xs: "0.5rem",
                    sm: "0.5rem",
                    md: "0.6rem",
                    lg: "0.7rem",
                    xl: "0.8rem",
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
                    xs: "0.5rem",
                    sm: "0.5rem",
                    md: "0.6rem",
                    lg: "0.7rem",
                    xl: "0.8rem",
                  },
                  fontFamily: "Poppins!important",
                }}
                onClick={handleDeleteConfirmOpen}
              >
                Cancella
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  fontSize: {
                    xs: "0.5rem",
                    sm: "0.5rem",
                    md: "0.6rem",
                    lg: "0.7rem",
                    xl: "0.8rem",
                  },
                  fontFamily: "Poppins!important",
                }}
                onClick={() => console.log("ciao")}
              >
                Elimina Progetto
              </Button>
            </Box>
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
