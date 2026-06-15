const { query } = require('../db/pool');

/**
 * GET /api/proveedores
 * Lista proveedores con contacto principal y tiempo de entrega promedio
 */
async function listar(req, res) {
  const { buscar, estado } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         p.proveedor_id_proveedor                           AS id,
         p.proveedor_razon_social                           AS nombre,
         p.proveedor_rubro                                  AS rubro,
         p.proveedor_tipo_proveedor                         AS tipo,
         p.proveedor_pais                                   AS pais,
         p.proveedor_estado                                 AS estado,
         p.proveedor_doc_identidad_rut_proveedor_opcional   AS rut,
         CONCAT_WS(' ',
           p.proveedor_contacto_primer_nombre,
           p.proveedor_contacto_primer_apellido)            AS contacto,
         -- Primer teléfono
         (SELECT pct.proveedor_contacto_telefono
          FROM proveedor_contacto_telefono pct
          WHERE pct.proveedor_id_proveedor = p.proveedor_id_proveedor
          LIMIT 1)                                          AS telefono,
         -- Primer correo
         (SELECT pcc.proveedor_contacto_correo
          FROM proveedor_contacto_correo pcc
          WHERE pcc.proveedor_id_proveedor = p.proveedor_id_proveedor
          LIMIT 1)                                          AS correo,
         -- Tiempo de reposición promedio entre todos sus materiales (FR-41)
         ROUND(AVG(mp.material_proveedor_tiempo_reposicion), 1) AS tiempo_entrega_promedio,
         COUNT(DISTINCT mp.material_sku)                    AS total_materiales
       FROM proveedor p
       LEFT JOIN material_proveedor mp ON mp.proveedor_id_proveedor = p.proveedor_id_proveedor
       WHERE ($1::text IS NULL OR
              p.proveedor_razon_social ILIKE '%' || $1 || '%' OR
              p.proveedor_doc_identidad_rut_proveedor_opcional ILIKE '%' || $1 || '%' OR
              p.proveedor_rubro ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR p.proveedor_estado = $2)
       GROUP BY p.proveedor_id_proveedor
       ORDER BY p.proveedor_razon_social`,
      [buscar || null, estado || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando proveedores:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/proveedores/:id
 * Detalle de proveedor con materiales y tiempos de entrega
 */
async function obtener(req, res) {
  const { id } = req.params;
  try {
    // Datos del proveedor
    const { rows: prov } = await query(
      `SELECT
         proveedor_id_proveedor                            AS id,
         proveedor_razon_social                            AS nombre,
         proveedor_rubro                                   AS rubro,
         proveedor_tipo_proveedor                          AS tipo,
         proveedor_pais                                    AS pais,
         proveedor_estado                                  AS estado,
         proveedor_doc_identidad_rut_proveedor_opcional    AS rut,
         proveedor_doc_identidad_tipo_identificador        AS tipo_identificador,
         proveedor_doc_identidad_numero_identificador      AS numero_identificador,
         proveedor_contacto_primer_nombre                  AS contacto_nombre,
         proveedor_contacto_primer_apellido                AS contacto_apellido
       FROM proveedor WHERE proveedor_id_proveedor = $1`,
      [id]
    );

    if (prov.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Teléfonos
    const { rows: telefonos } = await query(
      `SELECT proveedor_contacto_telefono AS telefono
       FROM proveedor_contacto_telefono
       WHERE proveedor_id_proveedor = $1`, [id]
    );

    // Correos
    const { rows: correos } = await query(
      `SELECT proveedor_contacto_correo AS correo
       FROM proveedor_contacto_correo
       WHERE proveedor_id_proveedor = $1`, [id]
    );

    // Materiales que provee con tiempos de entrega (FR-41)
    const { rows: materiales } = await query(
      `SELECT
         m.material_sku                                  AS sku,
         m.material_nombre_material                      AS nombre,
         mp.material_proveedor_tiempo_reposicion         AS tiempo_reposicion,
         mp.material_proveedor_precio_referencial        AS precio_referencial,
         mp.material_proveedor_proveedor_principal       AS es_principal
       FROM material_proveedor mp
       JOIN material m ON m.material_sku = mp.material_sku
       WHERE mp.proveedor_id_proveedor = $1
       ORDER BY mp.material_proveedor_proveedor_principal DESC, m.material_nombre_material`,
      [id]
    );

    const esGerencia = req.user?.rol === 'gerencia';

    // FR-59: ocultar precio referencial para usuarios no gerencia
    const materialesFiltrados = materiales.map(m => {
      if (!esGerencia) {
        const { precio_referencial, ...sinPrecio } = m;
        return sinPrecio;
      }
      return m;
    });

    res.json({
      ...prov[0],
      telefonos: telefonos.map(t => t.telefono),
      correos:   correos.map(c => c.correo),
      materiales: materialesFiltrados
    });
  } catch (err) {
    console.error('Error obteniendo proveedor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/proveedores
 * Crear nuevo proveedor (FR-22)
 */
async function crear(req, res) {
  const {
    nombre, rubro, tipo, pais, estado,
    rut, tipo_identificador, numero_identificador,
    contacto_nombre, contacto_apellido,
    telefonos = [], correos = []
  } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'La razón social es requerida' });
  }

  try {
    // Verificar RUT único si se proporciona
    if (rut) {
      const { rows: rutExist } = await query(
        `SELECT proveedor_id_proveedor FROM proveedor
         WHERE proveedor_doc_identidad_rut_proveedor_opcional = $1`, [rut]
      );
      if (rutExist.length > 0) {
        return res.status(409).json({ error: 'El RUT ya está registrado en otro proveedor' });
      }
    }

    // Insertar proveedor
    const { rows } = await query(
      `INSERT INTO proveedor (
         proveedor_razon_social, proveedor_rubro, proveedor_tipo_proveedor,
         proveedor_pais, proveedor_estado,
         proveedor_doc_identidad_rut_proveedor_opcional,
         proveedor_doc_identidad_tipo_identificador,
         proveedor_doc_identidad_numero_identificador,
         proveedor_contacto_primer_nombre, proveedor_contacto_primer_apellido
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING proveedor_id_proveedor AS id`,
      [
        nombre, rubro || null, tipo || null, pais || null, estado || 'activo',
        rut || null, tipo_identificador || null, numero_identificador || null,
        contacto_nombre || null, contacto_apellido || null
      ]
    );

    const proveedorId = rows[0].id;

    // Insertar teléfonos
    for (const tel of telefonos) {
      if (tel?.trim()) {
        await query(
          `INSERT INTO proveedor_contacto_telefono VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [proveedorId, tel.trim()]
        );
      }
    }

    // Insertar correos
    for (const correo of correos) {
      if (correo?.trim()) {
        await query(
          `INSERT INTO proveedor_contacto_correo VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [proveedorId, correo.trim()]
        );
      }
    }

    res.status(201).json({ message: 'Proveedor creado correctamente', id: proveedorId });
  } catch (err) {
    console.error('Error creando proveedor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/proveedores/:id
 * Actualizar proveedor
 */
async function actualizar(req, res) {
  const { id } = req.params;
  const {
    nombre, rubro, tipo, pais, estado,
    rut, contacto_nombre, contacto_apellido,
    telefonos, correos
  } = req.body;

  try {
    const { rowCount } = await query(
      `UPDATE proveedor SET
         proveedor_razon_social                          = COALESCE($1, proveedor_razon_social),
         proveedor_rubro                                 = $2,
         proveedor_tipo_proveedor                        = $3,
         proveedor_pais                                  = $4,
         proveedor_estado                                = COALESCE($5, proveedor_estado),
         proveedor_doc_identidad_rut_proveedor_opcional  = $6,
         proveedor_contacto_primer_nombre                = $7,
         proveedor_contacto_primer_apellido              = $8
       WHERE proveedor_id_proveedor = $9`,
      [nombre || null, rubro || null, tipo || null, pais || null,
       estado || null, rut || null, contacto_nombre || null, contacto_apellido || null, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Actualizar teléfonos si se envían
    if (Array.isArray(telefonos)) {
      await query(`DELETE FROM proveedor_contacto_telefono WHERE proveedor_id_proveedor = $1`, [id]);
      for (const tel of telefonos) {
        if (tel?.trim()) {
          await query(
            `INSERT INTO proveedor_contacto_telefono VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, tel.trim()]
          );
        }
      }
    }

    // Actualizar correos si se envían
    if (Array.isArray(correos)) {
      await query(`DELETE FROM proveedor_contacto_correo WHERE proveedor_id_proveedor = $1`, [id]);
      for (const correo of correos) {
        if (correo?.trim()) {
          await query(
            `INSERT INTO proveedor_contacto_correo VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, correo.trim()]
          );
        }
      }
    }

    res.json({ message: 'Proveedor actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando proveedor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, obtener, crear, actualizar };
