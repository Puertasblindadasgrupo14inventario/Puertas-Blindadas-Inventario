import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../services/api';
import { formatQty, formatMoney } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';

const MSG_INICIAL = 'Seleccione fechas y presione "Generar reporte"';

/** Consumo por Área — conversión 1:1 de reportes/consumo-area.html. data-rol="gerencia": enlace Valorización. */
export default function ReporteConsumoArea() {
  usePageTitle('Consumo por Área');
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();

  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [resumen, setResumen] = useState(null);     // resumen_por_area o null (oculto)
  const [consumos, setConsumos] = useState(null);   // null = mensaje de tabla
  const [msgTabla, setMsgTabla] = useState(MSG_INICIAL);

  // CU-69: Cargar áreas al iniciar
  useEffect(() => { API.reportes.listarAreas().then(a => setAreas(a || [])).catch(() => {}); }, []);

  const generarReporte = async () => {
    try {
      const data = await API.reportes.consumoArea({ area_id: areaId, desde, hasta });
      if (data?.error) { setResumen(null); setConsumos(null); setMsgTabla('Sin resultados'); showAlert('danger', data.error); return; }
      if (data?.mensaje) { setResumen(null); setConsumos(null); setMsgTabla('Sin resultados para los filtros aplicados'); showAlert('info', data.mensaje); return; }
      const { consumos: c, resumen_por_area } = data;
      const hayResumen = resumen_por_area && resumen_por_area.length > 0;
      setResumen(hayResumen ? resumen_por_area : null);
      if (!c || c.length === 0) {
        setConsumos(null);
        setMsgTabla('No hay datos de consumo para mostrar con los filtros aplicados');
        return;
      }
      setConsumos(c);
    } catch (err) {
      showAlert('danger', 'Error: ' + err.message);
    }
  };

  const limpiar = () => { setAreaId(''); setDesde(''); setHasta(''); setResumen(null); setConsumos(null); setMsgTabla(MSG_INICIAL); };

  const maxCosto = resumen ? Math.max(...resumen.map(a => a.costo_total || 0)) : 0;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Consumo por Área de Trabajo</div>
          <div className="page-subtitle">Análisis de materiales consumidos por área y período</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/reportes/movimientos" className="btn btn-ghost">← Reportes</Link>
          <Link to="/reportes/mermas" className="btn btn-ghost">Mermas</Link>
          {user?.rol !== 'jop' && <Link to="/reportes/valorizacion" className="btn btn-ghost">Valorización</Link>}
          <Link to="/reportes/programacion" className="btn btn-ghost">Programación</Link>
        </div>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Filtros</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 180 }}>
            <label className="form-label">Área</label>
            <select className="form-control" id="filter-area" value={areaId} onChange={e => setAreaId(e.target.value)}>
              <option value="">Todas las áreas</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 160 }}><label className="form-label">Desde</label><input className="form-control" type="date" id="filter-desde" value={desde} onChange={e => setDesde(e.target.value)} /></div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 160 }}><label className="form-label">Hasta</label><input className="form-control" type="date" id="filter-hasta" value={hasta} onChange={e => setHasta(e.target.value)} /></div>
          <button className="btn btn-primary" id="btn-generar" onClick={generarReporte}>Generar reporte</button>
          <button className="btn btn-ghost" id="btn-limpiar-filtros" type="button" onClick={limpiar}>Limpiar filtros</button>
        </div>
      </div>

      {/* Resumen por área */}
      {resumen && (
        <div id="resumen-areas" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Resumen por área</div>
          <div id="areas-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
            {resumen.map((a, i) => (
              <div key={a.area ?? i} className="card" style={{ padding: 14, ...(a.alerta_anomalia ? { borderLeft: '4px solid var(--danger)' } : {}) }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.area}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{a.materiales} material(es)</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6, color: 'var(--primary)' }}>{formatMoney(a.costo_total)}</div>
                {a.promedio_historico != null && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Promedio histórico: {formatMoney(a.promedio_historico)}</div>}
                {a.alerta_anomalia && <div style={{ marginTop: 6, padding: '6px 8px', background: '#FFF3CD', borderRadius: 4, fontSize: 11, color: '#856404', fontWeight: 600 }}>⚠ {a.mensaje_anomalia} (+{a.desviacion_pct}%)</div>}
              </div>
            ))}
          </div>
          {/* CU-69: Gráfico de distribución de costos por área */}
          <div className="card" style={{ marginTop: 16, padding: 18 }} id="grafico-areas">
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Distribución de costos por área</div>
            <div id="bars-container">
              {maxCosto === 0 && <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 12, fontSize: 12 }}>Sin datos de costos para graficar (materiales sin precio de referencia)</div>}
              {maxCosto > 0 && resumen.map((a, i) => (
                <div key={a.area ?? i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ minWidth: 120, fontSize: 12, fontWeight: 500, textAlign: 'right' }}>{a.area}</div>
                  <div style={{ flex: 1, background: 'var(--gray-mid)', borderRadius: 4, height: 22, overflow: 'hidden' }}>
                    <div style={{ width: ((a.costo_total || 0) / maxCosto * 100) + '%', background: 'var(--orange)', height: '100%', borderRadius: 4, transition: 'width .3s' }}></div>
                  </div>
                  <div style={{ minWidth: 100, fontSize: 12, fontWeight: 600 }}>{formatMoney(a.costo_total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabla detalle */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Área</th><th>SKU</th><th>Material</th><th>Unidad</th>
                <th style={{ textAlign: 'right' }}>Total consumido</th>
                <th style={{ textAlign: 'right' }}>Precio unit.</th>
                <th style={{ textAlign: 'right' }}>Costo total</th>
                <th style={{ textAlign: 'right' }}>OTs</th>
              </tr>
            </thead>
            <tbody id="tabla-body">
              {!consumos && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>{msgTabla}</td></tr>}
              {(consumos || []).map((c, i) => {
                const consumido = parseFloat(c.total_consumido || 0);
                const precio = parseFloat(c.precio_unitario || 0);
                return (
                  <tr key={`${c.area_nombre}-${c.sku}-${i}`}>
                    <td>{c.area_nombre}</td>
                    <td><code>{c.sku}</code></td>
                    <td>{c.material_nombre}</td>
                    <td>{c.unidad || '—'}</td>
                    <td style={{ textAlign: 'right' }}>{formatQty(consumido)}</td>
                    <td style={{ textAlign: 'right' }}>{precio ? formatMoney(precio) : '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(consumido * precio)}</td>
                    <td style={{ textAlign: 'right' }}>{c.ordenes_involucradas}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
