import React from 'react'

const Homepage = React.lazy(() => import('./views/Homepage'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const NewProject = React.lazy(() => import('./views/dashboard/NewProject'))
const ProjectDetails = React.lazy(() => import('./views/dashboard/ProjectDetatails'))
const ProjectItems = React.lazy(() => import('./views/dashboard/ProjectItems'))
const RequestList = React.lazy(() => import('./views/RequestsList'))
const Contacts = React.lazy(() => import('./views/Contacts'))
const Stock = React.lazy(() => import('./views/Stock'))
const Page404 = React.lazy(() => import('./views/pages/Page404'));
const Page500= React.lazy(() => import('./views/pages/Page500'));
const Login = React.lazy(() => import('./views/pages/Login'));



const routes = [
  { path: '/homepage', exact: true, name: 'Homepage', component: Homepage },
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/nuovo-progetto', name: 'New Project', component: NewProject },
  { path: '/richieste', exact: true, name: 'RequestList', component: RequestList },
  { path: '/stock', name: 'Stock', component: Stock },
  {
    path: '/dashboard/projectitems',
    exact: true,
    name: 'Project Items',
    component: ProjectItems,
  },
  //{
  //  path: '/dashboard/projectitems:id/projectdetails:id',
    //exact: true,
    //name: 'Project Details',
   // component: ProjectDetails,
  //},
  { path: '/contatti', name: 'Contacts', component: Contacts },
  
  
]

export default routes