import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import Home from "./view/home/Home";
import LoginPage from "./view/login/LoginPage";
import PanelIA from "./view/dashboard/PanelIA";
import DashboardShell from "./view/dashboard/DashboardShell";
import DonacionesDashboard from "./view/dashboard/DonacionesDashboard";

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
]);

export default router;
