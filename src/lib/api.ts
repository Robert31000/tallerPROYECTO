// Original backend-consuming implementation (summary)
// The project originally used an axios instance exported as `api`:
//
// import axios from 'axios'
// export const api = axios.create({ baseURL: 'http://localhost:8080/api', withCredentials: true })
// export default api
//
// The original file also exported helper functions such as:
// - registrarSolicitud
// - listarSolicitudes
// - obtenerSolicitud
// - cambiarEstadoSolicitud
// - listarCatalogoPublicaciones
// - registrarDonacion
// - registrarIngresoInventario
// - listarInventario
// - cambiarEstadoInventario
// - registrarEvento
//
// To avoid duplicating type declarations and causing conflicts, the full original
// implementation is not inlined here. If you want the full original code restored
// (commented), I can add it into `src/lib/api.backend.ts` or re-add it commented
// in this file. For now we keep a concise summary and the new local backend
// implementation below.

import axios from "axios";

const DEFAULT_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// Use local backend by default to enable a full local flow si no hay backend
const USE_LOCAL =
  import.meta.env.VITE_USE_LOCAL_API !== undefined
    ? import.meta.env.VITE_USE_LOCAL_API === "true"
    : true;

/**
 * Instancia base de Axios (si se quiere usar backend real)
 */
export const axiosApi = axios.create({
  baseURL: DEFAULT_BASE,
  withCredentials: true,
});

// ---------- Tipos comunes (exportados para uso en la app) ----------
export type EstadoSolicitud = "PENDIENTE" | "APROBADA" | "RECHAZADA";
export type TipoDonacion = "DINERO" | "ESPECIE";

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

export interface RegistrarSolicitudInput {
  titulo: string;
  descripcion: string;
  tipoRecurso: string;
  categoria: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  beneficiarioNombre: string;
  comprobante?: File | string;
  beneficiarioTipo: string;
  beneficiarioContacto: string;
  fechaLimite?: string;
  imagenes?: File[];
}

export interface SolicitudResumen {
  id: number;
  codigo?: string;
  titulo: string;
  tipoRecurso: string;
  comprobanteUrl?: string;
  categoria?: string;
  beneficiarioNombre: string;
  urgencia: "BAJA" | "MEDIA" | "ALTA";
  estado: EstadoSolicitud;
  fechaRegistro: string;
  fechaCreacion?: string;
}

export interface SolicitudDetalle extends SolicitudResumen {
  evidencias: string[];
  motivoRechazo?: string | null;
  descripcion?: string;
}

export interface PublicacionCatalogoItem {
  id: number;
  codigoSolicitud?: string;
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

export interface RegistrarDonacionInput {
  publicacionId: number;
  tipo: TipoDonacion;
  monto?: number;
  moneda?: string;
  descripcionBienes?: string;
  donanteNombre: string;
  donanteCorreo?: string;
  comprobante?: File | string;
}

export interface DonacionResumen {
  id: number;
  tipo: TipoDonacion;
  monto?: number;
  moneda?: string;
  descripcionBienes?: string;
  donanteNombre: string;
  fechaRegistro: string;
  publicacionId?: number;
  comprobanteUrl?: string;
}

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
  estado: string;
  fechaIngreso: string;
  fechaActualizacion: string;
  donacionId: number;
}

export interface RegistrarEventoInput {
  nombre: string;
  publicacionId?: number;
  publicacionTitulo?: string;
  tipo: string;
  fecha: string;
  lugar: string;
  metaRecaudacion?: number;
  canalDifusion?: string;
  estado?: string;
  descripcion?: string;
}

export interface EventoSolidario {
  id: number;
  nombre: string;
  publicacionId?: number;
  publicacionTitulo?: string;
  tipo: string;
  fecha: string;
  lugar: string;
  metaRecaudacion?: number;
  canalDifusion?: string;
  estado: string;
  descripcion?: string;
}

// ---------- Implementación de backend local (localStorage)
const LS_KEY = "local_backend_v1";

type Store = {
  users: Array<{
    id: number;
    email: string;
    password: string;
    nombre: string;
    rol: string;
  }>;
  solicitudes: SolicitudDetalle[];
  publicaciones: PublicacionDetalle[];
  donaciones: DonacionResumen[];
  inventario: ItemInventario[];
  eventos: EventoSolidario[];
};

function nowIso() {
  return new Date().toISOString();
}

// Helper: convierte un File a data URL
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

