/**
 * api.js — Cliente centralizado para comunicarse con el backend.
 * Conversión 1:1 de Vistas/puertas-blindadas/shared/api.js a módulo ES.
 *
 * Uso:
 *   import { API } from '../services/api';
 *   const materiales = await API.materiales.listar();
 */
import { getToken, USER_KEY, OPS_KEY } from '../utils/session';

export const API_BASE = 'http://localhost:3000/api';

/* ── Manejo de 401 vía router ─────────────────────────── */
// El HTML original hacía window.location.href = 'login.html'.
// En React, AuthContext registra aquí un handler que usa navigate('/login').
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

/* ── Auth helpers ─────────────────────────────────────── */
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

/**
 * Wrapper genérico de fetch con manejo de errores.
 * Si el servidor devuelve 401 redirige al login (vía router).
 */
export async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    });
  } catch {
    // CU-106 CP3: Encolar operación pendiente si es una mutación (POST/PUT/DELETE)
    if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
      try {
        const pendientes = JSON.parse(sessionStorage.getItem(OPS_KEY) || '[]');
        pendientes.push({ path, options: { ...options, headers: undefined }, timestamp: Date.now() });
        sessionStorage.setItem(OPS_KEY, JSON.stringify(pendientes));
      } catch { /* silencio */ }
      throw new Error('No se pudo conectar con el servidor. La operación fue encolada y se reintentará cuando se restablezca la conexión.');
    }
    // CU-66 CP2: Mensaje claro cuando el servidor no responde
    throw new Error('No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.');
  }

  if (res.status === 401) {
    sessionStorage.removeItem(USER_KEY);
    if (unauthorizedHandler) unauthorizedHandler();
    else window.location.href = '/login';
    return null;
  }

  const data = await res.json();

  // CU-96 CP3: 409 Conflict devuelve datos del conflicto para que el frontend decida
  if (res.status === 409) {
    return data;
  }

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data;
}

// Mismo filtrado que el original: descarta params falsy
const qsOf = (params = {}) =>
  new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();

/* ── API ──────────────────────────────────────────────── */

