import { useEffect, useState } from "react";
import {
  listarSolicitudes,
  cambiarEstadoSolicitud,
  obtenerSolicitud,
} from "../../lib/api";
import { Eye, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

type SolicitudEstado = "PENDIENTE" | "APROBADA" | "RECHAZADA";

type Solicitud = {
  id: number;
  titulo: string;
  categoria: string;
  tipoRecurso: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  beneficiarioNombre: string;
  fechaCreacion: string; // ISO string que llega del backend
  descripcion?: string;
  evidencias?: string[];
  estado: SolicitudEstado;
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
  const [viewingDetail, setViewingDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  async function cargarSolicitudes(estado: SolicitudEstado) {
    try {
      setLoading(true);
      setError(null);

      const lista = await listarSolicitudes(estado);
      setSolicitudes(lista as Solicitud[]);
    } catch (err: unknown) {
      console.error(err);
      setError("No se pudieron cargar las solicitudes.");
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

  async function abrirDetalle(s: Solicitud) {
    setComentario("");
    setAccionActual(null);
    setDetailLoading(true);
    try {
      const full = await obtenerSolicitud(s.id);
      const mapped: Solicitud = {
        id: full.id,
        titulo: full.titulo,
        categoria: full.categoria || s.categoria,
        tipoRecurso: (full.tipoRecurso as string) || s.tipoRecurso,
        urgencia: full.urgencia,
        beneficiarioNombre: full.beneficiarioNombre,
        fechaCreacion:
          full.fechaRegistro || full.fechaCreacion || s.fechaCreacion,
        estado: full.estado,
        descripcion: full.descripcion,
        evidencias: full.evidencias || [],
      };
      setSolicitudSeleccionada(mapped);
      setViewingDetail(true);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar el detalle de la solicitud.");
    } finally {
      setDetailLoading(false);
    }
  }

  function cerrarModal() {
    setAccionActual(null);
    setSolicitudSeleccionada(null);
    setComentario("");
    setViewingDetail(false);
  }

  async function confirmarAccion() {
    if (!accionActual || !solicitudSeleccionada) return;

    try {
      setLoading(true);
      const id = solicitudSeleccionada.id;

      // Use helper que maneja PUT/POST según backend
      const nuevoEstado = accionActual === "APROBAR" ? "APROBADA" : "RECHAZADA";
      await cambiarEstadoSolicitud(id, nuevoEstado, comentario || undefined);

      await cargarSolicitudes(estadoFiltro);
      cerrarModal();
    } catch (err: unknown) {
      console.error(err);
      setError("Ocurrió un error al actualizar la solicitud.");
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
            antes de publicarla o rechazarla.
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
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Título
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">
                  Tipo recurso
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
                      {s.id}
                    </td>
                    <td className="px-4 py-2 text-slate-900 font-medium">
                      {s.titulo}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {s.tipoRecurso}
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
                          onClick={() => abrirDetalle(s)}
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

      {/* Modal de aprobación / rechazo */}
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
                ID: {solicitudSeleccionada.id} · Tipo:{" "}
                {solicitudSeleccionada.tipoRecurso}
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

      {/* Modal de detalle (solo lectura) */}
      {viewingDetail && solicitudSeleccionada && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            {detailLoading ? (
              <div className="w-full flex items-center justify-center py-8 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {solicitudSeleccionada.titulo}
                    </h2>
                    <div className="text-sm text-slate-500">
                      ID: {solicitudSeleccionada.id} ·{" "}
                      {solicitudSeleccionada.tipoRecurso}
                    </div>
                  </div>
                  <button
                    onClick={cerrarModal}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="mt-4 text-sm text-slate-700">
                  <p className="mb-2">
                    <strong>Beneficiario:</strong>{" "}
                    {solicitudSeleccionada.beneficiarioNombre}
                  </p>
                  <p className="mb-2">
                    <strong>Urgencia:</strong> {solicitudSeleccionada.urgencia}
                  </p>
                  <p className="mb-2">
                    <strong>Fecha:</strong>{" "}
                    {new Date(
                      solicitudSeleccionada.fechaCreacion,
                    ).toLocaleString()}
                  </p>
                  {solicitudSeleccionada.descripcion && (
                    <div className="mb-2">
                      <h3 className="font-semibold">Descripción</h3>
                      <p className="text-sm text-slate-600 whitespace-pre-line">
                        {solicitudSeleccionada.descripcion}
                      </p>
                    </div>
                  )}
                  {solicitudSeleccionada.evidencias &&
                    solicitudSeleccionada.evidencias.length > 0 && (
                      <div className="mt-3">
                        <h3 className="font-semibold">Evidencias</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {solicitudSeleccionada.evidencias.map((e, i) => (
                            <a
                              key={i}
                              href={e}
                              target="_blank"
                              rel="noreferrer"
                              className="block border rounded overflow-hidden"
                            >
                              <img
                                src={e}
                                alt={`evidencia-${i}`}
                                className="w-full h-28 object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={cerrarModal}
                    className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
