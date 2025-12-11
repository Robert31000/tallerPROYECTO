// app/dashboard-donante/PublicationCard.tsx
// o donde lo tengas

import { Link } from "react-router-dom";


export type Publication = {
  id: number;
  title: string;
  category: "Niños" | "Emergencias" | "Educación" | "Salud";
  description: string;
  urgency: "Alta" | "Media" | "Baja";
  progress: number; // 0-100
  collected: number;
  goal: number;
};

function UrgencyBadge({ level }: { level: Publication["urgency"] }) {
  const styles: Record<Publication["urgency"], string> = {
    Alta: "bg-red-50 text-red-600 border-red-200",
    Media: "bg-amber-50 text-amber-600 border-amber-200",
    Baja: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${styles[level]}`}
    >
      Urgencia {level}
    </span>
  );
}

interface PublicationCardProps {
  pub: Publication;
}

export function PublicationCard({ pub }: PublicationCardProps) {
  const percentage = `${pub.progress}%`;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {pub.title}
          </h3>
          <p className="mt-1 text-xs text-slate-600">{pub.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] text-slate-700">
            {pub.category}
          </span>
          <UrgencyBadge level={pub.urgency} />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[0.7rem] text-slate-600">
          <span>
            Recaudado:{" "}
            <span className="font-semibold text-slate-900">
              Bs. {pub.collected.toLocaleString("es-BO")}
            </span>
          </span>
          <span>Meta: Bs. {pub.goal.toLocaleString("es-BO")}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900"
            style={{ width: percentage }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[0.7rem] text-slate-600">
          <span>{percentage} completado</span>
          <button className="text-[0.7rem] font-semibold text-slate-900 hover:underline">
            Ver detalles
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem]">
        {/* 👉 Aquí navegamos a /donar/[id] */}
        <Link
          to={`/dashboard-donante/donar/:id`}
          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-800"
        >
          Donar ahora
        </Link>
        <button className="rounded-lg border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50">
          Guardar para después
        </button>
      </div>
    </article>
  );
}
