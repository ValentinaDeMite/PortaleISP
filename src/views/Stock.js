import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiRest from "../service-API/ApiRest";
import AppTable from "../components/AppTable";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import StockData from "../service-API/stock.json";

const Stock = (props) => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const date = useSelector((state) => state.date);
  const stock = useSelector((state) => state.stock || StockData.values);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ref = useRef();

  const convertTypeColumn = (type) => {
    switch (type) {
      case "T":
        return "text";
      case "N":
        return "number";
      case "D":
        return "date";
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
    const getStock = async () => {
      setLoading(true);
      try {
        const api = new ApiRest();
        const data = await api.getStock(token);
        dispatch({ type: "set", stock: data.values });
        const columns = setColumns(data.fields);
        setColumnDefs(columns);
        dispatch({ type: "set", fieldsStock: columns });
      } catch (error) {
        console.error("API error, using mocked data", error);
        const columns = setColumns(StockData.fields);
        setColumnDefs(columns);
        dispatch({
          type: "set",
          payload: { stock: StockData.values, fieldsStock: columns },
        });
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
              fontFamily: "Poppins!important",
              fontWeight: "600",
            }}
          >
            Stock - Lista articoli disponibili
          </Typography>
          {/*<Typography
            variant="subtitle1"
            align="start"
            color="textSecondary"
            gutterBottom
          >
            Ultimo aggiornamento:{" "}
            {date !== undefined
              ? new Date(date).toLocaleString("it-IT", { hour12: false })
              : "--/--/----, --:--:--"}
          </Typography> */}
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {!loading && (
          <AppTable
            ref={ref}
            columns={columnDefs}
            rows={stock}
            useChips={false}
            showAddItem={true}
            enableSearch={true} // Attiva la barra di ricerca
            enableExcelExport={true} // Attiva l'esportazione in Excel
          />
        )}
      </Box>
    </Box>
  );
};

export default Stock;
