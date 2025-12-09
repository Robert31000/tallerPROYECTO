import React from "react";

const UsersRolesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Título y descripción */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Gestión de usuarios y roles
          </h1>
          <p className="text-sm text-slate-600">
            Administra cuentas, asigna roles (administrador, coordinador,
            voluntario, revisor, etc.) y controla los permisos del sistema.
          </p>
        </div>

        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          + Nuevo usuario
        </button>
      </header>

      {/* Filtros rápidos */}
      <section className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Buscar por nombre o correo
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Juan Pérez, juan@uagrm.edu.bo"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Rol
          </label>
          <select className="rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos</option>
            <option>Administrador</option>
            <option>Coordinador de campaña</option>
            <option>Voluntario</option>
            <option>Revisor de solicitudes</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Estado
          </label>
          <select className="rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos</option>
            <option>Activo</option>
            <option>Bloqueado</option>
          </select>
        </div>
      </section>

      {/* Tabla de usuarios (mock) */}
      <section className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                Usuario
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                Rol
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                Correo
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-700">
                Estado
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2">
                <div className="font-medium text-slate-900">Robert Flores</div>
                <div className="text-xs text-slate-500">
                  ID: 2199999 • UAGRM
                </div>
              </td>
              <td className="px-4 py-2">Administrador</td>
              <td className="px-4 py-2">robert@uagrm.edu.bo</td>
              <td className="px-4 py-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Activo
                </span>
              </td>
              <td className="px-4 py-2 text-right space-x-2">
                <button className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                  Editar
                </button>
                <button className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                  Bloquear
                </button>
              </td>
            </tr>

            <tr>
              <td className="px-4 py-2">
                <div className="font-medium text-slate-900">
                  Comité Samaipata
                </div>
                <div className="text-xs text-slate-500">
                  ID: COLECTIVO-01 • Institucional
                </div>
              </td>
              <td className="px-4 py-2">Coordinador de campaña</td>
              <td className="px-4 py-2">samaipata@uagrm.edu.bo</td>
              <td className="px-4 py-2">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  Pendiente
                </span>
              </td>
              <td className="px-4 py-2 text-right space-x-2">
                <button className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                  Revisar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UsersRolesPage;
