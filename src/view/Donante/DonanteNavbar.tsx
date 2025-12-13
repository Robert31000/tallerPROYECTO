import React from "react";
import { Link } from "react-router-dom";

interface DonanteNavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DonanteNavbar: React.FC<DonanteNavbarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
        {/* Logo + título */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-slate-900 text-sm font-bold text-white">
            U
          </div>
          <span className="text-sm font-semibold">UAGRM Donaciones</span>
        </div>

        {/* 🔍 Buscador que filtra el feed */}
        <div className="flex-1">
          <div className="relative max-w-md">
            <input
              className="w-full rounded-md bg-slate-100 px-8 py-1.5 text-xs outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              placeholder="Buscar campañas, hogares, emergencias..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="pointer-events-none absolute left-2 top-1.5 text-sm text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* Menú tipo iconos */}
        <nav className="hidden items-center gap-6 text-xs text-slate-600 md:flex">
          <Link to={'/dashboard-donante'} className="flex flex-col items-center gap-0.5 text-slate-900">
            <span>🏠</span>
            <Link to={'/'}>Inicio</Link>
          </Link>
          <Link to={'/dashboard-donante'} className="flex flex-col items-center gap-0.5 hover:text-slate-900">
            <span>❤️</span>
            <span>Mis donaciones</span>
          </Link>
          <Link to={'/dashboard-donante'} className="flex flex-col items-center gap-0.5 hover:text-slate-900">
            <span>📢</span>
            <span>Campañas</span>
          </Link>
          <Link to={'/dashboard-donante'} className="flex flex-col items-center gap-0.5 hover:text-slate-900">
            <span>🔔</span>
            <span>Alertas</span>
          </Link>
        </nav>

        {/* Avatar / Yo */}
        <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 shadow-sm md:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[0.7rem] font-bold text-white">
            D
          </span>
          <span>Yo</span>
        </button>
      </div>
    </header>
  );
};

export default DonanteNavbar;
