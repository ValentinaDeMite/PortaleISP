import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/store";
import App from "./App";
import "./style/index.scss";

import { LicenseInfo } from "@mui/x-license";

// Licenza MUI
LicenseInfo.setLicenseKey(
  "3ce739dabd6f64887f2b8669cbdd7ad4Tz0xMTE0MDQsRT0xNzc2Mjk3NTk5MDAwLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y"
);

// Render dell'app
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

/*import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { store, persistor } from "../src/store";
import App from "./App";
import theme from "./style/theme"; // Assicurati che il percorso sia corretto
import "./style/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
*/
