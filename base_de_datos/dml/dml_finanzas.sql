-- DML finanzas — extraído de dml_pb_inc2.sql
-- Schema: finanzas

--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-09-12 17:20:32

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
-- TOC entry 6216 (class 0 OID 27576)
-- Dependencies: 257
-- Data for Name: categoria_gasto; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Materiales', 'Compra de materiales e insumos', true);
INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Mano de obra', 'Costos de personal', true);
INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Transporte', 'Fletes y despachos', true);
INSERT INTO finanzas.categoria_gasto (id_categoria_gasto, nombre_categoria_gasto, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (4, 'Gastos generales', 'Varios no clasificados', true);

--
-- TOC entry 6232 (class 0 OID 27699)
-- Dependencies: 273
-- Data for Name: conciliacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.conciliacion (id_conciliacion, id_usuario_responsable, fecha_conciliacion, estado_conciliacion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, '2026-06-02 23:10:18.751781-04', 'cerrada', NULL);

--
-- TOC entry 6182 (class 0 OID 27300)
-- Dependencies: 223
-- Data for Name: empleado_cargo; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (1, 'Gerente General', 3500000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (2, 'Jefe de Operaciones', 2800000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (3, 'Encargado de Bodega', 1800000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (4, 'Administrador Sistema', 2200000.00);
INSERT INTO finanzas.empleado_cargo (empleado_cargo_id_cargo, empleado_cargo_nombre, empleado_cargo_sueldo_base) OVERRIDING SYSTEM VALUE VALUES (5, 'Técnico Instalador', 1600000.00);

--
-- TOC entry 6184 (class 0 OID 27309)
-- Dependencies: 225
-- Data for Name: empleado_tipo_vinculo_laboral; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.empleado_tipo_vinculo_laboral (empleado_tipo_vinculo_laboral_id_tipo_vinculo, empleado_tipo_vinculo_laboral_nombre, empleado_tipo_vinculo_laboral_seguro_cesantia) OVERRIDING SYSTEM VALUE VALUES (1, 'indefinido', true);
INSERT INTO finanzas.empleado_tipo_vinculo_laboral (empleado_tipo_vinculo_laboral_id_tipo_vinculo, empleado_tipo_vinculo_laboral_nombre, empleado_tipo_vinculo_laboral_seguro_cesantia) OVERRIDING SYSTEM VALUE VALUES (2, 'plazo_fijo', true);
INSERT INTO finanzas.empleado_tipo_vinculo_laboral (empleado_tipo_vinculo_laboral_id_tipo_vinculo, empleado_tipo_vinculo_laboral_nombre, empleado_tipo_vinculo_laboral_seguro_cesantia) OVERRIDING SYSTEM VALUE VALUES (3, 'honorarios', false);

--
-- TOC entry 6185 (class 0 OID 27318)
-- Dependencies: 226
-- Data for Name: empleado; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('12345678-9', 'Álvaro', NULL, 'Morales', NULL, 'activo', '2018-03-01', NULL, NULL, NULL, 1, 1);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('23456789-0', 'Olivia', NULL, 'Ramírez', NULL, 'activo', '2019-06-15', NULL, NULL, NULL, 2, 1);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('34567890-1', 'Juan', NULL, 'Pérez', NULL, 'activo', '2020-01-10', NULL, NULL, NULL, 3, 1);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('45678901-2', 'Marcela', NULL, 'Soto', NULL, 'activo', '2021-04-20', NULL, NULL, NULL, 4, 2);
INSERT INTO finanzas.empleado (empleado_rut_empleado, empleado_nombre_empleado_primer_nombre_empleado, empleado_nombre_empleado_segundo_nombre_empleado, empleado_nombre_empleado_primer_apellido_empleado, empleado_nombre_empleado_segundo_apellido_empleado, empleado_estado, empleado_fecha_ingreso, empleado_afp, empleado_prevision_salud, empleado_fecha_nacimiento, empleado_cargo_id_cargo, empleado_tipo_vinculo_laboral_id_tipo_vinculo) VALUES ('56789012-3', 'Pedro', NULL, 'Vásquez', NULL, 'activo', '2022-08-01', NULL, NULL, NULL, 5, 3);

--
-- TOC entry 6260 (class 0 OID 27910)
-- Dependencies: 301
-- Data for Name: evento_auditoria; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, '2026-06-02 23:10:18.751781-04', 'CREATE', 'proyecto_financiero', 'PRY-2024-001', '192.168.1.10', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, '2026-06-02 23:10:18.751781-04', 'CREATE', 'cotizacion', 'COT-2024-001', '192.168.1.10', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, '2026-06-02 23:10:18.751781-04', 'UPDATE', 'nota_venta', 'NV-2024-001', '192.168.1.10', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, '2026-06-02 23:10:18.751781-04', 'CREATE', 'proyecto_financiero', 'PRY-2024-002', '192.168.1.11', NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (5, 1, '2026-09-05 15:25:17.968612-04', 'editar_permisos', 'inventario', 'usuario_id: 3, rol: gerencia, estado: ', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (6, 1, '2026-09-05 15:32:32.998087-04', 'editar_permisos', 'inventario', 'usuario_id: 1, rol: gerencia, estado: inactivo', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (7, 1, '2026-09-05 15:32:41.414018-04', 'editar_permisos', 'inventario', 'usuario_id: 3, rol: gerencia, estado: activo', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (8, 1, '2026-09-05 15:32:47.829472-04', 'editar_permisos', 'inventario', 'usuario_id: 1, rol: gerencia, estado: activa', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (9, 1, '2026-09-06 15:03:25.155843-03', 'editar_permisos', 'inventario', 'usuario_id: 1, rol: gerencia, estado: inactivo', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (10, 1, '2026-09-06 15:06:20.510182-03', 'editar_permisos', 'inventario', 'usuario_id: 1, rol: gerencia, estado: activa', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (11, 1, '2026-09-06 17:48:42.35317-03', 'consumo_ot', 'inventario', 'OT: 2, SKU: PIN-GRS, cantidad: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (12, 1, '2026-09-06 18:16:40.005629-03', 'exportar_reporte', 'inventario', 'Ruta: /programacion-semanal/exportar', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (13, 1, '2026-09-06 18:16:52.524694-03', 'exportar_reporte', 'inventario', 'Ruta: /programacion-semanal/exportar-pdf', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (14, 1, '2026-09-06 19:23:42.856474-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (15, 1, '2026-09-06 19:23:43.206713-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (16, 1, '2026-09-06 19:24:56.325246-03', 'editar_material', 'inventario', 'SKU: PIN-CUS', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (17, 1, '2026-09-06 19:27:53.428032-03', 'reactivar_material', 'inventario', 'SKU: PIN-CUS', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (18, 1, '2026-09-06 19:29:55.733386-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (19, 1, '2026-09-06 19:30:03.444846-03', 'editar_material', 'inventario', 'SKU: PIN-BLA', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (20, 1, '2026-09-06 19:31:21.697971-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (21, 1, '2026-09-06 19:31:21.976861-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (22, 1, '2026-09-06 19:32:03.678455-03', 'registrar_entrada', 'inventario', 'SKU: ANG-CEM-001, cantidad: 1, bodega: 2', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (23, 1, '2026-09-06 19:32:18.414731-03', 'reactivar_material', 'inventario', 'SKU: PIN-BLA', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (24, 1, '2026-09-06 20:08:19.900841-03', 'exportar_reporte', 'inventario', 'Ruta: /programacion-semanal/exportar', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (25, 1, '2026-09-06 20:08:21.727537-03', 'exportar_reporte', 'inventario', 'Ruta: /programacion-semanal/exportar-pdf', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (26, 1, '2026-09-08 15:11:23.248113-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (27, 1, '2026-09-08 15:11:23.504057-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (28, 1, '2026-09-08 15:11:27.025835-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (29, 1, '2026-09-08 15:11:43.569282-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (30, 1, '2026-09-08 15:11:45.954167-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (31, 1, '2026-09-08 15:12:19.582776-03', 'registrar_salida', 'inventario', 'SKU: ANG-CEM-001, cantidad: 2, bodega: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (32, 1, '2026-09-08 15:12:29.158027-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (33, 1, '2026-09-08 15:14:26.337756-03', 'revertir_movimiento', 'inventario', 'ID movimiento: 63', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (34, 1, '2026-09-08 15:14:40.609712-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (35, 1, '2026-09-08 15:15:25.272733-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (36, 1, '2026-09-08 15:25:22.882833-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (37, 1, '2026-09-08 17:16:25.480126-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (38, 1, '2026-09-08 17:16:25.744353-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (39, 1, '2026-09-08 17:17:03.690073-03', 'editar_permisos', 'inventario', 'usuario_id: 2, rol: gerencia, estado: activa', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (40, 1, '2026-09-08 22:36:18.20363-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (41, 1, '2026-09-08 22:36:18.488239-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (42, 1, '2026-09-08 22:51:30.085806-03', 'registrar_estimados', 'inventario', 'OT ID 10: 5 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (43, 1, '2026-09-08 23:12:42.345246-03', 'registrar_estimados', 'inventario', 'OT ID 19: 3 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (44, 1, '2026-09-08 23:13:59.931402-03', 'registrar_estimados', 'inventario', 'OT ID 19: 3 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (45, 1, '2026-09-08 23:14:27.281377-03', 'registrar_estimados', 'inventario', 'OT ID 19: 3 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (46, 1, '2026-09-08 23:15:26.675345-03', 'registrar_estimados', 'inventario', 'OT ID 19: 3 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (47, 1, '2026-09-08 23:15:47.399722-03', 'registrar_estimados', 'inventario', 'OT ID 19: 1 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (48, 1, '2026-09-08 23:16:09.960603-03', 'registrar_estimados', 'inventario', 'OT ID 19: 1 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (49, 1, '2026-09-08 23:17:41.836688-03', 'registrar_estimados', 'inventario', 'OT ID 19: 3 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (50, 1, '2026-09-08 23:18:08.107363-03', 'registrar_estimados', 'inventario', 'OT ID 19: 3 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (51, 1, '2026-09-08 23:22:56.661181-03', 'registrar_estimados', 'inventario', 'OT ID 19: 1 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (52, 1, '2026-09-08 23:23:48.40241-03', 'registrar_estimados', 'inventario', 'OT ID 19: 1 material(es) estimado(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (53, 1, '2026-09-09 00:31:07.511565-03', 'registrar_entrada', 'inventario', 'SKU: ACR-001, cantidad: 23, bodega: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (54, 1, '2026-09-09 00:31:07.544047-03', 'auto_resolver_faltante', 'inventario', 'Alerta #8 resuelta automáticamente tras ingreso de ACR-001. Stock actual: 96', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (55, 1, '2026-09-09 00:31:07.547483-03', 'auto_resolver_faltante', 'inventario', 'Alerta #11 resuelta automáticamente tras ingreso de ACR-001. Stock actual: 96', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (56, 1, '2026-09-09 00:31:07.549021-03', 'auto_resolver_faltante', 'inventario', 'Alerta #15 resuelta automáticamente tras ingreso de ACR-001. Stock actual: 96', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (57, 1, '2026-09-09 16:36:35.471648-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (58, 1, '2026-09-09 16:36:35.773625-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (59, 1, '2026-09-09 16:37:39.899559-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (60, 1, '2026-09-09 17:19:27.844767-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (61, 1, '2026-09-09 17:20:04.986813-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (62, 1, '2026-09-09 17:20:05.241885-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (63, 1, '2026-09-09 17:20:21.96677-03', 'editar_bodega', 'inventario', 'Bodega ID: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (64, 1, '2026-09-09 17:21:13.1223-03', 'consumo_ot', 'inventario', 'OT: 19, SKU: ACR-001, cantidad: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (65, 1, '2026-09-09 17:29:39.204784-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (66, 1, '2026-09-09 17:29:39.437008-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (67, 1, '2026-09-09 17:30:04.768968-03', 'Registrar consumo OT', 'inventario', 'Consumo acumulado en OT #19: SKU ACR-001, cantidad 1 (total: 22)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (68, 1, '2026-09-09 17:30:17.334839-03', 'Crear anaquel', 'inventario', 'Anaquel "aa" creado en bodega ID 2', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (69, 1, '2026-09-09 17:30:19.531046-03', 'Eliminar anaquel', 'inventario', 'Anaquel ID 7 eliminado de bodega ID 2', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (70, 1, '2026-09-09 18:01:58.639395-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (71, 1, '2026-09-09 18:01:58.967387-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (72, 1, '2026-09-09 18:02:16.85129-03', 'editar_permisos', 'inventario', 'usuario_id: 4, rol: jop, estado: activa', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (73, 1, '2026-09-09 18:02:23.020892-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (74, 1, '2026-09-09 22:34:22.109953-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (75, 1, '2026-09-09 22:34:22.413721-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (76, 1, '2026-09-09 22:34:29.246233-03', 'revertir_movimiento', 'inventario', 'ID movimiento: 66', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (77, 1, '2026-09-09 22:34:41.406541-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (78, 1, '2026-09-09 22:35:04.05767-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (79, 1, '2026-09-09 22:35:28.397406-03', 'revertir_movimiento', 'inventario', 'ID movimiento: 65', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (80, 1, '2026-09-09 22:35:49.936248-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (81, 1, '2026-09-09 22:36:15.094855-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (82, 1, '2026-09-09 22:36:16.678102-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (83, 1, '2026-09-09 22:45:55.585817-03', 'Editar material', 'inventario', 'Intento de vincular proveedor duplicado al SKU ACR-016', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (84, 1, '2026-09-09 22:47:10.352744-03', 'Editar material', 'inventario', 'Material SKU PIN-BLA actualizado', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (85, 1, '2026-09-09 22:47:20.312947-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (86, 1, '2026-09-09 22:47:49.757077-03', 'Editar material', 'inventario', 'Material SKU ACR-016 actualizado', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (87, 1, '2026-09-09 23:06:16.862073-03', 'Reactivar material', 'inventario', 'Material SKU TUB-040 reactivado', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (88, 1, '2026-09-09 23:06:22.679076-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (89, 1, '2026-09-09 23:06:43.695975-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (90, 1, '2026-09-09 23:21:30.582425-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (91, 1, '2026-09-09 23:21:38.670804-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (92, 1, '2026-09-09 23:22:13.760546-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (93, 1, '2026-09-09 23:22:26.114083-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (94, 1, '2026-09-09 23:22:26.443844-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (95, 1, '2026-09-09 23:22:33.67952-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (96, 1, '2026-09-09 23:23:58.592462-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (97, 1, '2026-09-09 23:25:25.913609-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (98, 1, '2026-09-09 23:25:26.250861-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (99, 1, '2026-09-09 23:25:33.491924-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario caso74 (ID 10)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (100, 1, '2026-09-09 23:32:05.655328-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (101, 1, '2026-09-09 23:32:05.987892-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (102, 1, '2026-09-09 23:33:13.56587-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (103, 1, '2026-09-09 23:33:35.274366-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (104, 1, '2026-09-09 23:33:35.510668-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (105, 1, '2026-09-09 23:39:28.291717-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (106, 1, '2026-09-09 23:40:50.524183-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (107, 1, '2026-09-09 23:41:58.026316-03', 'registrar_entrada', 'inventario', 'SKU: TUB-040, cantidad: 1, bodega: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (108, 1, '2026-09-09 23:41:58.054273-03', 'auto_resolver_faltante', 'inventario', 'Alerta #1 resuelta automáticamente tras ingreso de TUB-040. Stock actual: 17', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (109, 1, '2026-09-09 23:48:59.632633-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (110, 1, '2026-09-09 23:49:28.707374-03', 'Editar material', 'inventario', 'Material SKU PIN-CUS actualizado', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (111, 1, '2026-09-09 23:53:25.09683-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (112, 1, '2026-09-09 23:54:29.503976-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario marcela.soto (ID 4)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (113, 1, '2026-09-10 19:19:28.527122-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (114, 1, '2026-09-10 19:19:28.933629-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (115, 1, '2026-09-10 19:19:41.210029-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (116, 6, '2026-09-10 19:19:50.544176-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (117, 6, '2026-09-10 19:19:50.795721-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (118, 6, '2026-09-10 19:19:57.46934-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (119, 6, '2026-09-10 19:19:57.768843-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (120, 6, '2026-09-10 19:20:20.941291-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (121, 6, '2026-09-10 19:20:33.612031-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (122, 6, '2026-09-10 19:20:33.851798-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (123, 1, '2026-09-10 21:21:07.930568-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (124, 1, '2026-09-10 21:21:08.23636-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (125, 1, '2026-09-10 21:21:25.398728-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (126, 1, '2026-09-10 21:21:25.692177-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (127, 1, '2026-09-10 21:21:34.94172-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (128, 6, '2026-09-10 21:21:44.701886-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (129, 6, '2026-09-10 21:21:44.943106-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (130, 1, '2026-09-10 21:29:42.234481-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (131, 1, '2026-09-10 21:29:42.516415-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (132, 1, '2026-09-10 21:29:48.591444-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (133, 6, '2026-09-10 21:29:56.081161-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (134, 6, '2026-09-10 21:31:08.634534-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (135, 6, '2026-09-10 21:36:29.903625-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (136, 6, '2026-09-10 21:36:30.173082-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (137, 6, '2026-09-10 21:37:43.938428-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (138, 6, '2026-09-10 21:37:55.902484-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (139, 6, '2026-09-10 21:38:06.076339-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (140, 6, '2026-09-10 21:38:06.350935-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (141, 1, '2026-09-10 21:41:16.986007-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (142, 1, '2026-09-10 21:41:17.261336-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (143, 1, '2026-09-10 21:41:25.419136-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (144, 6, '2026-09-10 21:41:33.671957-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (145, 6, '2026-09-10 21:41:33.919916-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (146, 6, '2026-09-10 21:42:30.218925-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (147, 6, '2026-09-10 21:42:30.484317-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (148, 6, '2026-09-10 21:42:44.778042-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (149, 6, '2026-09-10 21:42:45.064755-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (150, 6, '2026-09-10 21:43:03.616735-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (151, 6, '2026-09-10 21:44:59.608232-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (152, 6, '2026-09-10 21:44:59.898598-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (153, 6, '2026-09-10 21:45:01.787197-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (154, 6, '2026-09-10 21:45:15.057852-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (155, 6, '2026-09-10 21:45:15.401687-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (156, 6, '2026-09-10 21:45:32.274836-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (157, 6, '2026-09-10 21:45:51.786433-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (158, 6, '2026-09-10 21:45:52.096159-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (159, 1, '2026-09-10 21:45:57.697077-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (160, 1, '2026-09-10 21:45:57.945094-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (161, 1, '2026-09-10 21:46:04.817116-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (162, 6, '2026-09-10 21:46:11.408818-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (163, 6, '2026-09-10 21:46:11.656354-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (164, 6, '2026-09-10 21:47:54.149536-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (165, 1, '2026-09-10 21:48:22.514507-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (166, 1, '2026-09-10 21:48:22.768494-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (167, 1, '2026-09-10 21:48:29.941153-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (168, 6, '2026-09-10 21:48:39.729536-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (169, 6, '2026-09-10 21:48:39.976148-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (170, 6, '2026-09-10 21:54:08.92387-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (171, 6, '2026-09-10 21:54:10.445636-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (172, 6, '2026-09-10 21:54:16.373439-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (173, 6, '2026-09-10 21:54:41.964475-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (174, 6, '2026-09-10 21:54:42.238222-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (175, 6, '2026-09-10 21:56:35.378752-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (176, 6, '2026-09-10 21:56:35.620264-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (177, 6, '2026-09-10 21:56:52.726903-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (178, 1, '2026-09-10 21:59:39.390869-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (179, 1, '2026-09-10 21:59:39.665614-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (180, 1, '2026-09-10 21:59:46.191165-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (181, 1, '2026-09-10 22:00:07.281817-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (182, 1, '2026-09-10 22:00:07.546218-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (183, 1, '2026-09-10 22:00:15.641598-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (184, 6, '2026-09-10 22:00:26.315906-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (185, 6, '2026-09-10 22:00:26.538408-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (186, 6, '2026-09-10 22:01:12.695857-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (187, 1, '2026-09-10 22:01:22.028012-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (188, 1, '2026-09-10 22:01:22.311283-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (189, 1, '2026-09-10 22:01:27.547645-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (190, 6, '2026-09-10 22:01:35.477243-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (191, 6, '2026-09-10 22:01:35.701406-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (192, 6, '2026-09-10 22:02:02.455823-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (193, 1, '2026-09-10 22:02:11.900083-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (194, 1, '2026-09-10 22:02:12.165763-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (195, 1, '2026-09-10 22:02:18.93483-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (196, 6, '2026-09-10 22:02:33.394307-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (197, 6, '2026-09-10 22:02:33.683647-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (198, 6, '2026-09-10 22:08:39.834921-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (199, 6, '2026-09-10 22:08:41.032184-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (200, 6, '2026-09-10 22:08:58.666876-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (201, 6, '2026-09-10 22:08:59.023035-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (202, 6, '2026-09-10 22:10:28.089079-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (203, 1, '2026-09-10 22:13:03.349714-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (204, 1, '2026-09-10 22:13:03.619725-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (205, 1, '2026-09-10 22:13:10.242922-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (206, 6, '2026-09-10 22:13:20.841277-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (207, 6, '2026-09-10 22:13:21.126246-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (208, 6, '2026-09-10 22:13:33.511897-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (209, 1, '2026-09-11 15:40:55.850214-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (210, 1, '2026-09-11 15:40:56.145224-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (211, 1, '2026-09-11 15:41:15.755579-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (212, 1, '2026-09-11 15:42:30.41111-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (213, 1, '2026-09-11 15:44:09.610141-03', 'crear_proveedor', 'inventario', 'Proveedor "ColaCoca" (ID 5)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (214, 1, '2026-09-11 18:00:50.981469-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (215, 1, '2026-09-11 18:00:51.276922-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (216, 1, '2026-09-11 18:58:42.48653-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (217, 1, '2026-09-11 18:58:42.759805-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (218, 1, '2026-09-11 22:12:08.408003-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (220, 1, '2026-09-11 22:18:28.094162-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (219, 1, '2026-09-11 22:18:28.094225-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (221, 1, '2026-09-11 22:22:10.681006-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (222, 1, '2026-09-11 22:22:10.82356-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (223, 1, '2026-09-11 22:22:15.506738-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (224, 1, '2026-09-11 22:22:15.512473-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (225, 1, '2026-09-11 22:34:55.007825-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (226, 1, '2026-09-11 22:34:55.022733-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (227, 1, '2026-09-11 23:18:35.565082-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (228, 1, '2026-09-11 23:18:35.700303-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (229, 1, '2026-09-11 23:19:05.547979-03', 'recuperar_password', 'inventario', 'Contraseña temporal generada para usuario silgod (ID 6)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (230, 6, '2026-09-11 23:19:13.694499-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (231, 6, '2026-09-11 23:19:13.806959-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (232, 6, '2026-09-11 23:19:13.839325-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (233, 6, '2026-09-11 23:19:42.464721-03', 'cambiar_password', 'inventario', 'Usuario ID 6 cambió su contraseña', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (234, 6, '2026-09-11 23:19:50.083004-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (235, 6, '2026-09-11 23:19:50.160442-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (236, 6, '2026-09-11 23:19:50.185364-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (237, 1, '2026-09-11 23:20:38.588596-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (238, 1, '2026-09-11 23:20:38.716752-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (239, 1, '2026-09-11 23:20:38.749381-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (240, 1, '2026-09-11 23:21:37.583698-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (241, 1, '2026-09-11 23:21:37.586937-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (242, 1, '2026-09-11 23:22:18.824199-03', 'Crear anaquel', 'inventario', 'Anaquel "asasa" creado en bodega ID 2', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (243, 1, '2026-09-11 23:22:21.244301-03', 'Eliminar anaquel', 'inventario', 'Anaquel ID 8 eliminado de bodega ID 2', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (244, 1, '2026-09-12 01:39:28.198554-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (246, 1, '2026-09-12 01:39:28.391229-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (245, 1, '2026-09-12 01:39:28.391136-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (247, 1, '2026-09-12 01:40:12.412234-03', 'programar_desactivacion', 'inventario', 'usuario_id: 6, fecha: 2026-09-12T04:41:00.000Z', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (248, 1, '2026-09-12 01:44:21.453156-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (249, 1, '2026-09-12 01:44:21.456803-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (250, 1, '2026-09-12 01:57:38.116185-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (251, 1, '2026-09-12 01:57:38.116292-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (252, 1, '2026-09-12 15:07:04.206017-03', 'login', 'inventario', 'Inicio de sesión: alvaro.morales', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (253, 1, '2026-09-12 15:07:04.371492-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (254, 1, '2026-09-12 15:07:04.398495-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (255, 6, '2026-09-12 15:13:01.675341-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (256, 6, '2026-09-12 15:13:01.801159-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (257, 6, '2026-09-12 15:13:01.837339-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (258, 6, '2026-09-12 15:25:10.012185-03', 'login', 'inventario', 'Inicio de sesión: silgod', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (259, 6, '2026-09-12 15:25:10.138728-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (260, 6, '2026-09-12 15:25:10.178573-03', 'generar_alertas', 'inventario', '0 alerta(s) generada(s)', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (261, 6, '2026-09-12 15:27:54.981879-03', 'registrar_entrada', 'inventario', 'SKU: TUB-040, cantidad: 100, bodega: 1', NULL, NULL, NULL);
INSERT INTO finanzas.evento_auditoria (id_evento, id_usuario, fecha_hora, accion_realizada, entidad_afectada, registro_afectado, ip_origen, motivo, observacion) OVERRIDING SYSTEM VALUE VALUES (262, 6, '2026-09-12 15:27:55.011176-03', 'auto_resolver_faltante', 'inventario', 'Alerta #64 resuelta automáticamente tras ingreso de TUB-040. Stock actual: 117', NULL, NULL, NULL);

--
-- TOC entry 6262 (class 0 OID 27924)
-- Dependencies: 303
-- Data for Name: detalle_evento_auditoria; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

--
-- TOC entry 6236 (class 0 OID 27726)
-- Dependencies: 277
-- Data for Name: fondo_global_credito; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.fondo_global_credito (id_fondo_credito, fecha_calculo, utilidad_neta_disponible, monto_gastos_operacionales_considerados, reserva_emergencia, monto_total_calculado, monto_bloqueado, monto_disponible, limite_seguridad_pct, estado) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-01', 45000000.00, 8000000.00, 5000000.00, 32000000.00, 10000000.00, 22000000.00, 20.00, 'vigente');

--
-- TOC entry 6224 (class 0 OID 27639)
-- Dependencies: 265
-- Data for Name: gasto_caja_chica; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.gasto_caja_chica (id_gasto_caja, id_usuario_registra, id_usuario_valida, id_categoria_gasto, fecha_gasto, descripcion, monto, respaldo_url, rendido, estado_validacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, 1, 3, '2024-11-05', 'Flete materiales a obra Andes', 45000.00, NULL, true, 'aprobado');
INSERT INTO finanzas.gasto_caja_chica (id_gasto_caja, id_usuario_registra, id_usuario_valida, id_categoria_gasto, fecha_gasto, descripcion, monto, respaldo_url, rendido, estado_validacion) OVERRIDING SYSTEM VALUE VALUES (2, 3, 1, 3, '2024-11-12', 'Flete materiales a obra Inmosur', 38000.00, NULL, true, 'aprobado');
INSERT INTO finanzas.gasto_caja_chica (id_gasto_caja, id_usuario_registra, id_usuario_valida, id_categoria_gasto, fecha_gasto, descripcion, monto, respaldo_url, rendido, estado_validacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, NULL, 4, '2024-11-15', 'Útiles de oficina bodega', 12000.00, NULL, false, 'pendiente');

--
-- TOC entry 6256 (class 0 OID 27880)
-- Dependencies: 297
-- Data for Name: liquidacion_remuneracion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.liquidacion_remuneracion (id_liquidacion, rut_empleado, id_usuario_cierra, periodo_inicio, periodo_fin, estado) OVERRIDING SYSTEM VALUE VALUES (1, '34567890-1', 1, '2024-10-01', '2024-10-31', 'cerrada');
INSERT INTO finanzas.liquidacion_remuneracion (id_liquidacion, rut_empleado, id_usuario_cierra, periodo_inicio, periodo_fin, estado) OVERRIDING SYSTEM VALUE VALUES (2, '56789012-3', 1, '2024-11-01', '2024-11-30', 'abierta');

--
-- TOC entry 6208 (class 0 OID 27515)
-- Dependencies: 249
-- Data for Name: medio_pago; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.medio_pago (id_medio_pago, nombre_medio_pago, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Transferencia bancaria', 'Transferencia electrónica', true);
INSERT INTO finanzas.medio_pago (id_medio_pago, nombre_medio_pago, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Cheque', 'Pago con cheque', true);
INSERT INTO finanzas.medio_pago (id_medio_pago, nombre_medio_pago, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Efectivo', 'Pago en efectivo', true);

--
-- TOC entry 6230 (class 0 OID 27686)
-- Dependencies: 271
-- Data for Name: movimiento_bancario; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (1, '2024-09-18', 'Banco de Chile', '00-123-456-78', 'Abono COT-001 Andes', 1987200.00, 'abono', 'OP-001', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (2, '2024-10-15', 'Banco de Chile', '00-123-456-78', 'Abono hito avance Andes', 3312000.00, 'abono', 'OP-002', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (3, '2024-10-31', 'Banco de Chile', '00-123-456-78', 'Pago proveedor Aceros', 4403000.00, 'cargo', 'OP-003', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (4, '2024-11-01', 'Banco de Chile', '00-123-456-78', 'Abono saldo final Andes', 1324800.00, 'abono', 'OP-004', NULL);
INSERT INTO finanzas.movimiento_bancario (id_movimiento_bancario, fecha_banco, banco, cuenta, glosa, monto, cargo_abono, numero_operacion, archivo_origen) OVERRIDING SYSTEM VALUE VALUES (5, '2024-11-02', 'Banco de Chile', '00-123-456-78', 'Abono anticipo Inmosur', 3571200.00, 'abono', 'OP-005', NULL);

--
-- TOC entry 6220 (class 0 OID 27611)
-- Dependencies: 261
-- Data for Name: pago_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.pago_proveedor (id_pago_proveedor, id_proveedor, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, '2024-10-31', 4403000.00, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_proveedor (id_pago_proveedor, id_proveedor, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 1, 1, '2024-11-05', 1059100.00, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_proveedor (id_pago_proveedor, id_proveedor, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 1, 1, '2024-11-10', 399840.00, NULL, 'confirmado', NULL);

--
-- TOC entry 6240 (class 0 OID 27760)
-- Dependencies: 281
-- Data for Name: parametro_riesgo_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.parametro_riesgo_financiero (id_parametro_riesgo, nombre_parametro, descripcion, tipo_parametro, peso, puntaje_maximo, valor_referencia, operador_evaluacion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Historial de pagos', NULL, 'cualitativo', 40.00, 40.00, NULL, NULL, true);
INSERT INTO finanzas.parametro_riesgo_financiero (id_parametro_riesgo, nombre_parametro, descripcion, tipo_parametro, peso, puntaje_maximo, valor_referencia, operador_evaluacion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Antigüedad cliente', NULL, 'cuantitativo', 30.00, 30.00, NULL, NULL, true);
INSERT INTO finanzas.parametro_riesgo_financiero (id_parametro_riesgo, nombre_parametro, descripcion, tipo_parametro, peso, puntaje_maximo, valor_referencia, operador_evaluacion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Monto comprometido', NULL, 'cuantitativo', 30.00, 30.00, NULL, NULL, true);

--
-- TOC entry 6187 (class 0 OID 27332)
-- Dependencies: 228
-- Data for Name: tipo_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_cliente (id_tipo_cliente, nombre_tipo_cliente, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'B2B', 'Empresa o institución', true);
INSERT INTO finanzas.tipo_cliente (id_tipo_cliente, nombre_tipo_cliente, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'B2C', 'Persona natural', true);

--
-- TOC entry 6189 (class 0 OID 27346)
-- Dependencies: 230
-- Data for Name: cliente_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.cliente_financiero (id_cliente_financiero, rut_cliente, id_tipo_cliente, nombre_razon_social, telefono_principal, correo_principal, estado_cliente, fecha_creacion, fecha_actualizacion_datos) OVERRIDING SYSTEM VALUE VALUES (1, '76543210-1', 1, 'Constructora Andes SpA', '+56922334455', 'contacto@andes.cl', 'activo', '2026-06-02 23:10:18.751781-04', NULL);
INSERT INTO finanzas.cliente_financiero (id_cliente_financiero, rut_cliente, id_tipo_cliente, nombre_razon_social, telefono_principal, correo_principal, estado_cliente, fecha_creacion, fecha_actualizacion_datos) OVERRIDING SYSTEM VALUE VALUES (2, '87654321-2', 1, 'Inmobiliaria del Sur Ltda', '+56933445566', 'info@inmsur.cl', 'activo', '2026-06-02 23:10:18.751781-04', NULL);
INSERT INTO finanzas.cliente_financiero (id_cliente_financiero, rut_cliente, id_tipo_cliente, nombre_razon_social, telefono_principal, correo_principal, estado_cliente, fecha_creacion, fecha_actualizacion_datos) OVERRIDING SYSTEM VALUE VALUES (3, '98765432-3', 2, 'Roberto Figueroa', '+56944556677', 'rfigueroa@gmail.com', 'activo', '2026-06-02 23:10:18.751781-04', NULL);

--
-- TOC entry 6242 (class 0 OID 27776)
-- Dependencies: 283
-- Data for Name: evaluacion_credito; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.evaluacion_credito (id_evaluacion_credito, id_cliente_financiero, id_usuario_autorizador, fecha_evaluacion, score_confianza, resultado, causa_rechazo, aprobacion_excepcional, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, 1, '2026-06-02 23:10:18.751781-04', 72.50, 'aprobado', NULL, false, 'Cliente con buen historial referencial');

--
-- TOC entry 6244 (class 0 OID 27792)
-- Dependencies: 285
-- Data for Name: detalle_evaluacion_credito; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.detalle_evaluacion_credito (id_detalle_evaluacion_credito, id_evaluacion_credito, id_parametro_riesgo, valor_obtenido, puntaje_obtenido, cumple, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'bueno', 35.00, true, NULL);
INSERT INTO finanzas.detalle_evaluacion_credito (id_detalle_evaluacion_credito, id_evaluacion_credito, id_parametro_riesgo, valor_obtenido, puntaje_obtenido, cumple, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, '2 años', 22.00, true, NULL);
INSERT INTO finanzas.detalle_evaluacion_credito (id_detalle_evaluacion_credito, id_evaluacion_credito, id_parametro_riesgo, valor_obtenido, puntaje_obtenido, cumple, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, 3, '< 5M', 15.50, true, NULL);

--
-- TOC entry 6190 (class 0 OID 27361)
-- Dependencies: 231
-- Data for Name: ficha_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.ficha_cliente (id_cliente_financiero, fecha_creacion, observaciones, estado_revision) VALUES (1, '2026-06-02 23:10:18.751781-04', NULL, 'aprobado');
INSERT INTO finanzas.ficha_cliente (id_cliente_financiero, fecha_creacion, observaciones, estado_revision) VALUES (2, '2026-06-02 23:10:18.751781-04', NULL, 'aprobado');
INSERT INTO finanzas.ficha_cliente (id_cliente_financiero, fecha_creacion, observaciones, estado_revision) VALUES (3, '2026-06-02 23:10:18.751781-04', NULL, 'pendiente');

--
-- TOC entry 6238 (class 0 OID 27745)
-- Dependencies: 279
-- Data for Name: limite_credito_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.limite_credito_cliente (id_limite_credito_cliente, id_cliente_financiero, monto_limite, plazo_dias, fecha_inicio_vigencia, fecha_fin_vigencia, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, 3000000.00, 30, '2024-11-01', NULL, 'vigente', NULL);

--
-- TOC entry 6210 (class 0 OID 27529)
-- Dependencies: 251
-- Data for Name: pago_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, '2024-09-18', 1987200.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 1, '2024-10-15', 3312000.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 1, '2024-11-01', 1324800.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);
INSERT INTO finanzas.pago_cliente (id_pago_cliente, id_cliente_financiero, id_usuario_registra, id_medio_pago, fecha_pago, monto_pago, tipo_pago, requiere_fecha_cobro, nro_cuotas, fecha_cobro, comprobante_url, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, 2, 1, '2024-11-02', 3571200.00, 'contado', false, NULL, NULL, NULL, 'confirmado', NULL);

--
-- TOC entry 6228 (class 0 OID 27670)
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
-- TOC entry 6234 (class 0 OID 27713)
-- Dependencies: 275
-- Data for Name: detalle_conciliacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.detalle_conciliacion (id_detalle_conciliacion, id_conciliacion, id_movimiento_financiero, id_movimiento_bancario, monto_conciliado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 1987200.00, NULL);
INSERT INTO finanzas.detalle_conciliacion (id_detalle_conciliacion, id_conciliacion, id_movimiento_financiero, id_movimiento_bancario, monto_conciliado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 2, 3312000.00, NULL);
INSERT INTO finanzas.detalle_conciliacion (id_detalle_conciliacion, id_conciliacion, id_movimiento_financiero, id_movimiento_bancario, monto_conciliado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 1, 4, 4, 1324800.00, NULL);

--
-- TOC entry 6192 (class 0 OID 27374)
-- Dependencies: 233
-- Data for Name: proyecto_financiero; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.proyecto_financiero (id_proyecto_financiero, id_cliente_financiero, id_obra, id_proyecto_terreno, codigo_proyecto, nombre_referencia, fecha_ingreso, estado_financiero, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, 1, 'PRY-2024-001', 'Proyecto Andes Edificio A', '2024-09-01', 'activo', NULL);
INSERT INTO finanzas.proyecto_financiero (id_proyecto_financiero, id_cliente_financiero, id_obra, id_proyecto_terreno, codigo_proyecto, nombre_referencia, fecha_ingreso, estado_financiero, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, NULL, 2, 'PRY-2024-002', 'Proyecto Inmosur Torre B', '2024-10-01', 'activo', NULL);
INSERT INTO finanzas.proyecto_financiero (id_proyecto_financiero, id_cliente_financiero, id_obra, id_proyecto_terreno, codigo_proyecto, nombre_referencia, fecha_ingreso, estado_financiero, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, NULL, NULL, 'PRY-2024-003', 'Residencial Figueroa', '2024-11-01', 'activo', NULL);

--
-- TOC entry 6194 (class 0 OID 27390)
-- Dependencies: 235
-- Data for Name: cotizacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.cotizacion (id_cotizacion, numero_cotizacion, id_cliente_financiero, id_proyecto_financiero, id_usuario_creador, fecha_emision, fecha_vigencia, moneda, tipo_cambio, margen_pct, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 'COT-2024-001', 1, 1, 1, '2024-08-15', '2024-09-15', 'CLP', NULL, NULL, 'aprobada', NULL);
INSERT INTO finanzas.cotizacion (id_cotizacion, numero_cotizacion, id_cliente_financiero, id_proyecto_financiero, id_usuario_creador, fecha_emision, fecha_vigencia, moneda, tipo_cambio, margen_pct, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 'COT-2024-002', 2, 2, 1, '2024-09-20', '2024-10-20', 'CLP', NULL, NULL, 'aprobada', NULL);
INSERT INTO finanzas.cotizacion (id_cotizacion, numero_cotizacion, id_cliente_financiero, id_proyecto_financiero, id_usuario_creador, fecha_emision, fecha_vigencia, moneda, tipo_cambio, margen_pct, estado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 'COT-2024-003', 3, 3, 2, '2024-10-25', '2024-11-25', 'CLP', NULL, NULL, 'pendiente', NULL);

--
-- TOC entry 6246 (class 0 OID 27805)
-- Dependencies: 287
-- Data for Name: credito_proyecto; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.credito_proyecto (id_credito_proyecto, id_proyecto_financiero, id_limite_credito_cliente, id_fondo_credito, id_evaluacion_credito, id_usuario_autorizador, monto_credito_aprobado, monto_bloqueado, fecha_aprobacion, estado_credito, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 3, NULL, 1, 1, 1, 1500000.00, 1500000.00, '2024-11-02', 'activo', NULL);

--
-- TOC entry 6196 (class 0 OID 27409)
-- Dependencies: 237
-- Data for Name: detalle_cotizacion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, NULL, 'Puerta blindada simple cal.14 - und', 4.00, NULL, NULL, NULL, 850000.00, 1200000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, NULL, NULL, 'Instalación puerta simple - und', 4.00, NULL, NULL, NULL, 120000.00, 180000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, NULL, NULL, 'Puerta blindada doble hoja - und', 2.00, NULL, NULL, NULL, 1500000.00, 2100000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, NULL, NULL, 'Instalación puerta doble - und', 2.00, NULL, NULL, NULL, 180000.00, 260000.00, 0.00, NULL);
INSERT INTO finanzas.detalle_cotizacion (id_detalle_cotizacion, id_cotizacion, sku_material, id_precio_material, descripcion_item, cantidad, alto, ancho, espesor, costo_unitario_estimado, precio_unitario_sugerido, descuento, observacion) OVERRIDING SYSTEM VALUE VALUES (5, 3, NULL, NULL, 'Puerta blindada simple cal.16 - und', 1.00, NULL, NULL, NULL, 920000.00, 1300000.00, 0.00, NULL);

--
-- TOC entry 6206 (class 0 OID 27499)
-- Dependencies: 247
-- Data for Name: hito_cobro; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'anticipo', 'Pago inicial 30%', 30.00, 1987200.00, '2024-09-18', NULL, NULL, 'cobrado', 1);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'avance_50', 'Pago al 50% de avance', 50.00, 3312000.00, '2024-10-15', NULL, NULL, 'cobrado', 2);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (3, 1, 'entrega_final', 'Saldo contra entrega', 20.00, 1324800.00, '2024-11-01', NULL, NULL, 'cobrado', 3);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'anticipo', 'Anticipo 40%', 40.00, 3571200.00, '2024-11-01', NULL, NULL, 'cobrado', 1);
INSERT INTO finanzas.hito_cobro (id_hito_cobro, id_proyecto_financiero, tipo_hito, descripcion, porcentaje_estimado, monto_estimado, fecha_comprometida, condicion_cobro, condicion_liberacion, estado_hito, orden_hito) OVERRIDING SYSTEM VALUE VALUES (5, 2, 'entrega_final', 'Saldo contra entrega', 60.00, 5356800.00, '2025-01-15', NULL, NULL, 'pendiente', 2);

--
-- TOC entry 6198 (class 0 OID 27422)
-- Dependencies: 239
-- Data for Name: nota_venta; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.nota_venta (id_nota_venta, numero_nota_venta, id_cliente_financiero, id_proyecto_financiero, id_cotizacion_origen, fecha_emision, fecha_max_entrega, tipo_nota_venta, moneda, tipo_cambio, descuento, estado_pedido, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 'NV-2024-001', 1, 1, 1, '2024-09-16', NULL, 'producto', 'CLP', NULL, 0.00, 'entregado', 'pagado', NULL);
INSERT INTO finanzas.nota_venta (id_nota_venta, numero_nota_venta, id_cliente_financiero, id_proyecto_financiero, id_cotizacion_origen, fecha_emision, fecha_max_entrega, tipo_nota_venta, moneda, tipo_cambio, descuento, estado_pedido, estado_pago, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 'NV-2024-002', 2, 2, 2, '2024-10-21', NULL, 'producto', 'CLP', NULL, 0.00, 'en_proceso', 'pendiente', NULL);

--
-- TOC entry 6200 (class 0 OID 27443)
-- Dependencies: 241
-- Data for Name: item_nota_venta; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, NULL, 'Puerta blindada simple cal.14', 4.00, NULL, NULL, NULL, 1200000.00, 0.00, true, true, 'entregado', NULL);
INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, NULL, 'Instalación puerta simple', 4.00, NULL, NULL, NULL, 180000.00, 0.00, false, false, 'completado', NULL);
INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, NULL, 'Puerta blindada doble hoja', 2.00, NULL, NULL, NULL, 2100000.00, 0.00, true, true, 'en_produccion', NULL);
INSERT INTO finanzas.item_nota_venta (id_item_nota_venta, id_nota_venta, id_producto_terminado, descripcion_item, cantidad, alto, ancho, espesor, precio_unitario, descuento, requiere_produccion, requiere_instalacion, estado_item, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 2, NULL, 'Instalación puerta doble', 2.00, NULL, NULL, NULL, 260000.00, 0.00, false, false, 'pendiente', NULL);

--
-- TOC entry 6214 (class 0 OID 27558)
-- Dependencies: 255
-- Data for Name: tipo_documento_compra_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_documento_compra_proveedor (id_tipo_documento_compra, nombre_tipo_documento_compra, descripcion, es_preliminar, genera_obligacion_pago, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Factura proveedor', NULL, false, true, true);
INSERT INTO finanzas.tipo_documento_compra_proveedor (id_tipo_documento_compra, nombre_tipo_documento_compra, descripcion, es_preliminar, genera_obligacion_pago, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Orden de compra', NULL, true, false, true);
INSERT INTO finanzas.tipo_documento_compra_proveedor (id_tipo_documento_compra, nombre_tipo_documento_compra, descripcion, es_preliminar, genera_obligacion_pago, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Guía de despacho', NULL, true, false, true);

--
-- TOC entry 6218 (class 0 OID 27590)
-- Dependencies: 259
-- Data for Name: documento_compra_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.documento_compra_proveedor (id_documento_compra_proveedor, id_proveedor, id_tipo_documento_compra, id_categoria_gasto, numero_documento, fecha_emision, fecha_vencimiento, moneda, tipo_cambio, monto_neto, tasa_iva_aplicada, tasa_retencion_aplicada, estado_documento, archivo_url, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 'FAC-PROV-001', '2024-10-01', NULL, 'CLP', NULL, 3700000.00, 19.00, NULL, 'contabilizado', NULL, NULL);
INSERT INTO finanzas.documento_compra_proveedor (id_documento_compra_proveedor, id_proveedor, id_tipo_documento_compra, id_categoria_gasto, numero_documento, fecha_emision, fecha_vencimiento, moneda, tipo_cambio, monto_neto, tasa_iva_aplicada, tasa_retencion_aplicada, estado_documento, archivo_url, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 1, 1, 'FAC-PROV-002', '2024-10-05', NULL, 'CLP', NULL, 890000.00, 19.00, NULL, 'contabilizado', NULL, NULL);
INSERT INTO finanzas.documento_compra_proveedor (id_documento_compra_proveedor, id_proveedor, id_tipo_documento_compra, id_categoria_gasto, numero_documento, fecha_emision, fecha_vencimiento, moneda, tipo_cambio, monto_neto, tasa_iva_aplicada, tasa_retencion_aplicada, estado_documento, archivo_url, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 1, 1, 'FAC-PROV-003', '2024-10-10', NULL, 'CLP', NULL, 336000.00, 19.00, NULL, 'contabilizado', NULL, NULL);

--
-- TOC entry 6222 (class 0 OID 27627)
-- Dependencies: 263
-- Data for Name: asignacion_pago_proveedor; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.asignacion_pago_proveedor (id_asignacion_pago_proveedor, id_pago_proveedor, id_documento_compra_proveedor, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 4403000.00, NULL);
INSERT INTO finanzas.asignacion_pago_proveedor (id_asignacion_pago_proveedor, id_pago_proveedor, id_documento_compra_proveedor, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 2, 1059100.00, NULL);
INSERT INTO finanzas.asignacion_pago_proveedor (id_asignacion_pago_proveedor, id_pago_proveedor, id_documento_compra_proveedor, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 3, 399840.00, NULL);

--
-- TOC entry 6202 (class 0 OID 27463)
-- Dependencies: 243
-- Data for Name: tipo_documento_tributario; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Factura electrónica', 'Factura afecta a IVA', true, true);
INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Boleta electrónica', 'Boleta persona natural', true, true);
INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Nota de débito', 'Corrección al alza', true, true);
INSERT INTO finanzas.tipo_documento_tributario (id_tipo_documento_tributario, nombre_tipo_documento, descripcion, afecta_iva, activo) OVERRIDING SYSTEM VALUE VALUES (4, 'Nota de crédito', 'Corrección a la baja', true, true);

--
-- TOC entry 6204 (class 0 OID 27479)
-- Dependencies: 245
-- Data for Name: documento_tributario; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.documento_tributario (id_documento_tributario, id_tipo_documento_tributario, numero_documento, id_nota_venta, fecha_emision, fecha_vencimiento, monto_neto, tasa_iva_aplicada, es_exento, estado_documento, archivo_url) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'FAC-E-001', 1, '2024-09-17', NULL, 5520000.00, 19.00, false, 'pagado', NULL);
INSERT INTO finanzas.documento_tributario (id_documento_tributario, id_tipo_documento_tributario, numero_documento, id_nota_venta, fecha_emision, fecha_vencimiento, monto_neto, tasa_iva_aplicada, es_exento, estado_documento, archivo_url) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'FAC-E-002', 2, '2024-10-22', NULL, 4720000.00, 19.00, false, 'emitido', NULL);

--
-- TOC entry 6212 (class 0 OID 27547)
-- Dependencies: 253
-- Data for Name: asignacion_pago_cliente; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 1, 1, 1987200.00, NULL);
INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 2, 1, 1, 1, 2, 3312000.00, NULL);
INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 3, 1, 1, 1, 3, 1324800.00, NULL);
INSERT INTO finanzas.asignacion_pago_cliente (id_asignacion_pago_cliente, id_pago_cliente, id_proyecto_financiero, id_nota_venta, id_documento_tributario, id_hito_cobro, monto_asignado, observacion) OVERRIDING SYSTEM VALUE VALUES (4, 4, 2, 2, 2, 4, 3571200.00, NULL);

--
-- TOC entry 6248 (class 0 OID 27824)
-- Dependencies: 289
-- Data for Name: tipo_tarea_catalogada; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tipo_tarea_catalogada (id_tipo_tarea, nombre_tipo_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 'Instalación', 'Tareas de instalación en terreno', true);
INSERT INTO finanzas.tipo_tarea_catalogada (id_tipo_tarea, nombre_tipo_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 'Producción', 'Tareas de producción en planta', true);
INSERT INTO finanzas.tipo_tarea_catalogada (id_tipo_tarea, nombre_tipo_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 'Supervisión', 'Tareas de supervisión', true);

--
-- TOC entry 6250 (class 0 OID 27838)
-- Dependencies: 291
-- Data for Name: tarea_catalogada; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Instalación puerta simple', 'Instalación estándar puerta simple', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'Instalación puerta doble', 'Instalación puerta doble hoja', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (3, 2, 'Corte y habilitación', 'Corte de materiales en planta', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'Pintura base', 'Aplicación de pintura base', true);
INSERT INTO finanzas.tarea_catalogada (id_tarea_catalogada, id_tipo_tarea, nombre_tarea, descripcion, activo) OVERRIDING SYSTEM VALUE VALUES (5, 3, 'Supervisión instalación', 'Supervisión en terreno', true);

--
-- TOC entry 6252 (class 0 OID 27853)
-- Dependencies: 293
-- Data for Name: tarifa_tarea; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (1, 1, 120000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (2, 2, 180000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (3, 3, 45000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (4, 4, 35000.00, '2024-01-01', NULL, true);
INSERT INTO finanzas.tarifa_tarea (id_tarifa_tarea, id_tarea_catalogada, valor_unitario, vigencia_desde, vigencia_hasta, activo) OVERRIDING SYSTEM VALUE VALUES (5, 5, 90000.00, '2024-01-01', NULL, true);

--
-- TOC entry 6254 (class 0 OID 27865)
-- Dependencies: 295
-- Data for Name: tarea_remunerable; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, '34567890-1', 3, 3, 1, NULL, NULL, '2024-10-02', 1.00, 8.00, 'validado', NULL);
INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (2, '34567890-1', 4, 4, 1, NULL, NULL, '2024-10-03', 1.00, 6.00, 'validado', NULL);
INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (3, '56789012-3', 1, 1, 1, NULL, NULL, '2024-11-01', 4.00, 32.00, 'validado', NULL);
INSERT INTO finanzas.tarea_remunerable (id_tarea_remunerable, rut_empleado, id_tarea_catalogada, id_tarifa_tarea, id_proyecto_financiero, id_producto_terminado, id_orden_trabajo, fecha, cantidad, horas, estado_validacion, observacion) OVERRIDING SYSTEM VALUE VALUES (4, '56789012-3', 2, 2, 2, NULL, NULL, '2024-11-05', 2.00, 24.00, 'pendiente', NULL);

--
-- TOC entry 6258 (class 0 OID 27895)
-- Dependencies: 299
-- Data for Name: concepto_remuneracion; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.concepto_remuneracion (id_concepto_remuneracion, id_liquidacion, id_tarea_remunerable, tipo_concepto, descripcion, monto, es_imponible, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'haber', 'Corte y habilitación - 1 un', 45000.00, true, NULL);
INSERT INTO finanzas.concepto_remuneracion (id_concepto_remuneracion, id_liquidacion, id_tarea_remunerable, tipo_concepto, descripcion, monto, es_imponible, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 'haber', 'Pintura base - 1 un', 35000.00, true, NULL);
INSERT INTO finanzas.concepto_remuneracion (id_concepto_remuneracion, id_liquidacion, id_tarea_remunerable, tipo_concepto, descripcion, monto, es_imponible, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, 3, 'haber', 'Instalación puerta simple - 4 un', 480000.00, true, NULL);

--
-- TOC entry 6226 (class 0 OID 27657)
-- Dependencies: 267
-- Data for Name: costo_proyecto; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.costo_proyecto (id_costo_proyecto, id_proyecto_financiero, id_documento_compra_proveedor, id_gasto_caja, id_tarea_remunerable, id_movimiento_inventario, id_lote, id_categoria_gasto, monto_asignado, fecha_costo, descripcion, observacion) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, NULL, NULL, NULL, NULL, 1, 3700000.00, '2024-10-01', 'Compra acero galvanizado FAC-PROV-001', NULL);
INSERT INTO finanzas.costo_proyecto (id_costo_proyecto, id_proyecto_financiero, id_documento_compra_proveedor, id_gasto_caja, id_tarea_remunerable, id_movimiento_inventario, id_lote, id_categoria_gasto, monto_asignado, fecha_costo, descripcion, observacion) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, NULL, NULL, NULL, NULL, 1, 890000.00, '2024-10-05', 'Compra pinturas FAC-PROV-002', NULL);
INSERT INTO finanzas.costo_proyecto (id_costo_proyecto, id_proyecto_financiero, id_documento_compra_proveedor, id_gasto_caja, id_tarea_remunerable, id_movimiento_inventario, id_lote, id_categoria_gasto, monto_asignado, fecha_costo, descripcion, observacion) OVERRIDING SYSTEM VALUE VALUES (3, 2, 3, NULL, NULL, NULL, NULL, 1, 336000.00, '2024-10-10', 'Compra madera FAC-PROV-003', NULL);

--
-- TOC entry 6264 (class 0 OID 27935)
-- Dependencies: 305
-- Data for Name: alerta_financiera; Type: TABLE DATA; Schema: finanzas; Owner: postgres
--

INSERT INTO finanzas.alerta_financiera (id_alerta_financiera, tipo_alerta, nivel_alerta, fecha_generacion, prioridad, estado, mensaje, id_cliente_financiero, id_proyecto_financiero, id_documento_tributario, id_documento_compra_proveedor, id_costo_proyecto, id_credito_proyecto) OVERRIDING SYSTEM VALUE VALUES (1, 'vencimiento_documento', 'media', '2026-06-02 23:10:18.751781-04', 'alta', 'pendiente', 'Documento FAC-E-002 vence en 30 días. Monto: $4.720.000', 2, 2, NULL, NULL, NULL, NULL);
INSERT INTO finanzas.alerta_financiera (id_alerta_financiera, tipo_alerta, nivel_alerta, fecha_generacion, prioridad, estado, mensaje, id_cliente_financiero, id_proyecto_financiero, id_documento_tributario, id_documento_compra_proveedor, id_costo_proyecto, id_credito_proyecto) OVERRIDING SYSTEM VALUE VALUES (2, 'hito_pendiente', 'baja', '2026-06-02 23:10:18.751781-04', 'media', 'pendiente', 'Hito entrega final PRY-2024-002 vence 2025-01-15. Monto: $5.356.800', 2, 2, NULL, NULL, NULL, NULL);
