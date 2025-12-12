import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface DonationData {
  nombreCompleto: string;
  email: string;
  telefono: string;
  tipoDonacion: string;
  monto: number | null;
  comentario: string;
}

interface LocationState {
  donation?: DonationData;
  campaignTitle?: string;
}

const DonacionExitoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const donation = state.donation;
  const campaignTitle = state.campaignTitle ?? "Campaña de donación";

  const montoTexto =
    donation?.monto != null
      ? `Bs. ${donation.monto.toLocaleString("es-BO")}`
      : "No especificado";

  const sinDatos = !donation;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* breadcrumb */}
        <div className="mb-4 text-xs text-slate-500">
          <button
            onClick={() => navigate("/dashboard-donante")}
            className="hover:underline"
          >
            ← Volver al panel de donante
          </button>
        </div>

        {/* tarjeta principal */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* header verde */}
          <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              Donación exitosa
            </p>
            <h1 className="mt-1 text-2xl font-semibold">
              ¡Gracias por tu apoyo! 💚
            </h1>
            <p className="mt-1 text-sm text-emerald-50">
              Hemos registrado tu compromiso de donación para:
            </p>
            <p className="mt-1 text-sm font-semibold">
              {campaignTitle}
            </p>
          </div>

          <div className="grid gap-0 px-6 py-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] md:gap-6">
            {/* columna izquierda: resumen */}
            <div className="space-y-3 text-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Resumen de tu donación
              </h2>

              {sinDatos ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                  No se encontraron los datos de la donación en esta vista.
                  <br />
                  Puedes volver al panel de donante y revisar tu historial.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-xs">
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">Nombre</dt>
                      <dd className="font-medium text-slate-900">
                        {donation?.nombreCompleto}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Correo</dt>
                      <dd className="font-medium text-slate-900">
                        {donation?.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Tipo de donación</dt>
                      <dd className="font-medium text-slate-900">
                        {donation?.tipoDonacion}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Monto estimado</dt>
                      <dd className="font-medium text-slate-900">
                        {montoTexto}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-slate-500">
                        Comentario / detalle
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap text-slate-800">
                        {donation?.comentario || "Sin comentarios adicionales."}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              <p className="text-[0.75rem] text-slate-500">
                También se ha enviado un resumen de esta donación al correo del
                administrador del sistema. Pronto se contactarán contigo para
                coordinar la entrega o confirmación del aporte.
              </p>
            </div>

            {/* columna derecha: acciones */}
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-xs md:mt-0">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                ¿Qué puedes hacer ahora?
              </h2>

              <button
                onClick={() => navigate("/dashboard-donante")}
                className="w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Volver al panel de donante
              </button>

              <button
                onClick={() => navigate("/dashboard-donante", { state: { scrollTo: "history" } })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white"
              >
                Ver historial de mis donaciones
              </button>

              <button
                onClick={() => navigate("/dashboard-donante")}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white"
              >
                Explorar más campañas
              </button>

              <p className="mt-1 text-[0.7rem] text-slate-500">
                Gracias por confiar en el Sistema de Donaciones UAGRM. Cada
                aporte ayuda a que el uso de los recursos sea transparente y
                llegue a quienes más lo necesitan.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DonacionExitoPage;
