import React, { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  PackageSearch,
  PlusCircle,
  Search,
  Loader2,
} from "lucide-react";
import { ReceiveDonationModal } from "./ReceiveDonationModal";
import { listarInventario, registrarIngresoInventario } from "../../lib/api";
import type { InventarioItemInput } from "./ReceiveDonationModal";
import type { ItemInventario } from "../../lib/api";

export default function InventarioPage() {
  const [items, setItems] = useState<ItemInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [donacionFilter, setDonacionFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showRecepcionModal, setShowRecepcionModal] = useState(false);

  // Cargar inventario desde API local
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const lista = await listarInventario();
        setItems(lista);
      } catch (err) {
        console.error("Error al cargar inventario:", err);
        setError("No se pudo cargar el inventario.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtrados = useMemo(() => {
    let lista = items;
    // filtro por texto
    if (search.trim()) {
      const q = search.toLowerCase();
      lista = lista.filter((it) => {
        const texto =
          `${it.codigo} ${it.descripcion} ${it.ubicacion}`.toLowerCase();
        return texto.includes(q);
      });
    }
    // filtro por donación (ID exacta o parcial)
    if (donacionFilter.trim()) {
      const qd = donacionFilter.trim();
      const asNum = Number(qd);
      if (!Number.isNaN(asNum) && qd === String(asNum)) {
        lista = lista.filter((it) => it.donacionId === asNum);
      } else {
        // fallback: buscar coincidencia parcial en el id convertido a string
        lista = lista.filter((it) => String(it.donacionId).includes(qd));
      }
    }
    return lista;
  }, [items, search, donacionFilter]);

  const totalStock = items.reduce((acc, it) => acc + it.cantidad, 0);

  async function handleCreateFromRecepcion(data: InventarioItemInput) {
    try {
      // Registrar en API
      const nuevoItem = await registrarIngresoInventario({
        donacionId: 0,
        descripcion: data.recurso,
        cantidad: data.cantidad,
        unidad: data.unidad,
        ubicacion: data.ubicacion,
      });
      // Agregar a la lista local
      setItems((prev) => [nuevoItem, ...prev]);
      setShowRecepcionModal(false);
    } catch (err) {
      console.error("Error al registrar inventario:", err);
      setError("No se pudo registrar la recepción.");
    }
  }

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
      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase text-slate-400">
              Total en inventario
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {totalStock} unidades
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <PackageSearch className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase text-slate-400">
              Registros activos
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {items.length}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Cargando inventario...
        </div>
      ) : (
        <>
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Buscar por código, descripción o ubicación…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <input
                type="search"
                placeholder="Filtrar por donación (ID)…"
                className="w-full pl-3 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={donacionFilter}
                onChange={(e) => setDonacionFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Código
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Descripción
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Cantidad
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Ubicación
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Estado
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Donación
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-500">
                    Ingreso
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-xs text-slate-500"
                    >
                      {search || donacionFilter
                        ? "No hay recursos que coincidan con la búsqueda."
                        : "No hay registros en inventario."}
                    </td>
                  </tr>
                ) : (
                  filtrados.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-2 text-slate-600 font-mono">
                        {item.codigo}
                      </td>
                      <td className="px-4 py-2 text-slate-900">
                        <div className="font-medium">{item.descripcion}</div>
                      </td>
                      <td className="px-4 py-2 text-slate-900">
                        <span className="font-semibold">{item.cantidad}</span>{" "}
                        <span className="text-slate-500">{item.unidad}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {item.ubicacion}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={[
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            item.estado === "DISPONIBLE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600",
                          ].join(" ")}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {item.donacionId ? (
                          <span className="font-mono text-[12px]">
                            #{item.donacionId}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-slate-600 text-[11px]">
                        {new Date(item.fechaIngreso).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal de recepción */}
      <ReceiveDonationModal
        open={showRecepcionModal}
        onClose={() => setShowRecepcionModal(false)}
        onCreate={handleCreateFromRecepcion}
      />
    </div>
  );
}
