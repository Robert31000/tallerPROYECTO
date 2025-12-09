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
    path: "/dashboard/donaciones",
    element: (
      <DashboardShell>
        <DonacionesDashboard />
      </DashboardShell>
    ),
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
]);

export default router;