// Extrae archivos (si vienen como FormData) y los convierte a data-URLs
async function collectFilesAsDataUrls(
  maybeForm?:
    | { get?: (k: string) => unknown }
    | Record<string, unknown>
    | undefined,
) {
  if (!maybeForm) return [] as string[];
  // If it's FormData-like
  if (typeof maybeForm.get === "function") {
    const v = maybeForm.get!("imagenes");
    if (!v) return [];
    // v can be File, FileList, or array
    if (v instanceof File) {
      return [await fileToDataUrl(v)];
    }
    if (v instanceof FileList) {
      const arr: string[] = [];
      for (let i = 0; i < v.length; i++) arr.push(await fileToDataUrl(v[i]));
      return arr;
    }
    // if it's array-like
    if (Array.isArray(v)) {
      const res: string[] = [];
      for (const f of v) {
        if (f instanceof File) res.push(await fileToDataUrl(f));
      }
      return res;
    }
    return [];
  }
  // Not formdata: maybe a plain object with imagenes as array of urls, strings, or File objects
  const asRec = maybeForm as Record<string, unknown>;
  const res: string[] = [];
  for (const key of Object.keys(asRec || {})) {
    const val = asRec![key];
    if (!val) continue;
    if (val instanceof File) {
      res.push(await fileToDataUrl(val));
      continue;
    }
    if (val instanceof FileList) {
      for (let i = 0; i < val.length; i++)
        res.push(await fileToDataUrl(val[i]));
      continue;
    }
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item instanceof File) res.push(await fileToDataUrl(item));
        else if (typeof item === "string") res.push(item);
      }
      continue;
    }
    if (
      typeof val === "string" &&
      (key.toLowerCase().includes("url") ||
        key.toLowerCase().includes("comprobante") ||
        key.toLowerCase().includes("imagen") ||
        key.toLowerCase().includes("evidence"))
    ) {
      res.push(val);
    }
  }
  return res;
}

