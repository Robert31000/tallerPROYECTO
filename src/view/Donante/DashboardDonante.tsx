"use client";

// app/dashboard-donante/page.tsx

import { useMemo, useState } from "react";
import {
  PublicationCard,
  type Publication,
  type Comment,
} from "./PublicationCard";
import DonanteNavbar from "./DonanteNavbar";

const publications: Publication[] = [
  {
    id: 1,
    title: "Apoyo al hogar de niños 'Luz de Esperanza'",
    category: "Niños",
    description:
      "Campaña para cubrir alimentación, útiles escolares y ropa de invierno para 40 niños del hogar.",
    urgency: "Alta",
    progress: 68,
    collected: 10250,
    goal: 15000,
  },
  {
    id: 2,
    title: "Personas afectadas por las lluvias en el Beni",
    category: "Emergencias",
    description:
      "Recolecta de víveres, medicinas y kits de aseo para familias damnificadas por las inundaciones.",
    urgency: "Alta",
    progress: 42,
    collected: 8400,
    goal: 20000,
  },
  {
    id: 3,
    title: "Becas de alimentación para estudiantes UAGRM",
    category: "Educación",
    description:
      "Fondo solidario para becas de alimentación dirigidas a estudiantes en situación de vulnerabilidad.",
    urgency: "Media",
    progress: 75,
    collected: 15000,
    goal: 20000,
  },
  {
    id: 4,
    title: "Medicamentos para campaña de salud comunitaria",
    category: "Salud",
    description:
      "Apoyo para la compra de medicamentos básicos para brigadas médicas universitarias.",
    urgency: "Baja",
    progress: 30,
    collected: 4500,
    goal: 15000,
  },
];

const STORAGE_KEY = "uagrm-donante-comments-v1";

