import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiRest from "../../service-API/ApiRest";
import AppTable from "../../components/AppTable";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import projectsData from "../../service-API/projects.json";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

const Dashboard = (props) => {
  const [searchText, setSearchText] = useState("");
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const date = useSelector((state) => state.date);
  const projects = useSelector((state) => {
    return state.projects || projectsData.values;
  });

  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ref = useRef();
  const navigate = useNavigate();

  const handleRowDoubleClick = (row) => {
    const projectDetails = row.row;
    const projectId = projectDetails[0];
    console.log("Dettagli progetto selezionato:", projectDetails);

    dispatch({
      type: "setSelectedProject",
      projectDetails,
    });

    localStorage.setItem("selectedProjectId", projectId);

    navigate(`/dashboard/${projectId}`);
  };

  // export

  const filteredProjects = Array.isArray(projects)
    ? projects.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];
  const exportToExcel = () => {
    if (!filteredProjects || filteredProjects.length === 0 || !columnDefs)
      return;

    const fieldsToExport = columnDefs.map((col) => col.field);
    const headers = columnDefs.reduce((acc, col) => {
      acc[col.field] = col.headerName;
      return acc;
    }, {});

    const filteredForExport = filteredProjects.map((item) => {
      const newItem = {};
      for (const key of fieldsToExport) {
        newItem[headers[key]] = item[key];
      }
      return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Progetti");
    XLSX.writeFile(workbook, "lista_progetti.xlsx");
  };

  const convertTypeColumn = (type) => {
    switch (type) {
      case "T":
        return "text";
      case "N":
        return "number";
      case "D":
        return "text";
      case "B":
        return "button";
      default:
        return "text";
    }
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
    const projectId = sessionStorage.getItem("autoOpenProject");

    if (projectId) {
      console.log("📢 Auto-opening project:", projectId);

      setTimeout(() => {
        const projectRow = document.querySelector(
          `.data-project-id-${projectId}`
        );
        if (projectRow) {
          projectRow.dispatchEvent(
            new MouseEvent("dblclick", { bubbles: true })
          );
          console.log("✅ Double-click simulated for project ID:", projectId);
        } else {
          console.warn("⚠️ Project row not found.");
        }
      }, 1000);

      sessionStorage.removeItem("autoOpenProject"); // Cleanup
    }
  }, []);

  useEffect(() => {
    const getDashboard = async () => {
      setLoading(true);
      try {
        const api = new ApiRest();
        const data = await api.getProjects(token);

        console.log("Risposta API - Dati dei progetti:", data.values);

        dispatch({ type: "set", projects: data.values });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: "set", payload: { fieldsProject: columns } });
      } catch (error) {
        console.error("Errore API, utilizzo dati mockati", error);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
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
            Dettagli Progetti:
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
          <AppTable
            ref={ref}
            columns={columnDefs}
            rows={filteredProjects || []}
            useChips={true}
            onRowDoubleClick={handleRowDoubleClick}
            allowDoubleClick={true}
            //enableSearch={true}
            //enableExcelExport={true}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
