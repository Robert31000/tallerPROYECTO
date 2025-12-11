import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-blue-500">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
        {/* NAVBAR */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/40 bg-white text-sm font-bold text-red-400">
              U
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                UAGRM Donaciones
              </p>
              <p className="text-xs text-slate-400">
                Sistema inteligente de gestión solidaria
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#como-funciona" className="text-black">
              Cómo funciona
            </a>
            <a href="#areas" className="text-black">
              Áreas de apoyo
            </a>
            <a href="#impacto" className="text-black">
              Impacto
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300 sm:inline-flex">
              <Link to={'/auth/login'}>Ingresar</Link>
            </button>
            <button className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400">
              Quiero donar
            </button>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="mt-10 flex-1 space-y-16">
          {/* HERO */}
          <section className="grid items-center gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Texto */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-slate-700">
                Nuevo · Plataforma piloto para la UAGRM
              </span>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Gestiona las donaciones de la UAGRM
                <span className="block text-red-500">
                  con transparencia e impacto real.
                </span>
              </h1>

              <p className="max-w-xl text-sm text-slate-700 md:text-base">
                Centraliza las donaciones de personas, empresas y organizaciones.
                Registra necesidades, asigna recursos y haz seguimiento al impacto
                en estudiantes, proyectos de investigación y acción social dentro
                de la universidad.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400">
                  Crear campaña de donación
                </button>
                <button className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300">
                  Ver necesidades urgentes
                </button>
              </div>

              <div className="grid max-w-md grid-cols-3 gap-4 text-xs text-slate-300">
                <div>
                  <p className="text-lg font-semibold text-emerald-400">+120</p>
                  <p>Estudiantes beneficiados</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-400">18</p>
                  <p>Campañas activas</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-400">4</p>
                  <p>Facultades conectadas</p>
                </div>
              </div>
            </div>

            {/* Tarjeta / Dashboard falso */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-red-700 p-5 shadow-2xl">
                <p className="mb-3 text-xs font-medium text-slate-400">
                  Vista previa del panel
                </p>

                {/* Totales */}
                <div className="mb-4 grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl  px-3 py-3">
                    <p className="text-[0.7rem] text-slate-400">
                      Monto recaudado
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-400">
                      Bs. 34,250
                    </p>
                  </div>
                  <div className="rounded-xl px-3 py-3">
                    <p className="text-[0.7rem] text-slate-400">
                      Donaciones hoy
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-400">
                      23
                    </p>
                  </div>
                  <div className="rounded-xl  px-3 py-3">
                    <p className="text-[0.7rem] text-slate-400">
                      Necesidades cubiertas
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-400">
                      78%
                    </p>
                  </div>
                </div>

                {/* Lista de campañas */}
                <div className="space-y-3">
                  {[
                    {
                      nombre: "Becas de alimentación",
                      progreso: 72,
                      facultad: "Bienestar Estudiantil",
                    },
                    {
                      nombre: "Equipamiento laboratorio",
                      progreso: 45,
                      facultad: "Ingeniería",
                    },
                    {
                      nombre: "Fondo emergencia",
                      progreso: 88,
                      facultad: "Comunidad UAGRM",
                    },
                  ].map((campa, i) => (
                    <div
                      key={i}
                      className="rounded-xl  px-3 py-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-black">
                            {campa.nombre}
                          </p>
                          <p className="text-[0.7rem] text-black">
                            {campa.facultad}
                          </p>
                        </div>
                        <span className="text-[0.7rem] font-semibold text-black">
                          {campa.progreso}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${campa.progreso}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[0.7rem] text-slate-500">
                  Todo el flujo de donaciones, beneficiarios y reportes en un
                  solo lugar.
                </p>
              </div>
            </div>
          </section>

          {/* CÓMO FUNCIONA */}
          <section id="como-funciona" className="space-y-6">
            <h2 className="text-lg font-semibold tracking-tight">
              ¿Cómo funciona la plataforma?
            </h2>
            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-emerald-400">
                  1 · Registrar necesidades
                </p>
                <p className="mt-2 text-slate-200">
                  Las unidades, centros y carreras registran sus necesidades:
                  becas, equipamiento, proyectos sociales, etc.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-emerald-400">
                  2 · Recibir donaciones
                </p>
                <p className="mt-2 text-slate-200">
                  Personas y empresas se conectan con campañas claras,
                  transparentes y verificadas por la UAGRM.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-emerald-400">
                  3 · Monitorear el impacto
                </p>
                <p className="mt-2 text-slate-200">
                  El sistema registra entregas, beneficiarios y reportes para
                  que la comunidad vea el impacto real de cada donación.
                </p>
              </div>
            </div>
          </section>

          {/* ÁREAS DE APOYO */}
          <section id="areas" className="space-y-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Áreas de apoyo dentro de la UAGRM
            </h2>
            <div className="grid gap-4 text-sm md:grid-cols-4">
              <div className="rounded-2xl border  p-4">
                <p className="font-medium text-slate-100">Estudiantes</p>
                <p className="mt-1 text-xs text-black">
                  Becas de alimentación, transporte, materiales, salud, etc.
                </p>
              </div>
              <div className="rounded-2xl border  p-4">
                <p className="font-medium text-black">
                  Investigación y laboratorios
                </p>
                <p className="mt-1 text-xs text-black">
                  Equipos, software y recursos para proyectos científicos.
                </p>
              </div>
              <div className="rounded-2xl border  p-4">
                <p className="font-medium text-black">Acción social</p>
                <p className="mt-1 text-xs text-black">
                  Proyectos que conectan a la UAGRM con la comunidad.
                </p>
              </div>
              <div className="rounded-2xl border  p-4">
                <p className="font-medium text-black">Infraestructura</p>
                <p className="mt-1 text-xs text-black">
                  Mejoras en aulas, bibliotecas y espacios comunes.
                </p>
              </div>
            </div>
          </section>

          {/* IMPACTO / CTA FINAL */}
          <section
            id="impacto"
            className="overflow-hidden rounded-3xl border  via-slate-900 to-slate-950 px-5 py-6 md:px-8"
          >
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-black">
                  Construyamos juntos una UAGRM más solidaria.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-black">
                  Esta plataforma está pensada para transparentar el uso de los
                  recursos y facilitar la conexión entre quienes quieren ayudar
                  y quienes más lo necesitan dentro de la universidad.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400">
                  Registrarme como donante
                </button>
                <button className="rounded-lg border border-emerald-400/60 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-slate-950/70">
                  Registrar necesidad en mi unidad
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-slate-800 pt-5 text-xs text-black md:flex md(items-center) md:justify-between">
          <p>
            © {new Date().getFullYear()} Sistema de Gestión de Donaciones — UAGRM.
          </p>
          <p>Desarrollado por estudiantes de Ingeniería de Sistemas.</p>
        </footer>
      </div>
    </div>
  );
}
