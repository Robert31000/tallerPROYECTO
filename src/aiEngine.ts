import type { BaseAidRequest, RequestCategory } from "./requestsMock";

export type RequestPriority = "CRITICA" | "ALTA" | "MEDIA" | "BAJA";

export interface AidRequestWithAI extends BaseAidRequest {
  aiScore: number;      // 0–1
  priority: RequestPriority;
  explanation: string;
}

const KEYWORD_WEIGHTS: Record<string, number> = {
  emergencia: 0.25,
  urgencia: 0.2,
  urgente: 0.2,
  operación: 0.2,
  operacion: 0.2,
  corazón: 0.2,
  corazon: 0.2,
  viernes: 0.05,
  niño: 0.05,
  nino: 0.05,
  escuela: 0.05,
  techo: 0.05,
  lluvia: 0.05,
};

function getCategoryBoost(category: RequestCategory): number {
  switch (category) {
    case "SALUD":
      return 0.2;
    case "INFRAESTRUCTURA":
      return 0.05;
    default:
      return 0;
  }
}

function clamp(score: number): number {
  return Math.max(0, Math.min(1, score));
}

function scoreToPriority(score: number): RequestPriority {
  if (score >= 0.9) return "CRITICA";
  if (score >= 0.75) return "ALTA";
  if (score >= 0.6) return "MEDIA";
  return "BAJA";
}

export function analyzeRequest(req: BaseAidRequest): AidRequestWithAI {
  let score = 0.5;
  const text = (req.title + " " + req.description).toLowerCase();

  const matchedKeywords: string[] = [];

  for (const [keyword, weight] of Object.entries(KEYWORD_WEIGHTS)) {
    if (text.includes(keyword)) {
      score += weight;
      matchedKeywords.push(keyword);
    }
  }

  score += getCategoryBoost(req.category);

  if (req.requestedAmount > 10000) {
    score += 0.05;
  } else if (req.requestedAmount < 2000) {
    score -= 0.05;
  }

  score = clamp(score);

  const priority = scoreToPriority(score);

  const explanationParts: string[] = [];

  if (matchedKeywords.length) {
    explanationParts.push(
      `Palabras de riesgo detectadas: ${matchedKeywords
        .map((k) => `'${k}'`)
        .join(", ")}.`
    );
  }

  explanationParts.push(`Categoría: ${req.category.toLowerCase()}.`);
  explanationParts.push(
    `Monto requerido: Bs. ${req.requestedAmount.toLocaleString("es-BO")}.`
  );

  const explanation =
    `Riesgo ${priority === "CRITICA" ? "CRÍTICO" : priority.toLowerCase()}. ` +
    explanationParts.join(" ");

  return {
    ...req,
    aiScore: score,
    priority,
    explanation,
  };
}

export function analyzeAll(
  requests: BaseAidRequest[]
): AidRequestWithAI[] {
  return requests.map(analyzeRequest);
}
