// src/lib/api.ts
import axios from "axios";

/**
 * Instancia base de Axios
 */
export const api = axios.create({
  baseURL: "http://localhost:8080/api", // <-- AJUSTA AQUÍ SI ES OTRO PUERTO/PREFIJO
});

// ─────────────────────────────────────────────
// Tipos comunes
// ─────────────────────────────────────────────

export type EstadoSolicitud = "PENDIENTE" | "APROBADA" | "RECHAZADA";
export type TipoDonacion = "DINERO" | "ESPECIE";

// ---------- AUTH ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    nombre: string;
    rol: string;
  };
}

// ---------- CU3: REGISTRAR SOLICITUD ----------

export interface RegistrarSolicitudInput {
  titulo: string;
  descripcion: string;
  tipoRecurso: string; // alimentos, útiles, etc.
  categoria: string; // académica, emergencia, etc.
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  beneficiarioNombre: string;
  beneficiarioTipo: string; // estudiante, docente, colectivo…
  beneficiarioContacto: string;
  fechaLimite?: string; // ISO '2025-12-31'
  imagenes?: File[]; // SOLO IMÁGENES (CU4)
}

export interface SolicitudResumen {
  id: number;
  codigo: string;
  titulo: string;
  tipoRecurso: string;
  beneficiarioNombre: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  estado: EstadoSolicitud;
  fechaRegistro: string; // ISO
}

/**
 * CU3 + CU4 – registrar solicitud con evidencias (solo imágenes)
 */
export async function registrarSolicitud(
  input: RegistrarSolicitudInput,
  token?: string,
) {
  const formData = new FormData();
  formData.append("titulo", input.titulo);
  formData.append("descripcion", input.descripcion);
  formData.append("tipoRecurso", input.tipoRecurso);
  formData.append("categoria", input.categoria);
  formData.append("urgencia", input.urgencia);
  formData.append("beneficiarioNombre", input.beneficiarioNombre);
  formData.append("beneficiarioTipo", input.beneficiarioTipo);
  formData.append("beneficiarioContacto", input.beneficiarioContacto);
  if (input.fechaLimite) formData.append("fechaLimite", input.fechaLimite);

  input.imagenes?.forEach((img, idx) => {
    formData.append("imagenes", img, `evidencia-${idx}.jpg`);
  });

  const res = await api.post("/solicitudes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.data as SolicitudResumen;
}

// ---------- CU5: REVISAR Y VALIDAR SOLICITUDES ----------

export interface SolicitudDetalle extends SolicitudResumen {
  evidencias: string[]; // URLs de imágenes
  motivoRechazo?: string | null;
}

export async function listarSolicitudes(
  estado: EstadoSolicitud,
  token?: string,
) {
  const res = await api.get("/solicitudes", {
    params: { estado },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as SolicitudResumen[];
}

export async function obtenerSolicitud(id: number, token?: string) {
  const res = await api.get(`/solicitudes/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as SolicitudDetalle;
}

export async function cambiarEstadoSolicitud(
  id: number,
  estado: EstadoSolicitud,
  motivo?: string,
  token?: string,
) {
  const res = await api.post(
    `/solicitudes/${id}/estado`,
    { estado, motivo },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );
  return res.data as SolicitudDetalle;
}

// ---------- CU6: CATÁLOGO PUBLICACIONES ----------

export interface PublicacionCatalogoItem {
  id: number;
  codigoSolicitud: string;
  titulo: string;
  tipoRecurso: string;
  beneficiarioNombre: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  fechaPublicacion: string;
  imagenPrincipalUrl?: string | null;
  totalDonado?: number;
}

export interface PublicacionDetalle extends PublicacionCatalogoItem {
  descripcion: string;
  evidencias: string[];
  donaciones: DonacionResumen[];
}

export async function listarCatalogoPublicaciones(params?: {
  categoria?: string;
  estado?: string; // activa, cerrada, etc. si lo usas
}) {
  const res = await api.get("/publicaciones/catalogo", { params });
  return res.data as PublicacionCatalogoItem[];
}

export async function obtenerPublicacion(id: number) {
  const res = await api.get(`/publicaciones/${id}`);
  return res.data as PublicacionDetalle;
}

// ---------- CU9: REGISTRAR DONACIÓN ----------

export interface RegistrarDonacionInput {
  publicacionId: number;
  tipo: TipoDonacion;
  monto?: number;
  moneda?: string;
  descripcionBienes?: string;
  donanteNombre: string;
  donanteCorreo?: string;
}

export interface DonacionResumen {
  id: number;
  tipo: TipoDonacion;
  monto?: number;
  moneda?: string;
  descripcionBienes?: string;
  donanteNombre: string;
  fechaRegistro: string;
}

export async function registrarDonacion(input: RegistrarDonacionInput) {
  const res = await api.post("/donaciones", input);
  return res.data as DonacionResumen;
}

export async function listarDonacionesPorPublicacion(publicacionId: number) {
  const res = await api.get(`/publicaciones/${publicacionId}/donaciones`);
  return res.data as DonacionResumen[];
}

// ---------- CU13–CU14: INVENTARIO ----------

export interface RegistrarItemInventarioInput {
  donacionId: number;
  descripcion: string;
  cantidad: number;
  unidad: string;
  ubicacion: string;
}

export interface ItemInventario {
  id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  ubicacion: string;
  estado: string; // EN_ALMACEN, RESERVADO, ENTREGADO…
  fechaIngreso: string;
  fechaActualizacion: string;
  donacionId: number;
}

export async function registrarIngresoInventario(
  input: RegistrarItemInventarioInput,
  token?: string,
) {
  const res = await api.post("/inventario", input, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as ItemInventario;
}

export async function listarInventario(estado?: string, token?: string) {
  const res = await api.get("/inventario", {
    params: estado && estado !== "TODOS" ? { estado } : undefined,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as ItemInventario[];
}

export async function cambiarEstadoInventario(
  id: number,
  nuevoEstado: string,
  token?: string,
) {
  const res = await api.patch(
    `/inventario/${id}/estado`,
    { estado: nuevoEstado },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );
  return res.data as ItemInventario;
}

// ---------- CU18: EVENTOS SOLIDARIOS ----------

export interface RegistrarEventoInput {
  nombre: string;
  campania?: string;
  tipo: string;
  fecha: string; // '2025-12-10'
  lugar: string;
  metaRecaudacion?: number;
  canalDifusion?: string;
  estado?: string; // PROGRAMADO, EN_CURSO, FINALIZADO…
  descripcion?: string;
}

export interface EventoSolidario {
  id: number;
  nombre: string;
  campania?: string;
  tipo: string;
  fecha: string;
  lugar: string;
  metaRecaudacion?: number;
  canalDifusion?: string;
  estado: string;
  descripcion?: string;
}

export async function registrarEvento(
  input: RegistrarEventoInput,
  token?: string,
) {
  const res = await api.post("/eventos", input, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as EventoSolidario;
}

export async function listarEventos(estado?: string, token?: string) {
  const res = await api.get("/eventos", {
    params: estado && estado !== "TODOS" ? { estado } : undefined,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as EventoSolidario[];
}
