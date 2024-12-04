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

const Dashboard = (props) => {
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

    navigate(`/dashboard/${projectId}`);
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
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Box
          sx={{
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h5"
            align="start"
            gutterBottom
            sx={{
              fontWeight: "600",
              fontSize: {
                xs: "0.5rem",
                sm: "0.8rem",
                md: "1rem",
                lg: "1.2rem",
                xl: "1.5rem",
              },
              fontFamily: "Poppins!important",
            }}
          >
            Dashboard - Lista di tutti i progetti
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        {!loading && (
          <AppTable
            ref={ref}
            columns={columnDefs}
            rows={projects || []}
            useChips={true}
            onRowDoubleClick={handleRowDoubleClick}
            allowDoubleClick={true}
            enableSearch={true}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
