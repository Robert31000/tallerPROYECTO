import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { registrarDonacion } from "../../lib/api";
import type { RegistrarDonacionInput, TipoDonacion } from "../../lib/api";

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
  const [showQRStep, setShowQRStep] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

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

    // If monetary and transfer/deposit, move to QR confirmation step
    if (
      form.tipo === "MONETARIA" &&
      (form.metodoEntrega === "TRANSFERENCIA" ||
        form.metodoEntrega === "DEPOSITO")
    ) {
      const amount = Number(form.monto.replace(",", "."));
      const svg = generateQrSvg(amount, publicacion!.id, publicacion!.codigo);
      setQrDataUrl(svg);
      setShowQRStep(true);
      return;
    }

    try {
      setSubmitting(true);

      // use central helper (will call local mock if enabled)
      const donationPayload: RegistrarDonacionInput = {
        publicacionId: publicacion!.id,
        tipo: (form.tipo === "MONETARIA"
          ? "DINERO"
          : "ESPECIE") as TipoDonacion,
        monto:
          form.tipo === "MONETARIA"
            ? Number(form.monto.replace(",", "."))
            : undefined,
        moneda: undefined,
        descripcionBienes:
          form.tipo === "EN_ESPECIE" ? form.descripcion.trim() : undefined,
        donanteNombre: "Anon",
      };
      await registrarDonacion(donationPayload);

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
    } catch (err: unknown) {
      console.error(err);
      setServerError("No se pudo registrar la donación");
    } finally {
      setSubmitting(false);
    }
  }

  function generateQrSvg(
    amount: number,
    publicacionId: number,
    codigo: string,
  ) {
    const texto = `PAGO|PUB:${publicacionId}|COD:${codigo}|MON:${amount.toFixed(2)}`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'><rect width='100%' height='100%' fill='#fff'/><g font-family='Arial,Helvetica,sans-serif'><rect x='10' y='10' width='220' height='220' rx='12' fill='#0ea5e9'/><text x='50%' y='45%' text-anchor='middle' font-size='12' fill='#fff'>QR SIMULADO</text><text x='50%' y='55%' text-anchor='middle' font-size='10' fill='#fff'>${texto}</text></g></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  async function handleConfirmPayment() {
    if (!publicacion) return;
    setServerError(null);
    setSubmitting(true);
    try {
      const donationPayload: RegistrarDonacionInput = {
        publicacionId: publicacion.id,
        tipo: (form.tipo === "MONETARIA"
          ? "DINERO"
          : "ESPECIE") as TipoDonacion,
        monto:
          form.tipo === "MONETARIA"
            ? Number(form.monto.replace(",", "."))
            : undefined,
        moneda: undefined,
        descripcionBienes:
          form.tipo === "EN_ESPECIE" ? form.descripcion.trim() : undefined,
        donanteNombre: "Anon",
        comprobante: proofFile || undefined,
      };

      await registrarDonacion(donationPayload);

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

      // reset
      setForm({
        tipo: "MONETARIA",
        monto: "",
        descripcion: "",
        metodoEntrega: "TRANSFERENCIA",
      });
      setShowQRStep(false);
      setQrDataUrl(null);
      setProofFile(null);
      setProofPreview(null);
      onClose();
    } catch (err) {
      console.error(err);
      setServerError("No se pudo confirmar el pago");
    } finally {
      setSubmitting(false);
    }
  }

  function handleProofChange(f?: File) {
    if (!f) return;
    setProofFile(f);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(String(reader.result));
    reader.readAsDataURL(f);
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

          {/* QR / Proof step */}
          {showQRStep ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">QR de pago (simulado)</p>
                {qrDataUrl && (
                  <div className="mt-2">
                    <img
                      src={qrDataUrl}
                      alt="QR simulado"
                      className="w-40 h-40 object-contain rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subir comprobante del pago (imagen)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleProofChange(
                      e.target.files ? e.target.files[0] : undefined,
                    )
                  }
                />
                {proofPreview && (
                  <div className="mt-2">
                    <img
                      src={proofPreview}
                      alt="Comprobante"
                      className="w-32 h-20 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowQRStep(false);
                    setQrDataUrl(null);
                  }}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  disabled={submitting}
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirmando…</span>
                    </>
                  ) : (
                    <span>Confirmar pago y registrar</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Footer botones */
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
          )}
        </form>
      </div>
    </div>
  );
}
