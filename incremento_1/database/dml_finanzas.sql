--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-14 21:30:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5724 (class 0 OID 27576)
-- Dependencies: 257
-- Data for Name: categoria_gasto; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Materiales', 'Compra de materiales e insumos', true);
INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Mano de obra', 'Costos de personal', true);
INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Transporte', 'Fletes y despachos', true);
INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (4, 'Gastos generales', 'Varios no clasificados', true);


--
-- TOC entry 5695 (class 0 OID 27332)
-- Dependencies: 228
-- Data for Name: tipo_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_cliente (id_tipo_cliente, nombre_tipo_cliente, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'B2B', 'Empresa o institución', true);
INSERT INTO finanzas.tipo_cliente (id_tipo_cliente, nombre_tipo_cliente, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'B2C', 'Persona natural', true);


--
-- TOC entry 5697 (class 0 OID 27346)
-- Dependencies: 230
-- Data for Name: cliente_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.cliente_financiero (id_cliente_financiero, rut_cliente, id_tipo_cliente, nombre_razon_social, telefono_principal, correo_principal, estado_cliente, fecha_creacion, fecha_actualizacion_datos) OVERRIDING SYSTEM VALUE VALUES (1, '76543210-1', 1, 'Constructora Andes SpA', '+56922334455', 'contacto@andes.cl', 'activo', '2026-06-02 23:10:18.751781-04', NULL);
INSERT INTO finanzas.cliente_financiero (id_cliente_financiero, rut_cliente, id_tipo_cliente, nombre_razon_social, telefono_principal, correo_principal, estado_cliente, fecha_creacion, fecha_actualizacion_datos) OVERRIDING SYSTEM VALUE VALUES (2, '87654321-2', 1, 'Inmobiliaria del Sur Ltda', '+56933445566', 'info@inmsur.cl', 'activo', '2026-06-02 23:10:18.751781-04', NULL);
INSERT INTO finanzas.cliente_financiero (id_cliente_financiero, rut_cliente, id_tipo_cliente, nombre_razon_social, telefono_principal, correo_principal, estado_cliente, fecha_creacion, fecha_actualizacion_datos) OVERRIDING SYSTEM VALUE VALUES (3, '98765432-3', 2, 'Roberto Figueroa', '+56944556677', 'rfigueroa@gmail.com', 'activo', '2026-06-02 23:10:18.751781-04', NULL);


