import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppTable from "../../components/AppTable";
import AppModalTable from "../../components/AppModalTable";
import StockData from "../../service-API/stock.json";
import ApiRest from "../../service-API/ApiRest";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

const api = new ApiRest();
const ProjectItems = () => {
  const [searchText, setSearchText] = useState("");
  const ref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const project = useSelector((state) => state.selectedProject);
  let arrowIcon = "\u2192";
  const [details, setDetails] = useState({});
  const [disponibile, setDisponibile] = useState();

  const token = useSelector((state) => state.token);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  // const [editableData, setEditableData] = useState({
  //   projectName: project[8],
  //   projectDescription: project[9],
  //   projectNotes: project[10],
  //   projectManager: project[17],
  //   startDate: project[18]?.split(" ")[0] || "",
  //   endDate: project[19]?.split(" ")[0] || "",
  // });
  // const [editableData, setEditableData] = useState(null);

  // const [initialData] = useState({ ...editableData });
  const [editableData, setEditableData] = useState({});
  const [initialData, setInitialData] = useState({});

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [refreshKey, setRefreshKey] = useState(0);
  const [openDeleteProjectDialog, setOpenDeleteProjectDialog] = useState(false);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [pnCliente, setPnCliente] = useState(null);
  const [allocationData, setAllocationData] = useState([]);
  const [allocationColumns, setAllocationColumns] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const info = useSelector((state) => state.info);
  let isSupervisor = info.ruolo === "Supervisor";
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  const handleRowDoubleClick = (params) => {
    const selectedPnCliente = params.row["1"];
    const descriptionValue = params.row["2"];

    console.log("pnCliente selezionato:", selectedPnCliente);
    console.log(info.ruolo);

    if (!selectedPnCliente) {
      console.warn("⚠️ Nessun pnCliente trovato!");
      return;
    }

    setPnCliente(selectedPnCliente);
    setDescription(descriptionValue);

    setAllocationModalOpen(true);
  };

  useEffect(() => {
    if (!pnCliente || !token) return;

    const getItemAllocation = async () => {
      const api = new ApiRest();
      try {
        const allocationData = await api.getItemAllocation(pnCliente, token);
        console.log("Fetched allocationData:", allocationData);

        setAllocationData(allocationData.values || []);
        setAllocationColumns(setColumnsAllocatedItems(allocationData.fields));
      } catch (error) {
        console.error("Error fetching allocation data:", error);
      } finally {
        setLoading(false);
      }
    };

    getItemAllocation();
  }, [pnCliente, token]);

  // Funzione per chiudere la seconda modale
  const handleCloseAllocationModal = () => {
    setAllocationModalOpen(false);
    setPnCliente(null);
    setAllocationData([]);
  };

  const setColumnsAllocatedItems = (fields) => {
    return fields
      .filter((field) => Object.values(field)[0].show)
      .map((field) => {
        const fieldData = Object.values(field)[0];
        return {
          field: fieldData.forcount.toString(),
          headerName: fieldData.name,
          width: fieldData.type === "N" ? 100 : 250,
          type: fieldData.type === "N" ? "number" : "text",
          editable: fieldData.editable,
        };
      });
  };

  const filteredData = projectItemsData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const [modalQuantities, setModalQuantities] = useState({});

  // Callback per gestire le quantità nella modale
  const handleUpdateQuantities = (updatedQuantities) => {
    setModalQuantities(updatedQuantities);
  };

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
  const handleFetchDisponibile = async (pn) => {
    if (!pn || !token) return;

    try {
      const disponibileData = await api.getDisponibile(token, pn);
      if (disponibileData && disponibileData.dispo !== undefined) {
        console.log(
          "✅ Dati ricevuti da getDisponibile:",
          disponibileData.dispo
        );
        setDisponibile(parseInt(disponibileData.dispo));
      } else {
        console.warn("⚠️ Nessun dato disponibile per pn:", pn);
        setDisponibile(0);
      }
    } catch (error) {
      console.error(
        "❌ Errore nel recupero dei dati da getDisponibile:",
        error
      );
      setDisponibile(0);
    }
  };

  // Editpen

  const handleEditRow = (editedRow) => {
    let originalEditRow = filteredItems.filter(
      (row) => row[1] === editedRow[1]
    )[0];
    filteredItems.filter((row) => row[1] === editedRow[1])[0][2] = "REQ";
    console.log("originalEditRow", originalEditRow);
    let newPendingValue = editedRow[14];
    let newValueForecast = editedRow[12];
    let newQty = parseInt(editedRow[13]);
    let originalQty = parseInt(originalEditRow[13]);
    const pn = editedRow["9"];

    let originalPendingValue = originalEditRow[14];
    let originalForecastValue = originalEditRow[12];

    let isNewPending = false;
    let isNewForecast = false;

    let rowDescId = editedRow[10];

    // Se nessun valore è cambiato, chiudi la modale e interrompi l'esecuzione
    console.log("📌 originalQty:", originalQty, typeof originalQty);
    console.log("📌 newQty:", newQty, typeof newQty);

    // if (
    //   originalPendingValue === newPendingValue &&
    //   originalForecastValue === newValueForecast &&
    //   originalQty === newQty
    // ) {
    //   console.log("🟢 Nessuna modifica rilevata, esco.");
    //   return;
    // }

    // // if (originalQty !== newQty) {
    // //   isNewPending = true;
    // // }
    // if (originalQty !== newQty && !(originalQty === 0 && newQty === 0)) {
    //   isNewPending = true;
    // }

    // if (originalForecastValue !== newValueForecast) {
    //   isNewForecast = true;
    // }

    // Se nessun valore è cambiato, chiudi la modale e interrompi l'esecuzione
    if (
      originalPendingValue === newPendingValue &&
      originalForecastValue === newValueForecast &&
      (originalQty === newQty || (originalQty !== 0 && newQty === 0))
    ) {
      console.log("Nessuna modifica rilevata");
      return;
    }

    // Variazione allocato: solo se è diversa e diversa da 0
    if (originalQty !== newQty && newQty !== 0) {
      isNewPending = true;
    }

    // Variazione forecast: solo se è effettivamente cambiata
    if (originalForecastValue !== newValueForecast) {
      isNewForecast = true;
    }

    // if (newPendingValue != 0 && originalQty != newPendingValue) {
    //   // originalPending = pending;
    // } else {
    //   originalPendingValue = originalQty;
    // }

    console.log("originalPending:", originalPendingValue);
    console.log("newPendingValue:", newPendingValue);
    console.log("originalQty:", originalQty);
    console.log("newlQty:", newQty);

    let editDescriptionQty = `Modifica articolo [${rowDescId}] Nuova Quantità Allocata: ${originalQty} ${arrowIcon} ${newQty}`;

    let editDescriptionForecast = `Modifica articolo [${rowDescId}] Forecast: ${originalForecastValue} ${arrowIcon} ${newValueForecast}`;

    const rowEditValue = [
      isNewForecast
        ? parseInt(newValueForecast)
        : parseInt(originalForecastValue),
      isNewPending ? parseInt(newQty) : parseInt(originalQty),
    ]; // Nuovi valori

    setPendingRequests((prevRequests) => {
      let updatedEdits = [...prevRequests];

      let editIndex = updatedEdits.findIndex((desc) =>
        desc.includes(
          `Modifica articolo [${rowDescId}] Nuova Quantità Allocata:`
        )
      );

      let editIndexForecast = updatedEdits.findIndex((desc) =>
        desc.includes(`Modifica articolo [${rowDescId}] Forecast`)
      );

      if (isNewPending) {
        editIndex !== -1
          ? (updatedEdits[editIndex] = editDescriptionQty)
          : updatedEdits.push(editDescriptionQty);
      }

      if (isNewForecast) {
        editIndexForecast !== -1
          ? (updatedEdits[editIndexForecast] = editDescriptionForecast)
          : updatedEdits.push(editDescriptionForecast);
      }

      return updatedEdits;
    });

    setPayloadObj((prevPayload) => ({
      ...prevPayload,
      edits: {
        ...prevPayload.edits,
        [editedRow[9]]: rowEditValue,
      },
    }));

    originalEditRow[14] = newPendingValue;
    originalEditRow[12] = newValueForecast;
    setEditedRows(originalEditRow);
  };

  useEffect(() => {
    if (!pendingRequests || pendingRequests.length === 0) {
      setIsConfirmDisabled(true);
    } else {
      setIsConfirmDisabled(false);
    }
  }, [pendingRequests]);

  // Delete Project

  const handleDeleteProject = async () => {
    const updatedPayload = {
      new: payloadObj || {},
      edits: payloadObj || {},
      project: project,
      cancelRequests: false,
      deleteProject: true,
      qtydelta: false,
    };
    console.log(payloadObj);
    const api = new ApiRest();
    api
      .iuProject(token, updatedPayload)
      .then((data) => {
        setSnackbarMessage(
          isSupervisor
            ? "Tutte le richieste sono state accettate"
            : "La tua richiesta è stata inviata correttamente"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setRefreshKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error("Errore durante l'invio del payload:", error);
        setSnackbarMessage("Errore durante l'invio delle richieste");

        console.log("✅ Snackbar aperta:", openSnackbar);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.log("❌ Snackbar aperta in errore:", openSnackbar);
      });
    setOpenDeleteProjectDialog(false);
    navigate("/dashboard");
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

  const handleOpenModal = () => {
    setOpenModal(true);
    fetchStockDataForModal();
  };

  const handleCloseModal = () => setOpenModal(false);

  const getModalColumnDefs = () => {
    return columnDefs.map((column) => ({
      ...column,
      width: column.width || 150,
      sortable: true,
    }));
  };

  const handleAddStockItemFromModal = (filteredQnt) => {
    if (!filteredQnt || Object.keys(filteredQnt).length === 0) {
      //console.error("filteredQnt è vuoto o non definito.");
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

        // if (items.details) {
        //   setDetails(items.details); // 💥 mantiene i dati NON editabili

        //   setEditableData({
        //     projectName: items.details[8] || "",
        //     projectDescription: items.details[9] || "",
        //     projectNotes: items.details[10] || "",
        //     projectManager: items.details[17] || "",
        //     startDate: items.details[18]?.split(" ")[0] || "",
        //     endDate: items.details[19]?.split(" ")[0] || "",
        //   });
        // }
        if (items.details) {
          setDetails(items.details);
          const newEditable = {
            projectName: items.details[8] || "",
            projectDescription: items.details[9] || "",
            projectNotes: items.details[10] || "",
            projectManager: items.details[17] || "",
            startDate: items.details[18]?.split(" ")[0] || "",
            endDate: items.details[19]?.split(" ")[0] || "",
          };

          setEditableData(newEditable);
          setInitialData(newEditable); // ✅ assicurati che sia sincronizzato
        }

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
                const value = params.value;
                const isNegativeNumber =
                  fieldData.type === "N" &&
                  typeof value === "number" &&
                  value < 0;

                if (isNegativeNumber) {
                  return (
                    <Box sx={{ color: "red", fontWeight: "bold" }}>{value}</Box>
                  );
                }

                return value;
              },
            };
          });

        setColumnDefs(columns);
      } catch (error) {
        console.error("Errore nel recuperare i project items:", error);
      }
    };

    fetchProjectItems();
  }, [token, project, refreshKey]);

  useEffect(() => {
    //console.log(project);

    const handleReqItems = () => {
      if (projectItemsData.length > 0) {
        const reqItems = projectItemsData.filter(
          (item) => (item[2] === "REQ" || item[20]) && item[19]
        );

        let deleteProjectRequestLogged = false;

        // Aggiorna pendingRequests direttamente
        const newPendingRequests = reqItems
          .map((item) => {
            const partNumber = item[9];
            const description = item[20];
            const pendingQuantity = Number(item[14]);

            if (description.includes("Elimina articolo")) {
              return `Elimina articolo [${partNumber}];`;
            } else if (
              description.includes("Modifica articolo") &&
              !isNaN(pendingQuantity)
            ) {
              return `Modifica articolo [${partNumber}] nuovo allocato: ${pendingQuantity};`;
            } else if (
              description.includes("Aggiunto articolo") &&
              !isNaN(pendingQuantity)
            ) {
              return `Aggiunto articolo [${partNumber}] quantità: ${pendingQuantity};`;
            } else if (
              description.includes("Richiesta eliminazione Progetto") &&
              !deleteProjectRequestLogged
            ) {
              deleteProjectRequestLogged = true;
              return `Richiesta eliminazione progetto;`;
            } else if (
              description.includes("Richiesta eliminazione Progetto") &&
              reqItems.length === 1
            ) {
              return `Richiesta eliminazione progetto;`;
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
          let deleteProjectRequest = false;

          reqItems.forEach((item) => {
            const partNumber = item[9];
            const description = item[20];
            const pendingQuantity = Number(item[14]);
            const forecastNumber = Number(item[12]);
            if (description.includes("Elimina articolo")) {
              newEdits[partNumber] = "DELETED";
            } else if (
              description.includes("Modifica articolo") &&
              !isNaN(pendingQuantity)
            ) {
              newEdits[partNumber] = [forecastNumber, pendingQuantity];
            } else if (
              description.includes("Aggiunto articolo") &&
              !isNaN(pendingQuantity)
            ) {
              newItems[partNumber] = pendingQuantity;
            } else if (
              description.includes("Richiesta eliminazione Progetto")
            ) {
              deleteProjectRequest = true;
            }
          });

          return {
            ...prevPayload,
            edits: newEdits,
            new: newItems,
            deleteProject: deleteProjectRequest,
          };
        });

        setInitialPayloadObj(payloadObj);
      }
    };

    handleReqItems();
  }, [projectItemsData]);

  useEffect(() => {
    // console.log("openSnackbar:", openSnackbar);
  }, [openSnackbar]);

  // Form

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target || e; // Per supportare Autocomplete

  //   setEditableData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));

  //   setPayloadObj((prevPayload) => ({
  //     ...prevPayload,
  //     project: {
  //       ...prevPayload.project,
  //       [name]: value,
  //     },
  //   }));

  //   setPendingRequests((prevRequests) => {
  //     const updatedRequests = prevRequests.filter(
  //       (req) => !req.startsWith(`${getFieldLabel(name)} aggiornato:`)
  //     );

  //     if (value) {
  //       updatedRequests.push(`${getFieldLabel(name)} aggiornato: ${value}`);
  //     }
  //     return updatedRequests;
  //   });

  //   console.log("✅ Payload aggiornato:", payloadObj);
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target || e;

    // ✅ Se il valore è identico a quello iniziale, rimuovi la richiesta pendente e non aggiornare payload
    if (value === initialData[name]) {
      setEditableData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      setPendingRequests((prev) =>
        prev.filter(
          (req) => !req.startsWith(`${getFieldLabel(name)} aggiornato:`)
        )
      );

      // Rimuoviamo anche dal payload se era stato settato
      setPayloadObj((prevPayload) => {
        const updatedProject = { ...prevPayload.project };
        delete updatedProject?.[name];

        return {
          ...prevPayload,
          project: updatedProject,
        };
      });

      return;
    }

    // 🔄 Se il valore è cambiato, aggiornalo normalmente
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

    // console.log("✅ Payload aggiornato:", payloadObj);
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

  const filteredItems = Array.isArray(projectItemsData)
    ? projectItemsData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];
  const exportToExcel = () => {
    const filteredForExport = filteredItems.map((item) => {
      const entries = Object.entries(item).filter(
        ([key, value], index) => index !== 21 && index !== 22
      );

      return Object.fromEntries(entries);
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articoli");
    XLSX.writeFile(workbook, "lista_articoli_progetto.xlsx");
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

  // Conferma Richieste

  const handleConfirm = () => {
    const updatedProject = { ...details };
    updatedProject[8] = editableData.projectName;
    updatedProject[9] = editableData.projectDescription;
    updatedProject[10] = editableData.projectNotes;
    updatedProject[17] = editableData.projectManager;
    updatedProject[18] = editableData.startDate;
    updatedProject[19] = editableData.endDate;

    const updatedPayload = {
      new: payloadObj.new || {},
      edits: payloadObj.edits || {},
      project: updatedProject,
      cancelRequests: false,
      deleteProject: payloadObj.deleteProject || false,
      qtydelta: true,
    };

    const api = new ApiRest();
    api
      .iuProject(token, updatedPayload)
      .then((data) => {
        setSnackbarMessage(
          isSupervisor
            ? "Tutte le richieste sono state accettate"
            : "La tua richiesta è stata inviata correttamente"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setRefreshKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error("Errore durante l'invio del payload:", error);
        setSnackbarMessage("Errore durante l'invio delle richieste");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  useEffect(() => {
    // console.log("PayloadObj after state update:", payloadObj);
  }, [payloadObj]);

  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Elimina Richieste

  // const handleDelete = () => {
  //   if (isSupervisor) {
  //     details[8] = editableData.projectName;
  //     details[9] = editableData.projectDescription;
  //     details[10] = editableData.projectNotes;
  //     details[17] = editableData.projectManager;
  //     details[18] = editableData.startDate;
  //     details[19] = editableData.endDate;

  //     const updatedPayload = {
  //       new: payloadObj.new || {},
  //       edits: payloadObj.edits || {},
  //       project: project,
  //       cancelRequests: true,
  //       deleteProject: false,
  //     };

  //     const api = new ApiRest();
  //     api
  //       .iuProject(token, updatedPayload)
  //       .then((data) => {
  //         setSnackbarMessage("Tutte le richieste sono state eliminate");
  //         setSnackbarSeverity("success");
  //         setOpenSnackbar(true);
  //         setRefreshKey((prevKey) => prevKey + 1);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "Errore durante la cancellazione delle richieste",
  //           error
  //         );
  //         setSnackbarMessage("Errore durante la cancellazione delle richieste");
  //         setSnackbarSeverity("error");
  //         setOpenSnackbar(true);
  //       });
  //   } else {
  //     setEditableData(initialData);
  //     setPendingRequests([]);
  //     setPayloadObj([]);
  //     setPendingRequests(initialPendingRequests);
  //     setInitialPayloadObj(initialPayloadObj);
  //   }
  //   setOpenDeleteConfirm(false);
  // };
  const handleDelete = () => {
    const hasRichieste =
      Object.keys(payloadObj?.new || {}).length > 0 ||
      Object.keys(payloadObj?.edits || {}).length > 0 ||
      Object.keys(payloadObj?.project || {}).length > 0;

    if (!hasRichieste) {
      // RESET se sono solo modifiche locali
      setEditableData(initialData);
      setPendingRequests([]);
      setInitialPendingRequests([]);
      setPayloadObj({});
      setInitialPayloadObj({});

      setSnackbarMessage("Modifiche annullate");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    } else {
      const updatedDetails = {
        ...details,
        8: editableData.projectName,
        9: editableData.projectDescription,
        10: editableData.projectNotes,
        17: editableData.projectManager,
        18: editableData.startDate,
        19: editableData.endDate,
      };

      const updatedPayload = {
        new: payloadObj.new || {},
        edits: payloadObj.edits || {},
        project: updatedDetails,
        cancelRequests: true,
        deleteProject: false,
        qtydelta: false,
      };

      const api = new ApiRest();
      api
        .iuProject(token, updatedPayload)
        .then(() => {
          setSnackbarMessage("Le richieste sono state annullate correttamente");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

          // Reset manuale dopo invio
          setPayloadObj({});
          setInitialPayloadObj({});
          setPendingRequests([]);
          setInitialPendingRequests([]);
          setEditableData(initialData);
          setRefreshKey((prev) => prev + 1);
        })
        .catch((error) => {
          console.error("Errore durante annullamento", error);
          setSnackbarMessage("Errore durante l'annullamento");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        });
    }

    setOpenDeleteConfirm(false);
  };

  const handleOpenDeleteProjectDialog = () => setOpenDeleteProjectDialog(true);
  const handleCloseDeleteProjectDialog = () =>
    setOpenDeleteProjectDialog(false);

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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
              paddingY: "1rem",
            }}
          >
            {details["8"]}
          </Typography>

          <Tooltip
            title="Elimina Progetto"
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
            <DeleteForeverTwoToneIcon
              sx={{
                color: "red",
                fontSize: {
                  xs: "0.5rem",
                  sm: "1rem",
                  md: "1.2rem",
                  lg: "1.5rem",
                  xl: "1.8rem",
                },
                "&:hover": { color: "rgba(244, 67, 54, .7)" },
                cursor: "pointer",
              }}
              aria-label="delete"
              onClick={handleOpenDeleteProjectDialog}
            />
          </Tooltip>
        </Box>
        <Dialog
          open={openDeleteProjectDialog}
          onClose={handleCloseDeleteProjectDialog}
        >
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sei sicuro di voler eliminare questo progetto? Questa azione non
              può essere annullata.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteProjectDialog} color="primary">
              Annulla
            </Button>
            <Button onClick={handleDeleteProject} color="error" autoFocus>
              Conferma
            </Button>
          </DialogActions>
        </Dialog>
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
                xl: "0.9rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Ultima Modifica:{" "}
            {details["5"]
              ? format(new Date(details["5"]), "dd/MM/yyyy HH:mm")
              : "N/A"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.5rem",
                md: "0.6rem",
                lg: "0.7rem",
                xl: "0.9rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Modificato da: {details["6"]}
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
                { label: "ID Progetto", value: details["0"] || "N/A" },
                { label: "Stato", value: details["1"] || "N/A" },
                { label: "Allocato", value: details["13"] || "0" },
                { label: "Evaso", value: details["14"] || "0" },
                { label: "Residuo", value: details["15"] || "0" },
                { label: "Forecast", value: details["12"] || "0" },
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
            {/* 
            <Stack spacing={2} direction="row">
              {[
                "projectName",
                "projectDescription",
                "startDate",
                "endDate",
                "projectNotes",
                "projectManager",
              ].map((field, index) =>
                field === "projectManager" ? (
                  // <FormControl key={index} fullWidth>
                  //   <InputLabel>Project Manager</InputLabel>
                  //   <Select
                  //     name={field}
                  //     value={editableData[field] || ""}
                  //     onChange={(e) => handleInputChange(e, field)}
                  //   >
                  //     {editableData[field] && (
                  //       <MenuItem value={editableData[field]}>
                  //         {editableData[field]}
                  //       </MenuItem>
                  //     )}
                  //     {(info.pms || "")
                  //       .split(";")
                  //       .filter((pm) => pm !== editableData[field])
                  //       .map((pm, idx) => (
                  //         <MenuItem key={idx} value={pm.trim()}>
                  //           {pm.trim()}
                  //         </MenuItem>
                  //       ))}
                  //   </Select>
                  // </FormControl>
                  <FormControl key={index} fullWidth>
                    <InputLabel>Project Manager</InputLabel>
                    <Select
                      name={field}
                      value={editableData[field] || ""}
                      onChange={(e) => handleInputChange(e, field)}
                    >
                      {(info.pms || "")
                        .split(";")
                        .filter((pm) => pm.trim() && pm !== editableData[field])
                        .map((pm, idx) => (
                          <MenuItem key={idx} value={pm.trim()}>
                            {pm.trim()}
                          </MenuItem>
                        ))}
                      <MenuItem value="N/A">N/A</MenuItem>
                    </Select>
                  </FormControl>
                ) : field === "projectName" ? (
                  <Autocomplete
                    freeSolo
                    options={
                      info.projects
                        ? info.projects.split(";").map((p) => p.trim())
                        : []
                    }
                    value={editableData.projectName || ""}
                    onChange={(event, newValue) => {
                      if (newValue !== editableData.projectName) {
                        handleInputChange({
                          target: { name: "projectName", value: newValue },
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nome Progetto"
                        fullWidth
                        size="medium"
                        onBlur={(e) => {
                          const newValue = e.target.value;
                          if (newValue !== editableData.projectName) {
                            handleInputChange({
                              target: { name: "projectName", value: newValue },
                            });
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          borderRadius: "8px",
                          minWidth: "350px",
                          fontSize: "1.1rem",
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
                        }}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    key={index}
                    label={
                      field === "projectDescription"
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
            </Stack> */}
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} sx={{ paddingY: "4px" }}>
                {/* Nome Progetto */}
                <Box flex={1}>
                  <Autocomplete
                    freeSolo
                    options={
                      info.projects
                        ? info.projects.split(";").map((p) => p.trim())
                        : []
                    }
                    value={editableData.projectName || ""}
                    onChange={(event, newValue) => {
                      if (newValue !== editableData.projectName) {
                        handleInputChange({
                          target: { name: "projectName", value: newValue },
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nome Progetto"
                        fullWidth
                        size="medium"
                        onBlur={(e) => {
                          const newValue = e.target.value;
                          if (newValue !== editableData.projectName) {
                            handleInputChange({
                              target: { name: "projectName", value: newValue },
                            });
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ borderRadius: "8px" }}
                      />
                    )}
                  />
                </Box>

                {/* Descrizione */}
                <TextField
                  label="Descrizione Progetto"
                  name="projectDescription"
                  value={editableData.projectDescription || ""}
                  onChange={(e) => handleInputChange(e, "projectDescription")}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() =>
                            handleCancelChange("projectDescription")
                          }
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
                  sx={{ flex: 1, borderRadius: "8px" }}
                />

                {/* Data Inizio */}
                <TextField
                  label="Data Inizio"
                  name="startDate"
                  type="date"
                  value={editableData.startDate || ""}
                  onChange={(e) => handleInputChange(e, "startDate")}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => handleCancelChange("startDate")}
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
                  sx={{ width: "160px", borderRadius: "8px" }}
                />

                {/* Data Fine */}
                <TextField
                  label="Data Fine"
                  name="endDate"
                  type="date"
                  value={editableData.endDate || ""}
                  onChange={(e) => handleInputChange(e, "endDate")}
                  InputLabelProps={{ shrink: true }}
                  error={dateError}
                  helperText={
                    dateError
                      ? "La data di fine deve essere successiva a quella di inizio"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => handleCancelChange("endDate")}
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
                  sx={{ width: "160px", borderRadius: "8px" }}
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                {/* Note Progetto */}
                <TextField
                  label="Note Progetto"
                  name="projectNotes"
                  value={editableData.projectNotes || ""}
                  onChange={(e) => handleInputChange(e, "projectNotes")}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => handleCancelChange("projectNotes")}
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
                  sx={{ flex: 1, borderRadius: "8px", minWidth: "300px" }}
                />

                {/* Project Manager */}
                <FormControl sx={{ minWidth: 350 }}>
                  <InputLabel>Project Manager</InputLabel>
                  <Select
                    name="projectManager"
                    value={editableData.projectManager || ""}
                    onChange={(e) => handleInputChange(e, "projectManager")}
                  >
                    {(info.pms || "")
                      .split(";")
                      .filter(
                        (pm) => pm.trim() && pm !== editableData.projectManager
                      )
                      .map((pm, idx) => (
                        <MenuItem key={idx} value={pm.trim()}>
                          {pm.trim()}
                        </MenuItem>
                      ))}
                    <MenuItem value="N/A">N/A</MenuItem>
                  </Select>
                </FormControl>
                {/* Project Manager Backup*/}
                <FormControl sx={{ minWidth: 350 }}>
                  <InputLabel>PM Backup</InputLabel>
                  <Select
                    name="projectManager"
                    value={editableData.projectManager || ""}
                    onChange={(e) => handleInputChange(e, "projectManager")}
                  >
                    {(info.pms || "")
                      .split(";")
                      .filter(
                        (pm) => pm.trim() && pm !== editableData.projectManager
                      )
                      .map((pm, idx) => (
                        <MenuItem key={idx} value={pm.trim()}>
                          {pm.trim()}
                        </MenuItem>
                      ))}
                    <MenuItem value="N/A">N/A</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              sx={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Richieste Pendenti"
                value={pendingRequests.join("\n")}
                multiline
                sx={{
                  borderRadius: "8px",
                  width: "80%",
                  whiteSpace: "pre",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1.5rem",
                }}
              >
                <Tooltip
                  title="Conferma"
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
                      backgroundColor: isConfirmDisabled
                        ? "gray !important"
                        : "#FF8C00",
                      color: "white  !important",

                      fontFamily: "Poppins!important",
                      "&:hover": {
                        backgroundColor: isConfirmDisabled
                          ? "gray  !important"
                          : "rgba(50, 50, 50, .89)",
                      },
                    }}
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled} // 👈 Disable button if no pending requests
                  >
                    <CheckIcon
                      sx={{
                        fontSize: {
                          xs: "14px",
                          sm: "16px",
                          md: "18px",
                          lg: "20px",
                          xl: "28px",
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title="Annulla"
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
                    variant="contained"
                    sx={{
                      backgroundColor: isConfirmDisabled
                        ? "gray !important"
                        : "#108CCB",
                      color: "white !important",

                      fontFamily: "Poppins!important",
                      "&:hover": {
                        backgroundColor: isConfirmDisabled
                          ? "gray  !important"
                          : "rgba(50, 50, 50, .89)",
                      },
                    }}
                    onClick={handleDeleteConfirmOpen}
                    disabled={isConfirmDisabled}
                  >
                    <CloseIcon
                      sx={{
                        fontSize: {
                          xs: "14px",
                          sm: "16px",
                          md: "18px",
                          lg: "20px",
                          xl: "28px",
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
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
          width: "99%",
          margin: "3rem 0 2rem  0 ",
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Contenitore per barra di ricerca e icona export */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
                width: "75%",
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

            {/* Icona export */}
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

          {/* Tasto aggiungi */}
          <Tooltip
            title="Aggiungi un nuovo Item"
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
                backgroundColor: "#108CCB",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(50, 50, 50, .89)",
                },
              }}
              onClick={handleOpenModal}
            >
              <AddIcon
                sx={{
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                    md: "18px",
                    lg: "20px",
                    xl: "28px",
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ width: "99%", mt: "1rem" }}>
        <AppTable
          ref={ref}
          columns={columnDefs}
          rows={filteredData || []}
          onDeleteRow={handleDeleteRow}
          onEditRow={handleEditRow}
          useChips={true}
          showActions={true}
          disableCheckboxSelection={true}
          onRowDoubleClick={() => {}}
          fetchDisponibile={handleFetchDisponibile}
          disponibile={disponibile}
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
              onUpdateQuantities={handleUpdateQuantities}
              onRowDoubleClick={(params) => {
                console.log(
                  "🖱️ Doppio click sulla riga ricevuto in AppTable:",
                  params
                );
                handleRowDoubleClick(params);
              }}
            />
          )}
        </Box>
      </Modal>

      <Modal
        open={allocationModalOpen}
        onClose={() => handleCloseAllocationModal()}
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
            Dati allocazione per: "{description}"
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : allocationData.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              Non ci sono progetti per questo articolo.
            </Typography>
          ) : (
            <AppTable columns={allocationColumns} rows={allocationData || []} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectItems;
