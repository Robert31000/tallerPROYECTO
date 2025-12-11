// src/view/dashboard/CatalogoPublicacionesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  AlertCircle,
  Loader2,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";
import { DonationModal } from "./DonationModal";
import { listarCatalogoPublicaciones } from "../../lib/api";

type EstadoPublicacion = "PUBLICADA" | "FINALIZADA";

type Publicacion = {
  id: number;
  codigo: string;
  titulo: string;
  categoria?: string;
  estado: EstadoPublicacion;
  fechaPublicacion: string;
  resumen: string;
  descripcion: string;
  imagenUrl?: string;
  imagenes?: string[];
  totalDonado: number;
  metaDonacion?: number;
  numDonaciones: number;
  adjuntos: { id: number; nombre: string; url: string }[];
  comentarios: { id: number; autor: string; mensaje: string; fecha: string }[];
};

// initial fallback (empty) — real list comes from API/local mock
const BASE_PUBLICACIONES: Publicacion[] = [];

export default function CatalogoPublicacionesPage() {
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState<string>("TODAS");
  const [estado, setEstado] = useState<EstadoPublicacion | "TODOS">(
    "PUBLICADA",
  );

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [seleccionada, setSeleccionada] = useState<Publicacion | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // simulamos autenticación solo para mostrar botones
  const isAuthenticated = true;

  const [publicaciones, setPublicaciones] =
    useState<Publicacion[]>(BASE_PUBLICACIONES);

  // cargar publicaciones desde el backend (o mock local)
  useEffect(() => {
    let mounted = true;
    (async function load() {
      try {
        const items = await listarCatalogoPublicaciones();
        if (!mounted) return;
        // mapear a la forma de UI
        const mapped = items.map((it) => {
          const anyIt = it as unknown as Record<string, unknown>;
          const evidences = Array.isArray(anyIt.evidencias)
            ? (anyIt.evidencias as string[])
            : [];
          const firstImage = evidences.length > 0 ? evidences[0] : undefined;
          return {
            id: it.id,
            codigo: it.codigoSolicitud || `PUB-${it.id}`,
            titulo: it.titulo,
            categoria: ((it.tipoRecurso as string) || "OTROS").toUpperCase(),
            estado: "PUBLICADA" as EstadoPublicacion,
            fechaPublicacion: it.fechaPublicacion || new Date().toISOString(),
            resumen: (anyIt.descripcion as string) || "",
            descripcion: (anyIt.descripcion as string) || "",
            imagenUrl:
              firstImage || (anyIt.imagenPrincipalUrl as string) || undefined,
            imagenes: evidences.length > 0 ? evidences : undefined,
            totalDonado: it.totalDonado || 0,
            metaDonacion: undefined,
            numDonaciones: Array.isArray(anyIt.donaciones)
              ? (anyIt.donaciones as unknown[]).length
              : 0,
            adjuntos: [],
            comentarios: [],
          } as Publicacion;
        });
        setPublicaciones(mapped);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 🔍 filtrado en memoria sobre las publicaciones cargadas
  const publicacionesFiltradas = useMemo(() => {
    return publicaciones.filter((p) => {
      if (categoria !== "TODAS" && p.categoria !== categoria) return false;
      if (estado !== "TODOS" && p.estado !== estado) return false;
      if (!q.trim()) return true;

      const texto = `${p.titulo} ${p.codigo} ${p.resumen}`.toLowerCase();
      return texto.includes(q.toLowerCase());
    });
  }, [q, categoria, estado, publicaciones]);

  // seleccionar primera al cambiar filtros
  useEffect(() => {
    if (!publicacionesFiltradas.length) {
      setSeleccionada(null);
    } else if (
      !seleccionada ||
      !publicacionesFiltradas.some((p) => p.id === seleccionada.id)
    ) {
      setSeleccionada(publicacionesFiltradas[0]);
    }
  }, [publicacionesFiltradas, seleccionada]);

  async function manejarEnviarComentario() {
    if (!seleccionada || !nuevoComentario.trim()) return;
    // solo simulamos delay
    setEnviandoComentario(true);
    setTimeout(() => {
      alert(
        "En el backend real aquí se registraría el comentario.\n\nComentario: " +
          nuevoComentario.trim(),
      );
      setNuevoComentario("");
      setEnviandoComentario(false);
    }, 700);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Publicaciones solidarias
          </h1>
          <p className="text-sm text-slate-500">
            Visualiza las campañas activas, revisa su detalle y apoya con
            donaciones o comentarios.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-3 items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título o código..."
            className="w-full text-sm border-0 focus:ring-0 focus:outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </div>

        <select
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="TODAS">Todas las categorías</option>
          <option value="ALIMENTOS">Alimentos</option>
          <option value="VESTIMENTA">Vestimenta</option>
          <option value="EDUCACIÓN">Educación</option>
          <option value="OTROS">Otros</option>
        </select>

        <select
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50"
          value={estado}
          onChange={(e) =>
            setEstado(e.target.value as EstadoPublicacion | "TODOS")
          }
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PUBLICADA">Publicadas</option>
          <option value="FINALIZADA">Finalizadas</option>
        </select>
      </div>

      {/* Si no hay resultados */}
      {!publicacionesFiltradas.length && (
        <div className="flex items-center gap-2 rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-700 mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>
            No hay publicaciones que coincidan con los filtros seleccionados.
          </span>
        </div>
      )}

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] gap-4">
        {/* LISTADO */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Publicaciones
          </div>

          <ul className="divide-y divide-slate-100 max-h-[460px] overflow-auto">
            {publicacionesFiltradas.map((p) => {
              const active = seleccionada?.id === p.id;
              return (
                <li
                  key={p.id}
                  className={[
                    "px-4 py-3 cursor-pointer text-sm flex flex-col gap-1 hover:bg-slate-50",
                    active ? "bg-blue-50" : "",
                  ].join(" ")}
                  onClick={() => setSeleccionada(p)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">
                      {p.titulo}
                    </div>
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        p.estado === "PUBLICADA"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      {p.estado === "PUBLICADA" ? "Activa" : "Finalizada"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{p.categoria}</span>
                    <span>
                      {new Date(p.fechaPublicacion).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {p.resumen}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* DETALLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[260px]">
          {!seleccionada ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500 px-6 py-10">
              Selecciona una publicación del listado para ver su detalle.
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Header detalle */}
              <div className="border-b border-slate-100 px-5 py-4 flex justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    {seleccionada.codigo}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {seleccionada.titulo}
                  </h2>
                  <div className="mt-1 text-xs text-slate-500 flex gap-3 flex-wrap">
                    <span>{seleccionada.categoria}</span>
                    <span>
                      Publicado el{" "}
                      {new Date(
                        seleccionada.fechaPublicacion,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <div className="font-semibold text-slate-700">
                    Bs {seleccionada.totalDonado.toLocaleString()}
                    {seleccionada.metaDonacion
                      ? ` / ${seleccionada.metaDonacion.toLocaleString()}`
                      : ""}
                  </div>
                  <div>{seleccionada.numDonaciones} donaciones</div>
                </div>
              </div>

              {/* Cuerpo */}
              <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                {/* Galería de imágenes */}
                {seleccionada.imagenes && seleccionada.imagenes.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">
                      Evidencias fotográficas
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {seleccionada.imagenes.map((img, idx) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-lg overflow-hidden border border-slate-200 hover:border-blue-400 transition-colors group"
                        >
                          <img
                            src={img}
                            alt={`Evidencia ${idx + 1}`}
                            className="w-full h-24 object-cover group-hover:opacity-75 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : seleccionada.imagenUrl ? (
                  <img
                    src={seleccionada.imagenUrl}
                    alt={seleccionada.titulo}
                    className="w-full max-h-52 object-cover rounded-lg border border-slate-100"
                  />
                ) : null}

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">
                    Descripción
                  </h3>
                  <p className="text-sm text-slate-600 whitespace-pre-line">
                    {seleccionada.descripcion}
                  </p>
                </div>

                {seleccionada.adjuntos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-1">
                      Adjuntos
                    </h3>
                    <ul className="text-sm text-blue-600 space-y-1">
                      {seleccionada.adjuntos.map((a) => (
                        <li key={a.id}>
                          <a href={a.url} className="hover:underline">
                            {a.nombre}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">
                    Comentarios
                  </h3>
                  {seleccionada.comentarios.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Aún no hay comentarios registrados.
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-40 overflow-auto text-sm">
                      {seleccionada.comentarios.map((c) => (
                        <li
                          key={c.id}
                          className="border border-slate-100 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>{c.autor}</span>
                            <span>
                              {new Date(c.fecha).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">{c.mensaje}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Acciones */}
                {isAuthenticated && (
                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        onClick={() => setShowDonationModal(true)}
                      >
                        <HeartHandshake className="w-4 h-4" />
                        Donar a esta causa
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Agregar comentario
                      </label>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Escribe un mensaje para los organizadores..."
                          value={nuevoComentario}
                          onChange={(e) => setNuevoComentario(e.target.value)}
                        />
                        <button
                          type="button"
                          disabled={
                            enviandoComentario || !nuevoComentario.trim()
                          }
                          onClick={manejarEnviarComentario}
                          className="h-9 mt-auto inline-flex items-center justify-center gap-1 px-3 rounded-lg text-xs font-semibold bg-slate-900 text-white disabled:opacity-50"
                        >
                          {enviandoComentario ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MessageCircle className="w-4 h-4" />
                          )}
                          <span>Enviar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!isAuthenticated && (
                  <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                    Para comentar o donar, inicie sesión con su cuenta
                    institucional.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {seleccionada && (
        <DonationModal
          open={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          publicacion={{
            id: seleccionada.id,
            codigo: seleccionada.codigo,
            titulo: seleccionada.titulo,
          }}
          onSuccess={async (_don) => {
            // Recargar publicaciones para reflejar donación
            try {
              const items = await listarCatalogoPublicaciones();
              const mapped = items.map((it) => {
                const anyIt = it as unknown as Record<string, unknown>;
                const evidences = Array.isArray(anyIt.evidencias)
                  ? (anyIt.evidencias as string[])
                  : [];
                const firstImage =
                  evidences.length > 0 ? evidences[0] : undefined;
                return {
                  id: it.id,
                  codigo: it.codigoSolicitud || `PUB-${it.id}`,
                  titulo: it.titulo,
                  categoria: (
                    (it.tipoRecurso as string) || "OTROS"
                  ).toUpperCase(),
                  estado: "PUBLICADA" as EstadoPublicacion,
                  fechaPublicacion:
                    it.fechaPublicacion || new Date().toISOString(),
                  resumen: (anyIt.descripcion as string) || "",
                  descripcion: (anyIt.descripcion as string) || "",
                  imagenUrl:
                    firstImage ||
                    (anyIt.imagenPrincipalUrl as string) ||
                    undefined,
                  imagenes: evidences.length > 0 ? evidences : undefined,
                  totalDonado: it.totalDonado || 0,
                  metaDonacion: undefined,
                  numDonaciones: Array.isArray(anyIt.donaciones)
                    ? (anyIt.donaciones as unknown[]).length
                    : 0,
                  adjuntos: [],
                  comentarios: [],
                } as Publicacion;
              });
              setPublicaciones(mapped);
              // actualizar la seleccionada también
              const actualizada = mapped.find((p) => p.id === seleccionada.id);
              if (actualizada) {
                setSeleccionada(actualizada);
              }
            } catch (e) {
              console.error("Error reloading publications after donation:", e);
            }
            setShowDonationModal(false);
          }}
        />
      )}
    </div>
  );
}
