import React, { useMemo, useState } from "react";
import { Boxes, Filter, PackageSearch, PlusCircle, Search } from "lucide-react";
import { ReceiveDonationModal } from "./ReceiveDonationModal";
import type { InventarioItemInput } from "./ReceiveDonationModal";

type InventarioItem = {
  id: number;
  codigo: string;
  recurso: string;
  tipo: string;
  campania: string;
  stockTotal: number;
  stockDisponible: number;
  unidad: string;
  ubicacion: string;
  condicion: "NUEVO" | "USADO";
  fechaRecepcion: string;
  ultimaActualizacion: string;
};

// 🔹 Datos MOCK por ahora
const MOCK_ITEMS: InventarioItem[] = [
  {
    id: 1,
    codigo: "INV-2025-001",
    recurso: "Kits de víveres (arroz, fideo, aceite)",
    tipo: "Víveres",
    campania: "Fondo Samaipata 2025",
    stockTotal: 120,
    stockDisponible: 95,
    unidad: "kits",
    ubicacion: "Depósito central – Estante A1",
    condicion: "NUEVO",
    fechaRecepcion: "2025-02-10",
    ultimaActualizacion: "2025-02-20",
  },
  {
    id: 2,
    codigo: "INV-2025-002",
    recurso: "Frazadas y ropa de abrigo",
    tipo: "Ropa",
    campania: "Campaña Invierno Solidario",
    stockTotal: 80,
    stockDisponible: 38,
    unidad: "bolsas",
    ubicacion: "Depósito central – Estante B3",
    condicion: "USADO",
    fechaRecepcion: "2025-02-12",
    ultimaActualizacion: "2025-02-19",
  },
  {
    id: 3,
    codigo: "INV-2025-003",
    recurso: "Botiquines de primeros auxilios",
    tipo: "Medicamentos",
    campania: "Fondo Samaipata 2025",
    stockTotal: 40,
    stockDisponible: 32,
    unidad: "kits",
    ubicacion: "Depósito central – Estante C2",
    condicion: "NUEVO",
    fechaRecepcion: "2025-02-15",
    ultimaActualizacion: "2025-02-21",
  },
];

export default function InventarioPage() {
  const [items, setItems] = useState<InventarioItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("TODOS");
  const [campaniaFiltro, setCampaniaFiltro] = useState<string>("TODAS");
  const [showRecepcionModal, setShowRecepcionModal] = useState(false);

  const filtrados = useMemo(() => {
    return items.filter((it) => {
      const texto = `${it.codigo} ${it.recurso} ${it.campania}`.toLowerCase();
      const q = search.toLowerCase().trim();
      if (q && !texto.includes(q)) return false;
      if (tipoFiltro !== "TODOS" && it.tipo !== tipoFiltro) return false;
      if (campaniaFiltro !== "TODAS" && it.campania !== campaniaFiltro)
        return false;
      return true;
    });
  }, [items, search, tipoFiltro, campaniaFiltro]);

  const totalStock = items.reduce((acc, it) => acc + it.stockTotal, 0);
  const totalDisponible = items.reduce(
    (acc, it) => acc + it.stockDisponible,
    0,
  );

  function handleCreateFromRecepcion(data: InventarioItemInput) {
    const nuevo: InventarioItem = {
      id: items.length + 1,
      codigo: `INV-2025-${(items.length + 1).toString().padStart(3, "0")}`,
      recurso: data.recurso,
      tipo: data.tipo,
      campania: data.campania,
      stockTotal: data.cantidad,
      stockDisponible: data.cantidad,
      unidad: data.unidad,
      ubicacion: data.ubicacion,
      condicion: data.condicion,
      fechaRecepcion: data.fechaRecepcion,
      ultimaActualizacion: data.fechaRecepcion,
    };
    setItems((prev) => [nuevo, ...prev]);
  }

  const campaniasUnicas = Array.from(new Set(items.map((it) => it.campania)));

  const tiposUnicos = Array.from(new Set(items.map((it) => it.tipo)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Inventario
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            Inventario de donaciones
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Administra el stock de víveres, ropa y otros recursos recibidos en
            las campañas solidarias de la UAGRM. Aquí se refleja lo que está
            disponible para futuras entregas a beneficiarios.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRecepcionModal(true)}
          className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar recepción
        </button>
      </div>

      {/* Resumen */}
      <div className="grid sm:grid-cols-3 gap-4 text-xs">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase text-slate-400">
              Stock total registrado
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {totalStock} ítems
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <PackageSearch className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase text-slate-400">
              Stock disponible para entregar
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {totalDisponible} ítems
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase text-slate-400">
              Campañas activas en inventario
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {campaniasUnicas.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between text-xs">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Buscar por código, recurso o campaña…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
          >
            <option value="TODOS">Todos los tipos</option>
            {tiposUnicos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
            value={campaniaFiltro}
            onChange={(e) => setCampaniaFiltro(e.target.value)}
          >
            <option value="TODAS">Todas las campañas</option>
            {campaniasUnicas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500 uppercase tracking-wide">
          Inventario registrado
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Código
                </th>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Recurso
                </th>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Tipo
                </th>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Campaña
                </th>
                <th className="text-right px-4 py-2 font-semibold text-slate-500">
                  Stock / Disp.
                </th>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Ubicación
                </th>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Condición
                </th>
                <th className="text-left px-4 py-2 font-semibold text-slate-500">
                  Últ. actualización
                </th>
                <th className="text-right px-4 py-2 font-semibold text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-xs text-slate-500"
                  >
                    No hay recursos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtrados.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-2 text-slate-600">{item.codigo}</td>
                    <td className="px-4 py-2 text-slate-900">
                      <div className="font-medium">{item.recurso}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.unidad} • recibido {item.fechaRecepcion}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{item.tipo}</td>
                    <td className="px-4 py-2 text-slate-600">
                      {item.campania}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900">
                      <span className="font-semibold">
                        {item.stockDisponible}
                      </span>{" "}
                      <span className="text-[11px] text-slate-500">
                        / {item.stockTotal}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {item.ubicacion}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={[
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          item.condicion === "NUEVO"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200",
                        ].join(" ")}
                      >
                        {item.condicion === "NUEVO"
                          ? "Nuevo"
                          : "Usado en buen estado"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {item.ultimaActualizacion}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => {
                          // luego podrías abrir otro modal con detalle / historial
                          alert(
                            `Aquí iría el detalle de movimientos del recurso ${item.codigo}`,
                          );
                        }}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de recepción (CU13) */}
      <ReceiveDonationModal
        open={showRecepcionModal}
        onClose={() => setShowRecepcionModal(false)}
        onCreate={handleCreateFromRecepcion}
      />
    </div>
  );
}