function initialStore(): Store {
  return {
    users: [
      {
        id: 1,
        email: "admin@local.com",
        // contraseña actualizada a >=6 caracteres para pasar la validación del formulario
        password: "admin123",
        nombre: "Administrador",
        rol: "admin",
      },
      {
        id: 2,
        email: "donante@local.com",
        password: "donor123",
        nombre: "Donante",
        rol: "donante",
      },
    ],
    solicitudes: [
      {
        id: 1,
        codigo: "S-0001",
        titulo: "Kits escolares para niños",
        tipoRecurso: "ESPECIE",
        categoria: "educativa",
        beneficiarioNombre: "Colegio San Juan",
        urgencia: "MEDIA",
        fechaRegistro: nowIso(),
        fechaCreacion: nowIso(),
        estado: "PENDIENTE",
        descripcion: "Solicitan 50 kits escolares",
        evidencias: [],
        motivoRechazo: null,
      },
      {
        id: 2,
        codigo: "S-0002",
        titulo: "Ropa de abrigo para familia",
        tipoRecurso: "ESPECIE",
        categoria: "emergencia",
        beneficiarioNombre: "Familia López",
        urgencia: "ALTA",
        fechaRegistro: nowIso(),
        fechaCreacion: nowIso(),
        estado: "APROBADA",
        descripcion: "Ropa para 5 personas",
        evidencias: [],
        motivoRechazo: null,
      },
    ],
    publicaciones: [],
    donaciones: [],
    inventario: [],
    eventos: [],
  };
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const s = initialStore();
      localStorage.setItem(LS_KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as Store;
    // Ensure we always have at least the default users (in case store was overwritten)
    if (!parsed.users || parsed.users.length === 0) {
      parsed.users = initialStore().users;
      localStorage.setItem(LS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error(e);
    const s = initialStore();
    localStorage.setItem(LS_KEY, JSON.stringify(s));
    return s;
  }
}

function writeStore(s: Store) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// Helpers
function nextId<T extends { id: number }>(arr: T[]) {
  return arr.length === 0 ? 1 : Math.max(...arr.map((a) => a.id)) + 1;
}

// Simula latencia y responde { data }
function respond<T>(data: T, delay = 250): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
}

const localBackend = {
  async post(path: string, payload?: unknown, _opts?: Record<string, unknown>) {
    void _opts;
    const store = readStore();

    // Auth
    if (path === "/auth/login") {
      const body = payload as Record<string, unknown> | undefined;
      const email = body?.email as string | undefined;
      const password = body?.password as string | undefined;
      const user = store.users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!user) return respond({ message: "Credenciales inválidas" }, 300);
      const token = `local-token-${user.id}`;
      return respond({
        token,
        user: { id: user.id, nombre: user.nombre, rol: user.rol },
      } as LoginResponse);
    }

    if (path === "/solicitudes") {
      // crear solicitud (formdata o json)
      const id = nextId(store.solicitudes);
      const now = nowIso();
      const maybeForm = payload as { get?: (k: string) => unknown } | undefined;
      const body = payload as Record<string, unknown> | undefined;
      const getField = (k: string) =>
        maybeForm?.get
          ? (maybeForm.get(k) as string | undefined)
          : (body?.[k] as string | undefined);
      const s: SolicitudDetalle = {
        id,
        codigo: `S-${String(id).padStart(4, "0")}`,
        titulo: getField("titulo") || "",
        descripcion: getField("descripcion") || undefined,
        tipoRecurso: getField("tipoRecurso") || "",
        categoria: getField("categoria") || undefined,
        urgencia: (getField("urgencia") as "BAJA" | "MEDIA" | "ALTA") || "BAJA",
        beneficiarioNombre: getField("beneficiarioNombre") || "",
        fechaCreacion: now,
        fechaRegistro: now,
        estado: "PENDIENTE",
        evidencias: await collectFilesAsDataUrls(maybeForm || body),
        motivoRechazo: null,
      };
      store.solicitudes.push(s);
      writeStore(store);
      return respond<SolicitudDetalle>(s);
    }

    if (path === "/donaciones") {
      const body = payload as Record<string, unknown> | undefined;
      const id = nextId(store.donaciones);
      const now = nowIso();
      const tipoD = (body?.tipo as TipoDonacion) || "DINERO";
      // extraer comprobante si viene en payload (File o string)
      const comprobantes = await collectFilesAsDataUrls(
        payload as Record<string, unknown> | undefined,
      );
      const comprobanteUrl =
        comprobantes.length > 0
          ? comprobantes[0]
          : (body?.comprobante as string | undefined);

      const d: DonacionResumen = {
        id,
        tipo: tipoD,
        monto: (body?.monto as number) || 0,
        moneda: (body?.moneda as string) || undefined,
        descripcionBienes: (body?.descripcionBienes as string) || undefined,
        donanteNombre: (body?.donanteNombre as string) || "Anon",
        fechaRegistro: now,
        publicacionId: (body?.publicacionId as number) || undefined,
        comprobanteUrl: comprobanteUrl,
      };
      store.donaciones.push(d);

      // agregar totalDonado a publicación si existe
      const pubId = body?.publicacionId as number | undefined;
      const pub = store.publicaciones.find((p) => p.id === pubId);
      if (pub) {
        pub.totalDonado =
          (pub.totalDonado || 0) + ((body?.monto as number) || 0);
        // agregar donación a array de donaciones en publicación
        pub.donaciones = pub.donaciones || [];
        pub.donaciones.push(d);
      }

      // crear ítem en inventario para AMBOS tipos de donación
      const invId = nextId(store.inventario);
      let descripcionInventario = "";
      let cantidadInventario = 1;
      let unidadInventario = "donación";

      if (tipoD === "DINERO") {
        descripcionInventario = `Donación monetaria - Bs ${(body?.monto as number) || 0} (${body?.moneda || "BOB"})`;
        unidadInventario = "transferencia";
        cantidadInventario = (body?.monto as number) || 0;
      } else {
        descripcionInventario =
          (body?.descripcionBienes as string) || "Donación en especie";
        unidadInventario = "donación";
        cantidadInventario = 1;
      }

      const invItem: ItemInventario = {
        id: invId,
        codigo: `INV-${String(invId).padStart(4, "0")}`,
        descripcion: descripcionInventario,
        cantidad: cantidadInventario,
        unidad: unidadInventario,
        ubicacion: "Almacén central - Entrada de donaciones",
        estado: "EN_ALMACEN",
        fechaIngreso: now,
        fechaActualizacion: now,
        donacionId: d.id,
      };
      // Attach comprobante URL to inventory item description for traceability
      if (d.comprobanteUrl) {
        invItem.descripcion = `${invItem.descripcion} | comprobante: ${d.comprobanteUrl}`;
      }
      store.inventario.push(invItem);

      writeStore(store);
      return respond<DonacionResumen>(d);
    }

    if (path === "/inventario") {
      const body = payload as Record<string, unknown> | undefined;
      const id = nextId(store.inventario);
      const now = nowIso();
      const item: ItemInventario = {
        id,
        codigo: `I-${String(id).padStart(4, "0")}`,
        descripcion: (body?.descripcion as string) || "",
        cantidad: (body?.cantidad as number) || 0,
        unidad: (body?.unidad as string) || "",
        ubicacion: (body?.ubicacion as string) || "",
        estado: "EN_ALMACEN",
        fechaIngreso: now,
        fechaActualizacion: now,
        donacionId: (body?.donacionId as number) || 0,
      };
      store.inventario.push(item);
      writeStore(store);
      return respond<ItemInventario>(item);
    }

    if (path === "/eventos") {
      const body = payload as Record<string, unknown> | undefined;
      const id = nextId(store.eventos);
      const now = nowIso();
      const item: EventoSolidario = {
        id,
        nombre: (body?.nombre as string) || "Evento sin nombre",
        publicacionId: (body?.publicacionId as number) || undefined,
        publicacionTitulo:
          (body?.publicacionTitulo as string) ||
          (body?.campaniaNombre as string) ||
          undefined,
        tipo: (body?.tipo as string) || "OTRO",
        fecha: (body?.fecha as string) || now,
        lugar: (body?.lugar as string) || "",
        metaRecaudacion: (body?.metaRecaudacion as number) || undefined,
        canalDifusion: (body?.canalDifusion as string) || "",
        estado: (body?.estado as string) || "PLANIFICADO",
        descripcion: (body?.descripcion as string) || undefined,
      };
      store.eventos.push(item);
      writeStore(store);
      return respond<EventoSolidario>(item);
    }

    if (path.startsWith("/solicitudes/") && path.endsWith("/estado")) {
      // handled by put in this mock; support post variant too
      const parts = path.split("/");
      const id = Number(parts[2]);
      const sol = store.solicitudes.find((x) => x.id === id);
      if (!sol) return respond({ message: "No encontrado" }, 200);
      const body = payload as Record<string, unknown> | undefined;
      sol.estado = (body?.estado as EstadoSolicitud) || sol.estado;
      if (body?.comentario) sol.motivoRechazo = body.comentario as string;
      // si aprobada, crear publicación
      if (body?.estado === "APROBADA") {
        const pubId = nextId(store.publicaciones);
        const pub: PublicacionDetalle = {
          id: pubId,
          codigoSolicitud: sol.codigo,
          titulo: sol.titulo,
          tipoRecurso: sol.tipoRecurso,
          beneficiarioNombre: sol.beneficiarioNombre,
          urgencia: sol.urgencia,
          fechaPublicacion: nowIso(),
          descripcion: sol.descripcion || "",
          evidencias: sol.evidencias || [],
          donaciones: [],
          totalDonado: 0,
          imagenPrincipalUrl: null,
        };
        store.publicaciones.push(pub);
      }
      writeStore(store);
      return respond<SolicitudDetalle>(sol as SolicitudDetalle);
    }

    // fallback
    return respond({ message: "No implementado (POST) -> " + path });
  },

  async get(path: string, _opts?: { params?: Record<string, unknown> }) {
    const store = readStore();
    // listar solicitudes
    if (path === "/solicitudes") {
      const estado = _opts?.params?.estado as EstadoSolicitud | undefined;
      const list = estado
        ? store.solicitudes.filter((s) => s.estado === estado)
        : store.solicitudes;
      return respond(list);
    }

    if (path.startsWith("/solicitudes/")) {
      const parts = path.split("/");
      const id = Number(parts[2]);
      const sol = store.solicitudes.find((x) => x.id === id);
      return respond(sol || null);
    }

    if (path === "/publicaciones/catalogo") {
      // return publicaciones
      // ignore params for now
      return respond(store.publicaciones.slice());
    }

    if (path.startsWith("/publicaciones/") && path.endsWith("/donaciones")) {
      const parts = path.split("/");
      const pubId = Number(parts[2]);
      const dons = store.donaciones.filter(
        (d) => d.publicacionId === pubId || d.id === pubId,
      );
      return respond<DonacionResumen[]>(dons);
    }

    if (path.startsWith("/publicaciones/")) {
      const parts = path.split("/");
      const id = Number(parts[2]);
      const pub = store.publicaciones.find((p) => p.id === id);
      return respond(pub || null);
    }

    if (path === "/inventario") {
      const estado = _opts?.params?.estado as string | undefined;
      const list =
        estado && estado !== "TODOS"
          ? store.inventario.filter((i) => i.estado === estado)
          : store.inventario;
      return respond<ItemInventario[]>(list);
    }

    if (path === "/eventos") {
      return respond<EventoSolidario[]>(store.eventos);
    }

    return respond({ message: "No implementado (GET) -> " + path });
  },

  async put(path: string, payload?: unknown, _opts?: Record<string, unknown>) {
    // delegate to post where appropriate
    return this.post(path, payload, _opts);
  },

  async patch(
    path: string,
    payload?: unknown,
    _opts?: Record<string, unknown>,
  ) {
    void _opts;
    const store = readStore();
    if (path.includes("/inventario/") && path.endsWith("/estado")) {
      const parts = path.split("/");
      const id = Number(parts[2]);
      const item = store.inventario.find((i) => i.id === id);
      if (item) {
        const pay = payload as Record<string, unknown> | undefined;
        item.estado = (pay?.estado as string) || item.estado;
        item.fechaActualizacion = nowIso();
        writeStore(store);
        return respond<ItemInventario>(item);
      }
      return respond({ message: "No encontrado" });
    }
    return respond({ message: "No implementado (PATCH) -> " + path });
  },
};

