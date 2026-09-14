import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API } from '../../services/api';
import { formatMoney } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';

const lbl = { fontSize: 11, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 };

/**
 * Detalle Proveedor — conversión 1:1 de proveedores/detalle.html (?id= → /proveedores/:id).
 * data-rol="gerencia": columna "Precio referencial" (oculta si rol === 'jop').
 */
export default function ProveedorDetalle() {
  usePageTitle('Detalle Proveedor');
  const { id: provId } = useParams();
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();
  const verPrecio = user?.rol !== 'jop';

  const [p, setP] = useState(null);
  const [titulo, setTitulo] = useState('Cargando...');

  useEffect(() => {
    if (!provId) { showAlert('danger', 'ID de proveedor no especificado.'); return; }
    let cancelado = false;
    (async () => {
      try {
        const data = await API.proveedores.obtener(provId);
        if (cancelado) return;
        setP(data);
        setTitulo(data?.nombre || '—');
      } catch (err) {
        if (cancelado) return;
        showAlert('danger', 'Error cargando proveedor: ' + err.message);
        setTitulo('Error cargando proveedor');
      }
    })();
    return () => { cancelado = true; };
  }, [provId, showAlert]);

  const materiales = p?.materiales || [];
  const contactoNombre = p ? [p.contacto_nombre, p.contacto_apellido].filter(Boolean).join(' ') : '';

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title" id="prov-nombre">{titulo}</div>
          <div className="page-subtitle" id="prov-meta">{p ? `ID: ${p.id}` + (p.rut ? ` · RUT: ${p.rut}` : '') : ''}</div>
        </div>
        <Link to="/proveedores" className="btn btn-ghost">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
          Volver a proveedores
        </Link>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="section-label">Datos del proveedor</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={lbl}>RUT</div><div className="td-mono" id="prov-rut">{p?.rut || '—'}</div></div>
            <div><div style={lbl}>Tipo</div><div id="prov-tipo">{p?.tipo || '—'}</div></div>
            <div><div style={lbl}>Rubro</div><div id="prov-rubro">{p?.rubro || '—'}</div></div>
            <div><div style={lbl}>País</div><div id="prov-pais">{p?.pais || '—'}</div></div>
            <div>
              <div style={lbl}>Estado</div>
              <span className={'badge' + (p ? (['activo', 'activa'].includes(p.estado) ? ' badge-success' : ' badge-gray') : '')} id="prov-estado-badge">{p?.estado || '—'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-label">Contacto</div>
          <div style={{ marginBottom: 12 }}>
            <div style={lbl}>Persona de contacto</div>
            <div id="prov-contacto" style={{ fontWeight: 500 }}>{contactoNombre || '—'}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ ...lbl, marginBottom: 6 }}>Correos</div>
            <div id="prov-correos">
              {!p && '—'}
              {p && (p.correos?.length
                ? p.correos.map(c => <a key={c} href={`mailto:${c}`} style={{ color: 'var(--orange)', fontSize: 13, display: 'block' }}>{c}</a>)
                : <span style={{ color: 'var(--gray)', fontSize: 13 }}>Sin correos registrados</span>)}
            </div>
          </div>
          <div>
            <div style={{ ...lbl, marginBottom: 6 }}>Teléfonos</div>
            <div id="prov-telefonos">
              {!p && '—'}
              {p && (p.telefonos?.length
                ? p.telefonos.map(t => <span key={t} style={{ fontSize: 13, display: 'block' }}>{t}</span>)
                : <span style={{ color: 'var(--gray)', fontSize: 13 }}>Sin teléfonos registrados</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Materiales que provee */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Materiales suministrados (FR-41)</div>
          <div style={{ fontSize: 12, color: 'var(--gray)' }} id="materiales-count">{p ? `${materiales.length} material(es) asociado(s)` : ''}</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Material</th><th>Tiempo reposición</th>
                {verPrecio && <th>Precio referencial</th>}
                <th>Proveedor principal</th>
              </tr>
            </thead>
            <tbody id="tbody-materiales">
              {p && materiales.length === 0 && (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">📦</div><p>Este proveedor no tiene materiales asociados.</p></div></td></tr>
              )}
              {materiales.map(m => (
                <tr key={m.sku}>
                  <td><span className="td-mono">{m.sku}</span></td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>
                    <Link to={`/productos/${m.sku}`} style={{ color: 'inherit', textDecoration: 'none' }}>{m.nombre}</Link>
                  </td>
                  <td>
                    {m.tiempo_reposicion != null
                      ? <><span style={{ fontWeight: 600 }}>{Math.round(m.tiempo_reposicion)}</span> <span style={{ fontSize: 11, color: 'var(--gray)' }}>días</span></>
                      : <span style={{ color: 'var(--gray)' }}>—</span>}
                  </td>
                  {verPrecio && (
                    <td>
                      {m.precio_referencial != null
                        ? <span style={{ fontWeight: 500 }}>{formatMoney(m.precio_referencial)}</span>
                        : <span style={{ color: 'var(--gray)' }}>—</span>}
                    </td>
                  )}
                  <td>{m.es_principal ? <span className="badge badge-orange">Principal</span> : <span className="badge badge-gray">Secundario</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
