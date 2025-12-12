"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

export type Publication = {
  id: number;
  title: string;
  category: string;
  description: string;
  urgency: "Alta" | "Media" | "Baja";
  progress: number;
  collected: number;
  goal: number;
};

export type Comment = {
  id: string;
  publicationId: number;
  text: string;
  createdAt: string;
};

interface PublicationCardProps {
  pub: Publication;
  comments: Comment[];
  onAddComment: (pubId: number, text: string) => void;
}

export function PublicationCard({ pub, comments, onAddComment }: PublicationCardProps) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(pub.id, trimmed);
    setCommentText("");
  };

  const urgencyColor =
    pub.urgency === "Alta"
      ? "bg-rose-100 text-rose-700 border-rose-200"
      : pub.urgency === "Media"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";

  const progress = Math.min(100, pub.progress);

  
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/95 p-4 text-xs shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Campaña
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">
            {pub.title}
          </h3>
          <p className="mt-1 text-[0.75rem] text-slate-600">
            {pub.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${urgencyColor}`}
          >
            Urgencia: {pub.urgency}
          </span>
          <span className="mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] text-slate-600">
            {pub.category}
          </span>
        </div>
      </div>

      {/* PROGRESO */}
      <div className="mt-3 space-y-1 text-[0.7rem] text-slate-600">
        <div className="flex items-center justify-between">
          <span>
            Recaudado:{" "}
            <span className="font-semibold text-slate-900">
              Bs. {pub.collected.toLocaleString("es-BO")}
            </span>
          </span>
          <span>Meta: Bs. {pub.goal.toLocaleString("es-BO")}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[0.7rem] text-slate-500">
          {progress}% de la meta alcanzada
        </span>
      </div>

      {/* BOTÓN DONAR */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link to={'/dashboard-donante/donar/:id'} className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[0.75rem] font-semibold text-white hover:bg-slate-800">
          Donar ahora
        </Link>
        <button className="text-[0.7rem] font-semibold text-slate-700 hover:underline">
          Ver detalles
        </button>
      </div>

      {/* SECCIÓN DE COMENTARIOS */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[0.75rem] font-semibold text-slate-900">
          Comentarios de donantes
        </p>

        {/* Lista de comentarios */}
        {comments.length === 0 ? (
          <p className="mt-1 text-[0.7rem] text-slate-500">
            Aún no hay comentarios en esta campaña. Sé el primero en dejar uno.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-lg bg-slate-50 px-2 py-1.5 text-[0.7rem] text-slate-700"
              >
                <p>{c.text}</p>
                <p className="mt-1 text-[0.6rem] text-slate-400">
                  {new Date(c.createdAt).toLocaleString("es-BO", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Formulario para agregar comentario */}
        <form onSubmit={handleSubmit} className="mt-2 space-y-1.5">
          <label className="text-[0.7rem] text-slate-600">
            Deja tu comentario sobre esta campaña
          </label>
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[0.7rem] outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
              placeholder="Ej. Me parece muy importante apoyar este hogar..."
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-3 py-1.5 text-[0.7rem] font-semibold text-white hover:bg-slate-800"
            >
              Comentar
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