export default function DashboardDonante() {
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar comentarios desde localStorage (solo en cliente)
  const [comments, setComments] = useState<Comment[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Comment[];
    } catch {
      return [];
    }
  });

  const saveComments = (next: Comment[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const generateJsonFileForPublication = (
    publicationId: number,
    pubComments: Comment[],
  ) => {
    if (typeof window === "undefined") return;

    const json = JSON.stringify(pubComments, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `comentarios_publicacion_${publicationId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const handleAddComment = (pubId: number, text: string) => {
    const newComment: Comment = {
      id: `${pubId}-${Date.now()}`,
      publicationId: pubId,
      text,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => {
      const updated = [...prev, newComment];
      saveComments(updated);

      const pubComments = updated.filter(
        (c) => c.publicationId === pubId,
      );
      generateJsonFileForPublication(pubId, pubComments);

      return updated;
    });
  };

  // Filtrar publicaciones según buscador
  const filteredPublications = useMemo(() => {
    if (!searchTerm.trim()) return publications;

    const term = searchTerm.toLowerCase();

    return publications.filter((pub) =>
      [pub.title, pub.description, pub.category]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [searchTerm]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900">
      {/* NAVBAR SUPERIOR COMO COMPONENTE */}
      <DonanteNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* CONTENIDO */}
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        {/* CINTA DE RESUMEN SUPERIOR */}
        <section className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Tu resumen como donante
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Gracias por ser parte de la red solidaria de la UAGRM 💚
            </p>
            <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[0.7rem] text-slate-500">
                  Monto total donado
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  Bs. 4,320
                </p>
                <p className="mt-1 text-[0.65rem] text-slate-500">
                  Desde que te uniste a la plataforma.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[0.7rem] text-slate-500">
                  Campañas apoyadas
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  9
                </p>
                <p className="mt-1 text-[0.65rem] text-slate-500">
                  Niños, emergencias y educación.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[0.7rem] text-slate-500">Nivel solidario</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-lg font-semibold text-slate-900">
                    Bronce
                  </p>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-700">
                    + a 680 Bs. para Plata
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-900">
              Acción rápida
            </p>
            <p className="mt-1 text-[0.75rem] text-slate-600">
              Elige cómo quieres ayudar hoy:
            </p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <button className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:bg-white">
                <div>
                  <p className="font-semibold text-slate-900">
                    Donar a una campaña
                  </p>
                  <p className="text-[0.7rem] text-slate-500">
                    Apoya con un monto económico.
                  </p>
                </div>
                <span>❤️</span>
              </button>
              <button className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:bg-white">
                <div>
                  <p className="font-semibold text-slate-900">
                    Donación en especie
                  </p>
                  <p className="text-[0.7rem] text-slate-500">
                    Alimentos, ropa, medicamentos, etc.
                  </p>
                </div>
                <span>📦</span>
              </button>
            </div>
            {searchTerm.trim() && (
              <p className="mt-3 text-[0.7rem] text-slate-500">
                Buscando campañas relacionadas con{" "}
                <span className="font-semibold text-slate-900">
                  “{searchTerm}”
                </span>
                .
              </p>
            )}
          </div>
        </section>

        {/* LAYOUT PRINCIPAL 3 COLUMNAS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-[260px_minmax(0,2fr)_260px]">
          {/* COLUMNA IZQUIERDA – PERFIL */}
          <aside className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
              <div className="h-14 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900" />
              <div className="flex flex-col items-center px-4 pb-4">
                <img
                  src="/src/assets/perfil.jpeg"
                  alt="Foto de perfil"
                  className="mt-[-1.5rem] h-16 w-16 rounded-full border-2 border-white shadow-sm"
                />
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Robert Lorenzo Na...
                </p>
                <p className="text-center text-[0.7rem] text-slate-500">
                  Estudiante UAGRM · Donante solidario
                </p>
                <p className="mt-1 text-[0.7rem] text-slate-500">
                  Santa Cruz, Bolivia
                </p>
                <button className="mt-3 w-full rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-50">
                  Ver perfil
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 text-[0.75rem] shadow-sm">
              <p className="font-semibold text-slate-900">
                Resumen de tu impacto
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Personas alcanzadas</span>
                  <span className="font-semibold text-slate-900">27</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Campañas apoyadas</span>
                  <span className="font-semibold text-slate-900">9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Donaciones este mes</span>
                  <span className="font-semibold text-slate-900">3</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 text-[0.75rem] shadow-sm">
              <p className="font-semibold text-slate-900">Accesos rápidos</p>
              <ul className="mt-2 space-y-1.5">
                <li className="cursor-pointer text-slate-600 hover:text-slate-900">
                  Mis certificados de donación
                </li>
                <li className="cursor-pointer text-slate-600 hover:text-slate-900">
                  Métodos de pago
                </li>
                <li className="cursor-pointer text-slate-600 hover:text-slate-900">
                  Preferencias de notificación
                </li>
              </ul>
            </div>
          </aside>

          {/* COLUMNA CENTRAL – FEED / PUBLICACIONES */}
         <section className="space-y-3">
            {/* Card de texto de introducción */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 text-xs shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Campañas activas 💡
              </p>
              <p className="mt-1 text-slate-600">
                Explora las campañas creadas por la UAGRM y elige dónde quieres
                hacer la diferencia hoy.
              </p>
            </div>

            {filteredPublications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-6 text-center text-xs text-slate-500">
                No se encontraron campañas que coincidan con{" "}
                <span className="font-semibold text-slate-900">
                  “{searchTerm}”
                </span>
                . Intenta con otra palabra clave.
              </div>
            ) : (
              filteredPublications.map((pub) => (
                <PublicationCard
                  key={pub.id}
                  pub={pub}
                  comments={comments.filter(
                    (c) => c.publicationId === pub.id,
                  )}
                  onAddComment={handleAddComment}
                />
              ))
            )}
          </section>

          {/* COLUMNA DERECHA – RECOMENDACIONES / INFO */}
          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 text-[0.75rem] shadow-sm">
              <p className="font-semibold text-slate-900">
                Campañas recomendadas
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Hogar de niños “Luz de Esperanza”
                    </p>
                    <p className="text-[0.7rem] text-slate-600">
                      Necesita apoyo mensual para alimentos.
                    </p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-[0.7rem] font-medium text-slate-900 hover:bg-slate-50">
                    Ver
                  </button>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Emergencia por lluvias
                    </p>
                    <p className="text-[0.7rem] text-slate-600">
                      Kits de higiene y víveres para familias.
                    </p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-[0.7rem] font-medium text-slate-900 hover:bg-slate-50">
                    Ver
                  </button>
                </div>
              </div>
              <button className="mt-2 text-[0.7rem] font-semibold text-slate-900 hover:underline">
                Ver todas las campañas →
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 text-[0.7rem] text-slate-600 shadow-sm">
              <p className="mb-2 text-xs font-semibold text-slate-900">
                Información y ayuda
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <button className="hover:underline">Centro de ayuda</button>
                <button className="hover:underline">Términos</button>
                <button className="hover:underline">Privacidad</button>
                <button className="hover:underline">Acerca de</button>
              </div>
              <p className="mt-3 text-[0.65rem] text-slate-500">
                © {new Date().getFullYear()} Sistema de Donaciones UAGRM. Hecho
                para transparencia y solidaridad.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
