import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API } from '../../services/api';
import { formatMoney } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';

const TABS = [['consumos', 'Consumos'], ['estimados', 'Estimados'], ['registrar', 'Registrar consumo']];

/**
 * Detalle Orden de Trabajo — conversión 1:1 de ordenes/detalle.html (?id= → /ordenes/:id).
 * data-rol="gerencia": enlace "Costos" (oculto si rol === 'jop').
 */
export default function OrdenDetalle() {
  usePageTitle('Detalle Orden de Trabajo');
  const { id: otId } = useParams();
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();
  const { alert: regAlert, showAlert: showRegAlert, clearAlert: clearRegAlert } = useAlert();

  const [tab, setTab] = useState('consumos');
  const [data, setData] = useState(null);       // respuesta de consumos()
  const [bodegas, setBodegas] = useState([]);

  // Estimados (CU-91)
  const [estPendientes, setEstPendientes] = useState([]);
  const [estSku, setEstSku] = useState('');
  const [estCantidad, setEstCantidad] = useState('');
  const [tituloEst, setTituloEst] = useState('Registrar/Actualizar estimados');
  const [btnEstTxt, setBtnEstTxt] = useState('Guardar estimados');

  // Registrar consumo (CU-89)
  const [regSku, setRegSku] = useState('');
  const [regCantidad, setRegCantidad] = useState('');
  const [regBodega, setRegBodega] = useState('');
  const [conflicto, setConflicto] = useState(null); // { consumo_actual, cantidad_nueva }

  // Comparativo (CU-92)
  const [comp, setComp] = useState(null); // null | { loading } | { error } | { detalle, resumen }

  useEffect(() => {
    if (!otId) showAlert('danger', 'No se especificó un ID de orden de trabajo');
  }, [otId, showAlert]);

  const cargarConsumos = useCallback(async () => {
    try {
      const d = await API.ordenesTrabajo.consumos(otId);
      setData(d);
    } catch (err) {
      showAlert('danger', 'Error: ' + err.message);
    }
  }, [otId, showAlert]);

  useEffect(() => {
    if (!otId) return;
    cargarConsumos();
    API.bodegas.listar().then(b => setBodegas(b || [])).catch(e => console.warn('Error cargando bodegas:', e.message));
  }, [otId, cargarConsumos]);

  // CU-98 CP3: Detectar estimados previos y cargar para modificación
  const cargarEstimadosExistentes = async () => {
    try {
      const d = await API.ordenesTrabajo.consumos(otId);
      const conEstimado = (d?.materiales || []).filter(m => m.estimado != null);
      if (conEstimado.length > 0) {
        showAlert('info', 'Esta OT ya tiene una planificación de estimados registrada. Puede modificar los valores existentes o agregar nuevos materiales.');
        setTituloEst('Modificar estimados (planificación existente)');
        setEstPendientes(conEstimado.map(m => ({ sku: m.sku, cantidad_estimada: parseFloat(m.estimado) })));
        setBtnEstTxt('Actualizar estimados');
      } else {
        setTituloEst('Registrar/Actualizar estimados');
        setBtnEstTxt('Guardar estimados');
      }
    } catch { /* silencio */ }
  };

  const cambiarTab = (t) => {
    setTab(t);
    if (t === 'estimados') cargarEstimadosExistentes();
  };

  // Eliminar material de la OT (el HTML usa confirm() nativo)
  const eliminarMaterialOT = async (sku) => {
    if (!window.confirm('¿Eliminar el material ' + sku + ' de esta orden de trabajo?')) return;
    try {
      await API.ordenesTrabajo.eliminarMaterial(otId, sku);
      showAlert('success', 'Material ' + sku + ' eliminado correctamente');
      cargarConsumos();
    } catch (err) {
      showAlert('danger', 'Error al eliminar: ' + err.message);
    }
  };

  // Registrar consumo (CU-89 / CU-96 CP3)
  const enviarConsumo = async (modo) => {
    const sku = regSku.trim();
    const cantidad = parseFloat(regCantidad);
    const bodega_id = regBodega || undefined;
    if (!sku || !cantidad || cantidad <= 0) { showRegAlert('warning', 'Ingrese SKU y cantidad válida'); return; }
    try {
      const resp = await API.ordenesTrabajo.registrarConsumo(otId, { sku, cantidad, bodega_id, modo });
      // CU-96 CP3: conflicto → sumar o actualizar
      if (resp?.error === 'conflicto_consumo_existente') {
        clearRegAlert();
        setConflicto({ consumo_actual: resp.consumo_actual, cantidad_nueva: resp.cantidad_nueva });
        return;
      }
      setConflicto(null);
      if (resp?.error) {
        showRegAlert('danger', resp.error);
        if (resp.bodegas) {
          showRegAlert('warning', 'Bodegas disponibles: ' + resp.bodegas.map(b => `#${b.bodega_id} (${b.disponible} disp.)`).join(', '));
        }
        return;
      }
      showRegAlert('success', resp?.message + (resp?.advertencia ? ' — ' + resp.advertencia : ''));
      setRegSku('');
      setRegCantidad('');
      cargarConsumos();
    } catch (err) {
      showRegAlert('danger', 'Error: ' + err.message);
    }
  };

  // Estimados (CU-91)
  const agregarEstimado = () => {
    const sku = estSku.trim();
    const cantidad = parseFloat(estCantidad);
    if (!sku || isNaN(cantidad) || cantidad < 0) { showAlert('warning', 'SKU y cantidad ≥ 0 requeridos'); return; }
    setEstPendientes(p => [...p, { sku, cantidad_estimada: cantidad }]);
    setEstSku('');
    setEstCantidad('');
  };

  const guardarEstimados = async () => {
    if (estPendientes.length === 0) return;
    try {
      const resp = await API.ordenesTrabajo.registrarEstimados(otId, { materiales: estPendientes });
      if (resp?.error) { showAlert('danger', resp.error); return; }
      // CU-100 CP2: advertencia de desviación si real > nuevo estimado
      if (resp?.advertencias && resp.advertencias.length > 0) {
        const advTexto = resp.advertencias.map(a => `${a.sku}: real (${a.real}) > estimado (${a.estimado})`).join('; ');
        showAlert('warning', <>{resp.message}<br /><strong>⚠ Advertencia:</strong> Se detectaron desviaciones — {advTexto}. La desviación será negativa. Revise los consumos reales.</>);
      } else {
        showAlert('success', resp?.message);
      }
      setEstPendientes([]);
      cargarConsumos();
    } catch (err) {
      showAlert('danger', 'Error: ' + err.message);
    }
  };

  // Comparativo (CU-92)
  const verComparativo = async () => {
    setComp({ loading: true });
    try {
      const d = await API.ordenesTrabajo.comparativo(otId);
      if (d?.error) { setComp({ error: d.error }); return; }
      setComp({ detalle: d.detalle || [], resumen: d.resumen || {} });
    } catch (err) {
      setComp({ error: 'Error: ' + err.message });
    }
  };

  /* ── Render tabla consumos ── */
  const materiales = data?.materiales || [];
  const tieneConsumos = materiales.some(m => m.real != null);
  const tieneEstimados = materiales.some(m => m.estimado != null);
  const tieneEstimadosComp = comp?.detalle?.some(d => d.estimado != null && parseFloat(d.estimado) > 0);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Orden de Trabajo <span id="ot-id">{data ? '#' + otId : ''}</span></div>
          <div className="page-subtitle" id="ot-estado">{data ? 'Estado: ' + (data.orden?.estado || '—') : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/ordenes" className="btn btn-ghost">← Órdenes de trabajo</Link>
          <button className="btn btn-ghost" id="btn-comparativo" onClick={verComparativo}>Ver comparativo</button>
          {user?.rol !== 'jop' && <Link to={`/ordenes/${otId}/costos`} className="btn btn-ghost" id="link-costos">Costos</Link>}
        </div>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid var(--border)' }}>
        {TABS.map(([k, label]) => (
          <button key={k} className={'btn btn-ghost tab-btn' + (tab === k ? ' active' : '')}
            style={{ borderRadius: 0, marginBottom: -2, borderBottom: tab === k ? '2px solid var(--primary)' : 'none' }}
            onClick={() => cambiarTab(k)}>{label}</button>
        ))}
      </div>

      {/* Tab: Consumos (CU-89B) */}
      {tab === 'consumos' && (
        <div className="tab-content" id="tab-consumos">
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th><th>Material</th><th>Unidad</th>
                    <th style={{ textAlign: 'right' }}>Estimado</th>
                    <th style={{ textAlign: 'right' }}>Real</th>
                    <th style={{ textAlign: 'right' }}>Varianza</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody id="consumos-body">
                  {!data && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32 }}>Cargando…</td></tr>}
                  {data && materiales.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>No hay materiales asignados a esta OT. Registre estimados o consumos desde las pestañas correspondientes.</td></tr>
                  )}
                  {data && materiales.length > 0 && !tieneConsumos && !tieneEstimados && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>Los materiales están asignados pero aún no se han registrado estimados ni consumos reales.</td></tr>
                  )}
                  {data && (tieneConsumos || tieneEstimados) && materiales.map(m => {
                    const est = m.estimado != null ? parseFloat(m.estimado) : null;
                    const real = m.real != null ? parseFloat(m.real) : null;
                    const varianza = m.varianza != null ? parseFloat(m.varianza) : null;
                    const color = varianza > 0 ? 'danger' : varianza < 0 ? 'success' : '';
                    const sinContraparte = est == null && real != null ? 'Solo real' : est != null && real == null ? 'Solo estimado' : '';
                    const inactivo = m.estado_material === 'inactivo' || m.estado_material === 'dado_de_baja';
                    return (
                      <tr key={m.sku} style={inactivo ? { opacity: 0.6 } : undefined}>
                        <td><code>{m.sku}</code></td>
                        <td>{m.nombre}{m.es_critico && <> <span className="badge badge-danger">Crítico</span></>}{inactivo && <> <span className="badge badge-gray" style={{ fontSize: 10 }}>Inactivo</span></>}</td>
                        <td>{m.unidad || '—'}</td>
                        <td style={{ textAlign: 'right' }}>{est != null ? est : '—'}</td>
                        <td style={{ textAlign: 'right' }}>{real != null ? real : '—'}</td>
                        <td style={{ textAlign: 'right' }}>{varianza != null ? <span className={`badge badge-${color}`}>{varianza > 0 ? '+' : ''}{varianza}</span> : '—'}</td>
                        <td>{sinContraparte ? <span style={{ color: 'var(--warning)', fontSize: 12 }}>{sinContraparte}</span> : <span className="badge badge-success">OK</span>}</td>
                        <td style={{ textAlign: 'center' }}>
                          {real != null && real > 0
                            ? <span style={{ color: 'var(--text-secondary)', fontSize: 11 }} title="No se puede eliminar: tiene consumo real">—</span>
                            : <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 11, color: 'var(--danger)' }} onClick={() => eliminarMaterialOT(m.sku)}>Eliminar</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Estimados (CU-91) */}
      {tab === 'estimados' && (
        <div className="tab-content" id="tab-estimados">
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{tituloEst}</div>
            <div id="estimados-form">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 12 }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 160 }}>
                  <label className="form-label">SKU</label>
                  <input className="form-control" id="est-sku" placeholder="Ej: MAT-001" value={estSku} onChange={e => setEstSku(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 100 }}>
                  <label className="form-label">Cantidad estimada</label>
                  <input className="form-control" type="number" id="est-cantidad" min={0} step="0.01" value={estCantidad} onChange={e => setEstCantidad(e.target.value)} />
                </div>
                <button className="btn btn-secondary" id="btn-add-est" onClick={agregarEstimado}>Agregar</button>
              </div>
              <div id="est-lista" style={{ marginBottom: 12 }}>
                {estPendientes.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <code>{e.sku}</code> → {e.cantidad_estimada}
                    <button className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: 11 }} onClick={() => setEstPendientes(p => p.filter((_, j) => j !== i))}>✕</button>
                  </div>
                ))}
              </div>
              {estPendientes.length > 0 && (
                <button className="btn btn-primary" id="btn-guardar-est" onClick={guardarEstimados}>{btnEstTxt}</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Registrar consumo (CU-89) */}
      {tab === 'registrar' && (
        <div className="tab-content" id="tab-registrar">
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Registrar consumo real</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 160 }}>
                <label className="form-label">SKU</label>
                <input className="form-control" id="reg-sku" placeholder="Ej: MAT-001" value={regSku} onChange={e => setRegSku(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 100 }}>
                <label className="form-label">Cantidad</label>
                <input className="form-control" type="number" id="reg-cantidad" min={0.01} step="0.01" value={regCantidad} onChange={e => setRegCantidad(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 120 }}>
                <label className="form-label">Bodega (opcional)</label>
                <select className="form-control" id="reg-bodega" value={regBodega} onChange={e => setRegBodega(e.target.value)}>
                  <option value="">Automática</option>
                  {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre || ('Bodega #' + b.id)}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" id="btn-registrar" onClick={() => enviarConsumo()}>Registrar</button>
            </div>
            <div id="reg-alert" style={{ marginTop: 12 }}>
              <Alert {...regAlert} />
              {conflicto && (
                <div className="alert alert-warning" style={{ fontSize: 13 }}>
                  <div style={{ marginBottom: 10 }}>
                    <strong>⚠ Este material ya tiene consumo registrado</strong><br />
                    Consumo actual: <b>{conflicto.consumo_actual}</b> · Cantidad nueva: <b>{conflicto.cantidad_nueva}</b>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" id="btn-sumar-consumo" onClick={() => enviarConsumo('sumar')}>Sumar (total: {conflicto.consumo_actual + conflicto.cantidad_nueva})</button>
                    <button className="btn btn-secondary btn-sm" id="btn-actualizar-consumo" onClick={() => enviarConsumo('actualizar')}>Actualizar a {conflicto.cantidad_nueva}</button>
                    <button className="btn btn-ghost btn-sm" id="btn-cancelar-consumo" onClick={() => setConflicto(null)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal comparativo (CU-92) */}
      {comp && (
        <div className="modal-overlay" id="modal-comparativo" style={{ display: 'flex' }}>
          <div className="modal" style={{ maxWidth: 800 }}>
            <div className="modal-header">
              <div className="modal-title">Comparativo Estimado vs Real</div>
              <button className="modal-close" id="cerrar-comparativo" onClick={() => setComp(null)}>×</button>
            </div>
            <div className="modal-body" id="comparativo-body">
              {comp.loading && 'Cargando…'}
              {comp.error}
              {comp.detalle && !tieneEstimadosComp && (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>No existe una base de comparación</div>
                  <div style={{ fontSize: 13 }}>Debe registrar estimados desde la pestaña "Estimados" antes de poder generar un comparativo.</div>
                </div>
              )}
              {comp.detalle && tieneEstimadosComp && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8, marginBottom: 16 }}>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Costo estimado</div><div style={{ fontWeight: 700 }}>{formatMoney(comp.resumen.costo_total_estimado)}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Costo real</div><div style={{ fontWeight: 700 }}>{formatMoney(comp.resumen.costo_total_real)}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Diferencia</div><div style={{ fontWeight: 700, color: comp.resumen.costo_total_real > comp.resumen.costo_total_estimado ? 'var(--danger)' : 'var(--success)' }}>{formatMoney(comp.resumen.costo_total_real - comp.resumen.costo_total_estimado)}</div></div>
                  </div>
                  <table className="table">
                    <thead><tr><th>SKU</th><th>Material</th><th style={{ textAlign: 'right' }}>Estimado</th><th style={{ textAlign: 'right' }}>Real</th><th style={{ textAlign: 'right' }}>Var.</th><th style={{ textAlign: 'right' }}>Var. %</th></tr></thead>
                    <tbody>
                      {comp.detalle.map(d => (
                        <tr key={d.sku}>
                          <td><code>{d.sku}</code></td><td>{d.nombre}</td>
                          <td style={{ textAlign: 'right' }}>{d.estimado ?? '—'}</td>
                          <td style={{ textAlign: 'right' }}>{d.real ?? '—'}</td>
                          <td style={{ textAlign: 'right' }}>{d.varianza != null ? (d.varianza > 0 ? '+' : '') + d.varianza : '—'}</td>
                          <td style={{ textAlign: 'right' }}>{d.varianza_pct != null ? d.varianza_pct + '%' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
