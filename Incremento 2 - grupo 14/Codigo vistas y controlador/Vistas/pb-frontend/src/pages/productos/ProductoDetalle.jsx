import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API } from '../../services/api';
import { formatQty, formatMoney } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';

const DIAS = { semana: 7, mes: 30, trimestre: 90, anio: 365 };

/**
 * Detalle Producto — conversión 1:1 de productos/detalle.html (?sku= → /productos/:sku).
 * data-rol="gerencia": botón Editar, botón "+ Vincular proveedor" y su formulario (ocultos si rol === 'jop').
 */
export default function ProductoDetalle() {
  usePageTitle('Detalle Producto');
  const { sku } = useParams();
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();
  const esGerenciaVisible = user?.rol !== 'jop';

  const [prod, setProd] = useState(null);
  const [titulo, setTitulo] = useState('Cargando...');
  const [errorCarga, setErrorCarga] = useState('');
  const [periodo, setPeriodo] = useState('mes');
  const [movs, setMovs] = useState(null); // null = Cargando historial…
  const [provs, setProvs] = useState([]);
  const [formProv, setFormProv] = useState(false);
  const [provId, setProvId] = useState('');
  const [provTiempo, setProvTiempo] = useState('');
  const [provPrecio, setProvPrecio] = useState('');
  const [provAlert, setProvAlert] = useState(null); // { type, msg }

  const cargarDetalle = useCallback(async () => {
    if (!sku) { setTitulo('SKU no especificado'); return; }
    try {
      const p = await API.materiales.obtener(sku);
      console.log('Producto recibido:', p);
      if (!p || p.error) {
        setTitulo('Error');
        showAlert('danger', p?.error || 'No se pudo cargar el producto');
        return;
      }
      setProd(p);
      setTitulo(p.nombre || p.sku);
    } catch (err) {
      console.error('Error en cargarDetalle:', err);
      setTitulo('Error cargando producto');
      setErrorCarga('Error: ' + (err.message || err));
    }
  }, [sku, showAlert]);

  const cargarHistorial = useCallback(async () => {
    const desde = DIAS[periodo] ? new Date(Date.now() - DIAS[periodo] * 86400000).toISOString().split('T')[0] : null;
    try {
      const lista = await API.movimientos.listar({ buscar: sku, desde });
      setMovs(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.warn('Error cargando historial:', err.message);
    }
  }, [sku, periodo]);

  useEffect(() => {
    API.proveedores.listar().then(p => setProvs(p || [])).catch(() => {});
    cargarDetalle();
  }, [cargarDetalle]);

  // Historial de movimientos (FR-27): al cargar el producto y al cambiar el período
  useEffect(() => { if (prod) cargarHistorial(); }, [prod, cargarHistorial]);

  // CU-16: vincular proveedor al producto
  const vincularProveedor = async () => {
    if (!provId) { setProvAlert({ type: 'danger', msg: 'Seleccione un proveedor' }); return; }
    if (provTiempo && parseInt(provTiempo) < 1) { setProvAlert({ type: 'danger', msg: 'El tiempo de reposición debe ser de al menos 1 día' }); return; }
    try {
      const resp = await API.materiales.actualizar(sku, {
        vincular_proveedor: {
          proveedor_id: parseInt(provId),
          tiempo_reposicion: provTiempo ? parseInt(provTiempo) : null,
          precio_referencial: provPrecio ? parseFloat(provPrecio) : null,
        },
      });
      if (resp?.error) { setProvAlert({ type: 'danger', msg: resp.error }); return; }
      if (resp?.duplicado) setProvAlert({ type: 'warning', msg: resp.message || 'El proveedor ya se encuentra vinculado al producto.' });
      else setProvAlert({ type: 'success', msg: 'Proveedor vinculado correctamente' });
      setFormProv(false);
      cargarDetalle();
    } catch (err) { setProvAlert({ type: 'danger', msg: 'Error: ' + err.message }); }
  };

  // Derivados de stock
  const stockTotal = (prod?.stock_por_bodega || []).reduce((s, b) => s + parseFloat(b.cantidad_fisica || 0), 0);
  const min = parseFloat(prod?.stock_minimo || 0);
  const max = parseFloat(prod?.stock_maximo || 0);
  const crit = parseFloat(prod?.stock_critico || 0);
  let stockBadge = null;
  if (prod) {
    if (stockTotal <= crit)                stockBadge = <span className="badge badge-danger">Crítico</span>;
    else if (stockTotal <= min)            stockBadge = <span className="badge badge-warning">Bajo mínimo</span>;
    else if (max > 0 && stockTotal >= max) stockBadge = <span className="badge badge-info">Sobrestock</span>;
    else                                   stockBadge = <span className="badge badge-success">Normal</span>;
  }
  const proveedores = prod?.proveedores || [];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title" id="prod-nombre">{titulo}</div>
          <div className="page-subtitle" id="prod-sku">{prod ? 'SKU: ' + (prod.sku || sku) : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/productos" className="btn btn-secondary">← Volver</Link>
          {esGerenciaVisible && (
            <Link to={prod ? `/productos/${prod.sku}/editar` : '#'} className="btn btn-primary" id="btn-editar">Editar</Link>
          )}
        </div>
      </div>

      <div id="alert-container">
        <Alert {...alert} />
        {errorCarga && (
          <div style={{ padding: 12, background: '#f8d7da', color: '#721c24', borderRadius: 8, marginBottom: 16 }}>{errorCarga}</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Info principal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card">
            <div className="section-label">Identificación y clasificación</div>
            <div className="form-row" style={{ marginBottom: 16 }}>
              <div>
                <div className="form-label">SKU</div>
                <span className="td-mono" id="d-sku" style={{ fontSize: 13 }}>{prod?.sku}</span>
              </div>
              <div>
                <div className="form-label">Unidad de medida</div>
                <span style={{ fontSize: 14, fontWeight: 500 }} id="d-unidad">{prod ? (prod.unidad_medida || '—') : ''}</span>
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 16 }}>
              <div>
                <div className="form-label">Categoría general</div>
                <span className="badge badge-orange" id="d-categoria">{prod ? (prod.categoria_general || '—') : ''}</span>
              </div>
              <div>
                <div className="form-label">Categoría funcional</div>
                <span className="badge badge-gray" id="d-funcional">{prod ? (prod.categoria_funcional || '—') : ''}</span>
              </div>
            </div>
            <div>
              <div className="form-label">Producto crítico</div>
              <span className={'badge' + (prod ? (prod.es_critico ? ' badge-danger' : ' badge-gray') : '')} id="d-critico">
                {prod ? (prod.es_critico ? 'Sí — Producto crítico' : 'No') : ''}
              </span>
            </div>
          </div>

          <div className="card">
            <div className="section-label">Descripción</div>
            <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7 }} id="d-descripcion">{prod?.descripcion || 'Sin descripción.'}</p>
          </div>

          {/* Historial de movimientos del producto (FR-27) */}
          <div className="card">
            <div className="card-title">
              Historial de movimientos
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="form-control" id="hist-periodo" style={{ width: 'auto', fontSize: 12, padding: '4px 28px 4px 8px' }}
                  value={periodo} onChange={e => setPeriodo(e.target.value)}>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mes</option>
                  <option value="trimestre">Último trimestre</option>
                  <option value="anio">Último año</option>
                </select>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Fecha</th><th>Tipo</th><th>Cantidad</th><th>Bodega</th><th>Usuario</th></tr>
                </thead>
                <tbody id="tbody-historial">
                  {movs === null && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: 16 }}>Cargando historial…</td></tr>
                  )}
                  {movs !== null && movs.length === 0 && (
                    <tr><td colSpan={5}><div className="empty-state"><p>Sin movimientos en este período.</p></div></td></tr>
                  )}
                  {movs !== null && movs.map((m, i) => (
                    <tr key={m.id ?? i}>
                      <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.fecha_hora ? m.fecha_hora.split('T')[0] : '—'}</td>
                      <td><span className="badge badge-gray">{m.tipo || '—'}</span></td>
                      <td style={{ fontWeight: 600 }}>{parseFloat(m.cantidad || 0)}</td>
                      <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.bodega || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--gray)' }}>{m.usuario || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Lateral: stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-label">Estado de stock</div>

            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }} id="d-stockActual">{prod ? formatQty(stockTotal) : '—'}</div>
              <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }} id="d-unidad-label">{prod ? (prod.unidad_medida || 'unidades') + ' en stock físico' : ''}</div>
              <div style={{ marginTop: 12 }} id="d-stock-badge">{stockBadge}</div>
            </div>

            <div className="divider"></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--gray)' }}>Stock mínimo</span>
                <span style={{ fontWeight: 600 }} id="d-stockMin">{prod ? formatQty(prod.stock_minimo) : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--gray)' }}>Stock máximo</span>
                <span style={{ fontWeight: 600 }} id="d-stockMax">{prod ? formatQty(prod.stock_maximo) : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--gray)' }}>Stock crítico</span>
                <span style={{ fontWeight: 600, color: 'var(--danger)' }} id="d-stockCrit">{prod ? formatQty(prod.stock_critico) : '—'}</span>
              </div>
            </div>
          </div>

          {/* Stock por bodega (FR-17) */}
          <div className="card">
            <div className="section-label">Stock por bodega</div>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--gray)', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ textAlign: 'left', padding: '4px 0', fontWeight: 600 }}>Bodega</th>
                  <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 600 }}>Stock físico</th>
                  <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 600 }}>Reservado OT</th>
                </tr>
              </thead>
              <tbody id="tbody-stock-bodega">
                {!prod && <tr><td colSpan={3} style={{ color: 'var(--gray)', fontSize: 12 }}>Cargando...</td></tr>}
                {prod && (!prod.stock_por_bodega || prod.stock_por_bodega.length === 0) && (
                  <tr><td colSpan={3}><div className="empty-state"><p>Sin stock en bodegas.</p></div></td></tr>
                )}
                {prod && (prod.stock_por_bodega || []).map((b, i) => (
                  <tr key={b.bodega_id ?? i}>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{b.bodega_nombre}</td>
                    <td style={{ fontWeight: 600, textAlign: 'right' }}>{formatQty(b.cantidad_fisica)}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray)', textAlign: 'right' }}>{formatQty(b.cantidad_reservada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Proveedores del producto (CU-16, CU-17) */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Proveedores</div>
              {esGerenciaVisible && (
                <button className="btn btn-ghost btn-sm" id="btn-agregar-prov" style={{ fontSize: 11 }} onClick={() => setFormProv(v => !v)}>+ Vincular proveedor</button>
              )}
            </div>
            <div id="proveedores-lista" style={{ fontSize: 13 }}>
              {!prod && 'Cargando…'}
              {prod && proveedores.length === 0 && (
                <div style={{ color: 'var(--gray)', fontSize: 12, padding: '8px 0' }}>Sin proveedores vinculados. El producto no tendrá fuentes de reposición configuradas.</div>
              )}
              {prod && proveedores.map((p, i) => (
                <div key={p.id ?? i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {p.nombre || 'Proveedor #' + p.id}
                      {p.es_principal && <> <span className="badge badge-warning" style={{ fontSize: 10 }}>Principal</span></>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>
                      Tiempo repos.: {p.tiempo_reposicion ? <strong>{p.tiempo_reposicion} días</strong> : <span style={{ color: 'var(--warning)' }}>No registrado</span>}
                      {' '}· Precio ref.: {p.precio_referencial ? formatMoney(p.precio_referencial) : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Form agregar proveedor */}
            {esGerenciaVisible && formProv && (
              <div id="add-prov-form" style={{ marginTop: 12, padding: 12, background: 'var(--bg-alt)', borderRadius: 8 }}>
                <div id="add-prov-alert">
                  {provAlert && <div className={`alert alert-${provAlert.type}`} style={{ fontSize: 12 }}>{provAlert.msg}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 140 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Proveedor</label>
                    <select className="form-control" id="add-prov-select" value={provId} onChange={e => setProvId(e.target.value)}>
                      <option value="">Seleccione proveedor</option>
                      {provs.map(p => <option key={p.id} value={p.id}>{p.razon_social || p.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 80 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Tiempo repos. (días)</label>
                    <input className="form-control" type="number" id="add-prov-tiempo" min={1} placeholder="5" value={provTiempo} onChange={e => setProvTiempo(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 80 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Precio ref.</label>
                    <input className="form-control" type="number" id="add-prov-precio" min={0} step="0.01" placeholder="15000" value={provPrecio} onChange={e => setProvPrecio(e.target.value)} />
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={vincularProveedor}>Vincular</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
