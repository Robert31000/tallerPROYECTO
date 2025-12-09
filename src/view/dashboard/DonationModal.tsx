import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

export type DonationType = "MONETARIA" | "EN_ESPECIE";

export type DonationModalProps = {
  open: boolean;
  onClose: () => void;
  // publicación seleccionada desde el catálogo
  publicacion: {
    id: number;
    codigo: string;
    titulo: string;
  } | null;
  onSuccess?: (donacion: {
    tipo: DonationType;
    monto?: number | null;
    descripcion?: string;
  }) => void;
};

type DonationFormState = {
  tipo: DonationType;
  monto: string; // texto para el input
  descripcion: string;
  metodoEntrega: "TRANSFERENCIA" | "DEPOSITO" | "ENTREGA_PRESENCIAL";
};

type FormErrors = Partial<Record<keyof DonationFormState, string>>;

export function DonationModal({
  open,
  onClose,
  publicacion,
  onSuccess,
}: DonationModalProps) {
  const [form, setForm] = useState<DonationFormState>({
    tipo: "MONETARIA",
    monto: "",
    descripcion: "",
    metodoEntrega: "TRANSFERENCIA",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open || !publicacion) return null;

  function validate(values: DonationFormState): FormErrors {
    const e: FormErrors = {};

    if (values.tipo === "MONETARIA") {
      if (!values.monto.trim()) e.monto = "El monto es obligatorio";
      const num = Number(values.monto.replace(",", "."));
      if (isNaN(num) || num <= 0) {
        e.monto = "Ingrese un monto válido mayor a 0";
      }
    }

    if (values.tipo === "EN_ESPECIE") {
      if (!values.descripcion.trim()) {
        e.descripcion =
          "Describa brevemente los bienes que desea donar (ej. víveres, ropa, etc.)";
      }
    }

    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(null);

    const ve = validate(form);
    setErrors(ve);
    if (Object.keys(ve).length) return;

    try {
      setSubmitting(true);

      // payload típico para el backend (ajusta el endpoint luego)
      const payload = {
        publicacionId: publicacion?.id,
        tipo: form.tipo,
        monto:
          form.tipo === "MONETARIA"
            ? Number(form.monto.replace(",", "."))
            : null,
        descripcion:
          form.tipo === "EN_ESPECIE"
            ? form.descripcion.trim()
            : form.descripcion.trim() || null,
        metodoEntrega: form.metodoEntrega,
      };

      // 👉 cuando tengas backend real, solo ajustas la ruta:
      await api.post("/donaciones", payload);

      if (onSuccess) {
        onSuccess({
          tipo: form.tipo,
          monto:
            form.tipo === "MONETARIA"
              ? Number(form.monto.replace(",", "."))
              : null,
          descripcion: form.descripcion.trim() || undefined,
        });
      }

      // Reseteamos form SOLO si todo salió bien
      setForm({
        tipo: "MONETARIA",
        monto: "",
        descripcion: "",
        metodoEntrega: "TRANSFERENCIA",
      });
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo registrar la donación";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-start px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Registrar donación
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              {publicacion.titulo}
            </h2>
            <p className="text-xs text-slate-500">{publicacion.codigo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Tipo de donación */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Tipo de donación
            </label>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, tipo: "MONETARIA" }))}
                className={[
                  "flex-1 rounded-lg border px-3 py-2 text-center",
                  form.tipo === "MONETARIA"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                ].join(" ")}
              >
                Monetaria (Bs)
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, tipo: "EN_ESPECIE" }))}
                className={[
                  "flex-1 rounded-lg border px-3 py-2 text-center",
                  form.tipo === "EN_ESPECIE"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                ].join(" ")}
              >
                En especie
              </button>
            </div>
          </div>

          {/* Monto */}
          {form.tipo === "MONETARIA" && (
            <div>
              <label
                htmlFor="monto"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Monto (Bs)
              </label>
              <input
                id="monto"
                type="number"
                min={1}
                step="0.5"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 100.00"
                value={form.monto}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monto: e.target.value }))
                }
              />
              {errors.monto && (
                <p className="mt-1 text-[11px] text-red-600">{errors.monto}</p>
              )}
            </div>
          )}

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              {form.tipo === "EN_ESPECIE"
                ? "Descripción de los bienes a donar *"
                : "Comentario (opcional)"}
            </label>
            <textarea
              id="descripcion"
              rows={3}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                form.tipo === "EN_ESPECIE"
                  ? "Ej: 2 cajas de víveres (arroz, fideo, aceite) y ropa de abrigo."
                  : "Mensaje para los organizadores (opcional)…"
              }
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
            />
            {errors.descripcion && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Método de entrega / pago */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Método de entrega / pago
            </label>
            <select
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.metodoEntrega}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  metodoEntrega: e.target
                    .value as DonationFormState["metodoEntrega"],
                }))
              }
            >
              <option value="TRANSFERENCIA">Transferencia bancaria</option>
              <option value="DEPOSITO">Depósito en cuenta</option>
              <option value="ENTREGA_PRESENCIAL">
                Entrega presencial en punto de acopio
              </option>
            </select>
          </div>

          {serverError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {serverError}
            </div>
          )}

          {/* Footer botones */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando…</span>
                </>
              ) : (
                <span>Confirmar donación</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
