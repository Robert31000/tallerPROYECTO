export interface Beneficiary {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  country: string;
  activeNeeds: number;
  totalReceived: number;
  totalDistributed: number;
}

export type NeedUrgency = "alta" | "media" | "baja";

export interface Need {
  id: string;
  title: string;
  description: string;
  beneficiaryId: string;
  requiredAmount: number;
  collectedAmount: number;
  urgency: NeedUrgency;
  aiScore: number; // 0–1
  status: "abierta" | "financiada" | "cerrada";
  createdAt: string; // ISO
}

export interface Transaction {
  id: string;
  type: "donacion" | "gasto";
  beneficiaryId: string;
  needId?: string;
  amount: number;
  currency: string;
  direction: "in" | "out"; // entra o sale dinero
  description: string;
  createdAt: string;
}
