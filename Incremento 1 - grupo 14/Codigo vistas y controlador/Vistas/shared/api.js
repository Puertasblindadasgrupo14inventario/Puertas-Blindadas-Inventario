/**
 * api.js — Cliente centralizado para comunicarse con el backend
 * Todas las vistas importan sus funciones desde aquí.
 *
 * Uso:
 *   <script src="../shared/api.js"></script>
 *   const materiales = await API.materiales.listar();
 */

const API_BASE = 'http://localhost:3000/api';

/* ── Auth helpers ─────────────────────────────────────── */

function getToken() {
  const user = JSON.parse(sessionStorage.getItem('pb_user') || 'null');
  return user?.token || null;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

/**
 * Wrapper genérico de fetch con manejo de errores.
 * Si el servidor devuelve 401 redirige al login.
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (res.status === 401) {
    sessionStorage.removeItem('pb_user');
    window.location.href = window.location.pathname.includes('/') &&
      window.location.pathname.split('/').filter(Boolean).length > 1
      ? '../login.html' : 'login.html';
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data;
}

/* ── API ──────────────────────────────────────────────── */

const API = {

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
  },

  /* ── Materiales ── */
  materiales: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/materiales' + (qs ? '?' + qs : ''));
    },
    obtener:          (sku)    => apiFetch(`/materiales/${sku}`),
    crear:            (data)   => apiFetch('/materiales', { method: 'POST', body: JSON.stringify(data) }),
    actualizar:       (sku, data) => apiFetch(`/materiales/${sku}`, { method: 'PUT', body: JSON.stringify(data) }),
    eliminar:         (sku)        => apiFetch(`/materiales/${sku}`, { method: 'DELETE' }),
    unidades:         ()       => apiFetch('/materiales/catalogos/unidades'),
    categorias:       ()       => apiFetch('/materiales/catalogos/categorias'),
  },

  /* ── Bodegas ── */
  bodegas: {
    listar:           ()       => apiFetch('/bodegas'),
    obtener:          (id)     => apiFetch(`/bodegas/${id}`),
    stockConsolidado: (id)     => apiFetch(`/bodegas/${id}/stock-consolidado`),
    crear:            (data)   => apiFetch('/bodegas', { method: 'POST', body: JSON.stringify(data) }),
    actualizar:       (id, data) => apiFetch(`/bodegas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  /* ── Movimientos ── */
  movimientos: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/movimientos' + (qs ? '?' + qs : ''));
    },
    catalogos:        ()       => apiFetch('/movimientos/catalogos'),
    entrada:          (data)   => apiFetch('/movimientos/entrada', { method: 'POST', body: JSON.stringify(data) }),
    salida:           (data)   => apiFetch('/movimientos/salida',  { method: 'POST', body: JSON.stringify(data) }),
    revertir:         (id)     => apiFetch(`/movimientos/${id}/revertir`, { method: 'POST' }),
  },

  /* ── Proveedores ── */
  proveedores: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/proveedores' + (qs ? '?' + qs : ''));
    },
    obtener:          (id)     => apiFetch(`/proveedores/${id}`),
    crear:            (data)   => apiFetch('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
    actualizar:       (id, data) => apiFetch(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  /* ── Reportes ── */
  reportes: {
    movimientos: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/reportes/movimientos?' + qs);
    },
    mermas: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/reportes/mermas?' + qs);
    },
  },

  /* ── Alertas ── */
  alertas: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/alertas' + (qs ? '?' + qs : ''));
    },
    generar:  ()   => apiFetch('/alertas/generar', { method: 'POST' }),
    resolver: (id) => apiFetch(`/alertas/${id}/resolver`, { method: 'PUT' }),
  },

  /* ── Auditoría ── */
  auditoria: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/auditoria' + (qs ? '?' + qs : ''));
    },
  },

  /* ── Pedidos ── */
  pedidos: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/pedidos' + (qs ? '?' + qs : ''));
    },
    checklist: (id)        => apiFetch(`/pedidos/${id}/checklist`),
    reservar:  (id, data)  => apiFetch(`/pedidos/${id}/reservar`, { method: 'POST', body: JSON.stringify(data) }),
  },

  /* ── Usuarios ── */
  usuarios: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/usuarios' + (qs ? '?' + qs : ''));
    },
    crear:             (data)   => apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    editarPermisos:    (id, data) => apiFetch(`/usuarios/${id}/permisos`, { method: 'PUT', body: JSON.stringify(data) }),
    recuperarPassword: (id)     => apiFetch(`/usuarios/${id}/recuperar-password`, { method: 'POST' }),
    auditoria: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      return apiFetch('/usuarios/auditoria' + (qs ? '?' + qs : ''));
    },
  },

};

// Exponer globalmente
window.API = API;