// export `api` object compatible with axios-like interface used in the app
export const api = USE_LOCAL ? localBackend : axiosApi;

export default api;

// ---------- Funciones de conveniencia (siguen usando `api`) ----------
export async function registrarSolicitud(
  input: RegistrarSolicitudInput,
  token?: string,
) {
  if (USE_LOCAL) {
    const form = input as unknown as Record<string, unknown>;
    const res = await api.post("/solicitudes", form, {});
    return res.data as SolicitudResumen;
  }
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
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return res.data as SolicitudResumen;
}

export async function listarSolicitudes(
  estado: EstadoSolicitud,
  _token?: string,
) {
  void _token;
  const res = await api.get("/solicitudes", { params: { estado } });
  return res.data as SolicitudResumen[];
}

export async function obtenerSolicitud(id: number, _token?: string) {
  void _token;
  const res = await api.get(`/solicitudes/${id}`);
  return res.data as SolicitudDetalle;
}

export async function cambiarEstadoSolicitud(
  id: number,
  estado: EstadoSolicitud,
  motivo?: string,
  _token?: string,
) {
  void _token;
  // try PUT then POST depending on backend
  const payload = { estado, comentario: motivo };
  const res = await api
    .put(`/solicitudes/${id}/estado`, payload)
    .catch(() => api.post(`/solicitudes/${id}/estado`, { estado, motivo }));
  return res.data as SolicitudDetalle;
}

