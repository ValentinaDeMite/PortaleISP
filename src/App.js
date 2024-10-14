import React, { Suspense } from "react";
import Layout from "./layout/Layout";
import { HashRouter, Route, Routes } from 'react-router-dom';
import { routes } from "../src/routes";

// Lazy import delle pagine
const Login = React.lazy(() => import('./views/pages/Login'));
const Page404 = React.lazy(() => import('./views/pages/Page404'));
const Page500 = React.lazy(() => import('./views/pages/Page500'));

function App() {
  return (
    <div className="App">
      <HashRouter>
      <routes />
      <Layout/>
    </HashRouter>
    </div>
  );
}

export default App;
