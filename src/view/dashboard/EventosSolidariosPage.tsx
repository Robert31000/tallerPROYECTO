import React, { useState } from "react";

type EstadoEvento = "PLANIFICADO" | "EN_CURSO" | "FINALIZADO";

type Campania = {
  id: string;
  nombre: string;
};

type EventoSolidario = {
  id: number;
  nombre: string;
  campaniaId: string;
  campaniaNombre: string;
  tipo: string;
  fecha: string;
  lugar: string;
  metaRecaudacion?: number;
  canalDifusion: string;
  estado: EstadoEvento;
  descripcion?: string;
};

const mockCampanias: Campania[] = [
  { id: "CAMP-001", nombre: "Fondo Solidario Samaipata 2025" },
  { id: "CAMP-002", nombre: "Campaña Útiles para Todos" },
  { id: "CAMP-003", nombre: "Navidad Solidaria UAGRM" },
];

const initialEventos: EventoSolidario[] = [
  {
    id: 1,
    nombre: "Kermesse Solidaria Sociología",
    campaniaId: "CAMP-001",
    campaniaNombre: "Fondo Solidario Samaipata 2025",
    tipo: "KERMESSE",
    fecha: "2025-11-15",
    lugar: "Campus UAGRM - Bloque Sociología",
    metaRecaudacion: 5000,
    canalDifusion: "Redes sociales, afiches en facultad",
    estado: "FINALIZADO",
    descripcion: "Actividad gastronómica y cultural para recaudar fondos.",
  },
  {
    id: 2,
    nombre: "Colecta de víveres no perecederos",
    campaniaId: "CAMP-002",
    campaniaNombre: "Campaña Útiles para Todos",
    tipo: "COLECTA",
    fecha: "2025-12-05",
    lugar: "Hall central UAGRM",
    metaRecaudacion: 0,
    canalDifusion: "WhatsApp institucional y correo",
    estado: "EN_CURSO",
    descripcion:
      "Recojo de víveres y útiles escolares para familias vulnerables.",
  },
];

const emptyForm = {
  nombre: "",
  campaniaId: mockCampanias[0]?.id ?? "",
  tipo: "",
  fecha: "",
  lugar: "",
  metaRecaudacion: "",
  canalDifusion: "",
  estado: "PLANIFICADO" as EstadoEvento,
  descripcion: "",
};

const estadosOptions: { value: EstadoEvento; label: string }[] = [
  { value: "PLANIFICADO", label: "Planificado" },
  { value: "EN_CURSO", label: "En curso" },
  { value: "FINALIZADO", label: "Finalizado" },
];

const tiposEvento = [
  "KERMESSE",
  "COLECTA",
  "CONCIERTO",
  "TALLER",
  "CAMPAÑA EN REDES",
];

const EventosSolidariosPage: React.FC = () => {
  const [eventos, setEventos] = useState<EventoSolidario[]>(initialEventos);
  const [form, setForm] = useState(emptyForm);
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState<
    EstadoEvento | "TODOS"
  >("TODOS");

  const handleChange = (
    ev: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = ev.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!form.nombre.trim() || !form.fecha || !form.lugar.trim()) {
      alert("Por favor, complete al menos nombre, fecha y lugar del evento.");
      return;
    }

    const campania = mockCampanias.find((c) => c.id === form.campaniaId);

    const nuevo: EventoSolidario = {
      id: eventos.length ? Math.max(...eventos.map((e) => e.id)) + 1 : 1,
      nombre: form.nombre.trim(),
      campaniaId: form.campaniaId,
      campaniaNombre: campania?.nombre ?? "Campaña sin nombre",
      tipo: form.tipo || "OTRO",
      fecha: form.fecha,
      lugar: form.lugar.trim(),
      metaRecaudacion: form.metaRecaudacion
        ? Number(form.metaRecaudacion)
        : undefined,
      canalDifusion: form.canalDifusion.trim() || "No especificado",
      estado: form.estado,
      descripcion: form.descripcion.trim() || undefined,
    };

    setEventos((prev) => [nuevo, ...prev]);
    setForm(emptyForm);
  };

  const handleChangeEstado = (id: number, estado: EstadoEvento) => {
    setEventos((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, estado } : ev)),
    );
  };

  const eventosFiltrados =
    selectedEstadoFilter === "TODOS"
      ? eventos
      : eventos.filter((e) => e.estado === selectedEstadoFilter);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">
          CU18 – Registrar eventos solidarios
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Registra kermesses, colectas y otras actividades solidarias vinculadas
          a campañas de donación. Estos eventos ayudan a incrementar el impacto
          y la recaudación de fondos solidarios dentro de la UAGRM.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulario de registro */}
        <section className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            Nuevo evento solidario
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Complete los datos para registrar un evento vinculado a una campaña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del evento <span className="text-red-500">*</span>
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Kermesse Solidaria Sociología"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campaña asociada
              </label>
              <select
                name="campaniaId"
                value={form.campaniaId}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mockCampanias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de evento
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar…</option>
                  {tiposEvento.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lugar <span className="text-red-500">*</span>
              </label>
              <input
                name="lugar"
                value={form.lugar}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Campus UAGRM – Bloque 312"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meta de recaudación (Bs.)
                </label>
                <input
                  type="number"
                  name="metaRecaudacion"
                  value={form.metaRecaudacion}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. 5000"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {estadosOptions.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Canal de difusión
              </label>
              <input
                name="canalDifusion"
                value={form.canalDifusion}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Redes sociales, WhatsApp institucional"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción / detalle
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describa brevemente el objetivo del evento y las actividades que se realizarán."
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Registrar evento
            </button>
          </form>
        </section>

        {/* Listado de eventos */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Eventos registrados
              </h2>
              <p className="text-xs text-slate-500">
                Registro histórico de actividades vinculadas a las campañas de
                donación.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Filtrar por estado:
              </span>
              <select
                className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white"
                value={selectedEstadoFilter}
                onChange={(e) =>
                  setSelectedEstadoFilter(
                    e.target.value as EstadoEvento | "TODOS",
                  )
                }
              >
                <option value="TODOS">Todos</option>
                {estadosOptions.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {eventosFiltrados.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-8">
              No hay eventos registrados para el filtro seleccionado.
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {eventosFiltrados.map((ev) => (
                <article
                  key={ev.id}
                  className="border border-slate-200 rounded-lg p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {ev.nombre}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Campaña:{" "}
                        <span className="font-medium">{ev.campaniaNombre}</span>
                      </p>
                    </div>
                    <select
                      className="text-[11px] border border-slate-300 rounded-md px-2 py-1 bg-white self-start"
                      value={ev.estado}
                      onChange={(e) =>
                        handleChangeEstado(
                          ev.id,
                          e.target.value as EstadoEvento,
                        )
                      }
                    >
                      {estadosOptions.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="font-semibold">Fecha:</span> {ev.fecha}
                    </div>
                    <div>
                      <span className="font-semibold">Lugar:</span> {ev.lugar}
                    </div>
                    <div>
                      <span className="font-semibold">Tipo:</span> {ev.tipo}
                    </div>
                    <div>
                      <span className="font-semibold">Meta (Bs.):</span>{" "}
                      {ev.metaRecaudacion != null ? ev.metaRecaudacion : "—"}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold">Canal difusión:</span>{" "}
                      {ev.canalDifusion}
                    </div>
                  </div>

                  {ev.descripcion && (
                    <p className="text-xs text-slate-600 mt-1">
                      {ev.descripcion}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventosSolidariosPage;
