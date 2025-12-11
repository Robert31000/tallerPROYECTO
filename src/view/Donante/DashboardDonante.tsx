"use client";

// app/dashboard-donante/page.tsx

import { useMemo, useState } from "react";
import { PublicationCard, type Publication } from "./PublicationCard";

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

export default function DashboardDonante() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar publicaciones según lo que se escriba en el buscador
  const filteredPublications = useMemo(() => {
    if (!searchTerm.trim()) return publications;

    const term = searchTerm.toLowerCase();

    return publications.filter((pub) =>
      [
        pub.title,
        pub.description,
        pub.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR SUPERIOR */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="pointer-events-none absolute left-2 top-1.5 text-sm text-slate-400">
                🔍
              </span>
            </div>
          </div>

          {/* Menú tipo iconos */}
          <nav className="hidden items-center gap-6 text-xs text-slate-600 md:flex">
            <button className="flex flex-col items-center gap-0.5 text-slate-900">
              <span>🏠</span>
              <span>Inicio</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-slate-900">
              <span>❤️</span>
              <span>Mis donaciones</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-slate-900">
              <span>📢</span>
              <span>Campañas</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 hover:text-slate-900">
              <span>🔔</span>
              <span>Alertas</span>
            </button>
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

      {/* LAYOUT PRINCIPAL 3 COLUMNAS */}
      <main className="mx-auto max-w-6xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_minmax(0,2fr)_280px]">
          {/* COLUMNA IZQUIERDA – PERFIL */}
          <aside className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-100" />
              <div className="flex flex-col items-center px-4 pb-4">
                <div className="-mt-6 h-16 w-16 rounded-full border-2 border-white bg-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Robert Lorenzo Na...
                </p>
                <p className="text-center text-[0.7rem] text-slate-500">
                  Estudiante UAGRM · Donante solidario
                </p>
                <p className="mt-1 text-[0.7rem] text-slate-500">
                  Santa Cruz, Bolivia
                </p>
                <button className="mt-3 w-full rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-50">
                  Ver perfil
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[0.75rem] shadow-sm">
              <p className="font-semibold text-slate-900">
                Resumen de tu impacto
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Personas alcanzadas</span>
                  <span className="font-semibold text-slate-900">27</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Campañas apoyadas</span>
                  <span className="font-semibold text-slate-900">9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monto total donado</span>
                  <span className="font-semibold text-slate-900">
                    Bs. 4,320
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[0.75rem] shadow-sm">
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
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Hola, donante solidario 👋
              </p>
              <p className="mt-1 text-slate-600">
                Explora las campañas activas y apoya donde más se necesita.
              </p>
              {searchTerm.trim() && (
                <p className="mt-2 text-[0.7rem] text-slate-500">
                  Mostrando resultados para:{" "}
                  <span className="font-semibold text-slate-900">
                    &quot;{searchTerm}&quot;
                  </span>
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  D
                </div>
                <button className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs text-slate-500 hover:bg-white">
                  Realiza una donación rápida o deja un mensaje de apoyo...
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-[0.7rem] text-slate-600">
                <button className="flex items-center gap-1 hover:text-slate-900">
                  <span>❤️</span>
                  <span>Donar a una campaña</span>
                </button>
                <button className="flex items-center gap-1 hover:text-slate-900">
                  <span>📦</span>
                  <span>Donación en especie</span>
                </button>
                <button className="hidden items-center gap-1 hover:text-slate-900 sm:flex">
                  <span>📄</span>
                  <span>Ver historial</span>
                </button>
              </div>
            </div>

            {filteredPublications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">
                No se encontraron campañas que coincidan con{" "}
                <span className="font-semibold text-slate-900">
                  &quot;{searchTerm}&quot;
                </span>
                . Intenta con otra palabra.
              </div>
            ) : (
              filteredPublications.map((pub) => (
                <PublicationCard key={pub.id} pub={pub} />
              ))
            )}
          </section>

          {/* COLUMNA DERECHA – RECOMENDACIONES */}
          <aside className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[0.75rem] shadow-sm">
              <p className="font-semibold text-slate-900">
                Campañas recomendadas
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Hogar de niños &quot;Luz de Esperanza&quot;
                    </p>
                    <p className="text-[0.7rem] text-slate-600">
                      Necesita apoyo mensual para alimentos.
                    </p>
                  </div>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-[0.7rem] font-medium text-slate-900">
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
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-[0.7rem] font-medium text-slate-900">
                    Ver
                  </button>
                </div>
              </div>
              <button className="mt-2 text-[0.7rem] font-semibold text-slate-900">
                Ver todas las campañas →
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[0.7rem] text-slate-600 shadow-sm">
              <p className="mb-2 text-xs font-semibold text-slate-900">
                Información
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <button className="hover:underline">Centro de ayuda</button>
                <button className="hover:underline">Términos</button>
                <button className="hover:underline">Privacidad</button>
                <button className="hover:underline">Acerca de</button>
              </div>
              <p className="mt-3 text-[0.65rem] text-slate-500">
                © {new Date().getFullYear()} Sistema de Donaciones UAGRM
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
