import React, { useState } from "react";

import { api } from "../../lib/api";
// import DashboardShell from "../dashboard/DashboardShell";

type NuevaSolicitudForm = {
  tipoDonativo: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  beneficiarioNombre: string;
  beneficiarioDescripcion: string;
  montoEstimado: string;
  fechaLimite: string;
  ubicacion: string;
  contactoTelefono: string;
  contactoEmail: string;
  aceptaTerminos: boolean;
};

type EvidenciaPreview = {
  file: File;
  url: string;
};

export default function NuevaSolicitudPage() {
  const [form, setForm] = useState<NuevaSolicitudForm>({
    tipoDonativo: "",
    categoria: "",
    titulo: "",
    descripcion: "",
    urgencia: "MEDIA",
    beneficiarioNombre: "",
    beneficiarioDescripcion: "",
    montoEstimado: "",
    fechaLimite: "",
    ubicacion: "",
    contactoTelefono: "",
    contactoEmail: "",
    aceptaTerminos: false,
  });

  // 👇 Evidencias solo imágenes (CU4)
  const [evidencias, setEvidencias] = useState<EvidenciaPreview[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Manejo de archivos SOLO imágenes
  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const arr: EvidenciaPreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith("image/")) {
        // ignoramos lo que no sea imagen
        continue;
      }
      arr.push({
        file: f,
        url: URL.createObjectURL(f),
      });
    }

    setEvidencias(arr);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    if (!form.aceptaTerminos) {
      setServerError("Debe aceptar los términos y condiciones.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 👇 Enviamos todo como multipart/form-data
      const fd = new FormData();
      fd.append("tipoDonativo", form.tipoDonativo);
      fd.append("categoria", form.categoria);
      fd.append("titulo", form.titulo);
      fd.append("descripcion", form.descripcion);
      fd.append("urgencia", form.urgencia);
      fd.append("beneficiarioNombre", form.beneficiarioNombre);
      fd.append("beneficiarioDescripcion", form.beneficiarioDescripcion);
      fd.append("montoEstimado", form.montoEstimado);
      fd.append("fechaLimite", form.fechaLimite);
      fd.append("ubicacion", form.ubicacion);
      fd.append("contactoTelefono", form.contactoTelefono);
      fd.append("contactoEmail", form.contactoEmail);

      // Adjuntamos imágenes (CU4)
      evidencias.forEach((evd, idx) => {
        fd.append(
          "evidencias",
          evd.file,
          evd.file.name || `evidencia-${idx}.jpg`,
        );
      });

      await api.post("/solicitudes", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Solicitud registrada correctamente.");
      // Limpiar formulario
      setForm((prev) => ({
        ...prev,
        titulo: "",
        descripcion: "",
        beneficiarioNombre: "",
        beneficiarioDescripcion: "",
        montoEstimado: "",
        fechaLimite: "",
        ubicacion: "",
        contactoTelefono: "",
        contactoEmail: "",
      }));
      setEvidencias([]);
    } catch (err: any) {
      console.error(err);
      setServerError(
        err?.response?.data?.message || "No se pudo registrar la solicitud.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Registrar solicitud de donación
        </h1>
        <p className="text-sm text-slate-500">
          Completa los datos de la solicitud y adjunta evidencias en formato de
          imagen (fotos, capturas, etc.).
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
      >
        {serverError && (
          <div className="p-3 rounded-md bg-red-50 text-sm text-red-700">
            {serverError}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-md bg-emerald-50 text-sm text-emerald-700">
            {successMsg}
          </div>
        )}

        {/* Datos básicos */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Tipo de donativo
            </label>
            <select
              name="tipoDonativo"
              value={form.tipoDonativo}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">Seleccionar…</option>
              <option value="ALIMENTOS">Alimentos</option>
              <option value="ROPA">Ropa</option>
              <option value="MATERIAL_EDUCATIVO">Material educativo</option>
              <option value="ECONOMICO">Apoyo económico</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Categoría / campaña
            </label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Campaña Samaipata, Apoyo a becarios, etc."
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Título de la solicitud
          </label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="Ej. Apoyo alimentario para familia afectada"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Descripción detallada
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[90px]"
            placeholder="Explique la situación, necesidades y contexto de la solicitud…"
            required
          />
        </div>

        {/* Beneficiario + urgencia */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nombre / grupo beneficiario
            </label>
            <input
              type="text"
              name="beneficiarioNombre"
              value={form.beneficiarioNombre}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Ej. Familia Pérez, Comunidad Samaipata…"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nivel de urgencia
            </label>
            <select
              name="urgencia"
              value={form.urgencia}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Situación del beneficiario
          </label>
          <textarea
            name="beneficiarioDescripcion"
            value={form.beneficiarioDescripcion}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[70px]"
            placeholder="Explique brevemente el contexto de vulnerabilidad, número de personas, etc."
          />
        </div>

        {/* Monto, fecha, ubicación */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Monto estimado (opcional)
            </label>
            <input
              type="number"
              min={0}
              name="montoEstimado"
              value={form.montoEstimado}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Ej. 500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Fecha límite sugerida
            </label>
            <input
              type="date"
              name="fechaLimite"
              value={form.fechaLimite}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Ubicación / zona
            </label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Campus, barrio, municipio…"
            />
          </div>
        </div>

        {/* Contacto */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Teléfono de contacto
            </label>
            <input
              type="tel"
              name="contactoTelefono"
              value={form.contactoTelefono}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Ej. 75600000"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Correo de contacto
            </label>
            <input
              type="email"
              name="contactoEmail"
              value={form.contactoEmail}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="ejemplo@uagrm.edu.bo"
            />
          </div>
        </div>

        {/* CU4: Evidencias (solo imágenes) */}
        <div className="border-t border-slate-200 pt-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">
            Adjuntar evidencias (imágenes)
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Sube fotografías o capturas que respalden la solicitud (máx. 5
            imágenes, JPG/PNG).
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="block w-full text-sm text-slate-600
                         file:mr-3 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
          />

          {evidencias.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {evidencias.map((evd, idx) => (
                <div
                  key={idx}
                  className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <img
                    src={evd.url}
                    alt={`Evidencia ${idx + 1}`}
                    className="w-full h-28 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Términos */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="aceptaTerminos"
            checked={form.aceptaTerminos}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-600">
            Declaro que la información ingresada es verídica y autorizo el uso
            de estos datos para la gestión interna de campañas solidarias en la
            UAGRM.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Registrar solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}
