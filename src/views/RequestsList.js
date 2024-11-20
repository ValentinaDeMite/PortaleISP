import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiRest from "../service-API/ApiRest";
import AppTable from "../components/AppTable";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import * as XLSX from "xlsx";
import RequestsData from "../service-API/request.json";
import { useNavigate } from "react-router-dom";

const RequestList = (props) => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const date = useSelector((state) => state.date);
  const requests = useSelector(
    (state) => state.requests || RequestsData.values
  );
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ref = useRef();
  const navigate = useNavigate();

  const filteredRequests = Array.isArray(requests)
    ? requests.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : [];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");
    XLSX.writeFile(workbook, "lista_richieste.xlsx");
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
    const getRequests = async () => {
      setLoading(true);
      try {
        const api = new ApiRest();
        const data = await api.getRequests(token);
        dispatch({ type: "set", requests: data.values });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: "set", fieldsRequests: columns });
      } catch (error) {
        console.error("API error, using mocked data", error);
        const columns = setColumns(RequestsData.fields);
        setColumnDefs(columns);
        dispatch({
          type: "set",
          payload: { requests: RequestsData.values, fieldsStock: columns },
        });
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, [dispatch, token]);

  const handleRowClick = (params) => {
    const projectId = params.row.projectId; // Sostituire `projectId` con il nome effettivo del campo.
    if (projectId) {
      navigate(`/projectitems/${projectId}`);
    }
  };

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
        <Box sx={{ flexShrink: 0 }}>
          <Typography
            variant="h5"
            align="start"
            gutterBottom
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.8rem",
                md: "1rem",
                lg: "1.1rem",
                xl: "1.5rem",
              },
            }}
          >
            Lista Richieste
          </Typography>
          <Typography
            variant="subtitle1"
            align="start"
            color="textSecondary"
            gutterBottom
          >
            Ultimo aggiornamento:{" "}
            {date !== undefined
              ? new Date(date).toLocaleString("it-IT", { hour12: false })
              : "--/--/----, --:--:--"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginY: 5,
            }}
          >
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
                    lg: "0.85rem",
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
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
                onClick={exportToExcel}
              />
            </Tooltip>
          </Box>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {!loading &&
          (filteredRequests.length > 0 ? (
            <AppTable
              ref={ref}
              columns={columnDefs}
              rows={filteredRequests}
              useChips={false}
              showAddItem={true}
              onRowClick={handleRowClick} // Aggiungi questa proprietà.
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60%",
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Non ci sono richieste da visualizzare
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default RequestList;
