const { query } = require('../db/pool');
const { notificarPorRol } = require('./notificacionesController');
const auditoria = require('./auditoriaController');

/**
 * POST /api/alertas-faltantes/generar
 * Revisa instalaciones a 48h y genera alertas si falta stock (CU-105)
 */
async function generar(req, res) {
  try {
    const generadas = await generarAlertasFaltantes();
    res.json({ message: `${generadas} alerta(s) de faltante generada(s)`, total: generadas });
  } catch (err) {
    console.error('Error generando alertas faltantes:', err);
    // CU-113 CP3: Informar que la verificación de faltantes no pudo completarse
    res.status(500).json({
      error: 'La verificación de faltantes no pudo completarse. Los datos de la agenda de instalaciones no están disponibles. Solicite reintentar.',
      reintentar: true
    });
  }
}

/**
 * Lógica central: revisa OTs con fecha próxima (48h) y detecta faltantes
 */
async function generarAlertasFaltantes() {
  // OTs con materiales, cruzando con stock disponible
  // Busca OTs cuyo proyecto tenga fecha de instalación en las próximas 48h
  const { rows: faltantes } = await query(
    `SELECT
       mot.material_sku                                AS sku,
       m.material_nombre_material                      AS nombre_material,
       mot.orden_trabajo_id_orden                      AS orden_id,
       ot.proyecto_id_proyecto                         AS proyecto_id,
       mot.material_orden_trabajo_consumo_estimado     AS requerido,
       COALESCE(stock.disponible, 0)                   AS disponible,
       -- Proveedor principal
       mp.proveedor_id_proveedor                       AS proveedor_id,
       mp.material_proveedor_tiempo_reposicion          AS tiempo_reposicion
     FROM material_orden_trabajo mot
     JOIN orden_trabajo ot ON ot.orden_trabajo_id_orden = mot.orden_trabajo_id_orden
     JOIN material m ON m.material_sku = mot.material_sku
     LEFT JOIN LATERAL (
       SELECT SUM(ib.inventario_bodega_cantidad_fisica) -
              SUM(ib.inventario_bodega_cantidad_reservada) AS disponible
       FROM inventario_bodega ib
       WHERE ib.material_sku = mot.material_sku
     ) stock ON TRUE
     LEFT JOIN material_proveedor mp
          ON mp.material_sku = mot.material_sku
         AND mp.material_proveedor_proveedor_principal = TRUE
     LEFT JOIN terreno.proyecto proy ON proy.id_proyecto = ot.proyecto_id_proyecto
     WHERE ot.orden_trabajo_estado NOT IN ('cancelada', 'finalizada', 'completada', 'listo')
       AND COALESCE(mot.material_orden_trabajo_consumo_estimado, 0) > COALESCE(stock.disponible, 0)
       AND proy.fecha_instalacion IS NOT NULL
       AND proy.fecha_instalacion BETWEEN NOW() AND NOW() + INTERVAL '48 hours'`
  );

  let generadas = 0;

  for (const f of faltantes) {
    // Verificar que no exista alerta activa para este material+OT
    const { rows: existe } = await query(
      `SELECT alerta_faltante_pedido_id_alerta_faltante FROM alerta_faltante_pedido
       WHERE material_sku = $1
         AND proyecto_id_proyecto IS NOT DISTINCT FROM $2
         AND alerta_faltante_pedido_estado IN ('activa', 'en_gestion', 'solicitud_emitida')`,
      [f.sku, f.proyecto_id || null]
    );
    if (existe.length > 0) continue;

    await query(
      `INSERT INTO alerta_faltante_pedido (
         alerta_faltante_pedido_cantidad_disponible,
         alerta_faltante_pedido_cantidad_requerida,
         alerta_faltante_pedido_horas_anticipacion,
         alerta_faltante_pedido_estado,
         material_sku,
         proveedor_id_proveedor,
         proyecto_id_proyecto
       ) VALUES ($1, $2, 48, 'activa', $3, $4, $5)`,
      [f.disponible, f.requerido, f.sku, f.proveedor_id || null, f.proyecto_id]
    );
    generadas++;
  }

  // Notificar al JOP si se generaron alertas
  if (generadas > 0) {
    notificarPorRol({
      tipo: 'alerta_faltante',
      mensaje: `Se detectaron ${generadas} producto(s) con stock insuficiente para pedidos próximos.`,
      origen: 'alertas_faltantes',
      rol: 'jop'
    });
  }

  return generadas;
}

