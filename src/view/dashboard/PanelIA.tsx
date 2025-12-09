import React, { useEffect, useState } from "react";
import { analyzeAll, type AidRequestWithAI } from "../../aiEngine";
import { mockRequests } from "../../requestsMock";

function formatCurrency(amount: number) {
  return amount.toLocaleString("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  });
}

function priorityBorderClasses(priority: RequestPriority): string {
  switch (priority) {
    case "CRITICA":
      return "border-l-4 border-red-500";
    case "ALTA":
      return "border-l-4 border-amber-400";
    case "MEDIA":
      return "border-l-4 border-sky-400";
    default:
      return "border-l-4 border-slate-300";
  }
}

function scoreBadgeClasses(priority: RequestPriority): string {
  switch (priority) {
    case "CRITICA":
      return "bg-red-100 text-red-700";
    case "ALTA":
      return "bg-amber-100 text-amber-700";
    case "MEDIA":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

const PanelIA: React.FC = () => {
  const [requests, setRequests] = useState<AidRequestWithAI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos llamado a un servicio de IA
    setLoading(true);
    const timer = setTimeout(() => {
      const analyzed = analyzeAll(mockRequests);
      setRequests(analyzed);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const total = requests.length;
  const criticalCount = requests.filter((r) => r.priority === "CRITICA").length;
  const modelPrecision = 0.998; // 99.8% (mock)

  const sorted = [...requests].sort((a, b) => b.aiScore - a.aiScore);

  const recalc = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRequests(analyzeAll(mockRequests));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <header className="border-b border-slate-200 pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Sistema de Gestión Inteligente
            </h1>
            <p className="text-sm text-slate-500">
              Algoritmo de priorización activo ·{" "}
              <span className="font-semibold text-green-600">IA Online</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={recalc}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white text-xs px-4 py-2 hover:bg-slate-800"
        >
          <span>Recalcular con IA</span>
        </button>
      </header>

      {/* Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide">
            Solicitudes totales
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {loading ? "…" : total}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide">
            Prioridad crítica
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {loading ? "…" : criticalCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide">
            Precisión del modelo
          </p>
          <p className="mt-2 text-2xl font-semibold text-blue-600">
            {loading ? "…" : `${(modelPrecision * 100).toFixed(1)}%`}
          </p>
        </div>
      </section>

      {/* Lista de solicitudes */}
      <section className="space-y-4">
        {loading && (
          <p className="text-sm text-slate-500">
            Analizando solicitudes con el motor de IA…
          </p>
        )}

        {!loading &&
          sorted.map((req) => (
            <article
              key={req.id}
              className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row ${priorityBorderClasses(
                req.priority
              )}`}
            >
              <div className="flex-1 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900">
                      {req.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-sky-600">👤</span>
                        <span>
                          Solicitado por:{" "}
                          <span className="font-medium">{req.requester}</span>
                        </span>
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                        scoreBadgeClasses(req.priority)
                      }
                    >
                      IA Score: {Math.round(req.aiScore * 100)}/100
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {req.category}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-700">{req.description}</p>

                <div className="mt-3 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2 text-sm text-slate-700">
                  <p className="font-semibold text-sky-800 text-xs mb-1">
                    🔍 Análisis del Sistema:
                  </p>
                  <p className="text-[13px]">{req.explanation}</p>
                </div>
              </div>

              <div className="md:w-56 border-t md:border-t-0 md:border-l border-slate-100 p-4 md:p-5 flex flex-col justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Monto requerido
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCurrency(req.requestedAmount)}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full bg-blue-600 text-white text-sm font-medium py-2 hover:bg-blue-700"
                >
                  Donar
                </button>
              </div>
            </article>
          ))}
      </section>
    </div>
  );
};

export default PanelIA;
