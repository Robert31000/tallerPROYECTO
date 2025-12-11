// src/view/Donante/DonarPage.tsx (ajusta la ruta según tu estructura)
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const DonarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaign = id ? demoCampaigns[id] : undefined;

  const progress = campaign
    ? Math.min(100, Math.round((campaign.collected / campaign.goal) * 100))
    : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const data = new FormData(e.currentTarget);

    const donation = {
      nombreCompleto: (data.get("nombreCompleto") as string) || "",
      email: (data.get("email") as string) || "",
      telefono: (data.get("telefono") as string) || "",
      tipoDonacion: (data.get("tipoDonacion") as string) || "Dinero",
      monto: data.get("monto")
        ? Number(data.get("monto"))
        : null,
      comentario: (data.get("comentario") as string) || "",
    };

    // En lugar de alert → vamos a la página de éxito
    navigate(`/dashboard-donante/donar/${id}/exito`, {
      state: { donation },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Breadcrumb simple */}
        <div className="mb-4 text-xs text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="hover:underline"
          >
            ← Volver
          </button>{" "}
          / <span>Donar</span>
        </div>

        {/* Info campaña */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Donación a campaña
          </p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900">
            {campaign?.title ?? "Campaña de donación"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {campaign?.description ??
              "Describe aquí la campaña y los objetivos de la donación."}
          </p>

          {campaign && (
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>
                  Recaudado:{" "}
                  <span className="font-semibold text-slate-900">
                    Bs. {campaign.collected.toLocaleString("es-BO")}
                  </span>
                </span>
                <span>
                  Meta: Bs. {campaign.goal.toLocaleString("es-BO")}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}% completado</span>
            </div>
          )}
        </section>

        {/* Opciones: QR + registro */}
        <section className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Donar con QR */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Donar con dinero (QR)
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Escanea el código QR con la app de tu banco o billetera móvil.
              El monto será depositado a la cuenta oficial de la UAGRM para
              esta campaña.
            </p>

            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
                {/* Usa import si estás con Vite/CRA, algo como:
                    import qr from "../../assets/qr.png";
                    <img src={qr} alt="QR de donación" />
                */}
                <img src="/src/assets/qr.png" alt="QR de donación" />
              </div>
              <p className="text-[0.7rem] text-slate-500">
                * En producción, este QR será generado por el sistema/banco.
              </p>
            </div>
          </div>

          {/* Registrarse para donar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Registrarme para donar
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Si prefieres coordinar la donación por transferencia, depósito o
              entrega en especie, registra tus datos.
            </p>

            <form
              className="mt-3 space-y-3 text-xs"
              onSubmit={handleSubmit}
            >
              <div className="space-y-1">
                <label className="block text-slate-700">Nombre completo</label>
                <input
                  required
                  name="nombreCompleto"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Ej. María Pérez"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                  placeholder="tu-correo@ejemplo.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">
                  Teléfono / WhatsApp
                </label>
                <input
                  name="telefono"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                  placeholder="+591 ..."
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">Tipo de donación</label>
                <select
                  name="tipoDonacion"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                >
                  <option>Dinero</option>
                  <option>Alimentos</option>
                  <option>Ropa</option>
                  <option>Medicamentos</option>
                  <option>Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">
                  Monto estimado (opcional)
                </label>
                <input
                  type="number"
                  min={0}
                  name="monto"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Ej. 200 Bs."
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">
                  Comentarios / detalle de la donación
                </label>
                <textarea
                  name="comentario"
                  rows={3}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Ej. Puedo entregar alimentos el fin de semana..."
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Confirmar compromiso de donación
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DonarPage;