export const API = {

  /* ── Auth ── */
  auth: {
    login: (username, password) =>
      fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }).then(r => r.json()),

    cambiarPassword: (password_actual, password_nueva) =>
      apiFetch('/auth/cambiar-password', {
        method: 'POST',
        body: JSON.stringify({ password_actual, password_nueva }),
      }),

    // CU-77
    solicitarRecuperacion: (username) =>
      fetch(API_BASE + '/auth/solicitar-recuperacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      }).then(r => r.json()),

    resetearPassword: (token, password_nueva) =>
      fetch(API_BASE + '/auth/resetear-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password_nueva }),
      }).then(r => r.json()),
  },

  /* ── Materiales ── */
  materiales: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/materiales' + (qs ? '?' + qs : ''));
    },
    obtener:          (sku)    => apiFetch(`/materiales/${sku}`),
    crear:            (data)   => apiFetch('/materiales', { method: 'POST', body: JSON.stringify(data) }),
    actualizar:       (sku, data) => apiFetch(`/materiales/${sku}`, { method: 'PUT', body: JSON.stringify(data) }),
    eliminar:         (sku)        => apiFetch(`/materiales/${sku}`, { method: 'DELETE' }),
    unidades:         ()       => apiFetch('/materiales/catalogos/unidades'),
    categorias:       ()       => apiFetch('/materiales/catalogos/categorias'),
    // Incremento 2
    reactivar:        (sku)    => apiFetch(`/materiales/${sku}/reactivar`, { method: 'PUT' }),
    duplicar:         (data)   => apiFetch('/materiales/duplicar', { method: 'POST', body: JSON.stringify(data) }),
    historialPrecios: (sku)    => apiFetch(`/materiales/${sku}/historial-precios`),
    pinturasSobrantes: ()      => apiFetch('/materiales/pinturas-sobrantes'),
  },

  /* ── Bodegas ── */
  bodegas: {
    listar:           ()       => apiFetch('/bodegas'),
    obtener:          (id)     => apiFetch(`/bodegas/${id}`),
    stockConsolidado: (id)     => apiFetch(`/bodegas/${id}/stock-consolidado`),
    crear:            (data)   => apiFetch('/bodegas', { method: 'POST', body: JSON.stringify(data) }),
    actualizar:       (id, data) => apiFetch(`/bodegas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    // Incremento 2
    crearAnaquel:     (id, data) => apiFetch(`/bodegas/${id}/anaqueles`, { method: 'POST', body: JSON.stringify(data) }),
    eliminarAnaquel:  (id, anaquelId) => apiFetch(`/bodegas/${id}/anaqueles/${anaquelId}`, { method: 'DELETE' }),
  },

  /* ── Movimientos ── */
  movimientos: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/movimientos' + (qs ? '?' + qs : ''));
    },
    catalogos:        ()       => apiFetch('/movimientos/catalogos'),
    entrada:          (data)   => apiFetch('/movimientos/entrada', { method: 'POST', body: JSON.stringify(data) }),
    salida:           (data)   => apiFetch('/movimientos/salida',  { method: 'POST', body: JSON.stringify(data) }),
    revertir:         (id)     => apiFetch(`/movimientos/${id}/revertir`, { method: 'POST' }),
    // Incremento 2 — CU-68.1
    aprobarMerma:     (id)     => apiFetch(`/movimientos/${id}/aprobar-merma`,  { method: 'PUT' }),
    rechazarMerma:    (id)     => apiFetch(`/movimientos/${id}/rechazar-merma`, { method: 'PUT' }),
    // CU-74 CP3: Verificar mermas pendientes >24h
    verificarMermasPendientes: () => apiFetch('/movimientos/verificar-mermas-pendientes', { method: 'POST' }),
  },

  /* ── Proveedores ── */
  proveedores: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/proveedores' + (qs ? '?' + qs : ''));
    },
    obtener:          (id)     => apiFetch(`/proveedores/${id}`),
    crear:            (data)   => apiFetch('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
    actualizar:       (id, data) => apiFetch(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  /* ── Reportes ── */
  reportes: {
    movimientos: (params = {}) => apiFetch('/reportes/movimientos?' + qsOf(params)),
    mermas:      (params = {}) => apiFetch('/reportes/mermas?' + qsOf(params)),
    // Incremento 2
    valorizacion: ()           => apiFetch('/reportes/valorizacion'),
    listarAreas:  ()           => apiFetch('/reportes/areas'),
    consumoArea:  (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/reportes/consumo-area' + (qs ? '?' + qs : ''));
    },
    programacionSemanal: () => apiFetch('/reportes/programacion-semanal'),
    // CU-122
    exportarProgramacion: () => {
      const token = getToken();
      return fetch(API_BASE + '/reportes/programacion-semanal/exportar', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
    },
    exportarProgramacionPDF: () => {
      const token = getToken();
      return fetch(API_BASE + '/reportes/programacion-semanal/exportar-pdf', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
    },
  },

  /* ── Alertas ── */
  alertas: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/alertas' + (qs ? '?' + qs : ''));
    },
    generar:  ()   => apiFetch('/alertas/generar', { method: 'POST' }),
    resolver: (id) => apiFetch(`/alertas/${id}/resolver`, { method: 'PUT' }),
  },

  /* ── Auditoría ── */
  auditoria: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/auditoria' + (qs ? '?' + qs : ''));
    },
  },

  /* ── Pedidos ── */
  pedidos: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/pedidos' + (qs ? '?' + qs : ''));
    },
    checklist: (id)        => apiFetch(`/pedidos/${id}/checklist`),
    reservar:  (id, data)  => apiFetch(`/pedidos/${id}/reservar`, { method: 'POST', body: JSON.stringify(data) }),
    // CU-110
    reportarDiscrepancia: (id, data) => apiFetch(`/pedidos/${id}/discrepancia`, { method: 'POST', body: JSON.stringify(data) }),
  },

  /* ── Usuarios ── */
  usuarios: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/usuarios' + (qs ? '?' + qs : ''));
    },
    crear:             (data)   => apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    editarPermisos:    (id, data) => apiFetch(`/usuarios/${id}/permisos`, { method: 'PUT', body: JSON.stringify(data) }),
    recuperarPassword: (id)     => apiFetch(`/usuarios/${id}/recuperar-password`, { method: 'POST' }),
    auditoria: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/usuarios/auditoria' + (qs ? '?' + qs : ''));
    },
    // CU-83.1 / CU-83.2
    programarDesactivacion: (id, data) => apiFetch(`/usuarios/${id}/programar-desactivacion`, { method: 'POST', body: JSON.stringify(data) }),
    programarActivacion:    (id, data) => apiFetch(`/usuarios/${id}/programar-activacion`,    { method: 'POST', body: JSON.stringify(data) }),
    procesarProgramaciones: ()         => apiFetch('/usuarios/procesar-programaciones',       { method: 'POST' }),
  },

  /* ════════════════════════════════════════════════════════
     INCREMENTO 2
     ════════════════════════════════════════════════════════ */

  /* ── Facturas ── */
  facturas: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/facturas' + (qs ? '?' + qs : ''));
    },
    obtener:        (id)     => apiFetch(`/facturas/${id}`),
    crear:          (data)   => apiFetch('/facturas', { method: 'POST', body: JSON.stringify(data) }),
    buscarNumero:   (numero) => apiFetch(`/facturas/buscar-numero/${encodeURIComponent(numero)}`),
  },

  /* ── Notificaciones ── */
  notificaciones: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/notificaciones' + (qs ? '?' + qs : ''));
    },
    resumen:         ()   => apiFetch('/notificaciones/resumen'),
    marcarLeida:     (id) => apiFetch(`/notificaciones/${id}/leer`, { method: 'PUT' }),
    marcarTodasLeidas: () => apiFetch('/notificaciones/leer-todas', { method: 'PUT' }),
  },

  /* ── Reservas ── */
  reservas: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/reservas' + (qs ? '?' + qs : ''));
    },
    liberar: (id) => apiFetch(`/reservas/${id}/liberar`, { method: 'PUT' }),
    anular:  (id) => apiFetch(`/reservas/${id}/anular`,  { method: 'PUT' }),
  },

  /* ── Alertas Faltantes ── */
  alertasFaltantes: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/alertas-faltantes' + (qs ? '?' + qs : ''));
    },
    generar:         ()          => apiFetch('/alertas-faltantes/generar', { method: 'POST' }),
    obtener:         (id)        => apiFetch(`/alertas-faltantes/${id}`),
    emitirSolicitud: (id, data)  => apiFetch(`/alertas-faltantes/${id}/solicitud`, { method: 'PUT', body: JSON.stringify(data || {}) }),
    resolver:        (id, data)  => apiFetch(`/alertas-faltantes/${id}/resolver`,  { method: 'PUT', body: JSON.stringify(data) }),
  },

  /* ── Órdenes de Trabajo ── */
  ordenesTrabajo: {
    listar: (params = {}) => {
      const qs = qsOf(params);
      return apiFetch('/ordenes-trabajo' + (qs ? '?' + qs : ''));
    },
    consumos:          (id)       => apiFetch(`/ordenes-trabajo/${id}/consumos`),
    registrarConsumo:  (id, data) => apiFetch(`/ordenes-trabajo/${id}/consumos`, { method: 'POST', body: JSON.stringify(data) }),
    registrarEstimados:(id, data) => apiFetch(`/ordenes-trabajo/${id}/estimados`, { method: 'PUT', body: JSON.stringify(data) }),
    comparativo:       (id)       => apiFetch(`/ordenes-trabajo/${id}/comparativo`),
    costos:            (id)       => apiFetch(`/ordenes-trabajo/${id}/costos`),
    rentabilidad:      (id, margen) => apiFetch(`/ordenes-trabajo/${id}/rentabilidad?margen=${margen}`),
    eliminarMaterial:  (id, sku)    => apiFetch(`/ordenes-trabajo/${id}/materiales/${encodeURIComponent(sku)}`, { method: 'DELETE' }),
  },

};
