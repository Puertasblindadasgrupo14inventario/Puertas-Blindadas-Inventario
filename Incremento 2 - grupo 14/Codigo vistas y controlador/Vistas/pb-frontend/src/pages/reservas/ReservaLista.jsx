import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../services/api';
import { formatQty } from '../../utils/format';
import { usePageTitle } from '../../contexts/TitleContext';
import Alert, { useAlert } from '../../components/Alert';

/** Reservas de Stock — conversión 1:1 de reservas/lista.html */
export default function ReservaLista() {
  usePageTitle('Gestión de Reservas');
  const { alert, showAlert } = useAlert();

  const [estado, setEstado] = useState('activa');
  const [buscar, setBuscar] = useState('');
  const [reservas, setReservas] = useState(null); // null = Cargando…
  const [accionPendiente, setAccionPendiente] = useState(null); // { id, tipo, sku, cantidad }

  const cargarReservas = useCallback(async () => {
    try {
      const data = await API.reservas.listar({ estado, buscar: buscar.trim() });
      if (data?.error) { showAlert('danger', data.error); return; }
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert('danger', 'Error: ' + err.message);
    }
  }, [estado, buscar, showAlert]);

  // Carga inicial (el HTML solo recarga al pulsar "Filtrar")
  useEffect(() => { cargarReservas(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const confirmarAccion = (id, tipo, sku, cantidad) => setAccionPendiente({ id, tipo, sku, cantidad });
  const cerrarModal = () => setAccionPendiente(null);

  const aceptar = async () => {
    if (!accionPendiente) return;
    const { id, tipo } = accionPendiente;
    setAccionPendiente(null);
    try {
      const resp = tipo === 'liberar' ? await API.reservas.liberar(id) : await API.reservas.anular(id);
      if (resp?.error) {
        showAlert('danger', resp.error);
      } else {
        showAlert('success', resp?.message);
        cargarReservas();
      }
    } catch (err) {
      showAlert('danger', 'Error: ' + err.message);
    }
  };

  const verbo = accionPendiente?.tipo === 'liberar' ? 'liberar' : 'anular';

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reservas de Stock</div>
          <div className="page-subtitle">Gestión y liberación de reservas vinculadas a pedidos</div>
        </div>
      </div>

      <div id="alert-container"><Alert {...alert} /></div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 140 }}>
            <label className="form-label">Estado</label>
            <select className="form-control" id="filter-estado" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="activa">Activas</option>
              <option value="liberada">Liberadas</option>
              <option value="anulada">Anuladas</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 200 }}>
            <label className="form-label">Buscar (SKU / nombre)</label>
            <input className="form-control" id="filter-buscar" placeholder="Buscar…" value={buscar} onChange={e => setBuscar(e.target.value)} />
          </div>
          <button className="btn btn-primary" id="btn-filtrar" onClick={cargarReservas}>Filtrar</button>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>Material</th>
                <th style={{ textAlign: 'right' }}>Cantidad</th>
                <th>Unidad</th>
                <th>OT</th>
                <th>Proyecto</th>
                <th>Fecha reserva</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tabla-body">
              {reservas === null && (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>Cargando…</td></tr>
              )}
              {reservas !== null && reservas.length === 0 && (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>No se encontraron reservas</td></tr>
              )}
              {reservas !== null && reservas.map(r => {
                const esActiva = r.estado === 'activa';
                const badgeClass = r.estado === 'activa' ? 'badge-warning'
                                 : r.estado === 'liberada' ? 'badge-success'
                                 : 'badge-ghost';
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td><code>{r.sku}</code></td>
                    <td>
                      {r.material_nombre}
                      {r.es_critico && <> <span className="badge badge-danger" style={{ fontSize: 10 }}>Crítico</span></>}
                    </td>
                    <td style={{ textAlign: 'right' }}>{formatQty(r.cantidad)}</td>
                    <td>{r.unidad || '—'}</td>
                    <td>{r.orden_id ? <Link to={`/ordenes/${r.orden_id}`}>#{r.orden_id}</Link> : '—'}</td>
                    <td>{r.proyecto_codigo ? r.proyecto_codigo + ' ' + (r.proyecto_nombre || '') : '—'}</td>
                    <td>{new Date(r.fecha_reserva).toLocaleDateString('sv-SE')}</td>
                    <td><span className={`badge ${badgeClass}`}>{r.estado}</span></td>
                    <td>
                      {esActiva ? (
                        <>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => confirmarAccion(r.id, 'liberar', r.sku, r.cantidad)}>Liberar</button>
                          {' '}
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--danger)' }}
                            onClick={() => confirmarAccion(r.id, 'anular', r.sku, r.cantidad)}>Anular</button>
                        </>
                      ) : r.fecha_liberacion ? new Date(r.fecha_liberacion).toLocaleDateString('sv-SE') : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal confirmación */}
      {accionPendiente && (
        <div className="modal-overlay" id="modal-confirmar" style={{ display: 'flex' }}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div className="modal-title" id="modal-titulo">{accionPendiente.tipo === 'liberar' ? 'Liberar reserva' : 'Anular reserva'}</div>
              <button className="modal-close" id="modal-cerrar" onClick={cerrarModal}>×</button>
            </div>
            <div className="modal-body">
              <p id="modal-mensaje">
                {`¿Confirma que desea ${verbo} la reserva #${accionPendiente.id} de ${accionPendiente.cantidad} unidades de ${accionPendiente.sku}? `}
                {accionPendiente.tipo === 'liberar' ? 'El stock reservado volverá a estar disponible.' : 'Esta acción no se puede deshacer.'}
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                <button className="btn btn-ghost" id="modal-cancelar" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-primary" id="modal-aceptar" onClick={aceptar}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
