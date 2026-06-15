const { query } = require('../db/pool');

/**
 * GET /api/bodegas
 * Lista todas las bodegas con stock total consolidado
 */
async function listar(req, res) {
  try {
    const { rows } = await query(
      `SELECT
         b.bodega_id_bodega                                  AS id,
         b.bodega_nombre_bodega                              AS nombre,
         b.bodega_direccion                                  AS direccion,
         b.bodega_estado                                     AS estado,
         COUNT(DISTINCT ib.material_sku)                     AS total_skus,
         COALESCE(SUM(ib.inventario_bodega_cantidad_fisica), 0) AS total_unidades
       FROM bodega b
       LEFT JOIN inventario_bodega ib ON ib.bodega_id_bodega = b.bodega_id_bodega
       GROUP BY b.bodega_id_bodega, b.bodega_nombre_bodega, b.bodega_direccion, b.bodega_estado
       ORDER BY b.bodega_nombre_bodega`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando bodegas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/bodegas/:id
 * Detalle de bodega con stock de todos sus materiales
 */
async function obtener(req, res) {
  const { id } = req.params;
  try {
    // Datos de la bodega
    const { rows: bod } = await query(
      `SELECT
         bodega_id_bodega    AS id,
         bodega_nombre_bodega AS nombre,
         bodega_direccion    AS direccion,
         bodega_estado       AS estado
       FROM bodega
       WHERE bodega_id_bodega = $1`,
      [id]
    );

    if (bod.length === 0) {
      return res.status(404).json({ error: 'Bodega no encontrada' });
    }

    // Stock de materiales en esta bodega
    const { rows: stock } = await query(
      `SELECT
         m.material_sku                                       AS sku,
         m.material_nombre_material                           AS nombre,
         m.material_estado                                    AS estado_material,
         m.material_stock_minimo                              AS stock_minimo,
         m.material_stock_critico                             AS stock_critico,
         u.material_unidad_medida_nombre                      AS unidad_medida,
         SUM(ib.inventario_bodega_cantidad_fisica)            AS cantidad_fisica,
         SUM(ib.inventario_bodega_cantidad_reservada)         AS cantidad_reservada
       FROM inventario_bodega ib
       JOIN material m ON m.material_sku = ib.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       WHERE ib.bodega_id_bodega = $1
       GROUP BY m.material_sku, m.material_nombre_material, m.material_estado,
                m.material_stock_minimo, m.material_stock_critico,
                u.material_unidad_medida_nombre
       ORDER BY m.material_nombre_material`,
      [id]
    );

    // Anaqueles de la bodega
    const { rows: anaqueles } = await query(
      `SELECT anaquel_id_anaquel AS id, anaquel_descripcion AS descripcion
       FROM anaquel
       WHERE bodega_id_bodega = $1
       ORDER BY anaquel_id_anaquel`,
      [id]
    );

    res.json({ ...bod[0], materiales: stock, anaqueles });
  } catch (err) {
    console.error('Error obteniendo bodega:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/bodegas
 * Crear nueva bodega
 */
async function crear(req, res) {
  const { nombre, codigo, direccion, estado } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la bodega es requerido' });
  }
  if (!codigo) {
    return res.status(400).json({ error: 'El código de la bodega es requerido' });
  }

  try {
    // Verificar duplicado por nombre
    const { rows: dupNombre } = await query(
      `SELECT bodega_id_bodega FROM bodega WHERE bodega_nombre_bodega ILIKE $1`,
      [nombre]
    );
    if (dupNombre.length > 0) {
      return res.status(409).json({ error: 'Ya existe una bodega con ese nombre' });
    }

    const { rows } = await query(
      `INSERT INTO bodega (bodega_nombre_bodega, bodega_direccion, bodega_estado)
       VALUES ($1, $2, $3)
       RETURNING bodega_id_bodega AS id`,
      [nombre, direccion || null, estado || 'activa']
    );
    res.status(201).json({ message: 'Bodega creada correctamente', id: rows[0].id });
  } catch (err) {
    console.error('Error creando bodega:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/bodegas/:id
 * Actualizar bodega
 */
async function actualizar(req, res) {
  const { id } = req.params;
  const { nombre, direccion, estado } = req.body;

  try {
    const { rowCount } = await query(
      `UPDATE bodega SET
         bodega_nombre_bodega = COALESCE($1, bodega_nombre_bodega),
         bodega_direccion     = $2,
         bodega_estado        = COALESCE($3, bodega_estado)
       WHERE bodega_id_bodega = $4`,
      [nombre || null, direccion || null, estado || null, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Bodega no encontrada' });
    }
    res.json({ message: 'Bodega actualizada correctamente' });
  } catch (err) {
    console.error('Error actualizando bodega:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/bodegas/:id/stock-consolidado
 * Stock consolidado de la bodega (FR-16, FR-17)
 */
async function stockConsolidado(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await query(
      `SELECT
         m.material_sku                                         AS sku,
         m.material_nombre_material                             AS nombre,
         u.material_unidad_medida_nombre                        AS unidad,
         SUM(ib.inventario_bodega_cantidad_fisica)              AS stock_fisico,
         SUM(ib.inventario_bodega_cantidad_reservada)           AS stock_reservado,
         SUM(ib.inventario_bodega_cantidad_fisica)
           - SUM(ib.inventario_bodega_cantidad_reservada)       AS stock_disponible,
         m.material_stock_minimo                                AS minimo,
         m.material_stock_critico                               AS critico,
         CASE
           WHEN SUM(ib.inventario_bodega_cantidad_fisica) <= m.material_stock_critico THEN 'critico'
           WHEN SUM(ib.inventario_bodega_cantidad_fisica) <= m.material_stock_minimo  THEN 'bajo'
           ELSE 'normal'
         END AS estado_stock
       FROM inventario_bodega ib
       JOIN material m ON m.material_sku = ib.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       WHERE ib.bodega_id_bodega = $1
       GROUP BY m.material_sku, m.material_nombre_material,
                u.material_unidad_medida_nombre,
                m.material_stock_minimo, m.material_stock_critico
       ORDER BY estado_stock DESC, m.material_nombre_material`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error obteniendo stock consolidado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, obtener, crear, actualizar, stockConsolidado };
