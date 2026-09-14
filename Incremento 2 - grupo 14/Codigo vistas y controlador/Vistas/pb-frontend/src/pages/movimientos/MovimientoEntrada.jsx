import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';
import { ERR_BORDER, ERR_FULL } from '../productos/clasificacion';

const hoy = () => new Date().toISOString().slice(0, 10);
const esActiva = (b) => ['activo', 'activa'].includes(b.estado);

/** Registrar Entrada — conversión 1:1 de movimientos/entrada.html */
export default function MovimientoEntrada() {
  usePageTitle('Registrar Entrada');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();

  const [materiales, setMateriales] = useState(null);
  const [bodegas, setBodegas] = useState(null);
  const [proveedores, setProveedores] = useState(null);
  const [tipoEntradaId, setTipoEntradaId] = useState(null);

  const [sku, setSku] = useState('');
  const [bodega, setBodega] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(hoy());
  const [proveedor, setProveedor] = useState('');
  const [facturaNumero, setFacturaNumero] = useState('');
  const [facturaFecha, setFacturaFecha] = useState('');
  const [fechaPedido, setFechaPedido] = useState('');
  const [errStyles, setErrStyles] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null); // null | 'error' | { total, min, unidad }

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const [m, b, p, catalogos] = await Promise.all([
          API.materiales.listar(),
          API.bodegas.listar(),
          API.proveedores.listar(),
          API.movimientos.catalogos(),
        ]);
        if (cancelado) return;
        setMateriales(m || []);
        setBodegas((b || []).filter(esActiva));
        setProveedores(p || []);
        // Tipo movimiento: solo entradas
        const tipos = (catalogos?.tipos || []).filter(t => t.nombre.toLowerCase().includes('entrada'));
        setTipoEntradaId(tipos[0]?.id ?? null);
      } catch (err) {
        if (!cancelado) showAlert('danger', 'Error cargando catálogos: ' + err.message);
      }
    })();
    return () => { cancelado = true; };
  }, [showAlert]);

  // Preview stock al seleccionar producto
  const onSkuChange = async (val) => {
    setSku(val);
    if (!val) { setPreview(null); return; }
    try {
      const mat = await API.materiales.obtener(val);
      const total = parseFloat(mat.stock_por_bodega?.reduce((s, b) => s + parseFloat(b.cantidad_fisica || 0), 0) || 0);
      const min = parseFloat(mat.stock_minimo || 0);
      setPreview({ total, min, unidad: mat.unidad_medida || 'unidades' });
    } catch {
      setPreview('error');
    }
  };

  // Cálculo tiempo entrega (FR-41)
  let tiempoEntrega = null;
  if (fechaPedido && fecha) {
    const dias = Math.round((new Date(fecha) - new Date(fechaPedido)) / 86400000);
    tiempoEntrega = dias < 0
      ? <span style={{ color: 'var(--danger)' }}>La fecha del pedido no puede ser posterior a la recepción.</span>
      : <>Tiempo de entrega: <strong>{dias} día(s)</strong></>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const cant = parseFloat(cantidad);
    const lote = null; // el HTML leía #lote opcionalmente; no existe en el formulario
    const errs = {};
    let errE = null;
    if (!sku)                          { errs.sku = ERR_BORDER; errE = 'Selecciona un producto.'; }
    else if (!bodega)                  { errs.bodega = ERR_BORDER; errE = 'Selecciona la bodega de destino.'; }
    else if (isNaN(cant) || cant <= 0) { errs.cantidad = ERR_FULL; errE = 'La cantidad debe ser mayor que 0.'; }
    else if (!proveedor)               { errs.proveedor = ERR_BORDER; errE = 'Debes seleccionar un proveedor.'; }
    else if (!tipoEntradaId)           { errE = 'No se encontró tipo de movimiento "entrada". Verifica la BD.'; }
    setErrStyles(errs);
    if (errE) { showAlert('danger', errE); return; }

    // CU-32: Validar datos de factura (ambos o ninguno)
    const fNum = facturaNumero.trim();
    if (fNum && !facturaFecha) { setErrStyles({ facturaFecha: ERR_BORDER }); showAlert('danger', 'Debe ingresar la fecha de emisión de la factura.'); return; }
    if (!fNum && facturaFecha) { setErrStyles({ facturaNumero: ERR_BORDER }); showAlert('danger', 'Debe ingresar el número de la factura.'); return; }
    // CU-32 Exc 2: fecha de factura no puede ser futura
    if (facturaFecha && facturaFecha > hoy()) { setErrStyles({ facturaFecha: ERR_BORDER }); showAlert('danger', 'La fecha de emisión de la factura no puede ser una fecha futura.'); return; }

    setSaving(true);
    try {
      await API.movimientos.entrada({
        sku,
        bodega_id:          parseInt(bodega),
        cantidad:           cant,
        proveedor_id:       parseInt(proveedor),
        numero_lote:        lote,
        tipo_movimiento_id: tipoEntradaId,
        // CU-32: factura de compra
        ...(fNum && { factura_numero: fNum }),
        ...(facturaFecha && { factura_fecha: facturaFecha }),
      });
      showAlert('success', 'Entrada registrada correctamente. El stock ha sido actualizado.');
      setTimeout(() => navigate('/movimientos/historial'), 1500);
    } catch (err) {
      showAlert('danger', err.message || 'Error al registrar la entrada.');
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Registrar Entrada</div>
          <div className="page-subtitle">Ingreso de stock al inventario (FR-18, FR-22)</div>
        </div>
        <Link to="/movimientos/historial" className="btn btn-secondary">← Volver al historial</Link>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>

        <form id="form-entrada" noValidate onSubmit={onSubmit}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-label">Datos del producto</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sku">SKU del producto <span className="required">*</span></label>
                <select className="form-control" id="sku" required value={sku} onChange={e => onSkuChange(e.target.value)} style={errStyles.sku}>
                  {materiales === null
                    ? <option value="">Cargando productos...</option>
                    : <><option value="">Seleccionar producto...</option>{materiales.map(m => <option key={m.sku} value={m.sku}>{m.sku} — {m.nombre}</option>)}</>}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="bodega">Bodega de destino <span className="required">*</span></label>
                <select className="form-control" id="bodega" required value={bodega} onChange={e => setBodega(e.target.value)} style={errStyles.bodega}>
                  {bodegas === null
                    ? <option value="">Cargando bodegas...</option>
                    : <><option value="">Seleccionar bodega...</option>{bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}</>}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cantidad">Cantidad ingresada <span className="required">*</span></label>
                <input className="form-control" id="cantidad" type="number" min={1} placeholder="0" required value={cantidad} onChange={e => setCantidad(e.target.value)} style={errStyles.cantidad} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fecha">Fecha del movimiento <span className="required">*</span></label>
                <input className="form-control" id="fecha" type="date" required value={fecha} onChange={e => setFecha(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-label">Proveedor (FR-22)</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="proveedor" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Proveedor asociado <span className="required">*</span></span>
                  <a href="/proveedores" target="_blank" rel="noopener" style={{ fontSize: 11, fontWeight: 400, color: 'var(--orange)' }}
                    onClick={e => { e.preventDefault(); window.open('/proveedores', '_blank'); }}>
                    + Crear nuevo proveedor
                  </a>
                </label>
                <select className="form-control" id="proveedor" required value={proveedor} onChange={e => setProveedor(e.target.value)} style={errStyles.proveedor}>
                  {proveedores === null
                    ? <option value="">Cargando proveedores...</option>
                    : <><option value="">Seleccionar proveedor...</option>{proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</>}
                </select>
                {/* CU-29 Excepción 1: hint si no hay proveedores */}
                {proveedores !== null && proveedores.length === 0 && (
                  <div className="form-hint" id="hint-proveedor-nuevo" style={{ color: 'var(--orange)' }}>
                    ¿No encuentras el proveedor? Créalo y vuelve a esta pantalla — se cargará automáticamente.
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="factura-numero">Nº Factura de compra</label>
                <input className="form-control" id="factura-numero" placeholder="FAC-2025-001" value={facturaNumero} onChange={e => setFacturaNumero(e.target.value)} style={errStyles.facturaNumero} />
                <div className="form-hint">Número de factura del proveedor (opcional)</div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="factura-fecha">Fecha emisión factura</label>
                <input className="form-control" id="factura-fecha" type="date" value={facturaFecha} onChange={e => setFacturaFecha(e.target.value)} style={errStyles.facturaFecha} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="fecha-pedido">Fecha del pedido <span style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 400 }}>(opcional)</span></label>
                <input className="form-control" id="fecha-pedido" type="date" value={fechaPedido} onChange={e => setFechaPedido(e.target.value)} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div id="tiempo-entrega-preview" style={{ fontSize: 13, color: 'var(--gray)', paddingBottom: 9 }}>{tiempoEntrega}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-label">Responsable</div>
            <div className="form-group">
              <label className="form-label">Usuario responsable</label>
              <input className="form-control" id="usuario" disabled value={user ? (user.username || user.id) : ''} readOnly />
              <div className="form-hint">Se asigna automáticamente con la sesión activa</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Link to="/movimientos/historial" className="btn btn-secondary">Cancelar</Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Registrando...' : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
                    Registrar entrada
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Sidebar informativo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-label">Método FIFO (FR — CU-37)</div>
            <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7 }}>
              Este ingreso creará un nuevo lote con fecha y precio de compra. Al registrar salidas, el sistema descontará primero los lotes más antiguos automáticamente.
            </p>
          </div>
          <div className="card">
            <div className="section-label">Stock actual del producto</div>
            <div id="stock-preview" style={{ textAlign: 'center', padding: '16px 0', color: 'var(--gray)' }}>
              {preview === null && <div style={{ fontSize: 12, color: 'var(--gray)' }}>Selecciona un producto</div>}
              {preview === 'error' && <div style={{ fontSize: 12, color: 'var(--gray)' }}>Error cargando stock</div>}
              {preview && preview !== 'error' && (
                <>
                  <div style={{ fontSize: 36, fontWeight: 700, color: preview.total <= preview.min ? 'var(--danger)' : 'var(--success)' }}>{preview.total}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{preview.unidad} disponibles</div>
                  <div style={{ fontSize: 11, marginTop: 4, color: 'var(--gray)' }}>mínimo: {preview.min}</div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
