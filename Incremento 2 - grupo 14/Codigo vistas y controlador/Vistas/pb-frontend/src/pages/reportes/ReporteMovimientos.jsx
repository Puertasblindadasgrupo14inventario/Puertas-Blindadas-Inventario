import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../services/api';
import { formatMoney } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';
import Pagination, { EmptyRow } from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

const hoy = new Date();
const PRIMER_DIA = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
const HOY = hoy.toISOString().slice(0, 10);

/**
 * Reporte de Movimientos — conversión 1:1 de reportes/movimientos.html.
 * data-rol="gerencia": enlace Valorización y botón Exportar (ocultos si rol === 'jop').
 * Columna "Precio unit." solo si rol === 'gerencia'.
 */
export default function ReporteMovimientos() {
  usePageTitle('Reporte Movimientos');
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();
  const esGerencia = user?.rol === 'gerencia';

  const [desde, setDesde] = useState(PRIMER_DIA);
  const [hasta, setHasta] = useState(HOY);
  const [tipo, setTipo] = useState('');
  const [sku, setSku] = useState('');
  const [materiales, setMateriales] = useState([]);
  const [movs, setMovs] = useState(null); // null = estado vacío inicial
  const [rango, setRango] = useState({ desde: '', hasta: '' });
  const [generando, setGenerando] = useState(false);

  const generarReporte = useCallback(async () => {
    if (!desde || !hasta) { showAlert('danger', 'Selecciona un rango de fechas.'); return; }
    if (desde > hasta) {
      showAlert('danger', 'La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
      setMovs(null);
      return;
    }
    // CU-77 CP3: Advertencia para rangos de fecha amplios
    const diffDias = Math.ceil((new Date(hasta) - new Date(desde)) / (1000 * 60 * 60 * 24));
    if (diffDias > 90) showAlert('warning', `El rango seleccionado abarca ${diffDias} días. Esto puede tardar más de lo habitual.`);

    setGenerando(true);
    try {
      const data = await API.reportes.movimientos({ desde, hasta, tipo: tipo || null, buscar: sku || null });
      let lista = data?.movimientos || [];
      if (sku) lista = lista.filter(m => m.sku === sku);
      setMovs(lista);
      setRango({ desde, hasta });
    } catch (err) {
      showAlert('danger', 'Error generando reporte: ' + err.message);
    } finally {
      setGenerando(false);
    }
  }, [desde, hasta, tipo, sku, showAlert]);

  // Al cargar (300 ms después, como el HTML): productos para el filtro y reporte con defaults
  const generarRef = useRef(generarReporte);
  generarRef.current = generarReporte;
  useEffect(() => {
    let cancelado = false;
    const t = setTimeout(async () => {
      try {
        const m = await API.materiales.listar();
        if (!cancelado) setMateriales(m || []);
      } catch (e) { console.warn('Error cargando productos para filtro:', e); }
      if (!cancelado) generarRef.current();
    }, 300);
    return () => { cancelado = true; clearTimeout(t); };
  }, []);

  const pag = usePagination(movs, 20);
  const lista = movs || [];
  const cnt = (t) => lista.filter(m => m.tipo?.toLowerCase().includes(t)).length;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reporte de Movimientos</div>
          <div className="page-subtitle">Auditoría de entradas, salidas y traslados por período</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/reportes/mermas" className="btn btn-ghost">Mermas</Link>
          {user?.rol !== 'jop' && <Link to="/reportes/valorizacion" className="btn btn-ghost">Valorización</Link>}
          <Link to="/reportes/consumo-area" className="btn btn-ghost">Consumo por área</Link>
          <Link to="/reportes/programacion" className="btn btn-ghost">Programación semanal</Link>
          {user?.rol !== 'jop' && (
            <button className="btn btn-secondary" id="btn-exportar" onClick={() => showAlert('success', 'Exportación disponible próximamente.')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      {/* Filtros */}
      <div className="card card-sm" style={{ marginBottom: 16 }}>
        <div className="filter-row" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
          <div><label className="form-label" style={{ marginBottom: 4 }}>Desde</label><input className="form-control" type="date" id="filter-desde" style={{ width: 'auto' }} value={desde} onChange={e => setDesde(e.target.value)} /></div>
          <div><label className="form-label" style={{ marginBottom: 4 }}>Hasta</label><input className="form-control" type="date" id="filter-hasta" style={{ width: 'auto' }} value={hasta} onChange={e => setHasta(e.target.value)} /></div>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Tipo</label>
            <select className="form-control" id="filter-tipo" style={{ width: 'auto' }} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">Todos</option><option>Entrada</option><option>Salida</option>
            </select>
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Producto</label>
            <select className="form-control" id="filter-sku" style={{ width: 'auto' }} value={sku} onChange={e => setSku(e.target.value)}>
              <option value="">Todos los productos</option>
              {materiales.map(m => <option key={m.sku} value={m.sku}>{m.sku} — {m.nombre}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button className="btn btn-primary btn-sm" id="btn-generar" onClick={generarReporte} disabled={generando}>{generando ? 'Generando...' : 'Generar reporte'}</button>
          </div>
        </div>
      </div>

      {movs !== null && (
        <>
          {/* KPIs resumen (CU-77 CP1: calculados desde los movimientos filtrados) */}
          <div className="kpi-grid" id="kpi-container" style={{ marginBottom: 24 }}>
            <div className="kpi-card"><div className="kpi-label">Total movimientos</div><div className="kpi-value" id="kpi-total">{lista.length}</div><div className="kpi-sub">En el período</div></div>
            <div className="kpi-card kpi-success"><div className="kpi-label">Entradas</div><div className="kpi-value" id="kpi-entradas" style={{ color: 'var(--success)' }}>{cnt('entrada')}</div><div className="kpi-sub">Ingresos de stock</div></div>
            <div className="kpi-card kpi-danger"><div className="kpi-label">Salidas</div><div className="kpi-value danger" id="kpi-salidas">{cnt('salida')}</div><div className="kpi-sub">Retiros de stock</div></div>
            <div className="kpi-card kpi-warning"><div className="kpi-label">Traslados</div><div className="kpi-value warning" id="kpi-traslados">{cnt('traslado')}</div><div className="kpi-sub">Entre bodegas</div></div>
          </div>

          {/* Tabla resultado */}
          <div className="card" id="tabla-resultado">
            <div className="card-title" id="tabla-titulo">{lista.length} movimiento(s) entre {rango.desde} y {rango.hasta}</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Bodega</th><th>Cantidad</th><th>Clasificación</th>{esGerencia && <th id="th-precio">Precio unit.</th>}<th>Usuario</th></tr>
                </thead>
                <tbody id="tbody-reporte">
                  {lista.length === 0 && <EmptyRow colSpan={9} emptyMsg={<div className="empty-state"><p>Sin movimientos en este período.</p></div>} />}
                  {pag.items.map(m => {
                    const tl = (m.tipo || '').toLowerCase();
                    const cls = tl.includes('entrada') ? 'badge-success' : tl.includes('salida') ? 'badge-danger' : tl.includes('traslado') ? 'badge-orange' : 'badge-gray';
                    const signo = tl.includes('entrada') ? '+' : tl.includes('salida') ? '-' : '';
                    return (
                      <tr key={m.id}>
                        <td><span className="td-mono" style={{ fontSize: 11 }}>{m.id}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString('sv-SE') : '—'}</td>
                        <td><span className={`badge ${cls}`}>{m.tipo || ''}</span></td>
                        <td><div style={{ fontWeight: 500, fontSize: 13 }}>{m.material || '—'}</div><div style={{ fontSize: 11, color: '#aaa' }}>{m.sku}</div></td>
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.bodega || '—'}</td>
                        <td style={{ fontWeight: 600 }}>{signo}{parseFloat(m.cantidad || 0)}</td>
                        <td style={{ fontSize: 12 }}>{m.clasificacion_salida || '—'}</td>
                        {esGerencia && <td style={{ fontSize: 12 }}>{m.precio_unitario != null ? formatMoney(m.precio_unitario) : '—'}</td>}
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.usuario || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination {...pag} />
          </div>
        </>
      )}

      {/* Estado vacío inicial */}
      {movs === null && (
        <div className="card" id="empty-inicial">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>Selecciona un rango de fechas y haz clic en <strong>Generar reporte</strong> para ver los resultados.</p>
          </div>
        </div>
      )}
    </>
  );
}
