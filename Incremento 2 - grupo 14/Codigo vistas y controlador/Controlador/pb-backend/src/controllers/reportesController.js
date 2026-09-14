const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');

/**
 * GET /api/reportes/movimientos
 * Reporte de movimientos por rango de fechas
 * Query params: ?desde=&hasta=&tipo=
 */
async function reporteMovimientos(req, res) {
  const { desde, hasta, tipo, buscar } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Los parámetros desde y hasta son requeridos' });
  }

  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_id_movimiento            AS id,
         mi.movimiento_inventario_fecha_hora               AS fecha_hora,
         mi.movimiento_inventario_cantidad                 AS cantidad,
         mi.movimiento_inventario_estado                   AS estado,
         mi.material_sku                                   AS sku,
         m.material_nombre_material                        AS material,
         b.bodega_nombre_bodega                            AS bodega,
         tm.movimiento_inventario_tipo_movimiento_nombre   AS tipo,
         mot.movimiento_inventario_motivo_movimiento_nombre AS motivo,
         cs.movimiento_inventario_clasificacion_salida_nombre AS clasificacion_salida,
         u.usuario_username                                AS usuario,
         l.lote_numero_lote                                AS lote,
         -- Precio referencial del proveedor principal (solo gerencia lo verá en el frontend)
         mp.material_proveedor_precio_referencial          AS precio_unitario
       FROM movimiento_inventario mi
       JOIN material m ON m.material_sku = mi.material_sku
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       LEFT JOIN bodega b   ON b.bodega_id_bodega = mi.bodega_id_bodega
       LEFT JOIN lote l     ON l.lote_id_lote = mi.lote_id_lote
       LEFT JOIN usuario u  ON u.usuario_id_usuario = mi.usuario_id_usuario
       LEFT JOIN movimiento_inventario_motivo_movimiento mot
            ON mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
             = mi.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       LEFT JOIN movimiento_inventario_clasificacion_salida cs
            ON cs.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
             = mot.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
       -- Precio referencial del proveedor principal
       LEFT JOIN material_proveedor mp
            ON mp.material_sku = mi.material_sku
           AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mi.movimiento_inventario_fecha_hora >= $1::date
         AND mi.movimiento_inventario_fecha_hora < ($2::date + INTERVAL '1 day')
         AND ($3::text IS NULL OR tm.movimiento_inventario_tipo_movimiento_nombre ILIKE '%' || $3 || '%')
         AND ($4::text IS NULL OR mi.material_sku ILIKE '%' || $4 || '%' OR m.material_nombre_material ILIKE '%' || $4 || '%')
       ORDER BY mi.movimiento_inventario_fecha_hora DESC`,
      [desde, hasta, tipo || null, buscar || null]
    );

    // Resumen
    const resumen = {
      total_movimientos: rows.length,
      total_entradas: rows.filter(r => r.tipo?.toLowerCase().includes('entrada')).length,
      total_salidas:  rows.filter(r => r.tipo?.toLowerCase().includes('salida')).length,
    };

    res.json({ resumen, movimientos: rows });
  } catch (err) {
    console.error('Error generando reporte movimientos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/reportes/mermas
 * Reporte de mermas (FR-50) — movimientos con motivo de pérdida/daño
 * Query params: ?desde=&hasta=&motivo=
 * Nota: precio_unitario solo se devuelve si el usuario es gerencia (FR-59)
 */
async function reporteMermas(req, res) {
  const { desde, hasta, motivo } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Los parámetros desde y hasta son requeridos' });
  }

  const esGerencia = req.user?.rol === 'gerencia';

  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_id_movimiento              AS id,
         mi.movimiento_inventario_fecha_hora                 AS fecha,
         mi.movimiento_inventario_cantidad                   AS cantidad,
         mi.material_sku                                     AS sku,
         m.material_nombre_material                          AS producto,
         mot.movimiento_inventario_motivo_movimiento_nombre  AS motivo,
         u.usuario_username                                  AS usuario,
         mp.material_proveedor_precio_referencial            AS precio_unitario
       FROM movimiento_inventario mi
       JOIN material m ON m.material_sku = mi.material_sku
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       JOIN movimiento_inventario_motivo_movimiento mot
            ON mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
             = mi.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       LEFT JOIN movimiento_inventario_clasificacion_salida cs
            ON cs.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
             = mot.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
       LEFT JOIN usuario u ON u.usuario_id_usuario = mi.usuario_id_usuario
       LEFT JOIN material_proveedor mp
            ON mp.material_sku = mi.material_sku
           AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mi.movimiento_inventario_fecha_hora >= $1::date
         AND mi.movimiento_inventario_fecha_hora < ($2::date + INTERVAL '1 day')
         AND tm.movimiento_inventario_tipo_movimiento_nombre ILIKE '%salida%'
         AND cs.movimiento_inventario_clasificacion_salida_nombre ILIKE '%pérdida%'
         AND ($3::text IS NULL OR mot.movimiento_inventario_motivo_movimiento_nombre ILIKE '%' || $3 || '%')
       ORDER BY mi.movimiento_inventario_fecha_hora DESC`,
      [desde, hasta, motivo || null]
    );

    // KPIs
    const totalUnidades = rows.reduce((s, r) => s + parseFloat(r.cantidad || 0), 0);
    const totalValor    = rows.reduce((s, r) => s + parseFloat(r.cantidad || 0) * parseFloat(r.precio_unitario || 0), 0);
    const skusDistintos = new Set(rows.map(r => r.sku)).size;

    // Si es JOP, eliminar precio_unitario de cada fila (FR-59)
    const mermas = rows.map(r => {
      const row = { ...r };
      if (!esGerencia) {
        delete row.precio_unitario;
      } else {
        row.valor_merma = parseFloat(r.cantidad || 0) * parseFloat(r.precio_unitario || 0);
      }
      return row;
    });

    // CU-72 CP3: Contar productos sin precio unitario referencial
    const productosSinPrecio = new Set(
      rows.filter(r => !r.precio_unitario || parseFloat(r.precio_unitario) === 0)
          .map(r => r.sku)
    ).size;

    const resumen = {
      total_eventos:   rows.length,
      total_unidades:  totalUnidades,
      skus_afectados:  skusDistintos,
      productos_sin_precio: productosSinPrecio,
      // Solo gerencia recibe el valor monetario
      ...(esGerencia && { valor_total_merma: totalValor }),
    };

    res.json({ resumen, mermas });
  } catch (err) {
    console.error('Error generando reporte mermas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/reportes/valorizacion
 * Valor económico total del inventario (CU-64) — solo gerencia
 */
async function valorizacion(req, res) {
  try {
    const { rows } = await query(
      `SELECT
         m.material_sku                               AS sku,
         m.material_nombre_material                   AS nombre,
         m.material_material_critico                  AS es_critico,
         u.material_unidad_medida_nombre              AS unidad,
         cg.material_categoria_general_nombre         AS categoria,
         COALESCE(SUM(ib.inventario_bodega_cantidad_fisica), 0) AS stock_total,
         mp.material_proveedor_precio_referencial     AS precio_unitario
       FROM material m
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_categoria_general cg
              ON cg.material_categoria_general_id_categoria_general = m.material_categoria_general_id_categoria_general
       LEFT JOIN inventario_bodega ib ON ib.material_sku = m.material_sku
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = m.material_sku
             AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE m.material_estado = 'activo'
       GROUP BY m.material_sku, m.material_nombre_material,
                m.material_material_critico,
                u.material_unidad_medida_nombre,
                cg.material_categoria_general_nombre,
                mp.material_proveedor_precio_referencial
       HAVING COALESCE(SUM(ib.inventario_bodega_cantidad_fisica), 0) > 0
       ORDER BY m.material_nombre_material`
    );

    const detalle = rows.map(r => {
      const stock  = parseFloat(r.stock_total || 0);
      const precio = parseFloat(r.precio_unitario || 0);
      return {
        ...r,
        valor_linea: stock * precio,
        sin_precio: !r.precio_unitario
      };
    });

    const valorTotal    = detalle.reduce((s, d) => s + d.valor_linea, 0);
    const sinPrecio     = detalle.filter(d => d.sin_precio).length;
    const totalProductos = detalle.length;

    // CU-64 Exc 1: todo sin precio
    if (sinPrecio === totalProductos && totalProductos > 0) {
      return res.json({
        detalle,
        resumen: {
          valor_total: 0,
          moneda: 'CLP',
          total_productos: totalProductos,
          sin_precio: sinPrecio,
          estado: 'No es posible calcular el valor. Ningún producto tiene precio referencial.'
        }
      });
    }

    res.json({
      detalle,
      resumen: {
        valor_total: valorTotal,
        moneda: 'CLP',
        total_productos: totalProductos,
        sin_precio: sinPrecio,
        estado: sinPrecio > 0 ? 'Estimado/Incompleto' : 'Completo'
      }
    });
  } catch (err) {
    console.error('Error generando valorización:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/reportes/consumo-area
 * Consumo de materiales por área de trabajo (CU-65)
 * Query params: ?area_id=&desde=&hasta=
 */
async function consumoArea(req, res) {
  const { area_id, desde, hasta } = req.query;
  try {
    const { rows } = await query(
      `SELECT
         at.area_trabajo_id_area                    AS area_id,
         at.area_trabajo_nombre_area                AS area_nombre,
         m.material_sku                             AS sku,
         m.material_nombre_material                 AS material_nombre,
         u.material_unidad_medida_nombre            AS unidad,
         SUM(mot.material_orden_trabajo_consumo_real) AS total_consumido,
         mp.material_proveedor_precio_referencial   AS precio_unitario,
         COUNT(DISTINCT ot.orden_trabajo_id_orden)  AS ordenes_involucradas
       FROM material_orden_trabajo mot
       JOIN orden_trabajo ot ON ot.orden_trabajo_id_orden = mot.orden_trabajo_id_orden
       JOIN area_trabajo at  ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       JOIN material m       ON m.material_sku = mot.material_sku
       LEFT JOIN material_unidad_medida u
              ON u.material_unidad_medida_id_unidad_medida = m.material_unidad_medida_id_unidad_medida
       LEFT JOIN material_proveedor mp
              ON mp.material_sku = mot.material_sku
             AND mp.material_proveedor_proveedor_principal = TRUE
       WHERE mot.material_orden_trabajo_consumo_real IS NOT NULL
         AND ($1::text IS NULL OR $1::text = '' OR at.area_trabajo_id_area = $1::bigint)
         AND ($2::text IS NULL OR $2::text = '' OR ot.orden_trabajo_fecha_hora >= $2::date)
         AND ($3::text IS NULL OR $3::text = '' OR ot.orden_trabajo_fecha_hora <= $3::date + INTERVAL '1 day')
       GROUP BY at.area_trabajo_id_area, at.area_trabajo_nombre_area,
                m.material_sku, m.material_nombre_material,
                u.material_unidad_medida_nombre,
                mp.material_proveedor_precio_referencial
       ORDER BY at.area_trabajo_nombre_area, SUM(mot.material_orden_trabajo_consumo_real) DESC`,
      [area_id || null, desde || null, hasta || null]
    );

    // CU-65 Exc 1: sin datos
    if (rows.length === 0) {
      return res.json({
        consumos: [],
        mensaje: 'No se encontraron consumos registrados para los filtros aplicados'
      });
    }

    // Agrupar por área para el resumen
    const porArea = {};
    for (const r of rows) {
      if (!porArea[r.area_id]) {
        porArea[r.area_id] = { area_id: r.area_id, area: r.area_nombre, total_consumo: 0, costo_total: 0, materiales: 0 };
      }
      const consumido = parseFloat(r.total_consumido || 0);
      const precio    = parseFloat(r.precio_unitario || 0);
      porArea[r.area_id].total_consumo += consumido;
      porArea[r.area_id].costo_total   += consumido * precio;
      porArea[r.area_id].materiales++;
    }

    // CU-69 Exc 2: comparar con promedio histórico por área
    const UMBRAL_ANOMALIA_PCT = 50; // 50% sobre el promedio = pico anómalo
    for (const areaId of Object.keys(porArea)) {
      try {
        const { rows: hist } = await query(
          `SELECT
             COALESCE(AVG(mes_total), 0) AS promedio_mensual
           FROM (
             SELECT DATE_TRUNC('month', ot.orden_trabajo_fecha_hora) AS mes,
                    SUM(mot.material_orden_trabajo_consumo_real *
                        COALESCE(mp.material_proveedor_precio_referencial, 0)) AS mes_total
             FROM material_orden_trabajo mot
             JOIN orden_trabajo ot ON ot.orden_trabajo_id_orden = mot.orden_trabajo_id_orden
             LEFT JOIN material_proveedor mp
                    ON mp.material_sku = mot.material_sku
                   AND mp.material_proveedor_proveedor_principal = TRUE
             WHERE ot.area_trabajo_id_area = $1
               AND mot.material_orden_trabajo_consumo_real IS NOT NULL
               AND ot.orden_trabajo_fecha_hora < COALESCE($2::date, CURRENT_DATE)
             GROUP BY mes
           ) sub`,
          [areaId, desde || null]
        );
        const promedio = parseFloat(hist[0]?.promedio_mensual || 0);
        porArea[areaId].promedio_historico = Math.round(promedio);
        if (promedio > 0 && porArea[areaId].costo_total > promedio * (1 + UMBRAL_ANOMALIA_PCT / 100)) {
          porArea[areaId].alerta_anomalia = true;
          porArea[areaId].mensaje_anomalia = 'Pico de consumo anómalo detectado. Revise el detalle de salidas.';
          porArea[areaId].desviacion_pct = Math.round(((porArea[areaId].costo_total / promedio) - 1) * 100);
        }
      } catch (e) {
        // Si falla el cálculo histórico, continuar sin advertencia
      }
    }

    res.json({ consumos: rows, resumen_por_area: Object.values(porArea) });
  } catch (err) {
    console.error('Error generando consumo por área:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/reportes/programacion-semanal
 * OTs programadas en los próximos 7 días (CU-120, CU-121)
 */
async function programacionSemanal(req, res) {
  try {
    const { rows } = await query(
      `SELECT
         ot.orden_trabajo_id_orden                  AS id,
         COALESCE(p.fecha_instalacion, ot.orden_trabajo_fecha_hora::date) AS fecha,
         ot.orden_trabajo_estado                    AS estado,
         p.codigo_proyecto                          AS proyecto_codigo,
         p.nombre_referencia                        AS proyecto_nombre,
         at.area_trabajo_nombre_area                AS area,
         u.usuario_username                         AS responsable,
         -- Resumen de materiales
         COUNT(mot.material_sku)                    AS total_materiales,
         SUM(CASE WHEN COALESCE(stock.disponible, 0) < COALESCE(mot.material_orden_trabajo_consumo_estimado, 0)
             THEN 1 ELSE 0 END)                    AS materiales_con_faltante
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       LEFT JOIN area_trabajo at    ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       LEFT JOIN usuario u          ON u.usuario_id_usuario = ot.usuario_id_usuario
       LEFT JOIN material_orden_trabajo mot ON mot.orden_trabajo_id_orden = ot.orden_trabajo_id_orden
       LEFT JOIN LATERAL (
         SELECT SUM(ib.inventario_bodega_cantidad_fisica) -
                SUM(ib.inventario_bodega_cantidad_reservada) AS disponible
         FROM inventario_bodega ib WHERE ib.material_sku = mot.material_sku
       ) stock ON TRUE
       WHERE ot.orden_trabajo_estado NOT IN ('cancelada', 'finalizada', 'completada', 'cerrada')
         AND (
           (p.fecha_instalacion >= CURRENT_DATE AND p.fecha_instalacion < CURRENT_DATE + INTERVAL '7 days')
           OR (p.id_proyecto IS NULL AND ot.orden_trabajo_fecha_hora >= CURRENT_DATE AND ot.orden_trabajo_fecha_hora < CURRENT_DATE + INTERVAL '7 days')
         )
       GROUP BY ot.orden_trabajo_id_orden, ot.orden_trabajo_fecha_hora,
                ot.orden_trabajo_estado, p.codigo_proyecto, p.nombre_referencia,
                p.fecha_instalacion,
                at.area_trabajo_nombre_area, u.usuario_username
       ORDER BY COALESCE(p.fecha_instalacion, ot.orden_trabajo_fecha_hora::date) ASC`
    );

    // CU-120 Exc 1
    if (rows.length === 0) {
      return res.json({
        programacion: [],
        mensaje: 'No existen instalaciones programadas para los próximos 7 días'
      });
    }

    // CU-121: alertas de insumos faltantes
    const conFaltantes = rows.filter(r => parseInt(r.materiales_con_faltante) > 0);

    res.json({
      programacion: rows,
      resumen: {
        total_ots: rows.length,
        con_faltantes: conFaltantes.length,
        sin_faltantes: rows.length - conFaltantes.length
      }
    });
  } catch (err) {
    console.error('Error generando programación semanal:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/reportes/programacion-semanal/exportar
 * CU-122: Exportar cronograma semanal como CSV
 */
async function exportarProgramacion(req, res) {
  try {
    const { rows } = await query(
      `SELECT
         ot.orden_trabajo_id_orden                  AS id,
         ot.orden_trabajo_fecha_hora                AS fecha,
         ot.orden_trabajo_estado                    AS estado,
         p.codigo_proyecto                          AS proyecto_codigo,
         p.nombre_referencia                        AS proyecto_nombre,
         at.area_trabajo_nombre_area                AS area,
         u.usuario_username                         AS responsable
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       LEFT JOIN area_trabajo at    ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       LEFT JOIN usuario u          ON u.usuario_id_usuario = ot.usuario_id_usuario
       WHERE ot.orden_trabajo_estado NOT IN ('cancelada', 'finalizada', 'completada', 'cerrada')
         AND (
           (p.fecha_instalacion >= CURRENT_DATE AND p.fecha_instalacion < CURRENT_DATE + INTERVAL '7 days')
           OR (p.id_proyecto IS NULL AND ot.orden_trabajo_fecha_hora >= CURRENT_DATE AND ot.orden_trabajo_fecha_hora < CURRENT_DATE + INTERVAL '7 days')
         )
       ORDER BY ot.orden_trabajo_fecha_hora ASC`
    );

    // CU-122 Exc 1
    if (rows.length === 0) {
      return res.status(400).json({ error: 'No hay datos para exportar en el período seleccionado' });
    }

    // Generar CSV
    const headers = ['ID', 'Fecha', 'Estado', 'Código Proyecto', 'Nombre Proyecto', 'Área', 'Responsable'];
    const csvRows = rows.map(r => [
      r.id,
      new Date(r.fecha).toLocaleDateString('sv-SE'),
      r.estado,
      r.proyecto_codigo || '',
      (r.proyecto_nombre || '').replace(/,/g, ' '),
      r.area || '',
      r.responsable || ''
    ].join(','));

    const csv = [headers.join(','), ...csvRows].join('\n');

    await auditoria.registrar(req.user?.id, 'Exportar reporte', `Programación semanal exportada en formato CSV (${rows.length} registro(s))`);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="programacion_semanal.csv"');
    res.send('\uFEFF' + csv); // BOM para Excel
  } catch (err) {
    console.error('Error exportando programación:', err);
    res.status(500).json({ error: 'Error generando el archivo CSV. Intente nuevamente.' });
  }
}

/**
 * GET /api/reportes/programacion-semanal/exportar-pdf
 * CU-134: Exportar cronograma semanal como PDF real
 */
async function exportarProgramacionPDF(req, res) {
  try {
    const { rows } = await query(
      `SELECT
         ot.orden_trabajo_id_orden                  AS id,
         ot.orden_trabajo_fecha_hora                AS fecha,
         ot.orden_trabajo_estado                    AS estado,
         p.codigo_proyecto                          AS proyecto_codigo,
         p.nombre_referencia                        AS proyecto_nombre,
         at.area_trabajo_nombre_area                AS area,
         u.usuario_username                         AS responsable,
         p.rut_cliente                              AS cliente,
         (SELECT string_agg(m2.material_nombre_material, ', ' ORDER BY m2.material_nombre_material)
          FROM material_orden_trabajo mot2
          JOIN material m2 ON m2.material_sku = mot2.material_sku
          WHERE mot2.orden_trabajo_id_orden = ot.orden_trabajo_id_orden
         ) AS insumos
       FROM orden_trabajo ot
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = ot.proyecto_id_proyecto
       LEFT JOIN area_trabajo at    ON at.area_trabajo_id_area = ot.area_trabajo_id_area
       LEFT JOIN usuario u          ON u.usuario_id_usuario = ot.usuario_id_usuario
       WHERE ot.orden_trabajo_estado NOT IN ('cancelada', 'finalizada', 'completada', 'cerrada')
         AND (
           (p.fecha_instalacion >= CURRENT_DATE AND p.fecha_instalacion < CURRENT_DATE + INTERVAL '7 days')
           OR (p.id_proyecto IS NULL AND ot.orden_trabajo_fecha_hora >= CURRENT_DATE AND ot.orden_trabajo_fecha_hora < CURRENT_DATE + INTERVAL '7 days')
         )
       ORDER BY ot.orden_trabajo_fecha_hora ASC`
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No hay datos para exportar en el período seleccionado' });
    }

    const PDFDocument = require('pdfkit');
    const pdfDoc = new PDFDocument({ size: 'LETTER', layout: 'landscape', margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="programacion_semanal.pdf"');
    pdfDoc.pipe(res);

    // Título
    pdfDoc.font('Helvetica-Bold').fontSize(18).fillColor('#333333')
      .text('Programación Semanal de Instalaciones', { align: 'center' });
    pdfDoc.moveDown(0.3);
    pdfDoc.font('Helvetica').fontSize(10).fillColor('#666666')
      .text(`Generado: ${new Date().toLocaleDateString('sv-SE')} — Puertas Blindadas ERP — Módulo Inventario`, { align: 'center' });
    pdfDoc.moveDown(1.2);

    // Configuración tabla
    const colWidths = [35, 65, 60, 80, 110, 70, 80, 80, 120];
    const headers   = ['OT', 'Fecha', 'Estado', 'Cód. Proyecto', 'Nombre Proyecto', 'Cliente', 'Área', 'Responsable', 'Insumos'];
    const tableLeft = 40;
    const rowH = 24;
    let curY = pdfDoc.y;

    // Función auxiliar para dibujar una fila
    function drawRow(y, values, isHeader) {
      let x = tableLeft;
      values.forEach((val, i) => {
        // Fondo
        pdfDoc.save();
        if (isHeader) {
          pdfDoc.rect(x, y, colWidths[i], rowH).fill('#4472C4');
        }
        pdfDoc.restore();

        // Texto
        pdfDoc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(isHeader ? 9 : 8)
          .fillColor(isHeader ? '#FFFFFF' : '#333333')
          .text(val, x + 4, y + 7, { width: colWidths[i] - 8, height: rowH, lineBreak: false });
        x += colWidths[i];
      });

      // Bordes de fila
      if (!isHeader) {
        pdfDoc.save();
        pdfDoc.rect(tableLeft, y, colWidths.reduce((a, b) => a + b, 0), rowH)
          .strokeColor('#D0D0D0').lineWidth(0.5).stroke();
        pdfDoc.restore();
      }
    }

    // Header
    drawRow(curY, headers, true);
    curY += rowH;

    // Data rows
    rows.forEach((r, idx) => {
      if (curY + rowH > pdfDoc.page.height - 50) {
        pdfDoc.addPage();
        curY = 40;
        drawRow(curY, headers, true);
        curY += rowH;
      }

      // Fondo alterno
      if (idx % 2 === 0) {
        pdfDoc.save();
        pdfDoc.rect(tableLeft, curY, colWidths.reduce((a, b) => a + b, 0), rowH).fill('#F5F5F5');
        pdfDoc.restore();
      }

      drawRow(curY, [
        String(r.id),
        r.fecha ? new Date(r.fecha).toLocaleDateString('sv-SE') : '—',
        r.estado || '',
        r.proyecto_codigo || '',
        (r.proyecto_nombre || '').substring(0, 22),
        (r.cliente || '—').substring(0, 16),
        r.area || '',
        r.responsable || '',
        (r.insumos || '—').substring(0, 25)
      ], false);

      curY += rowH;
    });

    // Footer
    pdfDoc.moveDown(1);
    pdfDoc.font('Helvetica').fontSize(9).fillColor('#888888')
      .text(`Total: ${rows.length} orden(es) de trabajo programadas`, tableLeft, curY + 12);

    await auditoria.registrar(req.user?.id, 'Exportar reporte', `Programación semanal exportada en formato PDF (${rows.length} registro(s))`);

    pdfDoc.end();
  } catch (err) {
    console.error('Error exportando PDF:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error generando el archivo. Intente nuevamente.' });
    }
  }
}

/**
 * GET /api/reportes/areas
 * CU-69: Lista áreas de trabajo para filtro de consumo por área
 */
async function listarAreas(req, res) {
  try {
    const { rows } = await query(
      `SELECT area_trabajo_id_area AS id, area_trabajo_nombre_area AS nombre
       FROM area_trabajo
       ORDER BY area_trabajo_nombre_area`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error listando áreas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { reporteMovimientos, reporteMermas, valorizacion, consumoArea, programacionSemanal, exportarProgramacion, exportarProgramacionPDF, listarAreas };