--
-- TOC entry 5722 (class 0 OID 27558)
-- Dependencies: 255
-- Data for Name: tipo_documento_compra_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_documento_compra_proveedor (id_tipo_documento_compra, nombre_tipo_documento_compra, descripcion, es_preliminar, genera_obligacion_pago, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Factura proveedor', NULL, false, true, true);
INSERT INTO finanzas.tipo_documento_compra_proveedor (id_tipo_documento_compra, nombre_tipo_documento_compra, descripcion, es_preliminar, genera_obligacion_pago, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Orden de compra', NULL, true, false, true);
INSERT INTO finanzas.tipo_documento_compra_proveedor (id_tipo_documento_compra, nombre_tipo_documento_compra, descripcion, es_preliminar, genera_obligacion_pago, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Guía de despacho', NULL, true, false, true);


--
-- TOC entry 5726 (class 0 OID 27590)
-- Dependencies: 259
-- Data for Name: documento_compra_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.documento_compra_proveedor (id_documento_compra_proveedor, id_proveedor, id_tipo_documento_compra, id_categoria_gasto, numero_documento, fecha_emision, fecha_vencimiento, moneda, tipo_cambio, monto_neto, tasa_iva_aplicada, tasa_retencion_aplicada, estado_documento, archivo_url, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 'FAC-PROV-001', '2024-10-01', NULL, 'CLP', NULL, 3700000.00, 19.00, NULL, 'contabilizado', NULL, NULL);
INSERT INTO finanzas.documento_compra_proveedor (id_documento_compra_proveedor, id_proveedor, id_tipo_documento_compra, id_categoria_gasto, numero_documento, fecha_emision, fecha_vencimiento, moneda, tipo_cambio, monto_neto, tasa_iva_aplicada, tasa_retencion_aplicada, estado_documento, archivo_url, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 1, 1, 'FAC-PROV-002', '2024-10-05', NULL, 'CLP', NULL, 890000.00, 19.00, NULL, 'contabilizado', NULL, NULL);
INSERT INTO finanzas.documento_compra_proveedor (id_documento_compra_proveedor, id_proveedor, id_tipo_documento_compra, id_categoria_gasto, numero_documento, fecha_emision, fecha_vencimiento, moneda, tipo_cambio, monto_neto, tasa_iva_aplicada, tasa_retencion_aplicada, estado_documento, archivo_url, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 1, 1, 'FAC-PROV-003', '2024-10-10', NULL, 'CLP', NULL, 336000.00, 19.00, NULL, 'contabilizado', NULL, NULL);


--
-- TOC entry 5690 (class 0 OID 27300)
-- Dependencies: 223
-- Data for Name: empleado_cargo; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (1, 'Gerente General', 3500000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (2, 'Jefe de Operaciones', 2800000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (3, 'Encargado de Bodega', 1800000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (4, 'Administrador Sistema', 2200000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (5, 'Técnico Instalador', 1600000.00);


--
-- TOC entry 5692 (class 0 OID 27309)
-- Dependencies: 225
-- Data for Name: empleado_tipo_vinculo_laboral; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.empleado_tipo_vinculo_laboral (empleado_tipo_vinculo_laboral_id_tipo_vinculo, empleado_tipo_vinculo_laboral_nombre, empleado_tipo_vinculo_laboral_seguro_cesantia) OVERRIDING SYSTEM VALUE VALUES (1, 'indefinido', true);
INSERT INTO finanzas.empleado_tipo_vinculo_laboral (empleado_tipo_vinculo_laboral_id_tipo_vinculo, empleado_tipo_vinculo_laboral_nombre, empleado_tipo_vinculo_laboral_seguro_cesantia) OVERRIDING SYSTEM VALUE VALUES (2, 'plazo_fijo', true);
INSERT INTO finanzas.empleado_tipo_vinculo_laboral (empleado_tipo_vinculo_laboral_id_tipo_vinculo, empleado_tipo_vinculo_laboral_nombre, empleado_tipo_vinculo_laboral_seguro_cesantia) OVERRIDING SYSTEM VALUE VALUES (3, 'honorarios', false);


--
-- TOC entry 5693 (class 0 OID 27318)
-- Dependencies: 226
-- Data for Name: empleado; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('12345678-9', 'Álvaro', NULL, 'Morales', NULL, 'activo', '2018-03-01', NULL, NULL, NULL, 1, 1);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('23456789-0', 'Olivia', NULL, 'Ramírez', NULL, 'activo', '2019-06-15', NULL, NULL, NULL, 2, 1);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('34567890-1', 'Juan', NULL, 'Pérez', NULL, 'activo', '2020-01-10', NULL, NULL, NULL, 3, 1);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('45678901-2', 'Marcela', NULL, 'Soto', NULL, 'activo', '2021-04-20', NULL, NULL, NULL, 4, 2);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('56789012-3', 'Pedro', NULL, 'Vásquez', NULL, 'activo', '2022-08-01', NULL, NULL, NULL, 5, 3);


--
-- TOC entry 5732 (class 0 OID 27639)
-- Dependencies: 265
-- Data for Name: gasto_caja_chica; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.gasto_caja_chica (id_gasto_caja, id_usuario_registra, id_usuario_valida, id_categoria_gasto, fecha_gasto, descripcion, monto, respaldo_url, rendido, estado_validacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, 1, 3, '2024-11-05', 'Flete materiales a obra Andes', 45000.00, NULL, true, 'aprobado');
INSERT INTO finanzas.gasto_caja_chica (id_gasto_caja, id_usuario_registra, id_usuario_valida, id_categoria_gasto, fecha_gasto, descripcion, monto, respaldo_url, rendido, estado_validacion) OVERRIDING SYSTEM VALUE VALUES (2, 3, 1, 3, '2024-11-12', 'Flete materiales a obra Inmosur', 38000.00, NULL, true, 'aprobado');
INSERT INTO finanzas.gasto_caja_chica (id_gasto_caja, id_usuario_registra, id_usuario_valida, id_categoria_gasto, fecha_gasto, descripcion, monto, respaldo_url, rendido, estado_validacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, NULL, 4, '2024-11-15', 'Útiles de oficina bodega', 12000.00, NULL, false, 'pendiente');


--
-- TOC entry 5700 (class 0 OID 27374)
-- Dependencies: 233
-- Data for Name: proyecto_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.proyecto_financiero (id_proyecto_financiero, id_cliente_financiero, id_obra, id_proyecto_terreno, codigo_proyecto, nombre_referencia, fecha_ingreso, estado_financiero, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, 1, 'PRY-2024-001', 'Proyecto Andes Edificio A', '2024-09-01', 'activo', NULL);
INSERT INTO finanzas.proyecto_financiero (id_proyecto_financiero, id_cliente_financiero, id_obra, id_proyecto_terreno, codigo_proyecto, nombre_referencia, fecha_ingreso, estado_financiero, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, NULL, 2, 'PRY-2024-002', 'Proyecto Inmosur Torre B', '2024-10-01', 'activo', NULL);
INSERT INTO finanzas.proyecto_financiero (id_proyecto_financiero, id_cliente_financiero, id_obra, id_proyecto_terreno, codigo_proyecto, nombre_referencia, fecha_ingreso, estado_financiero, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, NULL, NULL, 'PRY-2024-003', 'Residencial Figueroa', '2024-11-01', 'activo', NULL);


--
-- TOC entry 5756 (class 0 OID 27824)
-- Dependencies: 289
-- Data for Name: tipo_tarea_catalogada; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_tarea_catalogada (id_tipo_tarea, nombre_tipo_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Instalación', 'Tareas de instalación en terreno', true);
INSERT INTO finanzas.tipo_tarea_catalogada (id_tipo_tarea, nombre_tipo_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Producción', 'Tareas de producción en planta', true);
INSERT INTO finanzas.tipo_tarea_catalogada (id_tipo_tarea, nombre_tipo_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Supervisión', 'Tareas de supervisión', true);


--
-- TOC entry 5758 (class 0 OID 27838)
-- Dependencies: 291
-- Data for Name: tarea_catalogada; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Instalación puerta simple', 'Instalación estándar puerta simple', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'Instalación puerta doble', 'Instalación puerta doble hoja', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 2, 'Corte y habilitación', 'Corte de materiales en planta', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'Pintura base', 'Aplicación de pintura base', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (5, 3, 'Supervisión instalación', 'Supervisión en terreno', true);


--
-- TOC entry 5760 (class 0 OID 27853)
-- Dependencies: 293
-- Data for Name: tarifa_tarea; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (1, 1, 120000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (2, 2, 180000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (3, 3, 45000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (4, 4, 35000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (5, 5, 90000.00, '2024-01-01', NULL, true);


--
-- TOC entry 5762 (class 0 OID 27865)
-- Dependencies: 295
-- Data for Name: tarea_remunerable; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, '34567890-1', 3, 3, 1, NULL, NULL, '2024-10-02', 1.00, 8.00, 'validado', NULL);
INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (2, '34567890-1', 4, 4, 1, NULL, NULL, '2024-10-03', 1.00, 6.00, 'validado', NULL);
INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (3, '56789012-3', 1, 1, 1, NULL, NULL, '2024-11-01', 4.00, 32.00, 'validado', NULL);
INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (4, '56789012-3', 2, 2, 2, NULL, NULL, '2024-11-05', 2.00, 24.00, 'pendiente', NULL);


--
-- TOC entry 5734 (class 0 OID 27657)
-- Dependencies: 267
-- Data for Name: costo_proyecto; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.costo_proyecto (id_costo_proyecto, id_proyecto_financiero, id_documento_compra_proveedor, id_gasto_caja, id_tarea_remunerable, id_movimiento_inventario, id_lote, id_categoria_gasto, monto_asignado, fecha_costo, descripcion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, NULL, NULL, NULL, NULL, 1, 3700000.00, '2024-10-01', 'Compra acero galvanizado FAC-PROV-001', NULL);
INSERT INTO finanzas.costo_proyecto (id_costo_proyecto, id_proyecto_financiero, id_documento_compra_proveedor, id_gasto_caja, id_tarea_remunerable, id_movimiento_inventario, id_lote, id_categoria_gasto, monto_asignado, fecha_costo, descripcion, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, NULL, NULL, NULL, NULL, 1, 890000.00, '2024-10-05', 'Compra pinturas FAC-PROV-002', NULL);
INSERT INTO finanzas.costo_proyecto (id_costo_proyecto, id_proyecto_financiero, id_documento_compra_proveedor, id_gasto_caja, id_tarea_remunerable, id_movimiento_inventario, id_lote, id_categoria_gasto, monto_asignado, fecha_costo, descripcion, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, 3, NULL, NULL, NULL, NULL, 1, 336000.00, '2024-10-10', 'Compra madera FAC-PROV-003', NULL);


--
-- TOC entry 5702 (class 0 OID 27390)
-- Dependencies: 235
-- Data for Name: cotizacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.cotizacion (id_cotizacion, numero_cotizacion, id_cliente_financiero, id_proyecto_financiero, id_usuario_creador, fecha_emision, fecha_vigencia, moneda, tipo_cambio, margen_pct, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 'COT-2024-001', 1, 1, 1, '2024-08-15', '2024-09-15', 'CLP', NULL, NULL, 'aprobada', NULL);
INSERT INTO finanzas.cotizacion (id_cotizacion, numero_cotizacion, id_cliente_financiero, id_proyecto_financiero, id_usuario_creador, fecha_emision, fecha_vigencia, moneda, tipo_cambio, margen_pct, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 'COT-2024-002', 2, 2, 1, '2024-09-20', '2024-10-20', 'CLP', NULL, NULL, 'aprobada', NULL);
INSERT INTO finanzas.cotizacion (id_cotizacion, numero_cotizacion, id_cliente_financiero, id_proyecto_financiero, id_usuario_creador, fecha_emision, fecha_vigencia, moneda, tipo_cambio, margen_pct, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 'COT-2024-003', 3, 3, 2, '2024-10-25', '2024-11-25', 'CLP', NULL, NULL, 'pendiente', NULL);


--
-- TOC entry 5750 (class 0 OID 27776)
-- Dependencies: 283
-- Data for Name: evaluacion_credito; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.evaluacion_credito (id_evaluacion_credito, id_cliente_financiero, id_usuario_autorizador, fecha_evaluacion, score_confianza, resultado, causa_rechazo, aprobacion_excepcional, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, 1, '2026-06-02 23:10:18.751781-04', 72.50, 'aprobado', NULL, false, 'Cliente con buen historial referencial');


--
-- TOC entry 5744 (class 0 OID 27726)
-- Dependencies: 277
-- Data for Name: fondo_global_credito; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.fondo_global_credito (id_fondo_credito, fecha_calculo, utilidad_neta_disponible, monto_gastos_operacionales_considerados, reserva_emergencia, monto_total_calculado, monto_bloqueado, monto_disponible, limite_seguridad_pct, estado) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-01', 45000000.00, 8000000.00, 5000000.00, 32000000.00, 10000000.00, 22000000.00, 20.00, 'vigente');


--
-- TOC entry 5746 (class 0 OID 27745)
-- Dependencies: 279
-- Data for Name: limite_credito_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.limite_credito_cliente (id_limite_credito_cliente, id_cliente_financiero, monto_limite, plazo_dias, fecha_inicio_vigencia, fecha_fin_vigencia, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, 3000000.00, 30, '2024-11-01', NULL, 'vigente', NULL);


--
-- TOC entry 5754 (class 0 OID 27805)
-- Dependencies: 287
-- Data for Name: credito_proyecto; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.credito_proyecto (id_credito_proyecto, id_proyecto_financiero, id_limite_credito_cliente, id_fondo_credito, id_evaluacion_credito, id_usuario_autorizador, monto_credito_aprobado, monto_bloqueado, fecha_aprobacion, estado_credito, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, NULL, 1, 1, 1, 1500000.00, 1500000.00, '2024-11-02', 'activo', NULL);


--
-- TOC entry 5706 (class 0 OID 27422)
-- Dependencies: 239
-- Data for Name: nota_venta; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.nota_venta (id_nota_venta, numero_nota_venta, id_cliente_financiero, id_proyecto_financiero, id_cotizacion_origen, fecha_emision, fecha_max_entrega, tipo_nota_venta, moneda, tipo_cambio, descuento, estado_pedido, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 'NV-2024-001', 1, 1, 1, '2024-09-16', NULL, 'producto', 'CLP', NULL, 0.00, 'entregado', 'pagado', NULL);
INSERT INTO finanzas.nota_venta (id_nota_venta, numero_nota_venta, id_cliente_financiero, id_proyecto_financiero, id_cotizacion_origen, fecha_emision, fecha_max_entrega, tipo_nota_venta, moneda, tipo_cambio, descuento, estado_pedido, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 'NV-2024-002', 2, 2, 2, '2024-10-21', NULL, 'producto', 'CLP', NULL, 0.00, 'en_proceso', 'pendiente', NULL);


--
-- TOC entry 5710 (class 0 OID 27463)
-- Dependencies: 243
-- Data for Name: tipo_documento_tributario; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Factura electrónica', 'Factura afecta a IVA', true, true);
INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Boleta electrónica', 'Boleta persona natural', true, true);
INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Nota de débito', 'Corrección al alza', true, true);
INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (4, 'Nota de crédito', 'Corrección a la baja', true, true);


--
-- TOC entry 5712 (class 0 OID 27479)
-- Dependencies: 245
-- Data for Name: documento_tributario; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.documento_tributario (id_documento_tributario, id_tipo_documento_tributario, numero_documento, id_nota_venta, fecha_emision, fecha_vencimiento, monto_neto, tasa_iva_aplicada, es_exento, estado_documento, archivo_url) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'FAC-E-001', 1, '2024-09-17', NULL, 5520000.00, 19.00, false, 'pagado', NULL);
INSERT INTO finanzas.documento_tributario (id_documento_tributario, id_tipo_documento_tributario, numero_documento, id_nota_venta, fecha_emision, fecha_vencimiento, monto_neto, tasa_iva_aplicada, es_exento, estado_documento, archivo_url) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'FAC-E-002', 2, '2024-10-22', NULL, 4720000.00, 19.00, false, 'emitido', NULL);


--
-- TOC entry 5772 (class 0 OID 27935)
-- Dependencies: 305
-- Data for Name: alerta_financiera; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.alerta_financiera (id_alerta_financiera, tipo_alerta, nivel_alerta, fecha_generacion, prioridad, estado, mensaje, id_cliente_financiero, id_proyecto_financiero, id_documento_tributario, id_documento_compra_proveedor, id_costo_proyecto, id_credito_proyecto) OVERRIDING SYSTEM VALUE VALUES (1, 'vencimiento_documento', 'media', '2026-06-02 23:10:18.751781-04', 'alta', 'pendiente', 'Documento FAC-E-002 vence en 30 días. Monto: $4.720.000', 2, 2, NULL, NULL, NULL, NULL);
INSERT INTO finanzas.alerta_financiera (id_alerta_financiera, tipo_alerta, nivel_alerta, fecha_generacion, prioridad, estado, mensaje, id_cliente_financiero, id_proyecto_financiero, id_documento_tributario, id_documento_compra_proveedor, id_costo_proyecto, id_credito_proyecto) OVERRIDING SYSTEM VALUE VALUES (2, 'hito_pendiente', 'baja', '2026-06-02 23:10:18.751781-04', 'media', 'pendiente', 'Hito entrega final PRY-2024-002 vence 2025-01-15. Monto: $5.356.800', 2, 2, NULL, NULL, NULL, NULL);


--
-- TOC entry 5714 (class 0 OID 27499)
-- Dependencies: 247
-- Data for Name: hito_cobro; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'anticipo', 'Pago inicial 30%', 30.00, 1987200.00, '2024-09-18', NULL, NULL, 'cobrado', 1);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'avance_50', 'Pago al 50% de avance', 50.00, 3312000.00, '2024-10-15', NULL, NULL, 'cobrado', 2);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (3, 1, 'entrega_final', 'Saldo contra entrega', 20.00, 1324800.00, '2024-11-01', NULL, NULL, 'cobrado', 3);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'anticipo', 'Anticipo 40%', 40.00, 3571200.00, '2024-11-01', NULL, NULL, 'cobrado', 1);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (5, 2, 'entrega_final', 'Saldo contra entrega', 60.00, 5356800.00, '2025-01-15', NULL, NULL, 'pendiente', 2);


--
-- TOC entry 5716 (class 0 OID 27515)
-- Dependencies: 249
-- Data for Name: medio_pago; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.medio_pago (id_medio_pago, nombre_medio_pago, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Transferencia bancaria', 'Transferencia electrónica', true);
INSERT INTO finanzas.medio_pago (id_medio_pago, nombre_medio_pago, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Cheque', 'Pago con cheque', true);
INSERT INTO finanzas.medio_pago (id_medio_pago, nombre_medio_pago, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Efectivo', 'Pago en efectivo', true);


--
-- TOC entry 5718 (class 0 OID 27529)
-- Dependencies: 251
-- Data for Name: pago_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, '2024-09-18', 1987200.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 1, '2024-10-15', 3312000.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 1, '2024-11-01', 1324800.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, 2, 1, '2024-11-02', 3571200.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);


--
-- TOC entry 5720 (class 0 OID 27547)
-- Dependencies: 253
-- Data for Name: asignacion_pago_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 1, 1, 1987200.00, NULL);
INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 1, 1, 1, 2, 3312000.00, NULL);
INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 1, 1, 1, 3, 1324800.00, NULL);
INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 4, 2, 2, 2, 4, 3571200.00, NULL);


--
-- TOC entry 5728 (class 0 OID 27611)
-- Dependencies: 261
-- Data for Name: pago_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.pago_proveedor (id_pago_proveedor, id_proveedor, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, '2024-10-31', 4403000.00, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_proveedor (id_pago_proveedor, id_proveedor, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 1, 1, '2024-11-05', 1059100.00, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_proveedor (id_pago_proveedor, id_proveedor, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 1, 1, '2024-11-10', 399840.00, NULL, 'confirmado', NULL);


--
-- TOC entry 5730 (class 0 OID 27627)
-- Dependencies: 263
-- Data for Name: asignacion_pago_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.asignacion_pago_proveedor (id_asignacion_pago_proveedor, id_pago_proveedor, id_documento_compra_proveedor, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 4403000.00, NULL);
INSERT INTO finanzas.asignacion_pago_proveedor (id_asignacion_pago_proveedor, id_pago_proveedor, id_documento_compra_proveedor, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 2, 1059100.00, NULL);
INSERT INTO finanzas.asignacion_pago_proveedor (id_asignacion_pago_proveedor, id_pago_proveedor, id_documento_compra_proveedor, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 3, 399840.00, NULL);


--
-- TOC entry 5764 (class 0 OID 27880)
-- Dependencies: 297
-- Data for Name: liquidacion_remuneracion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.liquidacion_remuneracion (id_liquidacion, rut_empleado, id_usuario_cierra, periodo_inicio, periodo_fin, estado) OVERRIDING SYSTEM VALUE VALUES (1, '34567890-1', 1, '2024-10-01', '2024-10-31', 'cerrada');
INSERT INTO finanzas.liquidacion_remuneracion (id_liquidacion, rut_empleado, id_usuario_cierra, periodo_inicio, periodo_fin, estado) OVERRIDING SYSTEM VALUE VALUES (2, '56789012-3', 1, '2024-11-01', '2024-11-30', 'abierta');


--
-- TOC entry 5766 (class 0 OID 27895)
-- Dependencies: 299
-- Data for Name: concepto_remuneracion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.concepto_remuneracion (id_concepto_remuneracion, id_liquidacion, id_tarea_remunerable, tipo_concepto, descripcion, monto, es_imponible, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'haber', 'Corte y habilitación - 1 un', 45000.00, true, NULL);
INSERT INTO finanzas.concepto_remuneracion (id_concepto_remuneracion, id_liquidacion, id_tarea_remunerable, tipo_concepto, descripcion, monto, es_imponible, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 'haber', 'Pintura base - 1 un', 35000.00, true, NULL);
INSERT INTO finanzas.concepto_remuneracion (id_concepto_remuneracion, id_liquidacion, id_tarea_remunerable, tipo_concepto, descripcion, monto, es_imponible, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, 3, 'haber', 'Instalación puerta simple - 4 un', 480000.00, true, NULL);


--
-- TOC entry 5740 (class 0 OID 27699)
-- Dependencies: 273
-- Data for Name: conciliacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.conciliacion (id_conciliacion, id_usuario_responsable, fecha_conciliacion, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, '2026-06-02 23:10:18.751781-04', 'cerrada', NULL);


--
-- TOC entry 5738 (class 0 OID 27686)
-- Dependencies: 271
-- Data for Name: movimiento_bancario; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (1, '2024-09-18', 'Banco de Chile', '00-123-456-78', 'Abono COT-001 Andes', 1987200.00, 'abono', 'OP-001', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (2, '2024-10-15', 'Banco de Chile', '00-123-456-78', 'Abono hito avance Andes', 3312000.00, 'abono', 'OP-002', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (3, '2024-10-31', 'Banco de Chile', '00-123-456-78', 'Pago proveedor Aceros', 4403000.00, 'cargo', 'OP-003', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (4, '2024-11-01', 'Banco de Chile', '00-123-456-78', 'Abono saldo final Andes', 1324800.00, 'abono', 'OP-004', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (5, '2024-11-02', 'Banco de Chile', '00-123-456-78', 'Abono anticipo Inmosur', 3571200.00, 'abono', 'OP-005', NULL);


--
-- TOC entry 5736 (class 0 OID 27670)
-- Dependencies: 269
-- Data for Name: movimiento_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.movimiento_financiero (id_movimiento_financiero, id_pago_cliente, id_pago_proveedor, id_gasto_caja, id_liquidacion, id_usuario_registra, fecha_movimiento, naturaleza, monto, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, NULL, NULL, 1, '2026-06-02 23:10:18.751781-04', 'ingreso', 1987200.00, 'conciliado', NULL);
INSERT INTO finanzas.movimiento_financiero (id_movimiento_financiero, id_pago_cliente, id_pago_proveedor, id_gasto_caja, id_liquidacion, id_usuario_registra, fecha_movimiento, naturaleza, monto, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, NULL, NULL, NULL, 1, '2026-06-02 23:10:18.751781-04', 'ingreso', 3312000.00, 'conciliado', NULL);
INSERT INTO finanzas.movimiento_financiero (id_movimiento_financiero, id_pago_cliente, id_pago_proveedor, id_gasto_caja, id_liquidacion, id_usuario_registra, fecha_movimiento, naturaleza, monto, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, NULL, NULL, NULL, 1, '2026-06-02 23:10:18.751781-04', 'ingreso', 1324800.00, 'conciliado', NULL);
INSERT INTO finanzas.movimiento_financiero (id_movimiento_financiero, id_pago_cliente, id_pago_proveedor, id_gasto_caja, id_liquidacion, id_usuario_registra, fecha_movimiento, naturaleza, monto, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 4, NULL, NULL, NULL, 1, '2026-06-02 23:10:18.751781-04', 'ingreso', 3571200.00, 'pendiente', NULL);
INSERT INTO finanzas.movimiento_financiero (id_movimiento_financiero, id_pago_cliente, id_pago_proveedor, id_gasto_caja, id_liquidacion, id_usuario_registra, fecha_movimiento, naturaleza, monto, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (5, NULL, NULL, NULL, NULL, 1, '2026-06-02 23:10:18.751781-04', 'egreso', 4403000.00, 'conciliado', NULL);
INSERT INTO finanzas.movimiento_financiero (id_movimiento_financiero, id_pago_cliente, id_pago_proveedor, id_gasto_caja, id_liquidacion, id_usuario_registra, fecha_movimiento, naturaleza, monto, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (6, NULL, NULL, NULL, NULL, 1, '2026-06-02 23:10:18.751781-04', 'egreso', 1059100.00, 'conciliado', NULL);


--
-- TOC entry 5742 (class 0 OID 27713)
-- Dependencies: 275
-- Data for Name: detalle_conciliacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.detalle_conciliacion (id_detalle_conciliacion, id_conciliacion, id_movimiento_financiero, id_movimiento_bancario, monto_conciliado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 1987200.00, NULL);
INSERT INTO finanzas.detalle_conciliacion (id_detalle_conciliacion, id_conciliacion, id_movimiento_financiero, id_movimiento_bancario, monto_conciliado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 2, 3312000.00, NULL);
INSERT INTO finanzas.detalle_conciliacion (id_detalle_conciliacion, id_conciliacion, id_movimiento_financiero, id_movimiento_bancario, monto_conciliado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, 4, 4, 1324800.00, NULL);


--
-- TOC entry 5704 (class 0 OID 27409)
-- Dependencies: 237
-- Data for Name: detalle_cotizacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, NULL, 'Puerta blindada simple cal.14 - und', 4.00, NULL, NULL, NULL, 850000.00, 1200000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, NULL, NULL, 'Instalación puerta simple - und', 4.00, NULL, NULL, NULL, 120000.00, 180000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, NULL, NULL, 'Puerta blindada doble hoja - und', 2.00, NULL, NULL, NULL, 1500000.00, 2100000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, NULL, NULL, 'Instalación puerta doble - und', 2.00, NULL, NULL, NULL, 180000.00, 260000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (5, 3, NULL, NULL, 'Puerta blindada simple cal.16 - und', 1.00, NULL, NULL, NULL, 920000.00, 1300000.00, 0.00, NULL);


--
-- TOC entry 5748 (class 0 OID 27760)
-- Dependencies: 281
-- Data for Name: parametro_riesgo_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.parametro_riesgo_financiero (id_parametro_riesgo, nombre_parametro, descripcion, tipo_parametro, peso, puntaje_maximo, valor_referencia, operador_evaluacion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Historial de pagos', NULL, 'cualitativo', 40.00, 40.00, NULL, NULL, true);
INSERT INTO finanzas.parametro_riesgo_financiero (id_parametro_riesgo, nombre_parametro, descripcion, tipo_parametro, peso, puntaje_maximo, valor_referencia, operador_evaluacion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Antigüedad cliente', NULL, 'cuantitativo', 30.00, 30.00, NULL, NULL, true);
INSERT INTO finanzas.parametro_riesgo_financiero (id_parametro_riesgo, nombre_parametro, descripcion, tipo_parametro, peso, puntaje_maximo, valor_referencia, operador_evaluacion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Monto comprometido', NULL, 'cuantitativo', 30.00, 30.00, NULL, NULL, true);


--
-- TOC entry 5752 (class 0 OID 27792)
-- Dependencies: 285
-- Data for Name: detalle_evaluacion_credito; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.detalle_evaluacion_credito (id_detalle_evaluacion_credito, id_evaluacion_credito, id_parametro_riesgo, valor_obtenido, puntaje_obtenido, cumple, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'bueno', 35.00, true, NULL);
INSERT INTO finanzas.detalle_evaluacion_credito (id_detalle_evaluacion_credito, id_evaluacion_credito, id_parametro_riesgo, valor_obtenido, puntaje_obtenido, cumple, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, '2 años', 22.00, true, NULL);
INSERT INTO finanzas.detalle_evaluacion_credito (id_detalle_evaluacion_credito, id_evaluacion_credito, id_parametro_riesgo, valor_obtenido, puntaje_obtenido, cumple, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, 3, '< 5M', 15.50, true, NULL);


--
-- TOC entry 5768 (class 0 OID 27910)
-- Dependencies: 301
-- Data for Name: evento_auditoria; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, '2026-06-02 23:10:18.751781-04', 'CREATE', 'proyecto_financiero', 'PRY-2024-001', '192.168.1.10', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, '2026-06-02 23:10:18.751781-04', 'CREATE', 'cotizacion', 'COT-2024-001', '192.168.1.10', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, '2026-06-02 23:10:18.751781-04', 'UPDATE', 'nota_venta', 'NV-2024-001', '192.168.1.10', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, '2026-06-02 23:10:18.751781-04', 'CREATE', 'proyecto_financiero', 'PRY-2024-002', '192.168.1.11', NULL, NULL);


--
-- TOC entry 5770 (class 0 OID 27924)
-- Dependencies: 303
-- Data for Name: detalle_evento_auditoria; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--



--
-- TOC entry 5698 (class 0 OID 27361)
-- Dependencies: 231
-- Data for Name: ficha_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.ficha_cliente (id_cliente_financiero, fecha_creacion, observaciones, estado_revision) VALUES (1, '2026-06-02 23:10:18.751781-04', NULL, 'aprobado');
INSERT INTO finanzas.ficha_cliente (id_cliente_financiero, fecha_creacion, observaciones, estado_revision) VALUES (2, '2026-06-02 23:10:18.751781-04', NULL, 'aprobado');
INSERT INTO finanzas.ficha_cliente (id_cliente_financiero, fecha_creacion, observaciones, estado_revision) VALUES (3, '2026-06-02 23:10:18.751781-04', NULL, 'pendiente');


--
-- TOC entry 5708 (class 0 OID 27443)
-- Dependencies: 241
-- Data for Name: item_nota_venta; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, 'Puerta blindada simple cal.14', 4.00, NULL, NULL, NULL, 1200000.00, 0.00, true, true, 'entregado', NULL);
INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, NULL, 'Instalación puerta simple', 4.00, NULL, NULL, NULL, 180000.00, 0.00, false, false, 'completado', NULL);
INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, NULL, 'Puerta blindada doble hoja', 2.00, NULL, NULL, NULL, 2100000.00, 0.00, true, true, 'en_produccion', NULL);
INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, NULL, 'Instalación puerta doble', 2.00, NULL, NULL, NULL, 260000.00, 0.00, false, false, 'pendiente', NULL);


--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 304
-- Name: alerta_financiera_id_alerta_financiera_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.alerta_financiera_id_alerta_financiera_seq', 2, true);


--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 252
-- Name: asignacion_pago_cliente_id_asignacion_pago_cliente_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.asignacion_pago_cliente_id_asignacion_pago_cliente_seq', 4, true);


--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 262
-- Name: asignacion_pago_proveedor_id_asignacion_pago_proveedor_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.asignacion_pago_proveedor_id_asignacion_pago_proveedor_seq', 3, true);


--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 256
-- Name: categoria_gasto_id_categoria_gasto_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.categoria_gasto_id_categoria_gasto_seq', 4, true);


--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 229
-- Name: cliente_financiero_id_cliente_financiero_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.cliente_financiero_id_cliente_financiero_seq', 3, true);


--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 298
-- Name: concepto_remuneracion_id_concepto_remuneracion_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.concepto_remuneracion_id_concepto_remuneracion_seq', 3, true);


--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 272
-- Name: conciliacion_id_conciliacion_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.conciliacion_id_conciliacion_seq', 1, true);


--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 266
-- Name: costo_proyecto_id_costo_proyecto_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.costo_proyecto_id_costo_proyecto_seq', 3, true);


--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 234
-- Name: cotizacion_id_cotizacion_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.cotizacion_id_cotizacion_seq', 3, true);


--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 286
-- Name: credito_proyecto_id_credito_proyecto_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.credito_proyecto_id_credito_proyecto_seq', 1, true);


--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 274
-- Name: detalle_conciliacion_id_detalle_conciliacion_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.detalle_conciliacion_id_detalle_conciliacion_seq', 3, true);


--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 236
-- Name: detalle_cotizacion_id_detalle_cotizacion_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.detalle_cotizacion_id_detalle_cotizacion_seq', 5, true);


--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 284
-- Name: detalle_evaluacion_credito_id_detalle_evaluacion_credito_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.detalle_evaluacion_credito_id_detalle_evaluacion_credito_seq', 3, true);


--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 302
-- Name: detalle_evento_auditoria_id_detalle_evento_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.detalle_evento_auditoria_id_detalle_evento_seq', 1, false);


--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 258
-- Name: documento_compra_proveedor_id_documento_compra_proveedor_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.documento_compra_proveedor_id_documento_compra_proveedor_seq', 3, true);


--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 244
-- Name: documento_tributario_id_documento_tributario_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.documento_tributario_id_documento_tributario_seq', 2, true);


--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 222
-- Name: empleado_cargo_empleado_cargo_id_cargo_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.empleado_cargo_empleado_cargo_id_cargo_seq', 5, true);


--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 224
-- Name: empleado_tipo_vinculo_laboral_empleado_tipo_vinculo_laboral_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.empleado_tipo_vinculo_laboral_empleado_tipo_vinculo_laboral_seq', 3, true);


--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 282
-- Name: evaluacion_credito_id_evaluacion_credito_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.evaluacion_credito_id_evaluacion_credito_seq', 1, true);


--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 300
-- Name: evento_auditoria_id_evento_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.evento_auditoria_id_evento_seq', 4, true);


--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 276
-- Name: fondo_global_credito_id_fondo_credito_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.fondo_global_credito_id_fondo_credito_seq', 1, true);


--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 264
-- Name: gasto_caja_chica_id_gasto_caja_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.gasto_caja_chica_id_gasto_caja_seq', 3, true);


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 246
-- Name: hito_cobro_id_hito_cobro_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.hito_cobro_id_hito_cobro_seq', 5, true);


--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 240
-- Name: item_nota_venta_id_item_nota_venta_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.item_nota_venta_id_item_nota_venta_seq', 4, true);


--
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 278
-- Name: limite_credito_cliente_id_limite_credito_cliente_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.limite_credito_cliente_id_limite_credito_cliente_seq', 1, true);


--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 296
-- Name: liquidacion_remuneracion_id_liquidacion_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.liquidacion_remuneracion_id_liquidacion_seq', 2, true);


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 248
-- Name: medio_pago_id_medio_pago_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.medio_pago_id_medio_pago_seq', 3, true);


--
-- TOC entry 5805 (class 0 OID 0)
-- Dependencies: 270
-- Name: movimiento_bancario_id_movimiento_bancario_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.movimiento_bancario_id_movimiento_bancario_seq', 5, true);


--
-- TOC entry 5806 (class 0 OID 0)
-- Dependencies: 268
-- Name: movimiento_financiero_id_movimiento_financiero_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.movimiento_financiero_id_movimiento_financiero_seq', 6, true);


--
-- TOC entry 5807 (class 0 OID 0)
-- Dependencies: 238
-- Name: nota_venta_id_nota_venta_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.nota_venta_id_nota_venta_seq', 2, true);


--
-- TOC entry 5808 (class 0 OID 0)
-- Dependencies: 250
-- Name: pago_cliente_id_pago_cliente_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.pago_cliente_id_pago_cliente_seq', 4, true);


--
-- TOC entry 5809 (class 0 OID 0)
-- Dependencies: 260
-- Name: pago_proveedor_id_pago_proveedor_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.pago_proveedor_id_pago_proveedor_seq', 3, true);


--
-- TOC entry 5810 (class 0 OID 0)
-- Dependencies: 280
-- Name: parametro_riesgo_financiero_id_parametro_riesgo_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.parametro_riesgo_financiero_id_parametro_riesgo_seq', 3, true);


--
-- TOC entry 5811 (class 0 OID 0)
-- Dependencies: 232
-- Name: proyecto_financiero_id_proyecto_financiero_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.proyecto_financiero_id_proyecto_financiero_seq', 3, true);


--
-- TOC entry 5812 (class 0 OID 0)
-- Dependencies: 290
-- Name: tarea_catalogada_id_tarea_catalogada_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tarea_catalogada_id_tarea_catalogada_seq', 5, true);


--
-- TOC entry 5813 (class 0 OID 0)
-- Dependencies: 294
-- Name: tarea_remunerable_id_tarea_remunerable_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tarea_remunerable_id_tarea_remunerable_seq', 4, true);


--
-- TOC entry 5814 (class 0 OID 0)
-- Dependencies: 292
-- Name: tarifa_tarea_id_tarifa_tarea_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tarifa_tarea_id_tarifa_tarea_seq', 5, true);


--
-- TOC entry 5815 (class 0 OID 0)
-- Dependencies: 227
-- Name: tipo_cliente_id_tipo_cliente_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tipo_cliente_id_tipo_cliente_seq', 2, true);


--
-- TOC entry 5816 (class 0 OID 0)
-- Dependencies: 254
-- Name: tipo_documento_compra_proveedor_id_tipo_documento_compra_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tipo_documento_compra_proveedor_id_tipo_documento_compra_seq', 3, true);


--
-- TOC entry 5817 (class 0 OID 0)
-- Dependencies: 242
-- Name: tipo_documento_tributario_id_tipo_documento_tributario_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tipo_documento_tributario_id_tipo_documento_tributario_seq', 4, true);


--
-- TOC entry 5818 (class 0 OID 0)
-- Dependencies: 288
-- Name: tipo_tarea_catalogada_id_tipo_tarea_seq; Type: SEQUENCE SET; Schema: finanzas; Owner: postgres
--

SELECT pg_catalog.setval('finanzas.tipo_tarea_catalogada_id_tipo_tarea_seq', 3, true);


-- Completed on 2026-06-14 21:30:58

--
-- PostgreSQL database dump complete
--


