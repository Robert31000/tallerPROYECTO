import React, { useState } from "react";
import { X, Calendar, Package, Warehouse } from "lucide-react";

export type ReceiveDonationModalProps = {
  open: boolean;
  onClose: () => void;
  // opcional: campaña / solicitud asociada
  defaultCampania?: string;
  onCreate?: (item: InventarioItemInput) => void;
};

export type InventarioItemInput = {
  recurso: string;
  tipo: string;
  campania: string;
  cantidad: number;
  unidad: string;
  ubicacion: string;
  condicion: "NUEVO" | "USADO";
  fechaRecepcion: string;
};

type FormErrors = Partial<Record<keyof InventarioItemInput, string>>;

export function ReceiveDonationModal({
  open,
  onClose,
  defaultCampania = "Fondo Samaipata 2025",
  onCreate,
}: ReceiveDonationModalProps) {
  const [form, setForm] = useState<InventarioItemInput>({
    recurso: "",
    tipo: "Víveres",
    campania: defaultCampania,
    cantidad: 0,
    unidad: "unidades",
    ubicacion: "Depósito central – Bloque UAGRM",
    condicion: "NUEVO",
    fechaRecepcion: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  function validate(values: InventarioItemInput): FormErrors {
    const e: FormErrors = {};
    if (!values.recurso.trim())
      e.recurso = "El nombre del recurso es obligatorio";
    if (!values.campania.trim()) e.campania = "Debe indicar la campaña o fondo";
    if (values.cantidad <= 0) e.cantidad = "La cantidad debe ser mayor a cero";
    if (!values.ubicacion.trim())
      e.ubicacion = "Indique la ubicación física en almacén";
    if (!values.fechaRecepcion)
      e.fechaRecepcion = "Seleccione la fecha de recepción";
    return e;
  }

  function handleChange<K extends keyof InventarioItemInput>(
    key: K,
    value: InventarioItemInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const ve = validate(form);
    setErrors(ve);
    if (Object.keys(ve).length) return;

    try {
      setSubmitting(true);
      if (onCreate) onCreate(form);
      setForm({
        recurso: "",
        tipo: "Víveres",
        campania: defaultCampania,
        cantidad: 0,
        unidad: "unidades",
        ubicacion: "Depósito central – Bloque UAGRM",
        condicion: "NUEVO",
        fechaRecepcion: new Date().toISOString().slice(0, 10),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Registro de recepción
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Ingreso de donaciones al inventario
            </h2>
            <p className="text-xs text-slate-500">
              Registra físicamente lo que llegó al almacén institucional.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
        >
          {/* Recurso */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre del recurso / donación
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej: Kits de víveres, frazadas, medicinas…"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.recurso}
                onChange={(e) => handleChange("recurso", e.target.value)}
              />
              <Package className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.recurso && (
              <p className="text-[11px] text-red-600 mt-1">{errors.recurso}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tipo de recurso
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option>Víveres</option>
              <option>Ropa</option>
              <option>Medicamentos</option>
              <option>Útiles escolares</option>
              <option>Otros</option>
            </select>
          </div>

          {/* Campaña */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campaña / fondo
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.campania}
              onChange={(e) => handleChange("campania", e.target.value)}
            />
            {errors.campania && (
              <p className="text-[11px] text-red-600 mt-1">{errors.campania}</p>
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min={1}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.cantidad}
              onChange={(e) => handleChange("cantidad", Number(e.target.value))}
            />
            {errors.cantidad && (
              <p className="text-[11px] text-red-600 mt-1">{errors.cantidad}</p>
            )}
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unidad
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.unidad}
              onChange={(e) => handleChange("unidad", e.target.value)}
            >
              <option>unidades</option>
              <option>paquetes</option>
              <option>cajas</option>
              <option>bolsas</option>
              <option>kg</option>
            </select>
          </div>

          {/* Ubicación */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ubicación en almacén
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Estantería A2, Depósito central"
                value={form.ubicacion}
                onChange={(e) => handleChange("ubicacion", e.target.value)}
              />
              <Warehouse className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.ubicacion && (
              <p className="text-[11px] text-red-600 mt-1">
                {errors.ubicacion}
              </p>
            )}
          </div>

          {/* Condición */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Condición
            </label>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleChange("condicion", "NUEVO")}
                className={[
                  "flex-1 rounded-lg border px-3 py-2 text-center",
                  form.condicion === "NUEVO"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                ].join(" ")}
              >
                Nuevo
              </button>
              <button
                type="button"
                onClick={() => handleChange("condicion", "USADO")}
                className={[
                  "flex-1 rounded-lg border px-3 py-2 text-center",
                  form.condicion === "USADO"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                ].join(" ")}
              >
                Usado en buen estado
              </button>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de recepción
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.fechaRecepcion}
                onChange={(e) => handleChange("fechaRecepcion", e.target.value)}
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.fechaRecepcion && (
              <p className="text-[11px] text-red-600 mt-1">
                {errors.fechaRecepcion}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Guardando…" : "Registrar ingreso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
