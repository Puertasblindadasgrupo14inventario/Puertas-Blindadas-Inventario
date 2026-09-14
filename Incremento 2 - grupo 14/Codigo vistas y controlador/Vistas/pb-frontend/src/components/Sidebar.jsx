import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInitials, getRoleLabel } from '../utils/user';
import { COLLAPSE_KEY } from '../utils/session';

/**
 * Sidebar — conversión de shared/sidebar.html + lógica de layout.js.
 * Props: mobileOpen (hamburger), onOpenApodo, onOpenPass.
 */
export default function Sidebar({ mobileOpen, onOpenApodo, onOpenPass }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Restaurar estado colapsado guardado (body.sidebar-collapsed)
  useEffect(() => {
    if (localStorage.getItem(COLLAPSE_KEY) === 'true') {
      document.body.classList.add('sidebar-collapsed');
    }
    return () => document.body.classList.remove('sidebar-collapsed');
  }, []);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  const toggleCollapse = () => {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem(COLLAPSE_KEY, collapsed);
  };

  // Equivale a `path.includes(data-page)` del original
  const itemClass = (page) => {
    const active = page === 'dashboard' ? pathname === '/' : pathname.includes(page);
    return 'sidebar-item' + (active ? ' active' : '');
  };

  return (
    <aside className={'sidebar' + (mobileOpen ? ' open' : '')} id="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">PB</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">Puertas Blindadas</div>
          <div className="sidebar-logo-sub">Sistema de Inventario</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">

        <div className="sidebar-section">Inventario</div>

        <Link className={itemClass('dashboard')} to="/" data-tooltip="Dashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span className="sidebar-item-label">Dashboard</span>
        </Link>

        <Link className={itemClass('productos')} to="/productos" data-tooltip="Productos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <span className="sidebar-item-label">Productos</span>
        </Link>

        <Link className={itemClass('bodegas')} to="/bodegas" data-tooltip="Bodegas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="sidebar-item-label">Bodegas</span>
        </Link>

        <Link className={itemClass('movimientos')} to="/movimientos/historial" data-tooltip="Movimientos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 014-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 01-4 4H3"/>
          </svg>
          <span className="sidebar-item-label">Movimientos</span>
        </Link>

        <div className="sidebar-section">Gestión</div>

        <Link className={itemClass('alertas')} to="/alertas" data-tooltip="Alertas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="sidebar-item-label">Alertas</span>
          <span className="sidebar-badge" id="alertas-badge" style={{ display: 'none' }}>0</span>
        </Link>

        <Link className={itemClass('faltantes')} to="/alertas/faltantes" data-tooltip="Faltantes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="sidebar-item-label">Faltantes</span>
        </Link>

        <Link className={itemClass('proveedores')} to="/proveedores" data-tooltip="Proveedores">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span className="sidebar-item-label">Proveedores</span>
        </Link>

        <Link className={itemClass('pedidos')} to="/pedidos/checklist" data-tooltip="Pedidos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span className="sidebar-item-label">Pedidos</span>
        </Link>

        <Link className={itemClass('reservas')} to="/reservas" data-tooltip="Reservas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
          <span className="sidebar-item-label">Reservas</span>
        </Link>

        <div className="sidebar-section">Producción</div>

        <Link className={itemClass('ordenes')} to="/ordenes" data-tooltip="Órdenes de trabajo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span className="sidebar-item-label">Órdenes de Trabajo</span>
        </Link>

        <Link className={itemClass('pinturas')} to="/pinturas/sobrantes" data-tooltip="Pinturas sobrantes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 3H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/>
            <path d="M12 11v6"/>
            <path d="M8 21h8"/>
            <path d="M12 17h.01"/>
          </svg>
          <span className="sidebar-item-label">Pinturas Sobrantes</span>
        </Link>

        <Link className={itemClass('reportes')} to="/reportes/movimientos" data-tooltip="Reportes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span className="sidebar-item-label">Reportes</span>
        </Link>

        {/* Solo visible para gerencia (data-rol="gerencia": layout.js lo ocultaba si rol === 'jop') */}
        {user?.rol !== 'jop' && (
          <div>
            <div className="sidebar-section">Administración</div>
            <Link className={itemClass('usuarios')} to="/usuarios" data-tooltip="Usuarios">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="sidebar-item-label">Usuarios</span>
            </Link>
          </div>
        )}

      </nav>

      {/* Footer */}
      <div className="sidebar-footer">

        {/* Toggle colapsar */}
        <div className="sidebar-toggle" id="sidebar-toggle-btn" title="Colapsar menú" onClick={toggleCollapse}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </div>

        {/* Botón usuario */}
        <div
          className="sidebar-user-btn"
          id="sidebar-user-btn"
          onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
        >
          <div className="sidebar-avatar" id="sidebar-avatar">{getInitials(user)}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name" id="sidebar-user-name">{user?.username || user?.nombre}</div>
            <div className="sidebar-user-role" id="sidebar-user-role">{getRoleLabel(user)}</div>
          </div>
        </div>

        {/* Menú desplegable usuario */}
        <div className={'sidebar-user-menu' + (menuOpen ? ' open' : '')} id="sidebar-user-menu">
          <div className="sidebar-user-menu-item" id="menu-cambiar-apodo" onClick={() => { setMenuOpen(false); onOpenApodo(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Cambiar apodo
          </div>
          <div className="sidebar-user-menu-item" id="menu-cambiar-pass" onClick={() => { setMenuOpen(false); onOpenPass(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Cambiar contraseña
          </div>
          <div className="sidebar-user-menu-item danger" id="logout-btn" onClick={() => logout()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </div>
        </div>

      </div>

    </aside>
  );
}
