import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Layout from "./layout/Layout";
import routes from "./routes";

const Login = React.lazy(() => import("./views/pages/Login"));
const Page404 = React.lazy(() => import("./views/pages/Page404"));

function App() {
  return (
    <HashRouter>
      <Suspense
        fallback={
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
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
