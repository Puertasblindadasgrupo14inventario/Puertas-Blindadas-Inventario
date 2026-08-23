/**
 * layout.js — carga el sidebar y topbar en cada página,
 * marca el ítem activo, inyecta datos de usuario,
 * y maneja el toggle de colapso y el menú de usuario.
 */

(async function () {
  /* ── 1. Detectar base path ──────────────────────────── */
  // Calcula la ruta al directorio shared/ relativa a la ubicación
  // del script (assets/js/layout.js), que siempre está 2 niveles
  // dentro de la raíz del proyecto.
  const scriptSrc = document.currentScript
    ? document.currentScript.src
    : Array.from(document.querySelectorAll('script[src]'))
        .map(s => s.src)
        .find(s => s.includes('layout.js')) || '';

  // Sube dos niveles desde assets/js/ para llegar a la raíz
  const root = scriptSrc
    ? scriptSrc.replace(/assets\/js\/layout\.js.*$/, '')
    : window.location.href.replace(/[^/]*$/, '').replace(/[^/]*\/$/, '/').replace(/[^/]*\/$/, '/');

  const base = root + 'shared/';

  // Para calcular depth para rutas de login/redireccion:
  const depth = window.location.pathname.split('/').filter(Boolean).length;

  /* ── 2. Cargar fragmentos HTML ──────────────────────── */
  // innerHTML no ejecuta <script>, así que toda la lógica
  // del sidebar vive aquí en layout.js
  async function loadFragment(id, file) {
    try {
      const res  = await fetch(base + file);
      const html = await res.text();
      document.getElementById(id).innerHTML = html;
    } catch (e) {
      console.warn(`No se pudo cargar ${file}:`, e);
    }
  }

  await Promise.all([
    loadFragment('sidebar-container', 'sidebar.html'),
    loadFragment('topbar-container',  'topbar.html'),
  ]);

  /* ── 3. Marcar ítem activo en sidebar ───────────────── */
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
    const page = item.getAttribute('data-page');
    if (path.includes(page)) item.classList.add('active');
  });

  /* ── 4. Inyectar datos de usuario ───────────────────── */
  const user = JSON.parse(sessionStorage.getItem('pb_user') || 'null');

  if (!user && !path.includes('login')) {
    window.location.href = (depth <= 1 ? '' : '../') + 'login.html';
    return;
  }

  if (user) {
    const initials = user.nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const sAvatar = document.getElementById('sidebar-avatar');
    const sName   = document.getElementById('sidebar-user-name');
    const sRole   = document.getElementById('sidebar-user-role');
    if (sAvatar) sAvatar.textContent = initials;
    if (sName)   sName.textContent   = user.username || user.nombre;
    if (sRole)   sRole.textContent   = user.rol === 'gerencia' ? 'Gerencia' : 'JOP';

    const tAvatar = document.getElementById('topbar-avatar');
    if (tAvatar) tAvatar.textContent = initials;

    if (user.rol === 'jop') {
      document.querySelectorAll('[data-rol="gerencia"]').forEach(el => {
        el.style.display = 'none';
      });
    }

    const titleEl = document.getElementById('topbar-title');
    if (titleEl && !titleEl.textContent.trim()) {
      titleEl.textContent = document.title.replace(' — Puertas Blindadas', '') || '';
    }
  }

  /* ── 5. Sidebar colapsar / expandir ─────────────────── */
  const COLLAPSE_KEY = 'pb_sidebar_collapsed';
  const toggleBtn    = document.getElementById('sidebar-toggle-btn');

  // Restaurar estado guardado
  if (localStorage.getItem(COLLAPSE_KEY) === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem(COLLAPSE_KEY, collapsed);
    });
  }

  /* ── 6. Menú desplegable de usuario ─────────────────── */
  const userBtn  = document.getElementById('sidebar-user-btn');
  const userMenu = document.getElementById('sidebar-user-menu');

  if (userBtn && userMenu) {
    userBtn.addEventListener('click', e => {
      e.stopPropagation();
      userMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      userMenu?.classList.remove('open');
    });
  }

  // Cambiar apodo
  const apodoBtn    = document.getElementById('menu-cambiar-apodo');
  const modalApodo  = document.getElementById('modal-apodo');
  const inputApodo  = document.getElementById('input-apodo');

  if (apodoBtn && modalApodo) {
    apodoBtn.addEventListener('click', () => {
      userMenu?.classList.remove('open');
      if (user && inputApodo) inputApodo.value = user.username || user.nombre || '';
      modalApodo.style.display = 'flex';
    });
    document.getElementById('close-modal-apodo')?.addEventListener('click',  () => { modalApodo.style.display = 'none'; });
    document.getElementById('cancel-modal-apodo')?.addEventListener('click', () => { modalApodo.style.display = 'none'; });
    document.getElementById('confirm-modal-apodo')?.addEventListener('click', () => {
      const val = inputApodo?.value.trim();
      if (!val) return;
      if (user) {
        user.username = val;
        sessionStorage.setItem('pb_user', JSON.stringify(user));
        const sName = document.getElementById('sidebar-user-name');
        if (sName) sName.textContent = val;
      }
      modalApodo.style.display = 'none';
    });
  }

  // Cambiar contraseña
  const passBtn   = document.getElementById('menu-cambiar-pass');
  const modalPass = document.getElementById('modal-cambiar-pass');

  if (passBtn && modalPass) {
    passBtn.addEventListener('click', () => {
      userMenu?.classList.remove('open');
      ['pass-actual','pass-nueva','pass-confirmar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      modalPass.style.display = 'flex';
    });
    document.getElementById('close-modal-pass')?.addEventListener('click',  () => { modalPass.style.display = 'none'; });
    document.getElementById('cancel-modal-pass')?.addEventListener('click', () => { modalPass.style.display = 'none'; });
    document.getElementById('confirm-modal-pass')?.addEventListener('click', () => {
      const nueva     = document.getElementById('pass-nueva')?.value || '';
      const confirmar = document.getElementById('pass-confirmar')?.value || '';
      if (nueva.length < 8)    { alert('La contraseña debe tener al menos 8 caracteres.'); return; }
      if (nueva !== confirmar)  { alert('Las contraseñas no coinciden.'); return; }
      // Aquí irá el fetch al backend
      modalPass.style.display = 'none';
    });
  }

  /* ── 7. Mobile hamburger ─────────────────────────────── */
  const hamburger = document.getElementById('topbar-hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  /* ── 8. Logout ───────────────────────────────────────── */
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('pb_user');
      window.location.href = (depth <= 1 ? '' : '../') + 'login.html';
    });
  }

})();

/* ── Helpers globales ─────────────────────────────────────── */

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.style.display = 'none';
  }
});

function showAlert(containerId, type, message) {
  const icons = {
    danger:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}" style="display:flex;align-items:center;gap:8px">${icons[type] || ''}${message}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 5000);
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('pb_user') || 'null');
}

function applyRoleVisibility() {
  const user = getCurrentUser();
  if (!user) return;
  if (user.rol === 'jop') {
    document.querySelectorAll('[data-rol="gerencia"]').forEach(el => {
      el.style.display = 'none';
    });
  }
}
