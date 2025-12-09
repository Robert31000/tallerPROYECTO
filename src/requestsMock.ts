export type RequestCategory = "SALUD" | "INFRAESTRUCTURA" | "EDUCACION";

export interface BaseAidRequest {
  id: string;
  title: string;
  requester: string;
  description: string;
  category: RequestCategory;
  requestedAmount: number; // en Bs.
  createdAt: string;       // ISO
}

export const mockRequests: BaseAidRequest[] = [
  {
    id: "r1",
    title: "Cirugía de Emergencia - Pedrito",
    requester: "Familia Mamani",
    description:
      "El niño necesita una operación de corazón abierto antes del viernes.",
    category: "SALUD",
    requestedAmount: 15000,
    createdAt: "2025-11-19T10:00:00Z",
  },
  {
    id: "r2",
    title: "Techo para la Escuela San José",
    requester: "Junta de Vecinos",
    description:
      "El techo tiene goteras y necesitamos calaminas para la temporada de lluvia.",
    category: "INFRAESTRUCTURA",
    requestedAmount: 3000,
    createdAt: "2025-11-18T14:30:00Z",
  },
  {
    id: "r3",
    title: "Kits escolares para inicio de clases",
    requester: "Comité de Padres de Familia",
    description:
      "Se requieren cuadernos, mochilas y útiles para 100 niños de bajos recursos.",
    category: "EDUCACION",
    requestedAmount: 8000,
    createdAt: "2025-11-17T09:15:00Z",
  },
];