export async function listarCatalogoPublicaciones(params?: {
  categoria?: string;
  estado?: string;
}) {
  const res = await api.get("/publicaciones/catalogo", { params });
  return res.data as PublicacionCatalogoItem[];
}

export async function obtenerPublicacion(id: number) {
  const res = await api.get(`/publicaciones/${id}`);
  return res.data as PublicacionDetalle;
}

export async function registrarDonacion(input: RegistrarDonacionInput) {
  const payload = input as unknown as Record<string, unknown>;
  const res = await api.post("/donaciones", payload);
  return res.data as DonacionResumen;
}

export async function listarDonacionesPorPublicacion(publicacionId: number) {
  const res = await api.get(`/publicaciones/${publicacionId}/donaciones`);
  return res.data as DonacionResumen[];
}

export async function registrarIngresoInventario(
  input: RegistrarItemInventarioInput,
  token?: string,
) {
  const payload = input as unknown as Record<string, unknown>;
  const res = await api.post("/inventario", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as ItemInventario;
}

export async function listarInventario(estado?: string, _token?: string) {
  void _token;
  const res = await api.get("/inventario", {
    params: estado && estado !== "TODOS" ? { estado } : undefined,
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

export async function listarPublicaciones(_token?: string) {
  void _token;
  const res = await api.get("/publicaciones/catalogo");
  return res.data as PublicacionCatalogoItem[];
}

export async function listarCampanias(_token?: string) {
  void _token;
  const res = await api.get("/solicitudes");
  return res.data as SolicitudResumen[];
}

export async function registrarEvento(
  input: RegistrarEventoInput,
  token?: string,
) {
  const payload = input as unknown as Record<string, unknown>;
  const res = await api.post("/eventos", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data as EventoSolidario;
}

export async function listarEventos(estado?: string, _token?: string) {
  void _token;
  const res = await api.get("/eventos", {
    params: estado && estado !== "TODOS" ? { estado } : undefined,
  });
  return res.data as EventoSolidario[];
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const data = res.data as any;
  if (!data || typeof data.token !== "string") {
    // propagate server message when available
    const msg = (data && data.message) || "Credenciales inválidas";
    throw new Error(String(msg));
  }
  return data as LoginResponse;
}
