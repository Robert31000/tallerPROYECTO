import React from "react";
import { Link, NavLink } from "react-router-dom";

interface DashboardShellProps {
  children: React.ReactNode;
}

const linkClasses = (isActive: boolean) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm flex flex-col px-4 py-5">
        {/* Logo + nombre */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow">
            SD
          </div>
          <div>
            <Link
              to="/"
              className="text-sm font-semibold text-slate-900 hover:text-blue-600"
            >
              Sistema de Donaciones
            </Link>
            <p className="text-[11px] text-slate-500">
              Gestión inteligente solidaria
            </p>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="h-px bg-slate-200 mb-4" />

        {/* Grupo: Panel */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
            Panel administrativo
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Resumen IA</span>
            </NavLink>

            <NavLink
              to="/dashboard/donaciones"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Presupuesto / Donaciones</span>
            </NavLink>

            <NavLink
              to="/dashboard/usuarios-roles"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Usuarios y roles</span>
            </NavLink>

            <NavLink
              to="/dashboard/solicitudes/nueva"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Nueva solicitud</span>
            </NavLink>

            <NavLink
              to="/dashboard/solicitudes/revisar"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Revisar solicitudes</span>
            </NavLink>

            <NavLink
              to="/dashboard/publicaciones-donaciones"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Publicaciones</span>
            </NavLink>

            <NavLink
              to="/dashboard/inventario"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Inventario de donaciones</span>
            </NavLink>

            <NavLink
              to="/dashboard/eventos"
              className={({ isActive }) => linkClasses(isActive)}
            >
              <span className="text-[15px]"></span>
              <span>Eventos solidarios</span>
            </NavLink>
          </nav>
        </div>

        {/* Info extra / footer sidebar */}
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500 border border-slate-200">
            <p className="font-semibold text-slate-700">
              Modo administrador
            </p>
            <p>Gestiona solicitudes, donaciones y eventos desde aquí.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Sesión
              </p>
              <p className="text-xs text-slate-600">admin@uagrm.edu</p>
            </div>
            <button
              type="button"
              className="text-[11px] font-medium text-slate-500 hover:text-red-500"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
