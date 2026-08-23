require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./routes/auth');
const materialRoutes  = require('./routes/materiales');
const bodegaRoutes      = require('./routes/bodegas');
const movimientoRoutes  = require('./routes/movimientos');
const proveedorRoutes   = require('./routes/proveedores');
const reporteRoutes     = require('./routes/reportes');
const usuarioRoutes     = require('./routes/usuarios');
const pedidoRoutes      = require('./routes/pedidos');
const alertaRoutes      = require('./routes/alertas');
const auditoriaRoutes   = require('./routes/auditoria');
// const movimientoRoutes= require('./routes/movimientos');
// const proveedorRoutes = require('./routes/proveedores');
// const alertaRoutes    = require('./routes/alertas');
// const reporteRoutes   = require('./routes/reportes');
// const usuarioRoutes   = require('./routes/usuarios');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middlewares globales ─────────────────────────────── */
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5000'],
  credentials: true,
}));
app.use(express.json());

/* ── Rutas ───────────────────────────────────────────── */
app.use('/api/auth',       authRoutes);
app.use('/api/materiales',  materialRoutes);
app.use('/api/bodegas',      bodegaRoutes);
app.use('/api/movimientos',  movimientoRoutes);
app.use('/api/proveedores',  proveedorRoutes);
app.use('/api/reportes',     reporteRoutes);
app.use('/api/usuarios',     usuarioRoutes);
app.use('/api/pedidos',      pedidoRoutes);
app.use('/api/alertas',      alertaRoutes);
app.use('/api/auditoria',    auditoriaRoutes);
// app.use('/api/movimientos',  movimientoRoutes);
// app.use('/api/proveedores',  proveedorRoutes);
app.use('/api/reportes',     reporteRoutes);
app.use('/api/usuarios',     usuarioRoutes);
app.use('/api/pedidos',      pedidoRoutes);
app.use('/api/alertas',      alertaRoutes);
app.use('/api/auditoria',    auditoriaRoutes);
// app.use('/api/alertas',      alertaRoutes);
// app.use('/api/reportes',     reporteRoutes);
// app.use('/api/usuarios',     usuarioRoutes);
app.use('/api/pedidos',      pedidoRoutes);
app.use('/api/alertas',      alertaRoutes);
app.use('/api/auditoria',    auditoriaRoutes);

/* ── Health check ────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── 404 ─────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

/* ── Error handler global ────────────────────────────── */
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

/* ── Arrancar servidor ───────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
});
