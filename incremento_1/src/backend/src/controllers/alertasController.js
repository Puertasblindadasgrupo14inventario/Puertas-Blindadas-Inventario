const { query } = require('../db/pool');

/**
 * GET /api/alertas
 * Devuelve alertas activas calculadas en tiempo real desde el stock
 * cruzando con stock_minimo, stock_critico y tiempos de reposición (FR-32, FR-35)
 * Query params: ?prioridad=&estado=
 */
async function listar(req, res) {
  const { prioridad, estado } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         a.alerta_inventario_id_alerta                                           AS id,
         a.alerta_inventario_mensaje                                             AS mensaje,
         a.alerta_inventario_fecha_generacion                                    AS fecha_generacion,
         a.alerta_inventario_fecha_est_agotamiento                               AS fecha_est_agotamiento,
         a.alerta_inventario_estado                                              AS estado,
         a.material_sku                                                          AS sku,
         m.material_nombre_material                                              AS producto,
         m.material_material_critico                                             AS es_critico,
         m.material_stock_minimo                                                 AS stock_minimo,
         m.material_stock_critico                                                AS stock_critico,
         ta.alerta_inventario_tipo_alerta_nombre                                 AS tipo,
         np.alerta_inventario_prioridad_nombre                                   AS prioridad,
         -- Stock actual consolidado
         COALESCE(SUM(ib.inventario_bodega_cantidad_fisica), 0)                  AS stock_actual,
         -- Proveedor principal
         p.proveedor_razon_social                                                AS proveedor,
         mp.material_proveedor_tiempo_reposicion                                 AS tiempo_reposicion
       FROM alerta_inventario a
       JOIN material m ON m.material_sku = a.material_sku
       JOIN alerta_inventario_tipo_alerta ta
            ON ta.alerta_inventario_tipo_alerta_id_tipo_alerta = a.alerta_inventario_tipo_alerta_id_tipo_alerta
       JOIN alerta_inventario_nivel_prioridad np
            ON np.alerta_inventario_nivel_prioridad_id_nivel_prioridad = ta.alerta_inventario_nivel_prioridad_id
       LEFT JOIN inventario_bodega ib ON ib.material_sku = a.material_sku
       LEFT JOIN material_proveedor mp
            ON mp.material_sku = a.material_sku
           AND mp.material_proveedor_proveedor_principal = TRUE
       LEFT JOIN proveedor p ON p.proveedor_id_proveedor = mp.proveedor_id_proveedor
       WHERE ($1::text IS NULL OR np.alerta_inventario_prioridad_nombre ILIKE $1)
         AND ($2::text IS NULL OR a.alerta_inventario_estado ILIKE $2)
       GROUP BY
         a.alerta_inventario_id_alerta, a.alerta_inventario_mensaje,
         a.alerta_inventario_fecha_generacion, a.alerta_inventario_fecha_est_agotamiento,
         a.alerta_inventario_estado, a.material_sku,
         m.material_nombre_material, m.material_material_critico,
         m.material_stock_minimo, m.material_stock_critico,
         ta.alerta_inventario_tipo_alerta_nombre,
         np.alerta_inventario_prioridad_nombre,
         p.proveedor_razon_social,
         mp.material_proveedor_tiempo_reposicion
       ORDER BY
         CASE np.alerta_inventario_prioridad_nombre
           WHEN 'urgente' THEN 0
           WHEN 'alta'    THEN 1
           ELSE 2
         END,
         a.alerta_inventario_fecha_generacion DESC`,
      [prioridad || null, estado || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando alertas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/alertas/generar
 * Genera alertas automáticamente comparando stock actual vs umbrales (FR-32, FR-35)
 * Se llama después de cada movimiento de inventario
 */
async function generar(req, res) {
  try {
    const generadas = await generarAlertasAutomaticas();
    res.json({ message: `${generadas} alerta(s) generada(s)`, total: generadas });
  } catch (err) {
    console.error('Error generando alertas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Lógica central de generación de alertas (FR-32, FR-35)
 * Reutilizable desde movimientos también
 */
async function generarAlertasAutomaticas() {
  // Obtener tipos de alerta y niveles de prioridad
  const { rows: tipos } = await query(
    `SELECT ta.alerta_inventario_tipo_alerta_id_tipo_alerta AS id,
            ta.alerta_inventario_tipo_alerta_nombre AS nombre,
            np.alerta_inventario_nivel_prioridad_id_nivel_prioridad AS prioridad_id,
            np.alerta_inventario_prioridad_nombre AS prioridad_nombre
     FROM alerta_inventario_tipo_alerta ta
     JOIN alerta_inventario_nivel_prioridad np
          ON np.alerta_inventario_nivel_prioridad_id_nivel_prioridad = ta.alerta_inventario_nivel_prioridad_id`
  );

  // Stock actual por material
  const { rows: stocks } = await query(
    `SELECT
       m.material_sku                                                    AS material_sku,
       m.material_nombre_material                                        AS nombre,
       m.material_stock_minimo                                           AS stock_minimo,
       m.material_stock_critico                                          AS stock_critico,
       m.material_stock_maximo                                           AS stock_maximo,
       m.material_material_critico                                       AS es_critico,
       COALESCE(SUM(ib.inventario_bodega_cantidad_fisica), 0)            AS stock_actual,
       mp.material_proveedor_tiempo_reposicion                           AS tiempo_reposicion
     FROM material m
     LEFT JOIN inventario_bodega ib ON ib.material_sku = m.material_sku
     LEFT JOIN material_proveedor mp
          ON mp.material_sku = m.material_sku
         AND mp.material_proveedor_proveedor_principal = TRUE
     WHERE m.material_estado = 'activo'
       AND m.material_stock_minimo IS NOT NULL
     GROUP BY m.material_sku, m.material_nombre_material,
              m.material_stock_minimo, m.material_stock_critico,
              m.material_stock_maximo, m.material_material_critico,
              mp.material_proveedor_tiempo_reposicion`
  );

  let generadas = 0;
  const normalize = (str) => str.toLowerCase().replace(/_/g, ' ').trim();

  for (const s of stocks) {
    const stockActual = parseFloat(s.stock_actual);
    const stockMin    = parseFloat(s.stock_minimo  || 0);
    const stockCrit   = parseFloat(s.stock_critico || 0);
    const stockMax    = parseFloat(s.stock_maximo  || 0);
    const esCritico   = s.es_critico;
    const tiempoRep   = parseInt(s.tiempo_reposicion || 0);

    // Determinar si necesita alerta y qué tipo (FR-35)
    let tipoNombre = null;
    let prioridadNombre = 'media';

    if (stockActual <= stockCrit) {
      tipoNombre = 'stock critico';
      prioridadNombre = 'urgente';
    } else if (stockActual <= stockMin) {
      tipoNombre = 'stock bajo minimo';
      prioridadNombre = esCritico ? 'alta' : 'media';
    } else if (stockMax > 0 && stockActual > stockMax) {
      tipoNombre = 'stock maximo';
      prioridadNombre = 'media';
    } else if (tiempoRep > 0 && stockActual <= stockMin * 1.2) {
      tipoNombre = 'tiempo reposicion';
      prioridadNombre = 'media';
    }

    console.log(`[Alertas] ${s.material_sku}: stock=${stockActual} min=${stockMin} crit=${stockCrit} → tipo=${tipoNombre || 'ninguno'}`);
    if (!tipoNombre) continue;

    // Verificar si ya existe alerta activa para este material y tipo
    const tipo = tipos.find(t => normalize(t.nombre).includes(tipoNombre));
    if (!tipo) continue;

    const { rows: existe } = await query(
      `SELECT alerta_inventario_id_alerta FROM alerta_inventario
       WHERE material_sku = $1
         AND alerta_inventario_tipo_alerta_id_tipo_alerta = $2
         AND alerta_inventario_estado = 'activa'`,
      [s.material_sku, tipo.id]
    );

    if (existe.length > 0) continue; // Ya existe alerta activa

    // Crear historial para esta alerta (FR-37)
    const { rows: hist } = await query(
      `INSERT INTO historial_alerta DEFAULT VALUES
       RETURNING historial_alerta_id_historial AS id`
    );

    // Crear alerta
    await query(
      `INSERT INTO alerta_inventario (
         alerta_inventario_mensaje,
         alerta_inventario_estado,
         material_sku,
         alerta_inventario_tipo_alerta_id_tipo_alerta,
         historial_alerta_id_historial
       ) VALUES ($1, 'activa', $2, $3, $4)`,
      [
        `Stock actual (${stockActual}) ${tipoNombre === 'tiempo reposicion' ? 'próximo a umbral mínimo considerando tiempo de reposición' : tipoNombre === 'stock critico' ? 'en nivel crítico' : 'bajo el mínimo definido'}`,
        s.material_sku,
        tipo.id,
        hist[0].id
      ]
    );
    generadas++;
  }

  return generadas;
}

/**
 * PUT /api/alertas/:id/resolver
 * Marca una alerta como resuelta y registra la fecha (FR-37)
 */
async function resolver(req, res) {
  const { id } = req.params;
  try {
    // Actualizar historial con fecha de resolución
    await query(
      `UPDATE historial_alerta ha
       SET historial_alerta_fecha_hora_resolucion = now()
       FROM alerta_inventario a
       WHERE a.historial_alerta_id_historial = ha.historial_alerta_id_historial
         AND a.alerta_inventario_id_alerta = $1`,
      [id]
    );

    const { rowCount } = await query(
      `UPDATE alerta_inventario
       SET alerta_inventario_estado = 'resuelta'
       WHERE alerta_inventario_id_alerta = $1`,
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }
    res.json({ message: 'Alerta marcada como resuelta' });
  } catch (err) {
    console.error('Error resolviendo alerta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, generar, resolver, generarAlertasAutomaticas };
