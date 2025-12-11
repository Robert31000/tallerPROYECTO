// src/view/dashboard/NuevaSolicitudPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarSolicitud } from "../../lib/api";

import type { RegistrarSolicitudInput } from "../../lib/api";

type FormState = {
  titulo: string;
  descripcion: string;
  tipoRecurso: string;
  categoria: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  beneficiarioNombre: string;
  beneficiarioTipo: string;
  beneficiarioContacto: string;
  fechaLimite: string;
  imagenes: File[];
};

const initialState: FormState = {
  titulo: "",
  descripcion: "",
  tipoRecurso: "",
  categoria: "",
  urgencia: "MEDIA",
  beneficiarioNombre: "",
  beneficiarioTipo: "",
  beneficiarioContacto: "",
  fechaLimite: "",
  imagenes: [],
};

export default function NuevaSolicitudPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    // solo imágenes
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) validFiles.push(file);
    }

    setForm((f) => ({ ...f, imagenes: validFiles }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      setIsSubmitting(true);
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token") ||
        undefined;

      const payload: RegistrarSolicitudInput = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        tipoRecurso: form.tipoRecurso,
        categoria: form.categoria,
        urgencia: form.urgencia,
        beneficiarioNombre: form.beneficiarioNombre,
        beneficiarioTipo: form.beneficiarioTipo,
        beneficiarioContacto: form.beneficiarioContacto,
        fechaLimite: form.fechaLimite || undefined,
        imagenes: form.imagenes,
      };

      await registrarSolicitud(payload, token);
      setMessage("La solicitud se registró correctamente.");
      setForm(initialState);

      // si quieres devolver al listado:
      // navigate("/dashboard/solicitudes/revisar");
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar la solicitud. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Nueva solicitud de donación
        </h1>
        <p className="text-sm text-slate-500">
          Registra una nueva solicitud y adjunta evidencias (solo imágenes).
        </p>
      </header>

      {message && (
        <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-300 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white rounded-xl shadow-sm p-6"
      >
        {/* Datos básicos */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título de la solicitud *
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de recurso *
            </label>
            <input
              name="tipoRecurso"
              placeholder="Alimentos, útiles escolares, ropa..."
              value={form.tipoRecurso}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoría
            </label>
            <input
              name="categoria"
              placeholder="Emergencia, apoyo académico, salud..."
              value={form.categoria}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Urgencia *
            </label>
            <select
              name="urgencia"
              value={form.urgencia}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descripción detallada *
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        {/* Beneficiario */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Beneficiario *
            </label>
            <input
              name="beneficiarioNombre"
              value={form.beneficiarioNombre}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de beneficiario
            </label>
            <input
              name="beneficiarioTipo"
              placeholder="Estudiante, docente, colectivo..."
              value={form.beneficiarioTipo}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contacto
            </label>
            <input
              name="beneficiarioContacto"
              placeholder="Correo o teléfono"
              value={form.beneficiarioContacto}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Fecha límite */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha límite (opcional)
            </label>
            <input
              type="date"
              name="fechaLimite"
              value={form.fechaLimite}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Evidencias (CU4) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Evidencias (imágenes) *
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            Solo se permiten archivos de imagen (JPG, PNG, etc.).
          </p>
          {form.imagenes.length > 0 && (
            <p className="mt-1 text-xs text-emerald-600">
              {form.imagenes.length} archivo(s) seleccionados.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Registrar solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}
