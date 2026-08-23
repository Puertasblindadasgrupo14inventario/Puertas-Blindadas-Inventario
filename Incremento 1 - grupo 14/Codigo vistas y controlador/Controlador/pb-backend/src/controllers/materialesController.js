const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');

/**
 * GET /api/materiales
 * Lista todos los materiales con stock consolidado
 * Query params: ?buscar=&categoria=&estado=
 */
async function listar(req, res) {
  const { buscar, categoria, estado } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         m.material_sku                                        AS sku,
         m.material_nombre_material                            AS nombre,
         m.material_descripcion                                AS descripcion,
         m.material_estado                                     AS estado,
         m.material_material_critico                           AS es_critico,
         m.material_stock_minimo                               AS stock_minimo,
         m.material_stock_maximo                               AS stock_maximo,
         m.material_stock_critico                              AS stock_critico,
         m.material_presentacion                               AS presentacion,
         u.material_unidad_medida_nombre                       AS unidad_medida,
         cg.material_categoria_general_nombre                  AS categoria_general,
         cf.material_categoria_funcional_nombre                AS categoria_funcional,
         -- Stock consolidado: suma de todas las bodegas
         COALESCE(SUM(ib.inventario_bodega_cantidad_fisica), 0)    AS stock_total,
         COALESCE(SUM(ib.inventario_bodega_cantidad_reservada), 0) AS stock_reservado
       FROM material m
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_categoria_general cg
              ON cg.material_categoria_general_id_categoria_general = m.material_categoria_general_id_categoria_general
       LEFT JOIN material_categoria_funcional cf
              ON cf.material_categoria_funcional_id_categoria_funcional = m.material_categoria_funcional_id_categoria_funcional
       LEFT JOIN material_clasificacion_nivel_especifico cn
              ON cn.material_clasificacion_nivel_especifico_id = m.material_clasificacion_nivel_especifico_id
       LEFT JOIN material_clasificacion_subcategoria cs2
              ON cs2.material_clasificacion_subcategoria_id = cn.material_clasificacion_subcategoria_id
       LEFT JOIN material_clasificacion_categoria cc
              ON cc.material_clasificacion_categoria_id = cs2.material_clasificacion_categoria_id
       LEFT JOIN inventario_bodega ib
              ON ib.material_sku = m.material_sku
       WHERE ($1::text IS NULL OR
              m.material_sku ILIKE '%' || $1 || '%' OR
              m.material_nombre_material ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR cg.material_categoria_general_nombre ILIKE '%' || $2 || '%')
         AND ($3::text IS NULL OR m.material_estado = $3)
       GROUP BY
         m.material_sku, m.material_nombre_material, m.material_descripcion,
         m.material_estado, m.material_material_critico,
         m.material_stock_minimo, m.material_stock_maximo, m.material_stock_critico,
         m.material_presentacion,
         u.material_unidad_medida_nombre,
         cg.material_categoria_general_nombre,
         cf.material_categoria_funcional_nombre,
         cc.material_clasificacion_categoria_nombre_categoria,
         cs2.material_clasificacion_subcategoria_nombre_subcategoria,
         cn.material_clasificacion_nivel_especifico_nombre_nivel_especifico
       ORDER BY m.material_nombre_material`,
      [buscar || null, categoria || null, estado || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando materiales:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/materiales/:sku
 * Detalle de un material con stock por bodega
 */
async function obtener(req, res) {
  const { sku } = req.params;
  try {
    // Datos del material
    const { rows: mat } = await query(
      `SELECT
         m.material_sku                              AS sku,
         m.material_nombre_material                  AS nombre,
         m.material_descripcion                      AS descripcion,
         m.material_estado                           AS estado,
         m.material_material_critico                 AS es_critico,
         m.material_stock_minimo                     AS stock_minimo,
         m.material_stock_maximo                     AS stock_maximo,
         m.material_stock_critico                    AS stock_critico,
         m.material_presentacion                     AS presentacion,
         m.material_es_rotativo                                                    AS es_rotativo,
         m.material_clasificacion_nivel_especifico_id                             AS clasificacion_nivel_id,
         m.material_unidad_medida_id_unidad_medida                               AS unidad_medida_id,
         m.material_categoria_general_id_categoria_general                       AS categoria_general_id,
         m.material_categoria_funcional_id_categoria_funcional                   AS categoria_funcional_id,
         u.material_unidad_medida_nombre                                          AS unidad_medida,
         cg.material_categoria_general_nombre                                     AS categoria_general,
         cf.material_categoria_funcional_nombre                                   AS categoria_funcional,
         cc.material_clasificacion_categoria_nombre_categoria                     AS clasificacion_categoria,
         cs2.material_clasificacion_subcategoria_nombre_subcategoria              AS clasificacion_subcategoria,
         cn.material_clasificacion_nivel_especifico_nombre_nivel_especifico       AS clasificacion_nivel
       FROM material m
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_categoria_general cg
              ON cg.material_categoria_general_id_categoria_general = m.material_categoria_general_id_categoria_general
       LEFT JOIN material_categoria_funcional cf
              ON cf.material_categoria_funcional_id_categoria_funcional = m.material_categoria_funcional_id_categoria_funcional
       LEFT JOIN material_clasificacion_nivel_especifico cn
              ON cn.material_clasificacion_nivel_especifico_id = m.material_clasificacion_nivel_especifico_id
       LEFT JOIN material_clasificacion_subcategoria cs2
              ON cs2.material_clasificacion_subcategoria_id = cn.material_clasificacion_subcategoria_id
       LEFT JOIN material_clasificacion_categoria cc
              ON cc.material_clasificacion_categoria_id = cs2.material_clasificacion_categoria_id
       WHERE m.material_sku ILIKE $1`,
      [sku]
    );

    if (mat.length === 0) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Stock por bodega
    const { rows: stock } = await query(
      `SELECT
         b.bodega_id_bodega                        AS bodega_id,
         b.bodega_nombre_bodega                    AS bodega_nombre,
         b.bodega_estado                           AS bodega_estado,
         SUM(ib.inventario_bodega_cantidad_fisica)    AS cantidad_fisica,
         SUM(ib.inventario_bodega_cantidad_reservada) AS cantidad_reservada
       FROM inventario_bodega ib
       JOIN bodega b ON b.bodega_id_bodega = ib.bodega_id_bodega
       WHERE ib.material_sku = $1
       GROUP BY b.bodega_id_bodega, b.bodega_nombre_bodega, b.bodega_estado
       ORDER BY b.bodega_nombre_bodega`,
      [sku]
    );

    // Proveedores del material
    const { rows: proveedores } = await query(
      `SELECT
         p.proveedor_id_proveedor                    AS id,
         p.proveedor_razon_social                    AS nombre,
         mp.material_proveedor_tiempo_reposicion     AS tiempo_reposicion,
         mp.material_proveedor_precio_referencial    AS precio_referencial,
         mp.material_proveedor_proveedor_principal   AS es_principal
       FROM material_proveedor mp
       JOIN proveedor p ON p.proveedor_id_proveedor = mp.proveedor_id_proveedor
       WHERE mp.material_sku = $1
       ORDER BY mp.material_proveedor_proveedor_principal DESC`,
      [sku]
    );

    res.json({ ...mat[0], stock_por_bodega: stock, proveedores });
  } catch (err) {
    console.error('Error obteniendo material:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/materiales
 * Crear nuevo material
 */
async function crear(req, res) {
  const {
    sku, nombre, descripcion, presentacion,
    stock_minimo, stock_maximo, stock_critico,
    es_critico, es_rotativo, estado,
    unidad_medida_id, categoria_general_id, categoria_funcional_id
  } = req.body;

  if (!sku || !nombre || !unidad_medida_id) {
    return res.status(400).json({ error: 'SKU, nombre y unidad de medida son requeridos' });
  }

  // Forzar SKU en mayúsculas siempre
  const skuUpper = sku.toUpperCase();

  const { clasificacion_nivel_especifico_id } = req.body;

  try {
    // Verificar duplicado case-insensitive antes del INSERT
    const { rows: dup } = await query(
      `SELECT material_sku FROM material WHERE UPPER(material_sku) = $1`,
      [skuUpper]
    );
    if (dup.length > 0) {
      return res.status(409).json({ error: 'El SKU ya existe en el sistema' });
    }

    await query(
      `INSERT INTO material (
         material_sku, material_nombre_material, material_descripcion,
         material_presentacion, material_stock_minimo, material_stock_maximo,
         material_stock_critico, material_material_critico, material_es_rotativo,
         material_estado, material_unidad_medida_id_unidad_medida,
         material_categoria_general_id_categoria_general,
         material_categoria_funcional_id_categoria_funcional,
         material_clasificacion_nivel_especifico_id
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        skuUpper, nombre, descripcion || null, presentacion || null,
        stock_minimo != null ? parseFloat(stock_minimo) : null,
        stock_maximo != null ? parseFloat(stock_maximo) : null,
        stock_critico != null ? parseFloat(stock_critico) : null,
        Boolean(es_critico),
        es_rotativo !== false,
        estado || 'activo',
        parseInt(unidad_medida_id),
        categoria_general_id ? parseInt(categoria_general_id) : null,
        categoria_funcional_id ? parseInt(categoria_funcional_id) : null,
        clasificacion_nivel_especifico_id ? parseInt(clasificacion_nivel_especifico_id) : null
      ]
    );
    auditoria.registrar(req.user?.id, 'crear_material', `SKU: ${skuUpper} — ${nombre}`);
    res.status(201).json({ message: 'Material creado correctamente', sku });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El SKU ya existe en el sistema' });
    }
    console.error('Error creando material:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/materiales/:sku
 * Actualizar material (SKU no se puede cambiar)
 */
async function actualizar(req, res) {
  const { sku } = req.params;
  const {
    nombre, descripcion, presentacion,
    stock_minimo, stock_maximo, stock_critico,
    es_critico, es_rotativo, estado,
    unidad_medida_id, categoria_general_id, categoria_funcional_id
  } = req.body;

  try {
    const { rowCount } = await query(
      `UPDATE material SET
         material_nombre_material                              = COALESCE($1, material_nombre_material),
         material_descripcion                                  = $2,
         material_presentacion                                 = $3,
         material_stock_minimo                                 = $4,
         material_stock_maximo                                 = $5,
         material_stock_critico                                = $6,
         material_material_critico                             = COALESCE($7, material_material_critico),
         material_es_rotativo                                  = COALESCE($8, material_es_rotativo),
         material_estado                                       = COALESCE($9, material_estado),
         material_unidad_medida_id_unidad_medida               = COALESCE($10, material_unidad_medida_id_unidad_medida),
         material_categoria_general_id_categoria_general       = $11,
         material_categoria_funcional_id_categoria_funcional   = $12,
         material_clasificacion_nivel_especifico_id            = $13
       WHERE material_sku ILIKE $14`,
      [
        nombre || null,
        descripcion !== undefined ? (descripcion || null) : null,
        presentacion || null,
        stock_minimo != null ? parseFloat(stock_minimo) : null,
        stock_maximo != null ? parseFloat(stock_maximo) : null,
        stock_critico != null ? parseFloat(stock_critico) : null,
        es_critico != null ? Boolean(es_critico) : null,
        es_rotativo != null ? Boolean(es_rotativo) : null,
        estado || null,
        unidad_medida_id ? parseInt(unidad_medida_id) : null,
        categoria_general_id ? parseInt(categoria_general_id) : null,
        categoria_funcional_id ? parseInt(categoria_funcional_id) : null,
        req.body.clasificacion_nivel_especifico_id ? parseInt(req.body.clasificacion_nivel_especifico_id) : null,
        sku
      ]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    auditoria.registrar(req.user?.id, 'editar_material', `SKU: ${sku}`);
    res.json({ message: 'Material actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando material:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/materiales/catalogos/unidades
 * Lista unidades de medida para los formularios
 */
async function listarUnidades(req, res) {
  try {
    const { rows } = await query(
      `SELECT
         material_unidad_medida_id_unidad_medida AS id,
         material_unidad_medida_nombre           AS nombre
       FROM material_unidad_medida
       ORDER BY material_unidad_medida_nombre`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando unidades:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/materiales/catalogos/categorias
 * Lista categorías generales, funcionales y clasificación en cascada
 */
async function listarCategorias(req, res) {
  try {
    const [generales, funcionales, clasCateg, clasSub, clasNiv] = await Promise.all([
      query(`SELECT material_categoria_general_id_categoria_general AS id,
                    material_categoria_general_nombre AS nombre
             FROM material_categoria_general ORDER BY nombre`),
      query(`SELECT material_categoria_funcional_id_categoria_funcional AS id,
                    material_categoria_funcional_nombre AS nombre
             FROM material_categoria_funcional ORDER BY nombre`),
      query(`SELECT material_clasificacion_categoria_id AS id,
                    material_clasificacion_categoria_nombre_categoria AS nombre
             FROM material_clasificacion_categoria ORDER BY nombre`),
      query(`SELECT material_clasificacion_subcategoria_id AS id,
                    material_clasificacion_subcategoria_nombre_subcategoria AS nombre,
                    material_clasificacion_subcategoria_es_color_custom AS es_color_custom,
                    material_clasificacion_categoria_id AS categoria_id
             FROM material_clasificacion_subcategoria ORDER BY nombre`),
      query(`SELECT material_clasificacion_nivel_especifico_id AS id,
                    material_clasificacion_nivel_especifico_nombre_nivel_especifico AS nombre,
                    material_clasificacion_subcategoria_id AS subcategoria_id
             FROM material_clasificacion_nivel_especifico ORDER BY nombre`),
    ]);
    res.json({
      generales:      generales.rows,
      funcionales:    funcionales.rows,
      clasificacion:  {
        categorias:    clasCateg.rows,
        subcategorias: clasSub.rows,
        niveles:       clasNiv.rows,
      }
    });
  } catch (err) {
    console.error('Error listando categorias:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


/**
 * DELETE /api/materiales/:sku
 * Elimina un material si no tiene movimientos ni stock.
 * Si tiene movimientos o stock, solo lo desactiva (CU-04)
 * Solo gerencia puede ejecutar esta acción.
 */
async function eliminar(req, res) {
  const { sku } = req.params;
  try {
    // Verificar si tiene movimientos asociados
    const { rows: movs } = await query(
      `SELECT COUNT(*) AS total FROM movimiento_inventario WHERE material_sku = $1`, [sku]
    );
    // Verificar si tiene stock en alguna bodega
    const { rows: stock } = await query(
      `SELECT COALESCE(SUM(inventario_bodega_cantidad_fisica), 0) AS total
       FROM inventario_bodega WHERE material_sku = $1`, [sku]
    );

    const tieneMovimientos = parseInt(movs[0].total) > 0;
    const tieneStock       = parseFloat(stock[0].total) > 0;

    if (tieneMovimientos || tieneStock) {
      // Solo desactivar — no eliminar físicamente
      await query(
        `UPDATE material SET material_estado = 'inactivo' WHERE material_sku = $1`, [sku]
      );
      return res.json({
        eliminado: false,
        desactivado: true,
        message: 'El producto tiene ' +
          (tieneMovimientos ? 'movimientos asociados' : 'stock registrado') +
          '. Fue desactivado en lugar de eliminado.'
      });
    }

    // Sin movimientos ni stock: eliminar físicamente
    const { rowCount } = await query(
      `DELETE FROM material WHERE material_sku = $1`, [sku]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    return res.json({ eliminado: true, desactivado: false, message: 'Producto eliminado correctamente.' });
  } catch (err) {
    console.error('Error eliminando material:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar, listarUnidades, listarCategorias };
