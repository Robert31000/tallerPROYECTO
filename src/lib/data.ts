// src/lib/data.ts

export interface Donacion {
  id: number;
  titulo: string;
  solicitante: string;
  descripcion: string;
  monto: number;
  moneda: string;
  // Campos de tu "Inteligencia Artificial"
  ia_score: number; // 0 a 100
  ia_categoria: 'SALUD' | 'ALIMENTACIÓN' | 'EDUCACIÓN' | 'INFRAESTRUCTURA';
  ia_resumen: string;
}

export const solicitudesIA: Donacion[] = [
  {
    id: 1,
    titulo: "Cirugía de Emergencia - Pedrito",
    solicitante: "Familia Mamani",
    descripcion: "El niño necesita una operación de corazón abierto antes del viernes.",
    monto: 15000,
    moneda: "BOB",
    ia_score: 98, // La IA detectó urgencia máxima
    ia_categoria: "SALUD",
    ia_resumen: "Riesgo vital inminente. Prioridad CRÍTICA detectada por palabras clave: 'operación', 'corazón', 'viernes'."
  },
  {
    id: 2,
    titulo: "Techo para la Escuela San José",
    solicitante: "Junta de Vecinos",
    descripcion: "El techo tiene goteras y necesitamos calaminas para la temporada de lluvia.",
    monto: 3000,
    moneda: "BOB",
    ia_score: 65, // Urgencia media
    ia_categoria: "INFRAESTRUCTURA",
    ia_resumen: "Necesidad preventiva. Impacto alto en comunidad, pero sin riesgo de vida inmediato."
  },
  {
    id: 3,
    titulo: "Libros de Historia",
    solicitante: "Biblioteca Municipal",
    descripcion: "Queremos renovar la colección de historia universal.",
    monto: 500,
    moneda: "BOB",
    ia_score: 20, // Urgencia baja
    ia_categoria: "EDUCACIÓN",
    ia_resumen: "Mejora cultural. No se detectan términos de urgencia o riesgo."
  }
];