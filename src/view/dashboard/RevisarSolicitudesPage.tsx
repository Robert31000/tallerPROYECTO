import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Eye, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

type SolicitudEstado = "PENDIENTE" | "APROBADA" | "RECHAZADA";

type Solicitud = {
  id: number;
  codigo: string;
  titulo: string;
  tipoDonativo: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  beneficiarioNombre: string;
  fechaCreacion: string; // ISO string
  estado: SolicitudEstado;
  // puedes añadir más campos según tu backend
};

type Accion = "APROBAR" | "RECHAZAR" | null;

export default function RevisarSolicitudesPage() {
  const [estadoFiltro, setEstadoFiltro] =
    useState<SolicitudEstado>("PENDIENTE");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accionActual, setAccionActual] = useState<Accion>(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<Solicitud | null>(null);
  const [comentario, setComentario] = useState("");

  async function cargarSolicitudes(estado: SolicitudEstado) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Solicitud[]>("/solicitudes", {
        params: { estado },
      });
      setSolicitudes(res.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "No se pudieron cargar las solicitudes.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarSolicitudes(estadoFiltro);
  }, [estadoFiltro]);

  function abrirAccion(accion: Accion, s: Solicitud) {
    setAccionActual(accion);
    setSolicitudSeleccionada(s);
    setComentario("");
  }

  function cerrarModal() {
    setAccionActual(null);
    setSolicitudSeleccionada(null);
    setComentario("");
  }

  async function confirmarAccion() {
    if (!accionActual || !solicitudSeleccionada) return;

    try {
      setLoading(true);
      const id = solicitudSeleccionada.id;

      if (accionActual === "APROBAR") {
        await api.post(`/solicitudes/${id}/aprobar`, { comentario });
      } else if (accionActual === "RECHAZAR") {
        await api.post(`/solicitudes/${id}/rechazar`, { comentario });
      }

      // recargar lista en el estado actual
      await cargarSolicitudes(estadoFiltro);
      cerrarModal();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al actualizar la solicitud.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Revisar solicitudes de donación
          </h1>
          <p className="text-sm text-slate-500">
            Valida la información enviada por estudiantes, docentes y colectivos
            antes de publicarla en el catálogo institucional.
          </p>
        </div>
      </div>

      {/* Filtros de estado */}
      <div className="flex gap-2 mb-4">
        {(["PENDIENTE", "APROBADA", "RECHAZADA"] as SolicitudEstado[]).map(
          (estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => setEstadoFiltro(estado)}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-semibold border",
                estadoFiltro === estado
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              {estado === "PENDIENTE" && "Pendientes"}
              {estado === "APROBADA" && "Aprobadas"}
              {estado === "RECHAZADA" && "Rechazadas"}
            </button>
          ),
        )}
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de solicitudes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Código
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Título
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Tipo
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Beneficiario
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Urgencia
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Fecha
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cargando solicitudes...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && solicitudes.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-400 text-sm"
                  >
                    No hay solicitudes en este estado.
                  </td>
                </tr>
              )}

              {!loading &&
                solicitudes.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-2 text-xs font-mono text-slate-500">
                      {s.codigo}
                    </td>
                    <td className="px-4 py-2 text-slate-900 font-medium">
                      {s.titulo}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {s.tipoDonativo}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {s.beneficiarioNombre || "-"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          s.urgencia === "ALTA"
                            ? "bg-rose-50 text-rose-700"
                            : s.urgencia === "MEDIA"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700",
                        ].join(" ")}
                      >
                        {s.urgencia}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">
                      {new Date(s.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100"
                          title="Ver detalle"
                          // Aquí luego puedes abrir un panel lateral/modal con más datos
                          onClick={() => abrirAccion(null, s)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {estadoFiltro === "PENDIENTE" && (
                          <>
                            <button
                              type="button"
                              className="p-1.5 rounded-md border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                              title="Aprobar"
                              onClick={() => abrirAccion("APROBAR", s)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50"
                              title="Rechazar"
                              onClick={() => abrirAccion("RECHAZAR", s)}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal simple de aprobación / rechazo */}
      {accionActual && solicitudSeleccionada && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {accionActual === "APROBAR"
                ? "Aprobar solicitud"
                : "Rechazar solicitud"}
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              {accionActual === "APROBAR"
                ? "Confirma que la información de la solicitud es válida y puede pasar al catálogo institucional."
                : "Describe brevemente el motivo del rechazo. Esta información puede ser visible para el responsable de la solicitud."}
            </p>

            <div className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <div className="font-semibold">
                {solicitudSeleccionada.titulo}
              </div>
              <div className="text-slate-500">
                Código: {solicitudSeleccionada.codigo} · Tipo:{" "}
                {solicitudSeleccionada.tipoDonativo}
              </div>
            </div>

            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
              placeholder={
                accionActual === "APROBAR"
                  ? "Ej. Cumple con los requisitos y cuenta con evidencias suficientes."
                  : "Ej. Falta documentación de respaldo o información del beneficiario."
              }
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cerrarModal}
                className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarAccion}
                disabled={loading}
                className={[
                  "px-4 py-1.5 text-xs font-semibold rounded-md text-white",
                  accionActual === "APROBAR"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700",
                  loading ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
              >
                {loading ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
