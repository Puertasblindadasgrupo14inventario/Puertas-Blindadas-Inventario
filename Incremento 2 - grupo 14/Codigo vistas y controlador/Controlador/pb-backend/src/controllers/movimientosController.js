const { query } = require('../db/pool');
const auditoria = require('./auditoriaController');
const { generarAlertasAutomaticas } = require('./alertasController');

// CU-106 CP2: Helper de reintento para errores de concurrencia (serialization failure)
async function queryConReintento(sql, params, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      return await query(sql, params);
    } catch (err) {
      if (err.code === '40001' && i < intentos - 1) {
        await new Promise(r => setTimeout(r, 50 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
}

/**
 * GET /api/movimientos
 * Historial de movimientos con filtros
 * Query params: ?buscar=&tipo=&desde=&hasta=&page=&limit=
 */
async function listar(req, res) {
  const { buscar, tipo, desde, hasta, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { rows } = await query(
      `SELECT
         mi.movimiento_inventario_id_movimiento          AS id,
         mi.movimiento_inventario_fecha_hora             AS fecha_hora,
         mi.movimiento_inventario_cantidad               AS cantidad,
         mi.movimiento_inventario_estado                 AS estado,
         mi.material_sku                                 AS sku,
         m.material_nombre_material                      AS material_nombre,
         b.bodega_nombre_bodega                          AS bodega,
         tm.movimiento_inventario_tipo_movimiento_nombre AS tipo,
         mot.movimiento_inventario_motivo_movimiento_nombre AS motivo,
         cs.movimiento_inventario_clasificacion_salida_nombre AS clasificacion_salida,
         u.usuario_username                              AS usuario,
         l.lote_numero_lote                              AS lote,
         p.nombre_referencia                             AS proyecto_nombre,
         p.codigo_proyecto                               AS proyecto_codigo,
         prov.proveedor_razon_social                     AS proveedor
       FROM movimiento_inventario mi
       JOIN material m   ON m.material_sku = mi.material_sku
       JOIN movimiento_inventario_tipo_movimiento tm
            ON tm.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
             = mi.movimiento_inventario_tipo_movimiento_id_tipo_movimiento
       LEFT JOIN bodega b ON b.bodega_id_bodega = mi.bodega_id_bodega
       LEFT JOIN movimiento_inventario_motivo_movimiento mot
            ON mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
             = mi.movimiento_inventario_motivo_movimiento_id_motivo_movimiento
       LEFT JOIN movimiento_inventario_clasificacion_salida cs
            ON cs.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
             = mot.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
       LEFT JOIN usuario u ON u.usuario_id_usuario = mi.usuario_id_usuario
       LEFT JOIN lote l    ON l.lote_id_lote = mi.lote_id_lote
       LEFT JOIN terreno.proyecto p ON p.id_proyecto = mi.proyecto_id_proyecto
       LEFT JOIN proveedor prov ON prov.proveedor_id_proveedor = l.proveedor_id_proveedor
       WHERE ($1::text IS NULL OR
              mi.material_sku ILIKE '%' || $1 || '%' OR
              m.material_nombre_material ILIKE '%' || $1 || '%' OR
              u.usuario_username ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR tm.movimiento_inventario_tipo_movimiento_nombre ILIKE '%' || $2 || '%')
         AND ($3::date IS NULL OR mi.movimiento_inventario_fecha_hora >= $3::date)
         AND ($4::date IS NULL OR mi.movimiento_inventario_fecha_hora < ($4::date + INTERVAL '1 day'))
       ORDER BY mi.movimiento_inventario_fecha_hora DESC
       LIMIT $5 OFFSET $6`,
      [buscar || null, tipo || null, desde || null, hasta || null, limit, offset]
    );
    // Intentar enriquecer con descripcion_motivo (solo si la columna existe)
    try {
      if (rows.length > 0) {
        const ids = rows.map(r => r.id);
        const { rows: descs } = await query(
          `SELECT movimiento_inventario_id_movimiento AS id,
                  movimiento_inventario_descripcion_motivo AS descripcion_motivo
           FROM movimiento_inventario
           WHERE movimiento_inventario_id_movimiento = ANY($1::bigint[])`,
          [ids]
        );
        const descMap = {};
        descs.forEach(d => { if (d.descripcion_motivo) descMap[d.id] = d.descripcion_motivo; });
        rows.forEach(r => { if (descMap[r.id]) r.descripcion_motivo = descMap[r.id]; });
      }
    } catch (_) { /* columna no existe aún — no pasa nada */ }

    res.json(rows);
  } catch (err) {
    console.error('Error listando movimientos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /api/movimientos/catalogos
 * Tipos y motivos de movimiento para los formularios
 */
async function catalogos(req, res) {
  try {
    const [tipos, motivos, clasificaciones] = await Promise.all([
      query(`SELECT movimiento_inventario_tipo_movimiento_id_tipo_movimiento AS id,
                    movimiento_inventario_tipo_movimiento_nombre AS nombre
             FROM movimiento_inventario_tipo_movimiento ORDER BY nombre`),
      query(`SELECT movimiento_inventario_motivo_movimiento_id_motivo_movimiento AS id,
                    movimiento_inventario_motivo_movimiento_nombre AS nombre,
                    movimiento_inventario_clasificacion_salida_id_clasificacion_salida AS clasificacion_id
             FROM movimiento_inventario_motivo_movimiento ORDER BY nombre`),
      query(`SELECT movimiento_inventario_clasificacion_salida_id_clasificacion_salida AS id,
                    movimiento_inventario_clasificacion_salida_nombre AS nombre
             FROM movimiento_inventario_clasificacion_salida ORDER BY nombre`),
    ]);
    res.json({
      tipos: tipos.rows,
      motivos: motivos.rows,
      clasificaciones: clasificaciones.rows,
    });
  } catch (err) {
    console.error('Error obteniendo catalogos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/entrada
 * Registrar entrada de stock (FR-18, FR-22)
 */
async function registrarEntrada(req, res) {
  const {
    sku, bodega_id, cantidad,
    proveedor_id, numero_lote, fecha_vencimiento,
    tipo_movimiento_id, numero_factura
  } = req.body;

  const userId = req.user.id;

  if (!sku || !bodega_id || !cantidad || !tipo_movimiento_id) {
    return res.status(400).json({ error: 'SKU, bodega, cantidad y tipo de movimiento son requeridos' });
  }
  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
  }

  try {
    // Verificar que el material existe
    const { rows: mat } = await query(
      `SELECT material_sku FROM material WHERE material_sku = $1`, [sku]
    );
    if (mat.length === 0) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Crear o reusar lote
    let loteId;
    if (numero_lote) {
      const { rows: loteExist } = await query(
        `SELECT lote_id_lote FROM lote WHERE lote_numero_lote = $1`, [numero_lote]
      );
      if (loteExist.length > 0) {
        loteId = loteExist[0].lote_id_lote;
      } else {
        const { rows: loteNuevo } = await query(
          `INSERT INTO lote (lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento,
                             lote_fecha_recepcion, lote_estado, proveedor_id_proveedor)
           VALUES ($1, now(), $2, now(), 'activo', $3)
           RETURNING lote_id_lote`,
          [numero_lote, fecha_vencimiento || null, proveedor_id || null]
        );
        loteId = loteNuevo[0].lote_id_lote;
      }
    } else {
      // Crear lote con número automático
      const { rows: loteGen } = await query(
        `INSERT INTO lote (lote_fecha_ingreso, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor)
         VALUES (now(), now(), 'activo', $1)
         RETURNING lote_id_lote`,
        [proveedor_id || null]
      );
      loteId = loteGen[0].lote_id_lote;
      // Generar número automático LOTE-YYYYMMDD-{id}
      const fechaStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
      await query(
        `UPDATE lote SET lote_numero_lote = $1 WHERE lote_id_lote = $2`,
        [`LOTE-${fechaStr}-${loteId}`, loteId]
      );
    }

    // CU-28/CU-32: vincular factura de compra si se proporcionó
    let facturaId = null;
    const { factura_id, factura_numero, factura_fecha } = req.body;

    // CU-32 Exc 1: si se proporciona uno, ambos son obligatorios
    if ((factura_numero && !factura_fecha) || (!factura_numero && factura_fecha)) {
      return res.status(400).json({
        error: 'Para asociar una factura debe ingresar tanto el número de factura como la fecha de emisión.'
      });
    }

    // CU-32 Exc 2: validar formato de fecha de factura
    if (factura_fecha) {
      const fechaFactura = new Date(factura_fecha);
      if (isNaN(fechaFactura.getTime())) {
        return res.status(400).json({ error: 'La fecha de emisión de la factura no tiene un formato válido.' });
      }
      const hoy = new Date();
      hoy.setHours(23,59,59,999);
      if (fechaFactura > hoy) {
        return res.status(400).json({ error: 'La fecha de emisión de la factura no puede ser una fecha futura.' });
      }
    }

    // CU-32 Exc 3: detectar factura duplicada y advertir
    if (factura_numero) {
      const { rows: facDup } = await query(
        `SELECT factura_compra_id_factura AS id FROM factura_compra
         WHERE factura_compra_numero_factura = $1`, [factura_numero]
      );
      if (facDup.length > 0) {
        return res.status(409).json({
          error: 'El número de factura "' + factura_numero + '" ya se encuentra registrado en otro movimiento. Verifique el documento.'
        });
      }
    }

    if (factura_id) {
      facturaId = factura_id;
    } else if (factura_numero && factura_fecha) {
      // Crear factura on-the-fly
      const { rows: facNueva } = await query(
        `INSERT INTO factura_compra (
           factura_compra_numero_factura, factura_compra_fecha_emision, proveedor_id_proveedor
         ) VALUES ($1, $2, $3)
         RETURNING factura_compra_id_factura AS id`,
        [factura_numero, factura_fecha, proveedor_id || null]
      );
      facturaId = facNueva[0].id;
      // También vincular factura al lote
      await query(
        `UPDATE lote SET factura_compra_id_factura = $1 WHERE lote_id_lote = $2`,
        [facturaId, loteId]
      );
    }

    // Registrar movimiento
    const { rows: mov } = await query(
      `INSERT INTO movimiento_inventario (
         movimiento_inventario_cantidad, movimiento_inventario_estado,
         material_sku, bodega_id_bodega, lote_id_lote,
         usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento,
         factura_compra_id_factura_compra
       ) VALUES ($1, 'completado', $2, $3, $4, $5, $6, $7)
       RETURNING movimiento_inventario_id_movimiento AS id`,
      [cantidad, sku, bodega_id, loteId, userId, tipo_movimiento_id, facturaId]
    );

    // CU-106 CP2: Actualizar inventario_bodega (upsert) con reintento por concurrencia
    await queryConReintento(
      `INSERT INTO inventario_bodega
         (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (material_sku, lote_id_lote, bodega_id_bodega)
       DO UPDATE SET inventario_bodega_cantidad_fisica =
         inventario_bodega.inventario_bodega_cantidad_fisica + EXCLUDED.inventario_bodega_cantidad_fisica`,
      [sku, loteId, bodega_id, cantidad]
    );

    auditoria.registrar(req.user?.id, 'registrar_entrada', `SKU: ${sku}, cantidad: ${cantidad}, bodega: ${bodega_id}`);
    generarAlertasAutomaticas().catch(e => console.warn('Alertas:', e.message));

    // CU-114: Verificar si hay alertas de faltante activas para este SKU
    let alertas_faltante = [];
    try {
      const { rows: alertaRows } = await query(
        `SELECT afp.alerta_faltante_pedido_id_alerta_faltante AS id,
                afp.alerta_faltante_pedido_cantidad_disponible AS cantidad_disponible,
                afp.alerta_faltante_pedido_cantidad_requerida AS cantidad_requerida,
                afp.alerta_faltante_pedido_estado AS estado,
                afp.proyecto_id_proyecto AS proyecto_id
         FROM alerta_faltante_pedido afp
         WHERE afp.material_sku = $1
           AND afp.alerta_faltante_pedido_estado IN ('activa', 'en_gestion')`,
        [sku]
      );
      alertas_faltante = alertaRows;

      // CU-114: Auto-resolver alertas si el stock ahora cubre el requerimiento
      if (alertaRows.length > 0) {
        const { rows: stockRows } = await query(
          `SELECT COALESCE(SUM(inventario_bodega_cantidad_fisica - inventario_bodega_cantidad_reservada), 0) AS disponible
           FROM inventario_bodega WHERE material_sku = $1`,
          [sku]
        );
        const stockActual = parseFloat(stockRows[0]?.disponible || 0);

        for (const alerta of alertaRows) {
          const requerido = parseFloat(alerta.cantidad_requerida || 0);
          if (stockActual >= requerido) {
            await query(
              `UPDATE alerta_faltante_pedido
               SET alerta_faltante_pedido_estado = 'resuelta',
                   alerta_faltante_pedido_cantidad_disponible = $2
               WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
              [alerta.id, stockActual]
            );
            auditoria.registrar(req.user?.id, 'auto_resolver_faltante',
              `Alerta #${alerta.id} resuelta automáticamente tras ingreso de ${sku}. Stock actual: ${stockActual}`);
          } else {
            // CU-114 CP2: Stock aumentó pero no cubre requerimiento — marcar en gestión
            const disponibleAnterior = parseFloat(alerta.cantidad_disponible || 0);
            if (stockActual > disponibleAnterior) {
              await query(
                `UPDATE alerta_faltante_pedido
                 SET alerta_faltante_pedido_estado = 'en_gestion',
                     alerta_faltante_pedido_cantidad_disponible = $2
                 WHERE alerta_faltante_pedido_id_alerta_faltante = $1`,
                [alerta.id, stockActual]
              );
              auditoria.registrar(req.user?.id, 'actualizar_faltante',
                `Alerta #${alerta.id} actualizada a en_gestion tras ingreso de ${sku}. Stock: ${disponibleAnterior} → ${stockActual} (requerido: ${requerido})`);
            }
          }
        }

        // Refrescar lista tras auto-resolución
        const { rows: alertasPostResolve } = await query(
          `SELECT alerta_faltante_pedido_id_alerta_faltante AS id,
                  alerta_faltante_pedido_estado AS estado
           FROM alerta_faltante_pedido
           WHERE material_sku = $1
             AND alerta_faltante_pedido_estado IN ('activa', 'en_gestion')`,
          [sku]
        );
        alertas_faltante = alertasPostResolve;
      }
    } catch (e) {
      console.warn('CU-114: Error consultando alertas faltante:', e.message);
    }

    // CU-114: Buscar proveedor con mejor tiempo de reposición para aviso
    let proveedor_info = null;
    try {
      const { rows: provRows } = await query(
        `SELECT p.proveedor_nombre_proveedor AS nombre,
                mp.material_proveedor_tiempo_reposicion AS tiempo_reposicion
         FROM material_proveedor mp
         JOIN proveedor p ON p.proveedor_id_proveedor = mp.proveedor_id_proveedor
         WHERE mp.material_sku = $1
         ORDER BY mp.material_proveedor_proveedor_principal DESC,
                  mp.material_proveedor_tiempo_reposicion ASC NULLS LAST
         LIMIT 1`,
        [sku]
      );
      if (provRows.length > 0) proveedor_info = provRows[0];
    } catch (e) { /* no-op */ }

    res.status(201).json({
      message: 'Entrada registrada correctamente',
      movimiento_id: mov[0].id,
      lote_id: loteId,
      ...(alertas_faltante.length > 0 && {
        alertas_faltante,
        aviso_faltantes: `Existen ${alertas_faltante.length} alerta(s) de faltante activa(s) para este SKU. Considere resolverlas.`,
        ...(proveedor_info && { proveedor_sugerido: proveedor_info })
      })
    });
  } catch (err) {
    console.error('Error registrando entrada:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/salida
 * Registrar salida de stock (FR-19, FR-24, FR-25)
 */
async function registrarSalida(req, res) {
  const {
    sku, bodega_id, cantidad,
    tipo_movimiento_id, motivo_id, descripcion_motivo
  } = req.body;

  const userId = req.user.id;

  if (!sku || !bodega_id || !cantidad || !tipo_movimiento_id) {
    return res.status(400).json({ error: 'SKU, bodega, cantidad y tipo de movimiento son requeridos' });
  }
  if (cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
  }

  try {
    // Verificar stock disponible
    const { rows: stock } = await query(
      `SELECT
         COALESCE(SUM(inventario_bodega_cantidad_fisica), 0) -
         COALESCE(SUM(inventario_bodega_cantidad_reservada), 0) AS disponible
       FROM inventario_bodega
       WHERE material_sku = $1 AND bodega_id_bodega = $2`,
      [sku, bodega_id]
    );

    const disponible = parseFloat(stock[0]?.disponible || 0);
    if (cantidad > disponible) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${disponible}`,
        stock_disponible: disponible
      });
    }

    // Obtener lote FIFO (el más antiguo con stock)
    const { rows: lotes } = await query(
      `SELECT ib.lote_id_lote,
              ib.inventario_bodega_cantidad_fisica - ib.inventario_bodega_cantidad_reservada AS disponible
       FROM inventario_bodega ib
       JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
       WHERE ib.material_sku = $1
         AND ib.bodega_id_bodega = $2
         AND ib.inventario_bodega_cantidad_fisica > ib.inventario_bodega_cantidad_reservada
       ORDER BY l.lote_fecha_ingreso ASC NULLS LAST`,
      [sku, bodega_id]
    );

    // CU-68.1: Detectar si es merma de producto crítico ANTES de descontar
    let esMermaCritica = false;
    if (motivo_id) {
      const { rows: clasif } = await query(
        `SELECT cs.movimiento_inventario_clasificacion_salida_nombre AS nombre
         FROM movimiento_inventario_motivo_movimiento mot
         LEFT JOIN movimiento_inventario_clasificacion_salida cs
              ON cs.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
               = mot.movimiento_inventario_clasificacion_salida_id_clasificacion_salida
         WHERE mot.movimiento_inventario_motivo_movimiento_id_motivo_movimiento = $1`,
        [motivo_id]
      );
      const esMerma = clasif[0]?.nombre?.toLowerCase().includes('pérdida') ||
                      clasif[0]?.nombre?.toLowerCase().includes('perdida') ||
                      clasif[0]?.nombre?.toLowerCase().includes('merma');

      const { rows: matInfo } = await query(
        `SELECT material_material_critico AS es_critico FROM material WHERE material_sku = $1`, [sku]
      );
      const esCritico = matInfo[0]?.es_critico === true;

      esMermaCritica = esMerma && esCritico && req.user?.rol !== 'gerencia';
    }

    // Determinar estado del movimiento
    const estadoMov = esMermaCritica ? 'pendiente_aprobacion' : 'completado';

    // Descontar por FIFO
    let restante = parseFloat(cantidad);
    for (const lote of lotes) {
      if (restante <= 0) break;
      const descontar = Math.min(restante, parseFloat(lote.disponible));
      // CU-106 CP2: Reintento por concurrencia en descuento de stock
      await queryConReintento(
        `UPDATE inventario_bodega
         SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica - $1
         WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
        [descontar, sku, lote.lote_id_lote, bodega_id]
      );
      restante -= descontar;
    }

    // Intentar INSERT con descripcion_motivo; fallback sin ella si columna no existe
    let mov;
    try {
      ({ rows: mov } = await query(
        `INSERT INTO movimiento_inventario (
           movimiento_inventario_cantidad, movimiento_inventario_estado,
           material_sku, bodega_id_bodega,
           usuario_id_usuario,
           movimiento_inventario_tipo_movimiento_id_tipo_movimiento,
           movimiento_inventario_motivo_movimiento_id_motivo_movimiento,
           movimiento_inventario_descripcion_motivo
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING movimiento_inventario_id_movimiento AS id`,
        [cantidad, estadoMov, sku, bodega_id, userId, tipo_movimiento_id, motivo_id || null, descripcion_motivo || null]
      ));
    } catch (e) {
      if (e.message && e.message.includes('descripcion_motivo')) {
        ({ rows: mov } = await query(
          `INSERT INTO movimiento_inventario (
             movimiento_inventario_cantidad, movimiento_inventario_estado,
             material_sku, bodega_id_bodega,
             usuario_id_usuario,
             movimiento_inventario_tipo_movimiento_id_tipo_movimiento,
             movimiento_inventario_motivo_movimiento_id_motivo_movimiento
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING movimiento_inventario_id_movimiento AS id`,
          [cantidad, estadoMov, sku, bodega_id, userId, tipo_movimiento_id, motivo_id || null]
        ));
      } else {
        throw e;
      }
    }

    // CU-68.1: notificar a gerencia si es merma crítica pendiente
    if (esMermaCritica) {
      const { notificarPorRol } = require('./notificacionesController');
      notificarPorRol({
        tipo: 'merma_pendiente',
        mensaje: `Merma de producto crítico (${sku}) pendiente de aprobación. Cantidad: ${cantidad}`,
        origen: 'movimientos',
        rol: 'gerencia'
      });
    }

    auditoria.registrar(req.user?.id, 'registrar_salida', `SKU: ${sku}, cantidad: ${cantidad}, bodega: ${bodega_id}`);
    generarAlertasAutomaticas().catch(e => console.warn('Alertas:', e.message));
    res.status(201).json({
      message: esMermaCritica
        ? 'Merma registrada como pendiente de aprobación. Se notificó a Gerencia.'
        : 'Salida registrada correctamente',
      movimiento_id: mov[0].id,
      pendiente_aprobacion: esMermaCritica
    });
  } catch (err) {
    console.error('Error registrando salida:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/:id/revertir
 * Revertir un movimiento (FR-30) — solo gerencia
 */
async function revertir(req, res) {
  const { id } = req.params;

  try {
    // Obtener movimiento original
    const { rows: mov } = await query(
      `SELECT * FROM movimiento_inventario WHERE movimiento_inventario_id_movimiento = $1`, [id]
    );

    if (mov.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }

    const m = mov[0];

    if (m.movimiento_inventario_estado === 'revertido') {
      return res.status(400).json({ error: 'Este movimiento ya fue revertido' });
    }

    // Obtener tipo para saber si fue entrada o salida
    const { rows: tipo } = await query(
      `SELECT movimiento_inventario_tipo_movimiento_nombre AS nombre
       FROM movimiento_inventario_tipo_movimiento
       WHERE movimiento_inventario_tipo_movimiento_id_tipo_movimiento = $1`,
      [m.movimiento_inventario_tipo_movimiento_id_tipo_movimiento]
    );

    const esEntrada = tipo[0]?.nombre?.toLowerCase().includes('entrada');

    if (m.bodega_id_bodega) {
      if (esEntrada) {
        // Revertir entrada: descontar del lote específico
        if (m.lote_id_lote) {
          await query(
            `UPDATE inventario_bodega
             SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica - $1
             WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
            [m.movimiento_inventario_cantidad, m.material_sku, m.lote_id_lote, m.bodega_id_bodega]
          );
        }
      } else {
        // Revertir salida: reponer stock
        if (m.lote_id_lote) {
          // Si tiene lote específico, reponer ahí
          await query(
            `UPDATE inventario_bodega
             SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica + $1
             WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
            [m.movimiento_inventario_cantidad, m.material_sku, m.lote_id_lote, m.bodega_id_bodega]
          );
        } else {
          // EXTRA fix: Salida sin lote registrado — reponer al lote más antiguo en esa bodega
          const { rows: loteDest } = await query(
            `SELECT ib.lote_id_lote
             FROM inventario_bodega ib
             JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
             WHERE ib.material_sku = $1 AND ib.bodega_id_bodega = $2
             ORDER BY l.lote_fecha_ingreso ASC NULLS LAST
             LIMIT 1`,
            [m.material_sku, m.bodega_id_bodega]
          );
          if (loteDest.length > 0) {
            await query(
              `UPDATE inventario_bodega
               SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica + $1
               WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
              [m.movimiento_inventario_cantidad, m.material_sku, loteDest[0].lote_id_lote, m.bodega_id_bodega]
            );
          }
        }
      }
    }

    // Marcar como revertido
    await query(
      `UPDATE movimiento_inventario SET movimiento_inventario_estado = 'revertido'
       WHERE movimiento_inventario_id_movimiento = $1`, [id]
    );

    auditoria.registrar(req.user?.id, 'revertir_movimiento', `ID movimiento: ${id}`);
    res.json({ message: 'Movimiento revertido correctamente' });
  } catch (err) {
    console.error('Error revirtiendo movimiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/movimientos/:id/aprobar-merma
 * Gerencia aprueba una merma de producto crítico (CU-68.1)
 */
async function aprobarMerma(req, res) {
  const { id } = req.params;
  try {
    const { rows: mov } = await query(
      `SELECT movimiento_inventario_id_movimiento AS id,
              movimiento_inventario_estado AS estado,
              material_sku AS sku,
              movimiento_inventario_cantidad AS cantidad
       FROM movimiento_inventario WHERE movimiento_inventario_id_movimiento = $1`,
      [id]
    );

    if (mov.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    if (mov[0].estado !== 'pendiente_aprobacion') {
      return res.status(400).json({ error: 'Este movimiento no está pendiente de aprobación' });
    }

    await query(
      `UPDATE movimiento_inventario SET movimiento_inventario_estado = 'completado'
       WHERE movimiento_inventario_id_movimiento = $1`, [id]
    );

    auditoria.registrar(req.user?.id, 'aprobar_merma', `ID: ${id}, SKU: ${mov[0].sku}, cantidad: ${mov[0].cantidad}`);
    res.json({ message: 'Merma aprobada correctamente' });
  } catch (err) {
    console.error('Error aprobando merma:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/movimientos/:id/rechazar-merma
 * Gerencia rechaza merma → revertir stock (CU-68.1)
 */
async function rechazarMerma(req, res) {
  const { id } = req.params;
  try {
    const { rows: mov } = await query(
      `SELECT movimiento_inventario_id_movimiento AS id,
              movimiento_inventario_estado AS estado,
              material_sku AS sku,
              movimiento_inventario_cantidad AS cantidad,
              bodega_id_bodega AS bodega_id
       FROM movimiento_inventario WHERE movimiento_inventario_id_movimiento = $1`,
      [id]
    );

    if (mov.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    if (mov[0].estado !== 'pendiente_aprobacion') {
      return res.status(400).json({ error: 'Este movimiento no está pendiente de aprobación' });
    }

    const m = mov[0];

    // Devolver stock descontado (FIFO inverso: al lote más reciente)
    const { rows: lotes } = await query(
      `SELECT ib.lote_id_lote
       FROM inventario_bodega ib
       JOIN lote l ON l.lote_id_lote = ib.lote_id_lote
       WHERE ib.material_sku = $1 AND ib.bodega_id_bodega = $2
       ORDER BY l.lote_fecha_ingreso DESC NULLS LAST
       LIMIT 1`,
      [m.sku, m.bodega_id]
    );

    if (lotes.length > 0) {
      await query(
        `UPDATE inventario_bodega
         SET inventario_bodega_cantidad_fisica = inventario_bodega_cantidad_fisica + $1
         WHERE material_sku = $2 AND lote_id_lote = $3 AND bodega_id_bodega = $4`,
        [m.cantidad, m.sku, lotes[0].lote_id_lote, m.bodega_id]
      );
    }

    await query(
      `UPDATE movimiento_inventario SET movimiento_inventario_estado = 'rechazado'
       WHERE movimiento_inventario_id_movimiento = $1`, [id]
    );

    auditoria.registrar(req.user?.id, 'rechazar_merma', `ID: ${id}, SKU: ${m.sku}, cantidad: ${m.cantidad}`);
    res.json({ message: 'Merma rechazada. Stock devuelto a la bodega.' });
  } catch (err) {
    console.error('Error rechazando merma:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/movimientos/verificar-mermas-pendientes
 * CU-74 CP3: Notificación de emergencia si merma lleva >24h pendiente
 */
async function verificarMermasPendientes(req, res) {
  try {
    const { rows } = await query(
      `SELECT mi.movimiento_inventario_id_movimiento AS id,
              mi.material_sku AS sku,
              mi.movimiento_inventario_cantidad AS cantidad,
              mi.movimiento_inventario_fecha_hora AS fecha
       FROM movimiento_inventario mi
       WHERE mi.movimiento_inventario_estado = 'pendiente_aprobacion'
         AND mi.movimiento_inventario_fecha_hora < now() - INTERVAL '24 hours'`
    );
    let notificadas = 0;
    for (const m of rows) {
      // Verificar si ya se envió notificación de emergencia para este movimiento
      const { rows: yaNotif } = await query(
        `SELECT 1 FROM notificacion
         WHERE notificacion_tipo_notificacion = 'merma_emergencia'
           AND notificacion_mensaje ILIKE '%ID: ' || $1 || '%'
         LIMIT 1`,
        [String(m.id)]
      );
      if (yaNotif.length > 0) continue;

      const { notificarPorRol } = require('./notificacionesController');
      notificarPorRol({
        tipo: 'merma_emergencia',
        mensaje: `EMERGENCIA: Merma de ${m.sku} (ID: ${m.id}, ${m.cantidad} uds.) lleva más de 24 horas pendiente de aprobación.`,
        origen: 'movimientos',
        rol: 'gerencia'
      });
      notificadas++;
    }
    res.json({ message: `${notificadas} notificación(es) de emergencia generada(s)`, total: notificadas });
  } catch (err) {
    console.error('Error verificando mermas pendientes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { listar, catalogos, registrarEntrada, registrarSalida, revertir, aprobarMerma, rechazarMerma, verificarMermasPendientes };
