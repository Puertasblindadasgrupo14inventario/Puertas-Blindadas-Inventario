import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';
import { ERR_FULL } from '../productos/clasificacion';

const CAMPOS = ['rut', 'nombre', 'contacto', 'email', 'telefono', 'rubro', 'direccion', 'obs'];
const VACIO = Object.fromEntries(CAMPOS.map(c => [c, '']));

/**
 * Directorio de Proveedores — conversión 1:1 de proveedores/lista.html.
 * data-rol="gerencia": botón "Nuevo proveedor" (oculto si rol === 'jop'); botón Editar solo si rol === 'gerencia'.
 * (El modal "Tiempos de entrega" del HTML no tiene ningún disparador, se omite.)
 */
export default function ProveedorLista() {
  usePageTitle('Proveedores');
  const { user } = useAuth();
  const { alert, showAlert } = useAlert();
  const isG = user?.rol === 'gerencia';

  const [search, setSearch] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [modal, setModal] = useState(false);
  const [f, setF] = useState(VACIO);
  const [errs, setErrs] = useState({});
  const [modalAlert, setModalAlert] = useState('');

  const cargarProveedores = useCallback(async () => {
    try {
      const data = await API.proveedores.listar({ buscar: search || null });
      setProveedores(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert('danger', 'Error cargando proveedores: ' + err.message);
    }
  }, [search, showAlert]);

  useEffect(() => { cargarProveedores(); }, [cargarProveedores]);

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (k === 'email') setErrs(x => ({ ...x, email: undefined })); };

  const guardar = async () => {
    const rut = f.rut.trim(), nombre = f.nombre.trim(), email = f.email.trim(), telefono = f.telefono.trim(), rubro = f.rubro.trim();
    setErrs({});
    if (!rut) { setErrs({ rut: ERR_FULL }); setModalAlert('El RUT es obligatorio.'); return; }
    if (!nombre) { setErrs({ nombre: ERR_FULL }); setModalAlert('El nombre es obligatorio.'); return; }
    if (!email) { setErrs({ email: ERR_FULL }); setModalAlert('El email es obligatorio.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) { setErrs({ email: ERR_FULL }); setModalAlert('El email no tiene un formato válido (ej: contacto@empresa.cl).'); return; }
    if (!telefono) { setErrs({ telefono: ERR_FULL }); setModalAlert('El teléfono es obligatorio.'); return; }
    if (!rubro) { setErrs({ rubro: ERR_FULL }); setModalAlert('El rubro es obligatorio.'); return; }
    try {
      await API.proveedores.crear({
        nombre,
        rut: rut || null,
        correos: email ? [email] : [],
        telefonos: telefono ? [telefono] : [],
        rubro,
        contacto_nombre: f.contacto.trim(),
      });
      setModal(false);
      setModalAlert('');
      setF(VACIO);
      cargarProveedores();
      showAlert('success', <>Proveedor <strong>{nombre}</strong> registrado correctamente.</>);
    } catch (err) {
      setModalAlert(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Directorio de Proveedores</div>
          <div className="page-subtitle">Registro, datos de contacto y tiempos de entrega (FR-22, FR-41)</div>
        </div>
        {user?.rol !== 'jop' && (
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo proveedor
          </button>
        )}
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      <div className="card card-sm" style={{ marginBottom: 16 }}>
        <div className="filter-row" style={{ marginBottom: 0 }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="search-input" placeholder="Buscar por nombre, RUT o rubro..." autoComplete="off" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>RUT</th><th>Nombre</th><th>Contacto</th><th>Email</th><th>Teléfono</th><th>Rubro</th><th>T. entrega prom.</th><th>Acciones</th></tr>
            </thead>
            <tbody id="tbody-proveedores">
              {proveedores.length === 0 && (
                <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon">🏢</div><p>No se encontraron proveedores.</p></div></td></tr>
              )}
              {proveedores.map(p => (
                <tr key={p.id}>
                  <td><span className="td-mono">{p.rut || '—'}</span></td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{p.nombre}</td>
                  <td style={{ fontSize: 13, color: 'var(--gray)' }}>{p.contacto || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--orange)' }}>{p.correo || '—'}</td>
                  <td style={{ fontSize: 13 }}>{p.telefono || '—'}</td>
                  <td><span className="badge badge-gray">{p.rubro || '—'}</span></td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{p.tiempo_entrega_promedio != null ? Math.round(p.tiempo_entrega_promedio) : '—'}</span>
                    <span style={{ fontSize: 11, color: 'var(--gray)' }}> días prom.</span>
                  </td>
                  <td>
                    <Link to={`/proveedores/${p.id}`} className="btn btn-ghost btn-sm btn-icon" title="Ver detalle">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </Link>
                    {isG && (
                      <button className="btn btn-ghost btn-sm btn-icon" title="Editar" onClick={() => showAlert('info', 'Función de edición disponible próximamente.')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal nuevo proveedor (FR-22) */}
      {modal && (
        <div className="modal-backdrop show" id="modal-nuevo" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <div><div className="modal-title">Registrar Proveedor</div><div className="modal-subtitle">Todos los campos marcados con * son obligatorios</div></div>
              <button className="modal-close" onClick={() => setModal(false)}>&#x2715;</button>
            </div>
            <div className="modal-body">
              <div id="modal-alert">{modalAlert && <div className="alert alert-danger">{modalAlert}</div>}</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="n-rut">RUT <span className="required">*</span></label>
                  <input className="form-control" id="n-rut" placeholder="76.543.210-1" value={f.rut} onChange={set('rut')} style={errs.rut} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="n-nombre">Nombre / Razón social <span className="required">*</span></label>
                  <input className="form-control" id="n-nombre" placeholder="Empresa S.A." value={f.nombre} onChange={set('nombre')} style={errs.nombre} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="n-contacto">Persona de contacto</label>
                  <input className="form-control" id="n-contacto" placeholder="Juan García" value={f.contacto} onChange={set('contacto')} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="n-email">Email <span className="required">*</span></label>
                  <input className="form-control" id="n-email" type="email" placeholder="contacto@empresa.cl" value={f.email} onChange={set('email')} style={errs.email} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="n-telefono">Teléfono <span className="required">*</span></label>
                  <input className="form-control" id="n-telefono" placeholder="+56 9 1234 5678" value={f.telefono} onChange={set('telefono')} style={errs.telefono} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="n-rubro">Rubro <span className="required">*</span></label>
                  <input className="form-control" id="n-rubro" placeholder="Metales y aceros" value={f.rubro} onChange={set('rubro')} style={errs.rubro} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="n-direccion">Dirección comercial</label>
                <input className="form-control" id="n-direccion" placeholder="Av. Providencia 1234, Santiago" value={f.direccion} onChange={set('direccion')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="n-obs">Observaciones</label>
                <textarea className="form-control" id="n-obs" rows={2} placeholder="Información adicional..." value={f.obs} onChange={set('obs')} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" id="btn-guardar-prov" onClick={guardar}>Registrar proveedor</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
