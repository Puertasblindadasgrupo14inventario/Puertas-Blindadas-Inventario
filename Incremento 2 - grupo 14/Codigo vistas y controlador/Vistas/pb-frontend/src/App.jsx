import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DialogProvider } from './components/DialogProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReservaLista from './pages/reservas/ReservaLista';
import ReporteValorizacion from './pages/reportes/ReporteValorizacion';
import PedidoSobrantes from './pages/pedidos/PedidoSobrantes';
import PinturaSobrantes from './pages/pinturas/PinturaSobrantes';
import ProductoLista from './pages/productos/ProductoLista';
import ProductoCrear from './pages/productos/ProductoCrear';
import ProductoEditar from './pages/productos/ProductoEditar';
import ProductoDetalle from './pages/productos/ProductoDetalle';
import BodegaLista from './pages/bodegas/BodegaLista';
import MovimientoEntrada from './pages/movimientos/MovimientoEntrada';
import MovimientoSalida from './pages/movimientos/MovimientoSalida';
import MovimientoHistorial from './pages/movimientos/MovimientoHistorial';
import Alertas from './pages/alertas/Alertas';
import Faltantes from './pages/alertas/Faltantes';
import PedidoChecklist from './pages/pedidos/PedidoChecklist';
import PedidoProgramacion from './pages/pedidos/PedidoProgramacion';
import OrdenLista from './pages/ordenes/OrdenLista';
import OrdenDetalle from './pages/ordenes/OrdenDetalle';
import OrdenCostos from './pages/ordenes/OrdenCostos';
import UsuarioLista from './pages/usuarios/UsuarioLista';
import UsuarioCrear from './pages/usuarios/UsuarioCrear';
import ProveedorLista from './pages/proveedores/ProveedorLista';
import ProveedorDetalle from './pages/proveedores/ProveedorDetalle';
import ReporteMovimientos from './pages/reportes/ReporteMovimientos';
import ReporteMermas from './pages/reportes/ReporteMermas';
import ReporteConsumoArea from './pages/reportes/ReporteConsumoArea';
import ReporteProgramacion from './pages/reportes/ReporteProgramacion';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DialogProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />

                <Route path="/productos"             element={<ProductoLista />} />
                <Route path="/productos/crear"       element={<ProductoCrear />} />
                <Route path="/productos/:sku"        element={<ProductoDetalle />} />
                <Route path="/productos/:sku/editar" element={<ProductoEditar />} />

                <Route path="/bodegas" element={<BodegaLista />} />

                <Route path="/movimientos/entrada"   element={<MovimientoEntrada />} />
                <Route path="/movimientos/salida"    element={<MovimientoSalida />} />
                <Route path="/movimientos/historial" element={<MovimientoHistorial />} />

                <Route path="/alertas"           element={<Alertas />} />
                <Route path="/alertas/faltantes" element={<Faltantes />} />

                <Route path="/proveedores"     element={<ProveedorLista />} />
                <Route path="/proveedores/:id" element={<ProveedorDetalle />} />

                <Route path="/pedidos/checklist"    element={<PedidoChecklist />} />
                <Route path="/pedidos/programacion" element={<PedidoProgramacion />} />
                <Route path="/pedidos/sobrantes"    element={<PedidoSobrantes />} />

                <Route path="/ordenes"            element={<OrdenLista />} />
                <Route path="/ordenes/:id"        element={<OrdenDetalle />} />
                <Route path="/ordenes/:id/costos" element={<OrdenCostos />} />

                <Route path="/reportes/movimientos"  element={<ReporteMovimientos />} />
                <Route path="/reportes/mermas"       element={<ReporteMermas />} />
                <Route path="/reportes/valorizacion" element={<ReporteValorizacion />} />
                <Route path="/reportes/consumo-area" element={<ReporteConsumoArea />} />
                <Route path="/reportes/programacion" element={<ReporteProgramacion />} />

                <Route path="/reservas"           element={<ReservaLista />} />
                <Route path="/pinturas/sobrantes" element={<PinturaSobrantes />} />

                <Route path="/usuarios"       element={<UsuarioLista />} />
                <Route path="/usuarios/crear" element={<UsuarioCrear />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DialogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