/**
 * GET /api/alertas-faltantes
 * Lista alertas de faltante con filtros (CU-105, CU-106)
 * Query params: ?estado=&buscar=
 */
async function listar(req, res) {
  const { estado, buscar, horas } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         afp.alerta_faltante_pedido_id_alerta_faltante AS id,
         afp.alerta_faltante_pedido_fecha_generacion   AS fecha,
         COALESCE((SELECT SUM(ib.inventario_bodega_cantidad_fisica - ib.inventario_bodega_cantidad_reservada)
                   FROM inventario_bodega ib WHERE ib.material_sku = afp.material_sku), 0) AS cantidad_disponible,
         afp.alerta_faltante_pedido_cantidad_disponible AS cantidad_disponible_almacenada,
         afp.alerta_faltante_pedido_cantidad_requerida  AS cantidad_requerida,
         afp.alerta_faltante_pedido_horas_anticipacion  AS horas_anticipacion,
         afp.alerta_faltante_pedido_estado              AS estado,
         afp.material_sku                               AS sku,
         m.material_nombre_material                     AS material_nombre,
         m.material_material_critico                    AS es_critico,
         u_mat.material_unidad_medida_nombre            AS unidad,
         afp.proveedor_id_proveedor                     AS proveedor_id,
         p.proveedor_razon_social                       AS proveedor_nombre,
         mp.material_proveedor_tiempo_reposicion        AS tiempo_reposicion,
         afp.proyecto_id_proyecto                       AS proyecto_id,
         proy.codigo_proyecto                           AS proyecto_codigo,
         proy.nombre_referencia                         AS proyecto_nombre,
         proy.fecha_instalacion                          AS fecha_instalacion,
         afp.usuario_id_usuario                         AS resuelto_por_id,
         u.usuario_username                             AS resuelto_por
       FROM alerta_faltante_pedido afp
       JOIN material m ON m.material_sku = afp.material_sku
       LEFT JOIN material_unidad_medida u_mat
              ON u_mat.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN proveedor p ON p.proveedor_id_proveedor = afp.proveedor_id_proveedor
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = afp.material_sku
             AND mp.proveedor_id_proveedor = afp.proveedor_id_proveedor
       LEFT JOIN terreno.proyecto proy ON proy.id_proyecto = afp.proyecto_id_proyecto
       LEFT JOIN usuario u ON u.usuario_id_usuario = afp.usuario_id_usuario
       WHERE ($1::text IS NULL OR afp.alerta_faltante_pedido_estado = $1)
         AND ($2::text IS NULL OR
              afp.material_sku ILIKE '%' || $2 || '%' OR
              m.material_nombre_material ILIKE '%' || $2 || '%')
         AND ($3::text IS NULL OR afp.alerta_faltante_pedido_fecha_generacion >= NOW() - (($3::int) * INTERVAL '1 hour'))
       ORDER BY
         CASE afp.alerta_faltante_pedido_estado
           WHEN 'activa' THEN 0
           WHEN 'en_gestion' THEN 1
           WHEN 'solicitud_emitida' THEN 2
           ELSE 3
         END,
         afp.alerta_faltante_pedido_fecha_generacion ASC`,
      [estado || null, buscar || null, horas || null]
    );

    // CU-114 CP2: Actualizar proactivamente alertas activas cuyo stock real subió
    for (const row of rows) {
      if (row.estado === 'activa') {
        const almacenado = parseFloat(row.cantidad_disponible_almacenada || 0);
        const real = parseFloat(row.cantidad_disponible || 0);
        if (real > almacenado) {
          await query(
            `UPDATE alerta_faltante_pedido
             SET alerta_faltante_pedido_estado = 'en_gestion',
                 alerta_faltante_pedido_cantidad_disponible = $2
             WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
            [row.id, real]
          );
          row.estado = 'en_gestion';
        }
      }
    }

    res.json(rows);
  } catch (err) {
    console.error('Error listando alertas faltantes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/alertas-faltantes/:id
 * Detalle de un faltante con proveedor sugerido (CU-106)
 */
async function obtener(req, res) {
  const { id } = req.params;
  try {
    const { rows: alerta } = await query(
      `SELECT
         afp.alerta_faltante_pedido_id_alerta_faltante AS id,
         afp.alerta_faltante_pedido_estado              AS estado,
         afp.alerta_faltante_pedido_cantidad_disponible AS cantidad_disponible,
         afp.alerta_faltante_pedido_cantidad_requerida  AS cantidad_requerida,
         afp.material_sku                               AS sku,
         m.material_nombre_material                     AS material_nombre,
         m.material_material_critico                    AS es_critico,
         afp.proyecto_id_proyecto                       AS proyecto_id,
         proy.codigo_proyecto                           AS proyecto_codigo,
         proy.nombre_referencia                         AS proyecto_nombre
       FROM alerta_faltante_pedido afp
       JOIN material m ON m.material_sku = afp.material_sku
       LEFT JOIN terreno.proyecto proy ON proy.id_proyecto = afp.proyecto_id_proyecto
       WHERE afp.alerta_faltante_pedido_id_alerta_faltante = $1`,
      [id]
    );

    if (alerta.length === 0) {
      return res.status(404).json({ error: 'Alerta de faltante no encontrada' });
    }

    const a = alerta[0];

    // CU-106 Exc 1: verificar si el stock cambió recientemente
    const { rows: stockActual } = await query(
      `SELECT COALESCE(SUM(inventario_bodega_cantidad_fisica) -
                        SUM(inventario_bodega_cantidad_reservada), 0) AS disponible
       FROM inventario_bodega WHERE material_sku = $1`,
      [a.sku]
    );
    const disponibleActual = parseFloat(stockActual[0]?.disponible || 0);

    // Proveedores del producto con tiempos de entrega (CU-106)
    const { rows: proveedores } = await query(
      `SELECT
         p.proveedor_id_proveedor                  AS id,
         p.proveedor_razon_social                  AS nombre,
         p.proveedor_estado                        AS estado,
         mp.material_proveedor_tiempo_reposicion   AS tiempo_reposicion,
         mp.material_proveedor_precio_referencial  AS precio_referencial,
         mp.material_proveedor_proveedor_principal AS es_principal
       FROM material_proveedor mp
       JOIN proveedor p ON p.proveedor_id_proveedor = mp.proveedor_id_proveedor
       WHERE mp.material_sku = $1
       ORDER BY mp.material_proveedor_proveedor_principal DESC,
                mp.material_proveedor_tiempo_reposicion ASC NULLS LAST`,
      [a.sku]
    );

    // CU-114 CP2: Si el stock cambió, actualizar la alerta en BD
    let estado_resolucion = null;
    const disponibleAlmacenado = parseFloat(a.cantidad_disponible || 0);
    if (disponibleActual > disponibleAlmacenado && a.estado === 'activa') {
      // Stock aumentó y alerta estaba activa — marcar como en_gestion
      await query(
        `UPDATE alerta_faltante_pedido
         SET alerta_faltante_pedido_estado = 'en_gestion',
             alerta_faltante_pedido_cantidad_disponible = $2
         WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
        [a.id, disponibleActual]
      );
      a.estado = 'en_gestion';
      a.cantidad_disponible = disponibleActual;
      estado_resolucion = 'en_gestion';
    } else if (disponibleActual !== disponibleAlmacenado) {
      // Stock cambió pero no subió — solo actualizar cantidad almacenada
      await query(
        `UPDATE alerta_faltante_pedido
         SET alerta_faltante_pedido_cantidad_disponible = $2
         WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
        [a.id, disponibleActual]
      );
      a.cantidad_disponible = disponibleActual;
    }
    if (disponibleActual >= parseFloat(a.cantidad_requerida)) {
      estado_resolucion = 'en_resolucion';
    }

    res.json({
      ...a,
      stock_actual: disponibleActual,
      estado_resolucion,
      proveedores,
      sin_proveedores: proveedores.length === 0,
      proveedor_sin_tiempo: proveedores.length > 0 &&
        proveedores.every(p => !p.tiempo_reposicion)
    });
  } catch (err) {
    console.error('Error obteniendo alerta faltante:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/alertas-faltantes/:id/solicitud
 * Marca la alerta como "solicitud emitida" (CU-107)
 * Body: { proveedor_id? }
 */
async function emitirSolicitud(req, res) {
  const { id } = req.params;
  const { proveedor_id } = req.body;
  const userId = req.user.id;

  try {
    // Verificar que no exista solicitud duplicada (CU-107 Exc 2)
    const { rows: alerta } = await query(
      `SELECT alerta_faltante_pedido_estado AS estado,
              material_sku AS sku, proyecto_id_proyecto AS proyecto_id
       FROM alerta_faltante_pedido
       WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
      [id]
    );

    if (alerta.length === 0) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }

    if (alerta[0].estado === 'solicitud_emitida') {
      return res.status(400).json({
        error: 'Ya existe una solicitud de compra activa para este producto y pedido'
      });
    }

    // CU-115: Verificar que no exista otra alerta con solicitud emitida para mismo SKU+proyecto
    const { rows: duplicados } = await query(
      `SELECT alerta_faltante_pedido_id_alerta_faltante AS id
       FROM alerta_faltante_pedido
       WHERE material_sku = $1
         AND proyecto_id_proyecto IS NOT DISTINCT FROM $2
         AND alerta_faltante_pedido_estado = 'solicitud_emitida'
         AND alerta_faltante_pedido_id_alerta_faltante != $3`,
      [alerta[0].sku, alerta[0].proyecto_id, id]
    );

    if (duplicados.length > 0) {
      // CU-115 CP2: Suggest alternative proveedor instead of blocking
      const { rows: altProveedores } = await query(
        `SELECT p.proveedor_id_proveedor AS id, p.proveedor_razon_social AS nombre,
                mp.material_proveedor_tiempo_reposicion AS tiempo_reposicion
         FROM material_proveedor mp
         JOIN proveedor p ON p.proveedor_id_proveedor = mp.proveedor_id_proveedor
         WHERE mp.material_sku = $1
         ORDER BY mp.material_proveedor_proveedor_principal DESC,
                  mp.material_proveedor_tiempo_reposicion ASC NULLS LAST`,
        [alerta[0].sku]
      );
      return res.status(400).json({
        error: `Ya existe una solicitud de compra emitida (alerta #${duplicados[0].id}) para este material y proyecto.`,
        proveedores_alternativos: altProveedores.length > 1 ? altProveedores.slice(1) : [],
        sugerencia: 'Considere usar un proveedor alternativo o resolver la solicitud existente antes de emitir una nueva.'
      });
    }

    // Actualizar proveedor si se seleccionó uno distinto (CU-107 Exc 1)
    await query(
      `UPDATE alerta_faltante_pedido
       SET alerta_faltante_pedido_estado = 'solicitud_emitida',
           proveedor_id_proveedor = COALESCE($1, proveedor_id_proveedor),
           usuario_id_usuario = $2
       WHERE alerta_faltante_pedido_id_alerta_faltante = $3`,
      [proveedor_id || null, userId, id]
    );

    // Notificar a gerencia
    notificarPorRol({
      tipo: 'solicitud_compra',
      mensaje: `Solicitud de compra de emergencia emitida para ${alerta[0].sku}`,
      origen: 'alertas_faltantes',
      rol: 'gerencia'
    });

    auditoria.registrar(userId, 'emitir_solicitud_compra', `Alerta #${id}, SKU: ${alerta[0].sku}`);
    res.json({ message: 'Solicitud de compra de emergencia emitida correctamente' });
  } catch (err) {
    console.error('Error emitiendo solicitud:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/alertas-faltantes/:id/resolver
 * Cierra el ciclo de la alerta (CU-105B)
 * Body: { accion: 'resuelta'|'pospuesta'|'descartada', motivo: string }
 */
async function resolver(req, res) {
  const { id } = req.params;
  const { accion, motivo } = req.body;
  const userId = req.user.id;

  if (!accion || !['resuelta', 'pospuesta', 'descartada'].includes(accion)) {
    return res.status(400).json({ error: 'Acción debe ser: resuelta, pospuesta o descartada' });
  }

  // CU-105B Exc 2: motivo obligatorio
  if (!motivo || !motivo.trim()) {
    return res.status(400).json({ error: 'Debe ingresar un motivo de cierre' });
  }

  try {
    // CU-105B Exc 1: verificar que siga activa
    const { rows: alerta } = await query(
      `SELECT alerta_faltante_pedido_estado AS estado
       FROM alerta_faltante_pedido
       WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
      [id]
    );

    if (alerta.length === 0) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }

    if (['resuelta', 'descartada'].includes(alerta[0].estado)) {
      return res.status(400).json({
        error: 'La alerta ya fue resuelta o descartada por otro usuario'
      });
    }

    await query(
      `UPDATE alerta_faltante_pedido
       SET alerta_faltante_pedido_estado = $1,
           usuario_id_usuario = $2
       WHERE alerta_faltante_pedido_id_alerta_faltante = $3`,
      [accion, userId, id]
    );

    // Registrar en auditoría
    auditoria.registrar(userId, 'resolver_alerta_faltante', `Alerta #${id} → ${accion}: ${motivo}`);

    res.json({ message: `Alerta marcada como '${accion}' correctamente` });
  } catch (err) {
    console.error('Error resolviendo alerta faltante:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { generar, listar, obtener, emitirSolicitud, resolver, generarAlertasFaltantes };
