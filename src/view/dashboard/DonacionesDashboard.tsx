import React from "react";
import { needs, transactions } from "../../lib/mockData";

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-BO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const DonacionesDashboard: React.FC = () => {
  const totalRecaudado = transactions
    .filter((t) => t.direction === "in")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDesembolsado = transactions
    .filter((t) => t.direction === "out")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoActual = totalRecaudado - totalDesembolsado;

  const necesidadesAbiertas = needs.filter(
    (n) => n.status === "abierta",
  ).length;

  const ultimasTransacciones = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Sistema Inteligente de Donaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visión general del presupuesto solidario de la UAGRM usando datos
            simulados.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            Modo demo
          </span>
          <button className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex">
            Exportar reporte
          </button>
        </div>
      </header>

      {/* CARDS DE RESUMEN */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Saldo actual
            </p>
            <span className="text-lg">💰</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {formatCurrency(saldoActual)}
          </p>
          <p className="mt-1 text-[0.75rem] text-slate-500">
            Disponible para asignar a nuevas campañas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total recaudado
            </p>
            <span className="text-lg">📥</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-emerald-700">
            {formatCurrency(totalRecaudado)}
          </p>
          <p className="mt-1 text-[0.75rem] text-slate-500">
            Suma de donaciones económicas registradas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total desembolsado
            </p>
            <span className="text-lg">📤</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-rose-700">
            {formatCurrency(totalDesembolsado)}
          </p>
          <p className="mt-1 text-[0.75rem] text-slate-500">
            Monto asignado a hogares, emergencias y proyectos.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Necesidades abiertas
            </p>
            <span className="text-lg">📌</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {necesidadesAbiertas}
          </p>
          <p className="mt-1 text-[0.75rem] text-slate-500">
            Casos que aún requieren presupuesto.
          </p>
        </div>
      </section>

      {/* LAYOUT: TRANSACCIONES + NOTAS */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* TABLA DE TRANSACCIONES */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Últimas transacciones
              </h2>
              <p className="text-[0.75rem] text-slate-500">
                Entradas y salidas recientes del fondo solidario.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.7rem] text-slate-600">
              {ultimasTransacciones.length} movimientos
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[0.7rem] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Fecha</th>
                  <th className="px-3 py-2 font-medium">Descripción</th>
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {ultimasTransacciones.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={
                      idx % 2 === 0
                        ? "border-b border-slate-100 bg-white"
                        : "border-b border-slate-100 bg-slate-50/40"
                    }
                  >
                    <td className="px-3 py-2 align-top text-[0.75rem] text-slate-600">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-3 py-2 align-top text-[0.75rem] text-slate-800">
                      {t.description}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
                          t.type === "donacion"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100",
                        ].join(" ")}
                      >
                        {t.type === "donacion" ? "Donación" : "Gasto"}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top text-right text-[0.75rem]">
                      <span
                        className={
                          t.direction === "out"
                            ? "font-semibold text-rose-700"
                            : "font-semibold text-emerald-700"
                        }
                      >
                        {t.direction === "out" ? "−" : "+"}
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}

                {ultimasTransacciones.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-[0.75rem] text-slate-500"
                    >
                      No hay movimientos registrados en el sistema demo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-[0.7rem] text-slate-500">
            <span>
              * En la versión real, esta tabla se conectará a la base de datos
              de donaciones.
            </span>
            <button className="hidden text-[0.7rem] font-semibold text-blue-600 hover:underline sm:inline">
              Ver todo el historial
            </button>
          </div>
        </div>

        {/* PANEL LATERAL: CONTEXTO / POLÍTICA */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Contexto del presupuesto
            </h3>
            <p className="mt-1 text-[0.75rem] text-slate-600">
              Este tablero permite visualizar rápidamente la salud financiera
              del fondo solidario: cuánto se recauda, cuánto se desembolsa y qué
              necesidades siguen abiertas.
            </p>
            <ul className="mt-3 space-y-1.5 text-[0.75rem] text-slate-600">
              <li>• Útil para informes a autoridades y transparencia.</li>
              <li>• Sirve como base para decisiones de asignación.</li>
              <li>• Se integra con solicitudes y publicaciones.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-[0.75rem] text-slate-700 shadow-sm">
            <p className="text-xs font-semibold text-blue-900">
              Próximos pasos del sistema
            </p>
            <p className="mt-1">
              En una versión completa, aquí se podrían mostrar:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Proyección de saldo a futuro.</li>
              <li>• Alertas de campañas con poco presupuesto.</li>
              <li>• Recomendaciones generadas por IA.</li>
            </ul>
            <p className="mt-3 text-[0.7rem] text-slate-600">
              Este panel es ideal para presentar el concepto de{" "}
              <span className="font-semibold">
                &quot;gestión inteligente de donaciones&quot;
              </span>{" "}
              en tu defensa o demo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonacionesDashboard;
