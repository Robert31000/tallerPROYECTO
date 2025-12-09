import React from "react";
import { NavLink } from "react-router-dom";

interface DashboardShellProps {
  children: React.ReactNode;
}

const linkClasses = (isActive: boolean) =>
  [
    "block rounded-md px-3 py-1 text-sm font-medium transition-colors",
    isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100",
  ].join(" ");

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col gap-6 px-4 py-5">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Sistema de Donaciones
          </div>
          <div className="text-xs text-slate-500">
            Gestión inteligente de solicitudes
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
            Panel
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => linkClasses(isActive)}
            >
              Resumen IA
            </NavLink>

            <NavLink
              to="/dashboard/donaciones"
              className={({ isActive }) => linkClasses(isActive)}
            >
              Presupuesto / Donaciones
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
            Sesión
          </p>
          <button
            type="button"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            (luego) Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
};

export default DashboardShell;
