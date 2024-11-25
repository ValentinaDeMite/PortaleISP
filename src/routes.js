import React from "react";

const Homepage = React.lazy(() => import("./views/Homepage"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const NewProject = React.lazy(() => import("./views/dashboard/NewProject"));
const ProjectItems = React.lazy(() => import("./views/dashboard/ProjectItems"));
const RequestList = React.lazy(() => import("./views/RequestsList"));
const Stock = React.lazy(() => import("./views/Stock"));
const Contacts = React.lazy(() => import("./views/Contacts"));

const routes = [
  { path: "homepage", element: <Homepage /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "stock", element: <Stock /> },
  { path: "dashboard/projectitems/:id", element: <ProjectItems /> },
  { path: "nuovo-progetto", element: <NewProject /> },
  { path: "richieste", element: <RequestList /> },
  { path: "contatti", element: <Contacts /> },
];

export default routes;
