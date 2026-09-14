import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API } from '../../services/api';
import { useConfirm } from '../../hooks/useDialog';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';
import Pagination, { EmptyRow } from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

const getPrioridadCls = (p) => p === 'urgente' ? 'badge-danger' : p === 'alta' ? 'badge-warning' : 'badge-gray';
const BORDER = { urgente: 'var(--danger)', alta: 'var(--warning)', media: 'var(--gray-mid)' };
const fecha = (a) => a.fecha_generacion ? a.fecha_generacion.split('T')[0] : '—';

/** Centro de Alertas — conversión 1:1 de alertas/alertas.html (?detalle=ID abre el modal) */
export default function Alertas() {
  usePageTitle('Alertas');
  const confirm = useConfirm();
  const { alert, showAlert } = useAlert();
  const [params] = useSearchParams();

  const [alertas, setAlertas] = useState(null);
  const [fp, setFp] = useState('');
  const [fe, setFe] = useState('activa');
  const [detalle, setDetalle] = useState(null); // null | 'no-encontrada' | alerta
  const detalleAbierto = useRef(false);

  const cargarAlertas = useCallback(async () => {
    try {
      const data = await API.alertas.listar({ prioridad: fp || null, estado: fe || null });
      const lista = Array.isArray(data) ? data : [];
      setAlertas(lista);
      return lista;
    } catch (err) {
      showAlert('danger', 'Error cargando alertas: ' + err.message);
    }
  }, [fp, fe, showAlert]);

  // Generar alertas al cargar y luego mostrarlas; ?detalle=ID abre el modal (desde el dashboard)
  useEffect(() => {
    let cancelado = false;
    API.alertas.generar().catch(() => {}).finally(async () => {
      if (cancelado) return;
      const lista = await cargarAlertas();
      const detalleId = params.get('detalle');
      if (detalleId && lista && !detalleAbierto.current) {
        detalleAbierto.current = true;
        const id = parseInt(detalleId);
        const a = lista.find(x => x.id === id || x.id === String(id));
        setDetalle(a || 'no-encontrada');
      }
    });
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargarAlertas]);

  const verDetalleAlerta = (id) => {
    const a = (alertas || []).find(x => x.id === id || x.id === String(id));
    setDetalle(a || 'no-encontrada');
  };

  const resolverAlerta = async (id) => {
    if (!(await confirm('¿Confirma que desea marcar esta alerta como resuelta?', 'Resolver alerta'))) return;
    try {
      await API.alertas.resolver(id);
      showAlert('success', 'Alerta marcada como resuelta.');
      cargarAlertas();
    } catch (err) {
      showAlert('danger', 'Error: ' + err.message);
    }
  };

  const lista = alertas || [];
  const activas = lista.filter(a => a.estado === 'activa');
  const pag = usePagination(alertas, 20);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Centro de Alertas</div>
          <div className="page-subtitle">Alertas ordenadas por prioridad: urgente → alta → media</div>
        </div>
        <Link to="/alertas/faltantes" className="btn btn-secondary">Ver alertas de faltantes</Link>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      {/* KPIs de alertas (valores estáticos iniciales del HTML hasta cargar) */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card kpi-danger">
          <div className="kpi-label">Urgentes</div>
          <div className="kpi-value danger" id="kpi-urgente">{alertas === null ? 1 : lista.filter(a => a.prioridad === 'urgente' && a.estado === 'activa').length}</div>
          <div className="kpi-sub">Stock ≤ crítico</div>
        </div>
        <div className="kpi-card kpi-warning">
          <div className="kpi-label">Altas</div>
          <div className="kpi-value warning" id="kpi-alta">{alertas === null ? 1 : lista.filter(a => a.prioridad === 'alta' && a.estado === 'activa').length}</div>
          <div className="kpi-sub">Producto crítico con stock bajo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Medias</div>
          <div className="kpi-value" id="kpi-media">{alertas === null ? 1 : lista.filter(a => a.prioridad === 'media' && a.estado === 'activa').length}</div>
          <div className="kpi-sub">Stock bajo sin criticidad</div>
        </div>
        <div className="kpi-card kpi-success">
          <div className="kpi-label">Resueltas</div>
          <div className="kpi-value" id="kpi-resuelta" style={{ color: 'var(--success)' }}>{alertas === null ? 0 : lista.filter(a => a.estado === 'resuelta').length}</div>
          <div className="kpi-sub">Cerradas en este periodo</div>
        </div>
      </div>

      {/* Filtro */}
      <div className="filter-row" style={{ marginBottom: 16 }}>
        <select className="form-control" id="filter-prioridad" style={{ width: 'auto' }} value={fp} onChange={e => setFp(e.target.value)}>
          <option value="">Todas las prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
        </select>
        <select className="form-control" id="filter-estado" style={{ width: 'auto' }} value={fe} onChange={e => setFe(e.target.value)}>
          <option value="activa">Solo activas</option>
          <option value="">Todas (incl. resueltas)</option>
        </select>
      </div>

      {/* Lista de alertas */}
      <div id="alertas-list" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {alertas !== null && activas.length === 0 && (
          <div className="card"><div className="empty-state"><div className="empty-state-icon">✅</div><p style={{ fontSize: 16, fontWeight: 600, color: 'var(--success)' }}>Inventario bajo control</p><p style={{ marginTop: 8 }}>No hay alertas activas.</p></div></div>
        )}
        {activas.map(a => (
          <div key={a.id} className="card card-sm" style={{ borderLeft: `4px solid ${BORDER[a.prioridad] || 'var(--gray-mid)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`badge ${getPrioridadCls(a.prioridad)}`}>{(a.prioridad || 'media').toUpperCase()}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.producto}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                  <span className="td-mono">{a.sku}</span> · {a.tipo}
                  {' '}· Stock actual: <strong style={{ color: a.prioridad === 'urgente' ? 'var(--danger)' : '#000' }}>{parseFloat(a.stock_actual || 0)}</strong>
                  {' '}(mín. {parseFloat(a.stock_minimo || 0)})
                  {' '}· {fecha(a)}
                  {a.tiempo_reposicion ? <> · Tiempo reposición: <strong>{a.tiempo_reposicion} días</strong></> : null}
                  {a.proveedor ? <> · Proveedor: {a.proveedor}</> : null}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => verDetalleAlerta(a.id)}>Ver detalle</button>
              <button className="btn btn-secondary btn-sm" onClick={() => resolverAlerta(a.id)}>Marcar resuelta</button>
            </div>
          </div>
        ))}
      </div>

      {/* Historial completo (FR-37) */}
      <div className="card">
        <div className="card-title">Historial de alertas</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Producto</th><th>Tipo</th><th>Prioridad</th><th>Stock actual</th><th>Generada</th><th>Estado</th></tr>
            </thead>
            <tbody id="tbody-historial">
              {alertas !== null && lista.length === 0 && (
                <EmptyRow colSpan={7} emptyMsg={<div className="empty-state"><p>Sin historial de alertas.</p></div>} />
              )}
              {pag.items.map(a => (
                <tr key={a.id}>
                  <td><span className="td-mono" style={{ fontSize: 11 }}>{a.id}</span></td>
                  <td style={{ fontSize: 13 }}><div style={{ fontWeight: 500 }}>{a.producto}</div><div style={{ fontSize: 11, color: '#aaa' }}>{a.sku}</div></td>
                  <td style={{ fontSize: 13 }}>{a.tipo}</td>
                  <td><span className={`badge ${getPrioridadCls(a.prioridad)}`}>{a.prioridad || 'media'}</span></td>
                  <td style={{ fontWeight: 600 }}>{parseFloat(a.stock_actual || 0)}</td>
                  <td style={{ fontSize: 12, color: 'var(--gray)' }}>{fecha(a)}</td>
                  <td><span className={`badge ${a.estado === 'activa' ? 'badge-warning' : 'badge-success'}`}>{a.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination {...pag} />
      </div>

      {/* Modal detalle de alerta (CU-117) */}
      {detalle && (
        <div className="modal-overlay" id="modal-detalle" style={{ display: 'flex' }}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <div className="modal-title">Detalle de alerta</div>
              <button className="modal-close" onClick={() => setDetalle(null)}>×</button>
            </div>
            <div className="modal-body" id="modal-detalle-body">
              {detalle === 'no-encontrada' && <div style={{ color: 'var(--danger)' }}>Alerta no encontrada</div>}
              {detalle !== 'no-encontrada' && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <span className={`badge ${getPrioridadCls(detalle.prioridad)}`} style={{ marginRight: 8 }}>{(detalle.prioridad || 'media').toUpperCase()}</span>
                    <strong>{detalle.producto || detalle.sku}</strong>
                    <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 8 }}>{detalle.sku || ''}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, fontSize: 13 }}>
                    <div><span style={{ color: 'var(--gray)' }}>Tipo:</span> {detalle.tipo || '—'}</div>
                    <div><span style={{ color: 'var(--gray)' }}>Estado:</span> {detalle.estado}</div>
                    <div><span style={{ color: 'var(--gray)' }}>Stock actual:</span> <strong style={{ color: detalle.prioridad === 'urgente' ? 'var(--danger)' : 'inherit' }}>{parseFloat(detalle.stock_actual || 0)}</strong></div>
                    <div><span style={{ color: 'var(--gray)' }}>Stock mínimo:</span> {parseFloat(detalle.stock_minimo || 0)}</div>
                    <div><span style={{ color: 'var(--gray)' }}>Generada:</span> {fecha(detalle)}</div>
                    <div><span style={{ color: 'var(--gray)' }}>Proveedor:</span> {detalle.proveedor || 'Sin proveedor'}</div>
                    {detalle.tiempo_reposicion
                      ? <div><span style={{ color: 'var(--gray)' }}>Tiempo repos.:</span> <strong>{detalle.tiempo_reposicion} días</strong></div>
                      : <div><span style={{ color: 'var(--gray)' }}>Tiempo repos.:</span> <span style={{ color: 'var(--warning)' }}>No registrado</span></div>}
                  </div>
                  {!detalle.proveedor && <div style={{ padding: 8, background: '#FFF3CD', borderRadius: 6, fontSize: 12, color: '#856404', marginBottom: 8 }}>Este producto no tiene proveedores asociados. Se recomienda registrar uno para evaluar abastecimiento.</div>}
                  {detalle.proveedor && !detalle.tiempo_reposicion && <div style={{ padding: 8, background: '#FFF3CD', borderRadius: 6, fontSize: 12, color: '#856404', marginBottom: 8 }}>El proveedor no tiene tiempo de entrega registrado. La viabilidad temporal no puede evaluarse.</div>}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setDetalle(null)}>Cerrar</button>
                    <button className="btn btn-secondary" onClick={() => { const id = detalle.id; setDetalle(null); resolverAlerta(id); }}>Marcar resuelta</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
