import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useConfirm } from '../../hooks/useDialog';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

const normalizar = (m) => ({
  id:            m.id,
  fecha:         m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString('sv-SE') : '',
  tipo:          m.tipo || '',
  sku:           m.sku || '',
  producto:      m.material_nombre || '',
  bodega:        m.bodega || '—',
  cantidad:      parseFloat(m.cantidad) || 0,
  clasificacion: m.clasificacion_salida || '—',
  motivo:        m.descripcion_motivo || m.motivo || '—',
  usuario:       m.usuario || '',
  revertido:     m.estado === 'revertido',
  pendiente:     m.estado === 'pendiente_aprobacion',
  rechazado:     m.estado === 'rechazado',
  proveedor:     m.proveedor || '—',
  proyecto_nombre: m.proyecto_nombre || null,
});

const EMPTY_DEFAULT = 'No hay movimientos registrados en el periodo seleccionado.';

/**
 * Movimientos de Inventario — conversión 1:1 de movimientos/historial.html.
 * data-rol="gerencia": botón Exportar (sin handler en el original). Acciones de fila
 * (aprobar/rechazar merma CU-73, revertir FR-30) solo si rol === 'gerencia'.
 */
export default function MovimientoHistorial() {
  usePageTitle('Movimientos');
  const { user } = useAuth();
  const confirm = useConfirm();
  const { alert, showAlert } = useAlert();
  const isGerencia = user?.rol === 'gerencia';

  const [movimientos, setMovimientos] = useState([]);
  const [emptyMsg, setEmptyMsg] = useState(EMPTY_DEFAULT);
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [revertir, setRevertir] = useState(null); // movimiento a revertir

  const cargarMovimientos = useCallback(async () => {
    const s = search.toLowerCase();
    const params = { buscar: s || null, tipo: tipo || null, desde: desde || null, hasta: hasta || null };
    try {
      const data = await API.movimientos.listar(params);
      const lista = (data || []).map(normalizar);
      setMovimientos(lista);

      // CU-39 CP2/CP3 + CU-40 CP2/CP3: Diferenciar mensaje cuando no hay resultados
      if (lista.length === 0 && s) {
        let encontrado = false;
        try {
          await API.materiales.obtener(s);
          setEmptyMsg(`El producto "${s}" no tiene movimientos registrados.`);
          encontrado = true;
        } catch { /* no es un producto */ }
        if (!encontrado) {
          try {
            const usuarios = await API.usuarios.listar({ buscar: s });
            const exacto = (usuarios || []).find(u => u.username.toLowerCase() === s.toLowerCase());
            if (exacto) {
              setEmptyMsg(`El usuario "${exacto.username}" no tiene actividad registrada.`);
              encontrado = true;
            }
          } catch { /* error consultando usuarios */ }
        }
        if (!encontrado) {
          setEmptyMsg(`No se encontró ningún producto ni usuario con "${s}". Verifique que el SKU o nombre ingresado sea válido.`);
        }
      } else {
        setEmptyMsg(EMPTY_DEFAULT);
      }
    } catch (err) {
      showAlert('danger', 'Error cargando movimientos: ' + err.message);
    }
  }, [search, tipo, desde, hasta, showAlert]);

  // Carga inicial y al cambiar filtros del servidor (search-input, tipo, desde, hasta)
  useEffect(() => { cargarMovimientos(); }, [cargarMovimientos]);

  // CU-74 CP3: Verificar mermas pendientes >24h y notificar emergencia
  useEffect(() => { API.movimientos.verificarMermasPendientes().catch(() => {}); }, []);

  // Filtro de estado (cliente)
  const filtered = useMemo(() => {
    if (!estado) return movimientos;
    return movimientos.filter(m => {
      if (estado === 'pendiente_aprobacion') return m.pendiente;
      if (estado === 'activo') return !m.revertido && !m.pendiente && !m.rechazado;
      if (estado === 'revertido') return m.revertido;
      if (estado === 'rechazado') return m.rechazado;
      return true;
    });
  }, [movimientos, estado]);

  const pag = usePagination(filtered, 20);

  const confirmarRevertir = async () => {
    const id = revertir?.id;
    setRevertir(null);
    try {
      await API.movimientos.revertir(id);
      showAlert('success', 'Movimiento revertido. El stock ha sido ajustado y la acción queda registrada en auditoría.');
      cargarMovimientos();
    } catch (err) {
      showAlert('danger', 'Error al revertir: ' + err.message);
    }
  };

  // CU-73: Aprobar/Rechazar merma de producto crítico
  const aprobarMerma = async (id) => {
    if (!(await confirm('¿Aprobar esta merma de producto crítico? El movimiento quedará registrado definitivamente.', 'Aprobar merma'))) return;
    try {
      const resp = await API.movimientos.aprobarMerma(id);
      if (resp?.error) { showAlert('danger', resp.error); return; }
      showAlert('success', resp?.message);
      cargarMovimientos();
    } catch (err) { showAlert('danger', 'Error: ' + err.message); }
  };

  const rechazarMerma = async (id) => {
    if (!(await confirm('¿Rechazar esta merma? El stock será devuelto a la bodega.', 'Rechazar merma'))) return;
    try {
      const resp = await API.movimientos.rechazarMerma(id);
      if (resp?.error) { showAlert('danger', resp.error); return; }
      showAlert('success', resp?.message);
      cargarMovimientos();
    } catch (err) { showAlert('danger', 'Error: ' + err.message); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Movimientos de Inventario</div>
          <div className="page-subtitle">Historial de entradas, salidas y traslados</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/movimientos/entrada" className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar entrada
          </Link>
          <Link to="/movimientos/salida" className="btn btn-secondary">Registrar salida</Link>
        </div>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      {/* Filtros */}
      <div className="card card-sm" style={{ marginBottom: 16 }}>
        <div className="filter-row" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="search-input" placeholder="Buscar por SKU, producto, usuario..." autoComplete="off" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" id="filter-tipo" style={{ width: 'auto' }} value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option>Entrada</option><option>Salida</option><option>Reverso</option>
          </select>
          {/* CU-74: Filtro para mermas pendientes de aprobación */}
          <select className="form-control" id="filter-estado-mov" style={{ width: 'auto' }} value={estado} onChange={e => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pendiente_aprobacion">Pendiente aprobación</option>
            <option value="activo">Activos</option>
            <option value="revertido">Revertidos</option>
            <option value="rechazado">Rechazados</option>
          </select>
          <input type="date" className="form-control" id="filter-desde" style={{ width: 'auto' }} value={desde} onChange={e => setDesde(e.target.value)} />
          <input type="date" className="form-control" id="filter-hasta" style={{ width: 'auto' }} value={hasta} onChange={e => setHasta(e.target.value)} />
          {user?.rol !== 'jop' && (
            <button className="btn btn-secondary btn-sm" id="btn-exportar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Fecha</th><th>Tipo</th><th>Producto</th>
                <th>Bodega</th><th>Cant.</th><th>Clasificación</th><th>Motivo</th><th>Proveedor</th><th>Usuario</th>
                <th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tbody-movimientos">
              {filtered.length === 0 && (
                <tr><td colSpan={12} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary,#888)' }}></td></tr>
              )}
              {pag.items.map(m => {
                const tipoCls  = m.tipo === 'Entrada' ? 'badge-success' : m.tipo === 'Salida' ? 'badge-danger' : 'badge-orange';
                const cantSign = m.tipo === 'Entrada' ? '+' + m.cantidad : m.tipo === 'Salida' ? '-' + m.cantidad : '' + m.cantidad;
                const motivoStr = String(m.motivo || '—');
                const estadoBadge = m.revertido ? <span className="badge badge-gray">Revertido</span>
                  : m.pendiente ? <span className="badge badge-warning">Pendiente aprobación</span>
                  : m.rechazado ? <span className="badge badge-danger">Rechazado</span>
                  : <span className="badge badge-success">Activo</span>;
                return (
                  <tr key={m.id} style={{ opacity: m.revertido ? 0.5 : 1 }}>
                    <td><span className="td-mono">{m.id}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{m.fecha}</td>
                    <td><span className={`badge ${tipoCls}`}>{m.tipo}</span></td>
                    <td><div style={{ fontWeight: 500, fontSize: 13 }}>{m.producto}</div><div style={{ fontSize: 11, color: '#aaa' }}>{m.sku}</div></td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.bodega}</td>
                    <td style={{ fontWeight: 600 }}>{cantSign}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.clasificacion}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }} title={motivoStr}>{motivoStr.substring(0, 25)}{motivoStr.length > 25 ? '...' : ''}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.proveedor}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.usuario}</td>
                    <td>{estadoBadge}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {isGerencia && m.pendiente && (
                          <>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)', fontSize: 11 }} onClick={() => aprobarMerma(m.id)}>Aprobar</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', fontSize: 11 }} onClick={() => rechazarMerma(m.id)}>Rechazar</button>
                          </>
                        )}
                        {isGerencia && !m.revertido && !m.pendiente && !m.rechazado && (
                          <button className="btn btn-ghost btn-sm btn-icon" title="Revertir" onClick={() => setRevertir(m)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination {...pag} />
        {filtered.length === 0 && (
          <div id="empty-state" className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p id="empty-state-msg">{emptyMsg}</p>
          </div>
        )}
      </div>

      {/* Modal revertir (FR-30, solo gerencia) */}
      {revertir && (
        <div className="modal-backdrop show" id="modal-revertir" onClick={e => { if (e.target === e.currentTarget) setRevertir(null); }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">Revertir movimiento</div>
                <div className="modal-subtitle" id="rev-subtitle">{revertir.id} · {revertir.tipo} · {revertir.producto} ({revertir.cantidad} uds.)</div>
              </div>
              <button className="modal-close" onClick={() => setRevertir(null)}>&#x2715;</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                La reversión queda registrada en el historial de auditoría. Esta acción requiere autorización de Gerencia.
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6 }}>¿Confirmas la reversión de este movimiento? El stock se ajustará automáticamente.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRevertir(null)}>Cancelar</button>
              <button className="btn btn-primary" id="btn-confirmar-revertir" onClick={confirmarRevertir}>Autorizar reversión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
