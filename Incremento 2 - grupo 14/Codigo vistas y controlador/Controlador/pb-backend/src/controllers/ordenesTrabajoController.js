const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');
const { generarAlertasAutomaticas } = require('./alertasController');
const { notificarPorRol } = require('./notificacionesController');

/**
 * GET /api/ordenes-trabajo
 * Lista OTs con resumen de consumos
 * Query params: ?estado=&buscar=
 */
async function listar(req, res) {
  const { estado, buscar } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         ot.orden_trabajo_id_orden                      AS id,
         ot.orden_trabajo_fecha_hora                    AS fecha,
         ot.orden_trabajo_estado                        AS estado,
         ot.proyecto_id_proyecto                        AS proyecto_id,
         p.codigo_proyecto                              AS proyecto_codigo,
         p.nombre_referencia                            AS proyecto_nombre,
         at.area_trabajo_nombre_area                    AS area,
         u.usuario_username                             AS responsable,
         COUNT(mot.material_sku)                        AS total_materiales,
         COUNT(CASE WHEN mot.material_orden_trabajo_consumo_estimado IS NOT NULL THEN 1 END) AS con_estimado,
         COUNT(CASE WHEN mot.material_orden_trabajo_consumo_real IS NOT NULL THEN 1 END) AS con_real
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       LEFT JOIN area_trabajo at    ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       LEFT JOIN usuario u          ON u.usuario_id_usuario = ot.usuario_id_usuario
       LEFT JOIN material_orden_trabajo mot ON mot.orden_trabajo_id_orden = ot.orden_trabajo_id_orden
       WHERE ($1::text IS NULL OR ot.orden_trabajo_estado = $1)
         AND ($2::text IS NULL OR
              p.codigo_proyecto ILIKE '%' || $2 || '%' OR
              p.nombre_referencia ILIKE '%' || $2 || '%')
       GROUP BY ot.orden_trabajo_id_orden, ot.orden_trabajo_fecha_hora,
                ot.orden_trabajo_estado, ot.proyecto_id_proyecto,
                p.codigo_proyecto, p.nombre_referencia,
                at.area_trabajo_nombre_area, u.usuario_username
       ORDER BY ot.orden_trabajo_fecha_hora DESC`,
      [estado || null, buscar || null]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando OTs:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/ordenes-trabajo/:id/consumos
 * Lista materiales con consumo estimado y real de una OT (CU-89B)
 */
async function consultarConsumos(req, res) {
  const { id } = req.params;
  try {
    // Verificar que la OT existe
    const { rows: ot } = await query(
      `SELECT orden_trabajo_id_orden AS id, orden_trabajo_estado AS estado,
              proyecto_id_proyecto AS proyecto_id
       FROM orden_trabajo WHERE orden_trabajo_id_orden = $1`,
      [id]
    );
    if (ot.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    // CU-89B Exc 1: sin consumos
    const { rows: materiales } = await query(
      `SELECT
         mot.material_sku                             AS sku,
         m.material_nombre_material                   AS nombre,
         m.material_estado                            AS estado_material,
         m.material_material_critico                  AS es_critico,
         u.material_unidad_medida_nombre              AS unidad,
         mot.material_orden_trabajo_consumo_estimado  AS estimado,
         mot.material_orden_trabajo_consumo_real      AS real,
         -- Precio vigente del proveedor principal
         mp.material_proveedor_precio_referencial     AS precio_unitario,
         CASE
           WHEN mot.material_orden_trabajo_consumo_real IS NOT NULL
                AND mot.material_orden_trabajo_consumo_estimado IS NOT NULL
           THEN mot.material_orden_trabajo_consumo_real - mot.material_orden_trabajo_consumo_estimado
           ELSE NULL
         END AS varianza
       FROM material_orden_trabajo mot
       JOIN material m ON m.material_sku = mot.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = mot.material_sku
             AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mot.orden_trabajo_id_orden = $1
       ORDER BY m.material_nombre_material`,
      [id]
    );

    res.json({
      orden: ot[0],
      materiales,
      resumen: {
        total: materiales.length,
        con_estimado: materiales.filter(m => m.estimado != null).length,
        con_real: materiales.filter(m => m.real != null).length
      }
    });
  } catch (err) {
    console.error('Error consultando consumos OT:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/ordenes-trabajo/:id/consumos
 * Registrar consumo real de un material en una OT (CU-89, CU-90)
 * Body: { sku, cantidad, bodega_id? }
 */
async function registrarConsumo(req, res) {
  const { id } = req.params;
  const { sku, cantidad, bodega_id, modo } = req.body;
  const userId = req.user.id;

  // CU-89 Exc 1
  if (!sku || !cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'SKU y cantidad positiva son requeridos' });
  }

  try {
    // CU-89 Exc 4: OT debe existir y estar abierta
    const { rows: ot } = await query(
      `SELECT orden_trabajo_id_orden AS id, orden_trabajo_estado AS estado,
              proyecto_id_proyecto AS proyecto_id
       FROM orden_trabajo WHERE orden_trabajo_id_orden = $1`,
      [id]
    );
    if (ot.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }
    if (['cancelada', 'finalizada', 'completada', 'cerrada'].includes(ot[0].estado.toLowerCase())) {
      return res.status(400).json({ error: 'No se pueden registrar consumos en una OT que no está abierta' });
    }

    // CU-89 Exc 2: verificar que el producto existe
    const { rows: mat } = await query(
      `SELECT material_sku, material_material_critico AS es_critico
       FROM material WHERE material_sku = $1`,
      [sku]
    );
    if (mat.length === 0) {
      return res.status(404).json({ error: 'El SKU no corresponde a un producto registrado' });
    }

    // CU-90 Exc 3: si hay stock en múltiples bodegas y no se especificó bodega
    let bodegaDestino = bodega_id;
    if (!bodegaDestino) {
      const { rows: bodegas } = await query(
        `SELECT bodega_id_bodega,
                SUM(inventario_bodega_cantidad_fisica) - SUM(inventario_bodega_cantidad_reservada) AS disponible
         FROM inventario_bodega
         WHERE material_sku = $1
           AND inventario_bodega_cantidad_fisica > inventario_bodega_cantidad_reservada
         GROUP BY bodega_id_bodega
         HAVING SUM(inventario_bodega_cantidad_fisica) - SUM(inventario_bodega_cantidad_reservada) > 0`,
        [sku]
      );

      if (bodegas.length === 0) {
        return res.status(400).json({ error: `Stock insuficiente para ${sku}. No hay disponible en ninguna bodega.` });
      }
      if (bodegas.length > 1) {
        return res.status(400).json({
          error: 'El producto existe en múltiples bodegas. Seleccione la bodega de origen.',
          bodegas: bodegas.map(b => ({ bodega_id: b.bodega_id_bodega, disponible: parseFloat(b.disponible) }))
        });
      }
      bodegaDestino = bodegas[0].bodega_id_bodega;
    }

    // CU-90 Exc 1: verificar stock disponible
    const { rows: stock } = await query(
      `SELECT COALESCE(SUM(inventario_bodega_cantidad_fisica), 0) -
              COALESCE(SUM(inventario_bodega_cantidad_reservada), 0) AS disponible
       FROM inventario_bodega
       WHERE material_sku = $1 AND bodega_id_bodega = $2`,
      [sku, bodegaDestino]
    );
    const disponible = parseFloat(stock[0]?.disponible || 0);

    if (cantidad > disponible) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${disponible}`,
        stock_disponible: disponible,
        cantidad_maxima: disponible
      });
    }

    // Descontar stock por FIFO (CU-90)
    const { rows: lotes } = await query(
      `SELECT ib.lote_id_lote,
              ib.inventario_bodega_cantidad_fisica - ib.inventario_bodega_cantidad_reservada AS disponible
       FROM inventario_bodega ib
       JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
       WHERE ib.material_sku = $1
         AND ib.bodega_id_bodega = $2
         AND ib.inventario_bodega_cantidad_fisica > ib.inventario_bodega_cantidad_reservada
       ORDER BY l.lote_fecha_ingreso ASC NULLS LAST`,
      [sku, bodegaDestino]
    );

    let restante = parseFloat(cantidad);
    const loteUsado = lotes[0]?.lote_id_lote;
    for (const lote of lotes) {
      if (restante <= 0) break;
      const descontar = Math.min(restante, parseFloat(lote.disponible));
      await query(
        `UPDATE inventario_bodega
         SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica - $1
         WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
        [descontar, sku, lote.lote_id_lote, bodegaDestino]
      );
      restante -= descontar;
    }

    // CU-89 Exc 3 / CU-96 CP3: verificar si ya existe consumo para este material en la OT
    let accionRealizada = 'nuevo';
    let consumoAnterior = 0;

    const { rows: existente } = await query(
      `SELECT material_orden_trabajo_consumo_real AS real_actual
       FROM material_orden_trabajo
       WHERE material_sku = $1 AND orden_trabajo_id_orden = $2`,
      [sku, id]
    );

    if (existente.length > 0 && existente[0].real_actual != null) {
      // CU-96 CP3: Preguntar si sumar o actualizar (modo viene del frontend)
      consumoAnterior = parseFloat(existente[0].real_actual);

      // Si no viene modo y ya tiene consumo, informar al frontend para que pregunte
      if (!modo) {
        return res.status(409).json({
          error: 'conflicto_consumo_existente',
          message: `El material ${sku} ya tiene consumo registrado (${consumoAnterior}). ¿Desea sumar o actualizar?`,
          consumo_actual: consumoAnterior,
          cantidad_nueva: parseFloat(cantidad),
        });
      }

      if (modo === 'actualizar') {
        accionRealizada = 'actualizado';
        await query(
          `UPDATE material_orden_trabajo
           SET material_orden_trabajo_consumo_real = $1
           WHERE material_sku = $2 AND orden_trabajo_id_orden = $3`,
          [cantidad, sku, id]
        );
      } else {
        // modo === 'sumar' (default explícito)
        accionRealizada = 'sumado';
        await query(
          `UPDATE material_orden_trabajo
           SET material_orden_trabajo_consumo_real =
                 COALESCE(material_orden_trabajo_consumo_real, 0) + $1
           WHERE material_sku = $2 AND orden_trabajo_id_orden = $3`,
          [cantidad, sku, id]
        );
      }
    } else if (existente.length > 0) {
      // Tiene estimado pero no real todavía
      await query(
        `UPDATE material_orden_trabajo
         SET material_orden_trabajo_consumo_real = $1
         WHERE material_sku = $2 AND orden_trabajo_id_orden = $3`,
        [cantidad, sku, id]
      );
    } else {
      // No existe registro — insertar
      await query(
        `INSERT INTO material_orden_trabajo (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_real)
         VALUES ($1, $2, $3)`,
        [sku, id, cantidad]
      );
    }

    // Registrar como movimiento de salida (tipo consumo)
    const { rows: tipoSalida } = await query(
      `SELECT movimiento_inventario_tipo_movimiento_id_tipo_movimiento AS id
       FROM movimiento_inventario_tipo_movimiento
       WHERE movimiento_inventario_tipo_movimiento_nombre ILIKE '%salida%'
       LIMIT 1`
    );

    if (tipoSalida.length > 0) {
      await query(
        `INSERT INTO movimiento_inventario (
           movimiento_inventario_cantidad, movimiento_inventario_estado,
           material_sku, bodega_id_bodega, lote_id_lote,
           usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento,
           proyecto_id_proyecto
         ) VALUES ($1, 'completado', $2, $3, $4, $5, $6, $7)`,
        [cantidad, sku, bodegaDestino, loteUsado, userId, tipoSalida[0].id, ot[0].proyecto_id]
      );
    }

    const cantidadNum = parseFloat(cantidad);
    const detalleAuditoria = accionRealizada === 'sumado'
      ? `Consumo acumulado en OT #${id}: SKU ${sku}, cantidad ${cantidadNum} (total: ${consumoAnterior + cantidadNum})`
      : accionRealizada === 'actualizado'
      ? `Consumo actualizado en OT #${id}: SKU ${sku}, anterior: ${consumoAnterior}, nuevo: ${cantidadNum}`
      : `Consumo registrado en OT #${id}: SKU ${sku}, cantidad ${cantidadNum}`;
    await auditoria.registrar(userId, 'Registrar consumo OT', detalleAuditoria);
    generarAlertasAutomaticas().catch(e => console.warn('Alertas:', e.message));

    // CU-90 Exc 2: verificar si tiene precio
    const { rows: precio } = await query(
      `SELECT material_proveedor_precio_referencial AS precio
       FROM material_proveedor
       WHERE material_sku = $1 AND material_proveedor_proveedor_principal = TRUE`,
      [sku]
    );
    const sinPrecio = !precio[0]?.precio;

    // CU-96 CP3: Mensaje diferenciado según acción realizada
    const msgConsumo = accionRealizada === 'sumado'
      ? `El material ${sku} ya tenía consumo registrado (${consumoAnterior}). Se sumó ${cantidadNum}. Nuevo total: ${consumoAnterior + cantidadNum}`
      : accionRealizada === 'actualizado'
      ? `El material ${sku} tenía consumo registrado (${consumoAnterior}). Se actualizó a ${cantidadNum}.`
      : 'Consumo registrado correctamente';

    res.status(201).json({
      message: msgConsumo,
      accion: accionRealizada,
      ...(accionRealizada === 'sumado' && { consumo_anterior: consumoAnterior, consumo_nuevo: consumoAnterior + cantidadNum }),
      ...(accionRealizada === 'actualizado' && { consumo_anterior: consumoAnterior, consumo_nuevo: cantidadNum }),
      sin_precio: sinPrecio,
      ...(sinPrecio && { advertencia: 'Producto sin precio unitario. Costo marcado como pendiente de valorización.' })
    });
  } catch (err) {
    console.error('Error registrando consumo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/ordenes-trabajo/:id/estimados
 * Registrar o actualizar consumo estimado (CU-91, CU-91B)
 * Body: { materiales: [{ sku, cantidad_estimada }] }
 */
async function registrarEstimados(req, res) {
  const { id } = req.params;
  const { materiales } = req.body;

  if (!Array.isArray(materiales) || materiales.length === 0) {
    return res.status(400).json({ error: 'Debe enviar al menos un material con cantidad estimada' });
  }

  try {
    // CU-91 Exc 3: OT debe estar abierta
    const { rows: ot } = await query(
      `SELECT orden_trabajo_estado AS estado FROM orden_trabajo WHERE orden_trabajo_id_orden = $1`,
      [id]
    );
    if (ot.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }
    if (['finalizada', 'completada', 'cerrada'].includes(ot[0].estado.toLowerCase())) {
      return res.status(400).json({ error: 'No se pueden agregar estimaciones a órdenes cerradas' });
    }

    const resultados = [];

    for (const item of materiales) {
      const { sku, cantidad_estimada } = item;

      // CU-91 Exc 1
      if (cantidad_estimada < 0) {
        resultados.push({ sku, error: 'La cantidad debe ser mayor o igual a cero' });
        continue;
      }

      // Verificar si ya existe
      const { rows: existente } = await query(
        `SELECT material_orden_trabajo_consumo_estimado AS estimado,
                material_orden_trabajo_consumo_real AS real
         FROM material_orden_trabajo
         WHERE material_sku = $1 AND orden_trabajo_id_orden = $2`,
        [sku, id]
      );

      if (existente.length > 0) {
        // CU-91B Exc 2: advertir si real > nuevo estimado
        const realActual = parseFloat(existente[0].real || 0);
        const advertencia = realActual > cantidad_estimada
          ? 'El consumo real actual supera el nuevo estimado. La desviación será negativa.'
          : null;

        await query(
          `UPDATE material_orden_trabajo
           SET material_orden_trabajo_consumo_estimado = $1
           WHERE material_sku = $2 AND orden_trabajo_id_orden = $3`,
          [cantidad_estimada, sku, id]
        );
        resultados.push({ sku, actualizado: true, advertencia, real_actual: realActual, cantidad_estimada });
      } else {
        await query(
          `INSERT INTO material_orden_trabajo
             (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado)
           VALUES ($1, $2, $3)`,
          [sku, id, cantidad_estimada]
        );
        resultados.push({ sku, creado: true });
      }
    }

    // CU-100 CP2: Collect deviation warnings
    const advertencias = resultados
      .filter(r => r.advertencia)
      .map(r => ({ sku: r.sku, real: r.real_actual || 0, estimado: r.cantidad_estimada || 0 }));

    await auditoria.registrar(req.user?.id, 'Registrar estimados OT', `Estimados registrados en OT #${id}: ${materiales.length} material(es)`);
    res.json({
      message: 'Estimados registrados correctamente',
      resultados,
      ...(advertencias.length > 0 && { advertencias })
    });
  } catch (err) {
    console.error('Error registrando estimados:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/ordenes-trabajo/:id/comparativo
 * Reporte estimado vs real (CU-92)
 */
async function comparativo(req, res) {
  const { id } = req.params;
  try {
    const { rows: ot } = await query(
      `SELECT orden_trabajo_id_orden AS id, orden_trabajo_estado AS estado
       FROM orden_trabajo WHERE orden_trabajo_id_orden = $1`,
      [id]
    );
    if (ot.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    const { rows: materiales } = await query(
      `SELECT
         mot.material_sku                             AS sku,
         m.material_nombre_material                   AS nombre,
         u.material_unidad_medida_nombre              AS unidad,
         mot.material_orden_trabajo_consumo_estimado  AS estimado,
         mot.material_orden_trabajo_consumo_real      AS real,
         mp.material_proveedor_precio_referencial     AS precio_unitario
       FROM material_orden_trabajo mot
       JOIN material m ON m.material_sku = mot.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = mot.material_sku
             AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mot.orden_trabajo_id_orden = $1
       ORDER BY m.material_nombre_material`,
      [id]
    );

    // CU-92 Exc 1 y 2
    const sinEstimado = materiales.filter(m => m.estimado == null);
    const sinReal     = materiales.filter(m => m.real == null);
    const comparables = materiales.filter(m => m.estimado != null && m.real != null);

    // Calcular varianza para cada comparable
    const detalle = materiales.map(m => {
      const est  = parseFloat(m.estimado || 0);
      const real = parseFloat(m.real || 0);
      const precio = parseFloat(m.precio_unitario || 0);
      const varianza = m.estimado != null && m.real != null ? real - est : null;
      const varianzaPct = est > 0 && varianza != null ? ((varianza / est) * 100) : null;
      const costoEstimado = est * precio;
      const costoReal     = real * precio;

      return {
        ...m,
        varianza,
        varianza_pct: varianzaPct != null ? Math.round(varianzaPct * 10) / 10 : null,
        costo_estimado: costoEstimado,
        costo_real: costoReal,
        costo_diferencia: costoReal - costoEstimado,
        sin_contraparte: (m.estimado == null && m.real != null) ? 'solo_real'
                       : (m.estimado != null && m.real == null) ? 'solo_estimado'
                       : null
      };
    });

    res.json({
      orden: ot[0],
      detalle,
      resumen: {
        total_materiales: materiales.length,
        comparables: comparables.length,
        solo_estimado: sinReal.filter(m => m.estimado != null).length,
        solo_real: sinEstimado.filter(m => m.real != null).length,
        costo_total_estimado: detalle.reduce((s, d) => s + (d.costo_estimado || 0), 0),
        costo_total_real: detalle.reduce((s, d) => s + (d.costo_real || 0), 0)
      }
    });
  } catch (err) {
    console.error('Error generando comparativo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/ordenes-trabajo/:id/costos
 * Consolidar costos de materiales (CU-93)
 */
async function costos(req, res) {
  const { id } = req.params;
  try {
    const { rows: ot } = await query(
      `SELECT ot.orden_trabajo_id_orden AS id, ot.orden_trabajo_estado AS estado,
              p.codigo_proyecto AS proyecto_codigo, p.nombre_referencia AS proyecto_nombre
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       WHERE ot.orden_trabajo_id_orden = $1`,
      [id]
    );
    if (ot.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    const { rows: materiales } = await query(
      `SELECT
         mot.material_sku                             AS sku,
         m.material_nombre_material                   AS nombre,
         u.material_unidad_medida_nombre              AS unidad,
         mot.material_orden_trabajo_consumo_real      AS cantidad_real,
         mp.material_proveedor_precio_referencial     AS precio_unitario
       FROM material_orden_trabajo mot
       JOIN material m ON m.material_sku = mot.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = mot.material_sku
             AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mot.orden_trabajo_id_orden = $1
         AND mot.material_orden_trabajo_consumo_real IS NOT NULL
       ORDER BY m.material_nombre_material`,
      [id]
    );

    const detalle = materiales.map(m => {
      const cant   = parseFloat(m.cantidad_real || 0);
      const precio = parseFloat(m.precio_unitario || 0);
      return {
        ...m,
        costo_linea: cant * precio,
        // CU-93 Exc 1
        sin_precio: !m.precio_unitario,
        // CU-93 Exc 2
        nota_precio: m.precio_unitario ? 'Precio vigente proveedor principal' : 'Estimado/Incompleto'
      };
    });

    const costoTotal   = detalle.reduce((s, d) => s + d.costo_linea, 0);
    const incompleto   = detalle.some(d => d.sin_precio);

    res.json({
      orden: ot[0],
      detalle,
      resumen: {
        costo_total_materiales: costoTotal,
        moneda: 'CLP',
        estado_calculo: incompleto ? 'Estimado/Incompleto' : 'Completo',
        total_insumos: detalle.length,
        sin_precio: detalle.filter(d => d.sin_precio).length
      }
    });
  } catch (err) {
    console.error('Error consolidando costos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/ordenes-trabajo/:id/rentabilidad
 * Calcular precio sugerido con margen (CU-94)
 * Query params: ?margen=25 (porcentaje)
 */
async function rentabilidad(req, res) {
  const { id } = req.params;
  const margen = parseFloat(req.query.margen);

  // CU-94 Exc 3
  if (isNaN(margen) || margen <= 0) {
    return res.status(400).json({ error: 'El margen de utilidad debe ser un porcentaje válido mayor a 0' });
  }

  try {
    // Reutilizar lógica de costos
    const { rows: ot } = await query(
      `SELECT ot.orden_trabajo_id_orden AS id, ot.orden_trabajo_estado AS estado,
              p.codigo_proyecto AS proyecto_codigo, p.nombre_referencia AS proyecto_nombre
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       WHERE ot.orden_trabajo_id_orden = $1`,
      [id]
    );

    if (ot.length === 0) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    const { rows: materiales } = await query(
      `SELECT
         mot.material_orden_trabajo_consumo_real      AS cantidad_real,
         mp.material_proveedor_precio_referencial     AS precio_unitario
       FROM material_orden_trabajo mot
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = mot.material_sku
             AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mot.orden_trabajo_id_orden = $1
         AND mot.material_orden_trabajo_consumo_real IS NOT NULL`,
      [id]
    );

    // CU-94 Exc 1
    if (materiales.length === 0) {
      return res.status(400).json({ error: 'No existen datos de producción disponibles para analizar' });
    }

    const costoTotal = materiales.reduce((s, m) => {
      return s + (parseFloat(m.cantidad_real || 0) * parseFloat(m.precio_unitario || 0));
    }, 0);

    const incompleto = materiales.some(m => !m.precio_unitario);
    const precioSugerido = costoTotal * (1 + margen / 100);

    res.json({
      orden: ot[0],
      costo_materiales: costoTotal,
      margen_pct: margen,
      precio_sugerido: Math.round(precioSugerido),
      moneda: 'CLP',
      // CU-94 Exc 2
      advertencia: incompleto
        ? 'El precio sugerido se basa en datos incompletos. Algunos insumos no tienen precio registrado.'
        : null
    });
  } catch (err) {
    console.error('Error calculando rentabilidad:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/* ── Eliminar material de OT ────────────────────────── */
const eliminarMaterial = async (req, res) => {
  const { id, sku } = req.params;
  try {
    // Verificar que la OT existe
    const ot = await pool.query(
      'SELECT id_orden, orden_trabajo_estado FROM orden_trabajo WHERE id_orden = $1',
      [id]
    );
    if (ot.rows.length === 0)
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });

    // Verificar que el material existe en la OT
    const mat = await pool.query(
      `SELECT material_sku, material_orden_trabajo_consumo_real
       FROM material_orden_trabajo
       WHERE orden_trabajo_id_orden = $1 AND material_sku = $2`,
      [id, sku]
    );
    if (mat.rows.length === 0)
      return res.status(404).json({ error: 'Material no encontrado en esta orden' });

    // Si tiene consumo real > 0, no permitir eliminar
    const consumoReal = parseFloat(mat.rows[0].material_orden_trabajo_consumo_real) || 0;
    if (consumoReal > 0)
      return res.status(400).json({
        error: 'No se puede eliminar un material que ya tiene consumo real registrado'
      });

    await pool.query(
      'DELETE FROM material_orden_trabajo WHERE orden_trabajo_id_orden = $1 AND material_sku = $2',
      [id, sku]
    );

    await auditoria.registrar(req.user?.id, 'Eliminar material de OT', `Material SKU ${sku} eliminado de OT #${id}`);
    res.json({ message: 'Material eliminado de la orden de trabajo' });
  } catch (err) {
    console.error('Error al eliminar material de OT:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listar, consultarConsumos, registrarConsumo,
  registrarEstimados, comparativo, costos, rentabilidad,
  eliminarMaterial
};
