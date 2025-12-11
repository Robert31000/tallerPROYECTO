// src/view/Donante/DonacionExitosaPage.tsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const demoCampaigns: Record<
  string,
  {
    title: string;
    description: string;
    goal: number;
    collected: number;
  }
> = {
  "1": {
    title: "Apoyo al hogar de niños 'Luz de Esperanza'",
    description:
      "Campaña para cubrir alimentación, útiles escolares y ropa de invierno para 40 niños del hogar.",
    goal: 15000,
    collected: 10250,
  },
  "2": {
    title: "Personas afectadas por las lluvias en el Beni",
    description:
      "Recolecta de víveres, medicinas y kits de aseo para familias damnificadas por las inundaciones.",
    goal: 20000,
    collected: 8400,
  },
  "3": {
    title: "Becas de alimentación para estudiantes UAGRM",
    description:
      "Fondo solidario para becas de alimentación dirigidas a estudiantes en situación de vulnerabilidad.",
    goal: 20000,
    collected: 15000,
  },
  "4": {
    title: "Medicamentos para campaña de salud comunitaria",
    description:
      "Apoyo para la compra de medicamentos básicos para brigadas médicas universitarias.",
    goal: 15000,
    collected: 4500,
  },
};

type DonationState = {
  donation?: {
    nombreCompleto: string;
    email: string;
    telefono: string;
    tipoDonacion: string;
    monto: number | null;
    comentario: string;
  };
};

const DonacionExitosaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as DonationState) || {};
  const donation = state.donation;

  const campaign = id ? demoCampaigns[id] : undefined;

  const totalOriginal = campaign?.collected ?? 0;
  const montoDonado = donation?.monto ?? 0;
  const totalConDonacion = totalOriginal + (montoDonado || 0);

  const progressOriginal = campaign
    ? Math.min(100, Math.round((campaign.collected / campaign.goal) * 100))
    : 0;

  const progressNuevo = campaign
    ? Math.min(
        100,
        Math.round((totalConDonacion / campaign.goal) * 100)
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-xs text-slate-500">
          <button
            onClick={() => navigate("/dashboard-donante")}
            className="hover:underline"
          >
            ← Volver al panel
          </button>
          <span>/</span>
          <span>Confirmación de donación</span>
        </div>

        {/* Card principal de éxito */}
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                ✅
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  ¡Tu compromiso de donación se registró con éxito!
                </p>
                <p className="text-xs text-slate-600">
                  Gracias por apoyar esta campaña. A continuación te mostramos
                  un resumen transparente de tu aporte.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard-donante")}
              className="mt-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 md:mt-0"
            >
              Ir al panel del donante
            </button>
          </div>

          {donation && (
            <div className="mt-4 grid gap-4 text-xs md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[0.7rem] text-slate-500">Donante</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {donation.nombreCompleto || "Donante anónimo"}
                </p>
                {donation.email && (
                  <p className="mt-1 text-[0.7rem] text-slate-500">
                    {donation.email}
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[0.7rem] text-slate-500">
                  Tipo de donación
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {donation.tipoDonacion}
                </p>
                {donation.telefono && (
                  <p className="mt-1 text-[0.7rem] text-slate-500">
                    Tel. {donation.telefono}
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[0.7rem] text-slate-500">
                  Monto estimado
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {donation.monto
                    ? `Bs. ${donation.monto.toLocaleString("es-BO")}`
                    : "No especificado"}
                </p>
              </div>
            </div>
          )}

          {donation?.comentario && (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
              <p className="text-[0.7rem] font-semibold text-slate-700">
                Mensaje que dejaste
              </p>
              <p className="mt-1 text-[0.7rem] text-slate-600">
                “{donation.comentario}”
              </p>
            </div>
          )}
        </section>

        {/* Transparencia de la campaña */}
        <section className="mt-6 grid gap-4 md:grid-cols-[1.2fr,1fr]">
          {/* Lado izquierdo: campaña y barras de progreso */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Resumen de campaña
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {campaign?.title ?? "Campaña de donación"}
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {campaign?.description ??
                "Describe aquí la campaña y los objetivos de la donación."}
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Recaudado antes de tu donación</span>
                <span className="font-semibold text-slate-900">
                  Bs. {totalOriginal.toLocaleString("es-BO")}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-400"
                  style={{ width: `${progressOriginal}%` }}
                />
              </div>

              {montoDonado > 0 && (
                <>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Tu aporte estimado</span>
                    <span className="font-semibold text-emerald-700">
                      + Bs. {montoDonado.toLocaleString("es-BO")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Total simulado tras tu donación</span>
                    <span className="font-semibold text-slate-900">
                      Bs. {totalConDonacion.toLocaleString("es-BO")}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${progressNuevo}%` }}
                    />
                  </div>
                </>
              )}

              {campaign && (
                <p className="mt-1 text-[0.7rem] text-slate-500">
                  Meta de la campaña:{" "}
                  <span className="font-semibold text-slate-900">
                    Bs. {campaign.goal.toLocaleString("es-BO")}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Lado derecho: "Historial" / transparencia */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <p className="text-xs font-semibold text-slate-900">
              Transparencia de tu donación
            </p>
            <p className="mt-1 text-[0.7rem] text-slate-600">
              Este es un resumen simulado de cómo se registra tu aporte en el
              sistema. En la versión final, estos datos se conectarán con la
              base de datos real de la UAGRM.
            </p>

            <ul className="mt-3 space-y-1.5 text-[0.7rem] text-slate-500">
              <li>• Tu donación se asocia a esta campaña y a tu perfil.</li>
              <li>
                • El administrador puede ver el detalle en el panel de
                donaciones.
              </li>
              <li>
                • Los montos se usan para actualizar el total recaudado y
                generar reportes.
              </li>
            </ul>

            <button
              onClick={() => navigate("/dashboard-donante")}
              className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Volver al panel del donante
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DonacionExitosaPage;
