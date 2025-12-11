import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import Home from "./view/home/Home";
import LoginPage from "./view/login/LoginPage";
import PanelIA from "./view/dashboard/PanelIA";
import DashboardShell from "./view/dashboard/DashboardShell";
import DonacionesDashboard from "./view/dashboard/DonacionesDashboard";
import UsersRolesPage from "./view/dashboard/UserRolesPage";
import NuevaSolicitudPage from "./view/solicitudes/NuevaSolicitudPage";
import RevisarSolicitudesPage from "./view/dashboard/RevisarSolicitudesPage";
import VerPublicacionesPage from "./view/dashboard/VerPublicacionesPage";
import InventarioPage from "./view/dashboard/InventarioPage";
import EventosSolidariosPage from "./view/dashboard/EventosSolidariosPage";
import DashboardDonante from "./view/Donante/DashboardDonante";
import DonarPage from "./view/Donante/Donar";
import DonacionExitosaPage from "./view/Donante/DonacionExitosaPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <DashboardShell>
        <PanelIA />
      </DashboardShell>
    ),
  },
  {
    path: "/dashboard-donante",
    element: (
        <DashboardDonante />
    ),
  },
  {
    path: "/dashboard/donaciones",
    element: (
      <DashboardShell>
        <DonacionesDashboard />
      </DashboardShell>
    ),
  },
  {
  path: "/dashboard-donante/donar/:id",
  element: <DonarPage />,
},
  {
  path: "/dashboard-donante/donar/:id/exito",
  element: <DonacionExitosaPage />,
},
  {
    path: "/dashboard/usuarios-roles", // 👈 ruta para CU01
    element: (
      <DashboardShell>
        <UsersRolesPage />
      </DashboardShell>
    ),
  },
  {
    path: "/dashboard/solicitudes/nueva",
    element: (
      <DashboardShell>
        <NuevaSolicitudPage />
      </DashboardShell>
    ),
  },

  {
    path: "/dashboard/solicitudes/revisar",
    element: (
      <DashboardShell>
        <RevisarSolicitudesPage />
      </DashboardShell>
    ),
  },

  {
    path: "/dashboard/publicaciones-donaciones",
    element: (
      <DashboardShell>
        <VerPublicacionesPage />
      </DashboardShell>
    ),
  },

  {
    path: "/dashboard/inventario",
    element: (
      <DashboardShell>
        <InventarioPage />
      </DashboardShell>
    ),
  },

  {
    path: "/dashboard/eventos",
    element: (
      <DashboardShell>
        <EventosSolidariosPage />
      </DashboardShell>
    ),
  },
]);

export default router;
