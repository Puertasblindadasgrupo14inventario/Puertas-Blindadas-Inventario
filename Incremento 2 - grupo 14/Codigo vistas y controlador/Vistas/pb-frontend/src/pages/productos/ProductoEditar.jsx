import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API } from '../../services/api';
import { useConfirm } from '../../hooks/useDialog';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';
import { CLAS_VACIA, subcategoriasDe, nivelesDe, ERR_FULL } from './clasificacion';

const UNIDADES_ESTATICAS = ['unidad', 'kg', 'm²', 'm³', 'litro', 'metro', 'caja', 'rollo'];

/** Editar Producto — conversión 1:1 de productos/editar.html (?sku= → /productos/:sku/editar) */
export default function ProductoEditar() {
  usePageTitle('Editar Producto');
  const { sku } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { alert, showAlert } = useAlert();

  const [unidades, setUnidades] = useState(null);   // null = opciones estáticas del HTML
  const [generales, setGenerales] = useState(null); // null = "Cargando..."
  const [funcionales, setFuncionales] = useState(null);
  const [clas, setClas] = useState(CLAS_VACIA);

  const [subtitle, setSubtitle] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidad, setUnidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [funcional, setFuncional] = useState('');
  const [critico, setCritico] = useState(false);
  const [clasCat, setClasCat] = useState('');
  const [clasSub, setClasSub] = useState('');
  const [clasNivel, setClasNivel] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [stockMax, setStockMax] = useState('');
  const [stockCritico, setStockCritico] = useState('');
  const [estado, setEstado] = useState('activo');
  const [saving, setSaving] = useState(false);

  const [errStyles, setErrStyles] = useState({});
  const clearErr = (campo) => setErrStyles(s => { const n = { ...s }; delete n[campo]; return n; });

  // CU-11 & CU-13: valores originales para detectar cambios
  const original = useRef({ cat: '', sub: '', nivel: '' });

  useEffect(() => {
    let cancelado = false;
    (async () => {
      if (!sku) { showAlert('danger', 'No se especificó un SKU para editar.'); return; }
      try {
        const [u, c] = await Promise.all([API.materiales.unidades(), API.materiales.categorias()]);
        let prod = null;
        try {
          prod = await API.materiales.obtener(sku);
        } catch (e) {
          if (!cancelado) showAlert('danger', `Error cargando producto SKU ${sku}: ${e.message}`);
          return;
        }
        if (cancelado) return;

        setUnidades(u || []);
        setGenerales(c?.generales || []);
        setFuncionales(c?.funcionales || []);
        const cl = c?.clasificacion || CLAS_VACIA;
        setClas(cl);

        if (prod) {
          setSubtitle(`SKU: ${prod.sku}`);
          setNombre(prod.nombre || '');
          setDescripcion(prod.descripcion || '');
          // Usar != null para no perder el valor 0
          setStockMin(prod.stock_minimo != null ? String(parseFloat(prod.stock_minimo)) : '');
          setStockMax(prod.stock_maximo != null ? String(parseFloat(prod.stock_maximo)) : '');
          setStockCritico(prod.stock_critico != null ? String(parseFloat(prod.stock_critico)) : '');
          setCritico(prod.es_critico || false);
          console.log('Producto cargado:', prod);

          // Pre-seleccionar por ID
          if (prod.unidad_medida_id)       setUnidad(String(prod.unidad_medida_id));
          if (prod.categoria_general_id)   setCategoria(String(prod.categoria_general_id));
          if (prod.categoria_funcional_id) setFuncional(String(prod.categoria_funcional_id));

          // Pre-seleccionar clasificación en cascada si el producto tiene nivel
          let oCat = '', oSub = '', oNivel = '';
          if (prod.clasificacion_nivel) {
            const nivel = cl.niveles.find(n => n.nombre === prod.clasificacion_nivel);
            if (nivel) {
              const sub = cl.subcategorias.find(s => s.id === nivel.subcategoria_id);
              if (sub) {
                oCat = String(sub.categoria_id); oSub = String(sub.id); oNivel = String(nivel.id);
                setClasCat(oCat); setClasSub(oSub); setClasNivel(oNivel);
              }
            }
          }
          original.current = { cat: oCat, sub: oSub, nivel: oNivel };
        } else {
          showAlert('danger', 'Producto no encontrado.');
        }
      } catch (err) {
        if (!cancelado) showAlert('danger', 'Error cargando datos: ' + err.message);
      }
    })();
    return () => { cancelado = true; };
  }, [sku, showAlert]);

  // Cascada
  const onClasCat = (v) => { setClasCat(v); setClasSub(''); setClasNivel(''); };
  const onClasSub = (v) => { setClasSub(v); setClasNivel(''); clearErr('clasSub'); };
  const subs = subcategoriasDe(clas, clasCat);
  const niveles = nivelesDe(clas, clasSub);
  const esColor = subs.find(s => String(s.id) === String(clasSub))?.es_color_custom === true;

  // CU-13: Confirmación al cambiar criticidad
  const onCriticoChange = async (nuevoValor) => {
    setCritico(nuevoValor);
    const ok = nuevoValor
      ? await confirm('¿Marcar este producto como crítico? Será priorizado en los monitores.', 'Cambiar criticidad')
      : await confirm('¿Desactivar la criticidad? Esto puede representar un riesgo operativo.', 'Cambiar criticidad');
    if (!ok) setCritico(!nuevoValor); // Revertir
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nombreVal = nombre.trim();

    // Limpiar bordes previos y marcar TODOS los inválidos
    const errs = {};
    const errores = [];
    if (!nombreVal || nombreVal.length < 3) { errs.nombre = ERR_FULL; errores.push('El nombre debe tener al menos 3 caracteres.'); }
    else if (nombreVal.length > 100) { errs.nombre = ERR_FULL; errores.push('El nombre no puede superar los 100 caracteres.'); }
    if (!unidad)    { errs.unidad = ERR_FULL;    errores.push('Selecciona la unidad de medida.'); }
    if (!categoria) { errs.categoria = ERR_FULL; errores.push('Selecciona la categoría general.'); }
    if (!funcional) { errs.funcional = ERR_FULL; errores.push('Selecciona la categoría funcional.'); }
    let error = errores.length > 0 ? errores.join(' ') : null;

    const min  = stockMin  !== '' ? parseFloat(stockMin)  : null;
    const max  = stockMax  !== '' ? parseFloat(stockMax)  : null;
    const crit = stockCritico !== '' ? parseFloat(stockCritico) : null;

    if (!error && min !== null && (isNaN(min) || min < 0)) {
      errs.stockMin = ERR_FULL; error = 'Stock mínimo debe ser mayor o igual a 0.';
    } else if (!error && max !== null && min !== null && max <= min) {
      errs.stockMax = ERR_FULL; error = 'Stock máximo debe ser mayor que el stock mínimo.';
    } else if (!error && crit !== null && (crit < 0 || (min !== null && crit >= min))) {
      errs.stockCritico = ERR_FULL; error = 'El stock crítico debe ser mayor o igual a 0 y menor al stock mínimo.';
    }
    setErrStyles(errs);
    if (error) { showAlert('danger', error); return; }

    // CU-11 Exc 2: Si se seleccionó categoría de clasificación, subcategoría es obligatoria
    if (clasCat && !clasSub) {
      setErrStyles({ clasSub: ERR_FULL });
      showAlert('danger', 'Debe seleccionar una subcategoría antes de guardar.');
      return;
    }

    // CU-11: Confirmar si la clasificación cambió
    const o = original.current;
    const cambio = clasCat !== o.cat || clasSub !== o.sub || clasNivel !== o.nivel;
    if (cambio && (o.cat || o.sub || o.nivel)) {
      const ok = await confirm('La clasificación del producto ha cambiado. ¿Desea reemplazar la clasificación existente?', 'Confirmar reclasificación');
      if (!ok) return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: nombreVal,
        descripcion:            descripcion.trim() || null,
        es_critico:             critico,
        unidad_medida_id:       unidad ? parseInt(unidad) : null,
        categoria_general_id:   categoria ? parseInt(categoria) : null,
        categoria_funcional_id: funcional ? parseInt(funcional) : null,
        estado:                 estado || 'activo',
      };
      if (min  !== null) payload.stock_minimo  = min;
      if (max  !== null) payload.stock_maximo  = max;
      if (crit !== null) payload.stock_critico = crit;
      if (clasNivel)     payload.clasificacion_nivel_especifico_id = parseInt(clasNivel);

      console.log('Enviando PUT:', sku, payload);
      await API.materiales.actualizar(sku, payload);
      showAlert('success', 'Producto actualizado correctamente.');
      setTimeout(() => navigate('/productos'), 1200);
    } catch (err) {
      console.error('Error al actualizar:', err);
      showAlert('danger', err.message || 'Error al actualizar el producto.');
      setSaving(false);
    }
  };

  const opts = (lista) => lista === null
    ? <option value="">Cargando...</option>
    : <><option value="">Seleccionar...</option>{lista.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</>;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Editar Producto</div>
          <div className="page-subtitle" id="edit-subtitle">{subtitle}</div>
        </div>
        <Link to="/productos" className="btn btn-secondary">← Volver al catálogo</Link>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      <form id="form-editar" noValidate onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card">
              <div className="section-label">Identificación</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">SKU <span className="hint">(no editable)</span></label>
                  <input className="form-control" id="sku" readOnly value={sku || ''} style={{ background: 'var(--gray-light,#f5f5f5)', cursor: 'default' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="unidad">Unidad de medida <span className="required">*</span></label>
                  <select className="form-control" id="unidad" required value={unidad} onChange={e => setUnidad(e.target.value)} style={errStyles.unidad}>
                    <option value="">Seleccionar...</option>
                    {unidades === null
                      ? UNIDADES_ESTATICAS.map(u => <option key={u}>{u}</option>)
                      : unidades.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre <span className="required">*</span></label>
                <input className="form-control" id="nombre" maxLength={100} required value={nombre} onChange={e => setNombre(e.target.value)} style={errStyles.nombre} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="descripcion">Descripción <span className="hint">(máx. 500)</span></label>
                <textarea className="form-control" id="descripcion" rows={3} maxLength={500} value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                <div className="form-counter"><span id="desc-count">{descripcion.length}</span>/500</div>
              </div>
            </div>

            <div className="card">
              <div className="section-label">Clasificación</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="categoria">Categoría general <span className="required">*</span></label>
                  <select className="form-control" id="categoria" required value={categoria} onChange={e => setCategoria(e.target.value)} style={errStyles.categoria}>
                    {opts(generales)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="funcional">Categoría funcional <span className="required">*</span></label>
                  <select className="form-control" id="funcional" required value={funcional} onChange={e => setFuncional(e.target.value)} style={errStyles.funcional}>
                    {opts(funcionales)}
                  </select>
                </div>
              </div>
              <label className="form-check">
                <input type="checkbox" id="critico" checked={critico} onChange={e => onCriticoChange(e.target.checked)} />
                Marcar como <strong>producto crítico</strong>
              </label>
            </div>

            {/* Clasificación específica en cascada */}
            <div className="card">
              <div className="section-label">Clasificación específica</div>
              <div className="form-group">
                <label className="form-label" htmlFor="clas-categoria">Categoría de clasificación</label>
                <select className="form-control" id="clas-categoria" value={clasCat} onChange={e => onClasCat(e.target.value)}>
                  {generales === null
                    ? <option value="">Cargando...</option>
                    : <><option value="">Seleccionar categoría...</option>{clas.categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</>}
                </select>
              </div>
              {clasCat && (
                <div className="form-group" id="grupo-subcategoria">
                  <label className="form-label" htmlFor="clas-subcategoria">Subcategoría</label>
                  <select className="form-control" id="clas-subcategoria" value={clasSub} onChange={e => onClasSub(e.target.value)} style={errStyles.clasSub}>
                    <option value="">Seleccionar subcategoría...</option>
                    {subs.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                  {esColor && (
                    <div className="form-hint" id="hint-color-custom" style={{ color: 'var(--orange)' }}>
                      Esta subcategoría admite colores personalizados
                    </div>
                  )}
                </div>
              )}
              {clasCat && clasSub && (
                <div className="form-group" id="grupo-nivel">
                  <label className="form-label" htmlFor="clas-nivel">Nivel específico</label>
                  <select className="form-control" id="clas-nivel" value={clasNivel} onChange={e => setClasNivel(e.target.value)}>
                    <option value="">Seleccionar nivel...</option>
                    {niveles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                  </select>
                </div>
              )}
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="section-label">Parámetros de stock</div>
              <div className="form-group">
                <label className="form-label" htmlFor="stockMin">Stock mínimo <span className="required">*</span></label>
                <input className="form-control" id="stockMin" type="number" min={1} required value={stockMin}
                  onChange={e => { setStockMin(e.target.value); clearErr('stockMin'); }} style={errStyles.stockMin} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="stockMax">Stock máximo <span className="required">*</span></label>
                <input className="form-control" id="stockMax" type="number" min={1} required value={stockMax}
                  onChange={e => { setStockMax(e.target.value); clearErr('stockMax'); }} style={errStyles.stockMax} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="stockCritico">Stock crítico <span className="required">*</span></label>
                <input className="form-control" id="stockCritico" type="number" min={0} required value={stockCritico}
                  onChange={e => { setStockCritico(e.target.value); clearErr('stockCritico'); }} style={errStyles.stockCritico} />
                <div className="form-hint">Debe ser ≤ stock mínimo</div>
              </div>
              <div className="divider"></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <Link to="/productos" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>Cancelar</Link>
            </div>

            {/* Estado del producto */}
            <div className="card">
              <div className="section-label">Estado del producto</div>
              <div className="form-group">
                <label className="form-label" htmlFor="estado">Estado</label>
                <select className="form-control" id="estado" value={estado} onChange={e => setEstado(e.target.value)}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <div className="form-hint">Inactivo oculta el producto del catálogo sin eliminarlo</div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  );
}
