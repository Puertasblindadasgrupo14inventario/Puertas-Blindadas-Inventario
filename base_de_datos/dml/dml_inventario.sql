--
-- PostgreSQL database dump
--


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
-- TOC entry 5692 (class 0 OID 29141)
-- Dependencies: 309
-- Data for Name: material_categoria_funcional; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_categoria_funcional (material_categoria_funcional_id_categoria_funcional, material_categoria_funcional_nombre) OVERRIDING SYSTEM VALUE VALUES (1, 'Estructura');
INSERT INTO inventario.material_categoria_funcional (material_categoria_funcional_id_categoria_funcional, material_categoria_funcional_nombre) OVERRIDING SYSTEM VALUE VALUES (2, 'Recubrimiento');
INSERT INTO inventario.material_categoria_funcional (material_categoria_funcional_id_categoria_funcional, material_categoria_funcional_nombre) OVERRIDING SYSTEM VALUE VALUES (3, 'Ferretería');


--
-- TOC entry 5690 (class 0 OID 29131)
-- Dependencies: 307
-- Data for Name: material_categoria_general; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_categoria_general (material_categoria_general_id_categoria_general, material_categoria_general_nombre) OVERRIDING SYSTEM VALUE VALUES (1, 'Materia Prima');
INSERT INTO inventario.material_categoria_general (material_categoria_general_id_categoria_general, material_categoria_general_nombre) OVERRIDING SYSTEM VALUE VALUES (2, 'Insumo');


--
-- TOC entry 5694 (class 0 OID 29151)
-- Dependencies: 311
-- Data for Name: material_clasificacion_categoria; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_clasificacion_categoria (material_clasificacion_categoria_id, material_clasificacion_categoria_nombre_categoria) OVERRIDING SYSTEM VALUE VALUES (1, 'Fierro');
INSERT INTO inventario.material_clasificacion_categoria (material_clasificacion_categoria_id, material_clasificacion_categoria_nombre_categoria) OVERRIDING SYSTEM VALUE VALUES (2, 'Pintura');
INSERT INTO inventario.material_clasificacion_categoria (material_clasificacion_categoria_id, material_clasificacion_categoria_nombre_categoria) OVERRIDING SYSTEM VALUE VALUES (3, 'Madera');


--
-- TOC entry 5696 (class 0 OID 29159)
-- Dependencies: 313
-- Data for Name: material_clasificacion_subcategoria; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_clasificacion_subcategoria (material_clasificacion_subcategoria_id, material_clasificacion_subcategoria_nombre_subcategoria, material_clasificacion_subcategoria_es_color_custom, material_clasificacion_categoria_id) OVERRIDING SYSTEM VALUE VALUES (1, 'Plancha galvanizada', false, 1);
INSERT INTO inventario.material_clasificacion_subcategoria (material_clasificacion_subcategoria_id, material_clasificacion_subcategoria_nombre_subcategoria, material_clasificacion_subcategoria_es_color_custom, material_clasificacion_categoria_id) OVERRIDING SYSTEM VALUE VALUES (2, 'Tubo estructural', false, 1);
INSERT INTO inventario.material_clasificacion_subcategoria (material_clasificacion_subcategoria_id, material_clasificacion_subcategoria_nombre_subcategoria, material_clasificacion_subcategoria_es_color_custom, material_clasificacion_categoria_id) OVERRIDING SYSTEM VALUE VALUES (3, 'Blanco estándar', false, 2);
INSERT INTO inventario.material_clasificacion_subcategoria (material_clasificacion_subcategoria_id, material_clasificacion_subcategoria_nombre_subcategoria, material_clasificacion_subcategoria_es_color_custom, material_clasificacion_categoria_id) OVERRIDING SYSTEM VALUE VALUES (4, 'Gris RAL-7016', false, 2);
INSERT INTO inventario.material_clasificacion_subcategoria (material_clasificacion_subcategoria_id, material_clasificacion_subcategoria_nombre_subcategoria, material_clasificacion_subcategoria_es_color_custom, material_clasificacion_categoria_id) OVERRIDING SYSTEM VALUE VALUES (5, 'Verde oliva custom', true, 2);
INSERT INTO inventario.material_clasificacion_subcategoria (material_clasificacion_subcategoria_id, material_clasificacion_subcategoria_nombre_subcategoria, material_clasificacion_subcategoria_es_color_custom, material_clasificacion_categoria_id) OVERRIDING SYSTEM VALUE VALUES (6, 'Pino radiata', false, 3);


--
-- TOC entry 5698 (class 0 OID 29170)
-- Dependencies: 315
-- Data for Name: material_clasificacion_nivel_especifico; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (1, 'Calibre 14', 1);
INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (2, 'Calibre 16', 1);
INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (3, '40x40mm', 2);
INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (4, 'Esmalte', 3);
INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (5, 'Anticorrosiva', 4);
INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (6, 'Esmalte custom', 5);
INSERT INTO inventario.material_clasificacion_nivel_especifico (material_clasificacion_nivel_especifico_id, material_clasificacion_nivel_especifico_nombre_nivel_especifico, material_clasificacion_subcategoria_id) OVERRIDING SYSTEM VALUE VALUES (7, 'Tabla 1x6', 6);


--
-- TOC entry 5700 (class 0 OID 29179)
-- Dependencies: 317
-- Data for Name: material_unidad_medida; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_unidad_medida (material_unidad_medida_id_unidad_medida, material_unidad_medida_nombre) OVERRIDING SYSTEM VALUE VALUES (1, 'plancha');
INSERT INTO inventario.material_unidad_medida (material_unidad_medida_id_unidad_medida, material_unidad_medida_nombre) OVERRIDING SYSTEM VALUE VALUES (2, 'litro');
INSERT INTO inventario.material_unidad_medida (material_unidad_medida_id_unidad_medida, material_unidad_medida_nombre) OVERRIDING SYSTEM VALUE VALUES (3, 'metro');
INSERT INTO inventario.material_unidad_medida (material_unidad_medida_id_unidad_medida, material_unidad_medida_nombre) OVERRIDING SYSTEM VALUE VALUES (4, 'unidad');
INSERT INTO inventario.material_unidad_medida (material_unidad_medida_id_unidad_medida, material_unidad_medida_nombre) OVERRIDING SYSTEM VALUE VALUES (5, 'kilogramo');


--
-- TOC entry 5725 (class 0 OID 29310)
-- Dependencies: 342
-- Data for Name: material; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('ACR-001', 'Acero galvanizado cal.14', 'Plancha 1.22x2.44m cal.14', true, 'plancha', 5.0000, 200.0000, 20.0000, true, 'activo', NULL, NULL, NULL, NULL, 1, 1, 1, 1);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('TUB-040', 'Tubo estructural 40x40', 'Tubo cuadrado 40x40x1.5mm', false, 'metro', 3.0000, 300.0000, 15.0000, true, 'activo', NULL, NULL, NULL, NULL, 1, 1, 3, 3);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('ACR-016', 'Acero galvanizado cal.16', 'Plancha 1.22x2.44m cal.16', true, 'plancha', 8.0000, 150.0000, 25.0000, true, 'activo', NULL, NULL, NULL, NULL, 1, 1, 2, 1);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('PIN-CUS', 'Pintura verde oliva custom', 'Mezcla custom proyecto A', false, 'litro', 0.0000, 10.0000, 2.0000, false, 'activo', true, 'Verde oliva - mezcla exclusiva PRY-2024-003', NULL, NULL, 2, 2, 6, 2);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('PIN-BLA', 'Pintura esmalte blanco', 'Esmalte blanco estándar', false, 'litro', 2.0000, 50.0000, 5.0000, false, 'activo', NULL, NULL, true, 'Blanco estándar', 2, 2, 4, 2);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('PIN-GRS', 'Pintura anticorrosiva gris', 'Anticorrosiva RAL-7016', false, 'litro', 1.0000, 30.0000, 3.0000, false, 'activo', NULL, NULL, true, 'Gris RAL-7016', 2, 2, 5, 2);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('SIX-SEV-067', 'SIXSEVEN67', 'sasasasasa', true, NULL, 1.0000, 111.0000, 11.0000, true, 'activo', NULL, NULL, NULL, NULL, 1, 1, NULL, 1);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('ANG-CEM-001', 'Acero de prueba', 'material para probar la demo', true, NULL, 5.0000, 100.0000, 10.0000, true, 'activo', NULL, NULL, NULL, NULL, 1, 3, 3, 3);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('1121212121W', 'pruebamat', NULL, true, NULL, 1.0000, 100.0000, 10.0000, true, 'activo', NULL, NULL, NULL, NULL, 2, 1, 7, 5);
INSERT INTO inventario.material (material_sku, material_nombre_material, material_descripcion, material_material_critico, material_presentacion, material_stock_critico, material_stock_maximo, material_stock_minimo, material_es_rotativo, material_estado, es_material_pintura_custom, material_pintura_pintura_custom, es_material_pintura_no_custom, material_pintura_no_custom, material_categoria_general_id_categoria_general, material_categoria_funcional_id_categoria_funcional, material_clasificacion_nivel_especifico_id, material_unidad_medida_id_unidad_medida) VALUES ('MAD-PIN', 'Tabla pino radiata 1x6', 'Tabla cepillada 1x6 pulg.', true, NULL, 10.0000, 400.0000, 350.0000, true, 'activo', NULL, NULL, NULL, NULL, 1, 3, 7, 3);


--
-- TOC entry 5716 (class 0 OID 29251)
-- Dependencies: 333
-- Data for Name: perfil; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.perfil (perfil_id_perfil, perfil_nombre_perfil, perfil_descripcion) OVERRIDING SYSTEM VALUE VALUES (1, 'gerencia', 'Acceso completo');
INSERT INTO inventario.perfil (perfil_id_perfil, perfil_nombre_perfil, perfil_descripcion) OVERRIDING SYSTEM VALUE VALUES (2, 'jop', 'Jefe de Operaciones — sin datos financieros');
INSERT INTO inventario.perfil (perfil_id_perfil, perfil_nombre_perfil, perfil_descripcion) OVERRIDING SYSTEM VALUE VALUES (3, 'bodeguero', 'Gestión de bodega e inventario');
INSERT INTO inventario.perfil (perfil_id_perfil, perfil_nombre_perfil, perfil_descripcion) OVERRIDING SYSTEM VALUE VALUES (4, 'administrador', 'Administración del sistema');


--
-- TOC entry 5728 (class 0 OID 29337)
-- Dependencies: 345
-- Data for Name: proveedor; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.proveedor (proveedor_id_proveedor, proveedor_pais, proveedor_tipo_proveedor, proveedor_rubro, proveedor_razon_social, proveedor_contacto_primer_nombre, proveedor_contacto_segundo_nombre, proveedor_contacto_primer_apellido, proveedor_contacto_segundo_apellido, proveedor_estado, proveedor_doc_identidad_tipo_identificador, proveedor_doc_identidad_rut_proveedor_opcional, proveedor_doc_identidad_pais_emision_identificador, proveedor_doc_identidad_numero_identificador) OVERRIDING SYSTEM VALUE VALUES (1, 'Chile', 'nacional', 'Acero y metales', 'Aceros del Sur Ltda.', 'Carlos', NULL, 'Muñoz', NULL, 'activo', NULL, NULL, NULL, NULL);
INSERT INTO inventario.proveedor (proveedor_id_proveedor, proveedor_pais, proveedor_tipo_proveedor, proveedor_rubro, proveedor_razon_social, proveedor_contacto_primer_nombre, proveedor_contacto_segundo_nombre, proveedor_contacto_primer_apellido, proveedor_contacto_segundo_apellido, proveedor_estado, proveedor_doc_identidad_tipo_identificador, proveedor_doc_identidad_rut_proveedor_opcional, proveedor_doc_identidad_pais_emision_identificador, proveedor_doc_identidad_numero_identificador) OVERRIDING SYSTEM VALUE VALUES (2, 'Chile', 'distribuidor', 'Pinturas y barnices', 'Pinturas Sherwin Chile', 'Andrea', NULL, 'Torres', NULL, 'activo', NULL, NULL, NULL, NULL);
INSERT INTO inventario.proveedor (proveedor_id_proveedor, proveedor_pais, proveedor_tipo_proveedor, proveedor_rubro, proveedor_razon_social, proveedor_contacto_primer_nombre, proveedor_contacto_segundo_nombre, proveedor_contacto_primer_apellido, proveedor_contacto_segundo_apellido, proveedor_estado, proveedor_doc_identidad_tipo_identificador, proveedor_doc_identidad_rut_proveedor_opcional, proveedor_doc_identidad_pais_emision_identificador, proveedor_doc_identidad_numero_identificador) OVERRIDING SYSTEM VALUE VALUES (3, 'Chile', 'nacional', 'Madera y tableros', 'Maderería Los Boldos', 'Roberto', NULL, 'Soto', NULL, 'activo', NULL, NULL, NULL, NULL);


--
-- TOC entry 5759 (class 0 OID 29545)
-- Dependencies: 376
-- Data for Name: usuario; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.usuario (usuario_id_usuario, usuario_fecha_de_ultima_edicion, usuario_rut_usuario, usuario_fecha_de_creacion, usuario_correo, usuario_username, usuario_estado_cuenta, usuario_fecha_ultima_conexion, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_segundo_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, usuario_nombre_completo_segundo_apellido_usuario, usuario_es_gerencia, gerencia, usuario_es_tecnico, tecnico, usuario_es_jop, jop, usuario_es_administrador, administrador, usuario_es_secretaria, secretaria, perfil_id_perfil, empleado_rut_empleado) OVERRIDING SYSTEM VALUE VALUES (2, NULL, NULL, '2026-06-02 22:56:52.885913-04', 'olivia@pb.cl', 'olivia.ramirez', 'activa', NULL, 'Olivia', NULL, 'Ramírez', NULL, false, NULL, false, NULL, true, NULL, false, NULL, false, NULL, 2, '23456789-0');
INSERT INTO inventario.usuario (usuario_id_usuario, usuario_fecha_de_ultima_edicion, usuario_rut_usuario, usuario_fecha_de_creacion, usuario_correo, usuario_username, usuario_estado_cuenta, usuario_fecha_ultima_conexion, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_segundo_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, usuario_nombre_completo_segundo_apellido_usuario, usuario_es_gerencia, gerencia, usuario_es_tecnico, tecnico, usuario_es_jop, jop, usuario_es_administrador, administrador, usuario_es_secretaria, secretaria, perfil_id_perfil, empleado_rut_empleado) OVERRIDING SYSTEM VALUE VALUES (4, NULL, NULL, '2026-06-02 22:56:52.885913-04', 'marcela@pb.cl', 'marcela.soto', 'activa', NULL, 'Marcela', NULL, 'Soto', NULL, false, NULL, false, NULL, false, NULL, true, NULL, false, NULL, 4, '45678901-2');
INSERT INTO inventario.usuario (usuario_id_usuario, usuario_fecha_de_ultima_edicion, usuario_rut_usuario, usuario_fecha_de_creacion, usuario_correo, usuario_username, usuario_estado_cuenta, usuario_fecha_ultima_conexion, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_segundo_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, usuario_nombre_completo_segundo_apellido_usuario, usuario_es_gerencia, gerencia, usuario_es_tecnico, tecnico, usuario_es_jop, jop, usuario_es_administrador, administrador, usuario_es_secretaria, secretaria, perfil_id_perfil, empleado_rut_empleado) OVERRIDING SYSTEM VALUE VALUES (5, '2026-06-08 02:07:40.929676-04', NULL, '2026-06-08 01:16:20.886731-04', 'juan@puertasblindadas.cl', 'jgarcia1', 'activa', '2026-06-08 02:05:02.155044-04', 'juan', NULL, 'garcia', NULL, false, NULL, false, NULL, true, NULL, false, NULL, false, NULL, NULL, NULL);
INSERT INTO inventario.usuario (usuario_id_usuario, usuario_fecha_de_ultima_edicion, usuario_rut_usuario, usuario_fecha_de_creacion, usuario_correo, usuario_username, usuario_estado_cuenta, usuario_fecha_ultima_conexion, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_segundo_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, usuario_nombre_completo_segundo_apellido_usuario, usuario_es_gerencia, gerencia, usuario_es_tecnico, tecnico, usuario_es_jop, jop, usuario_es_administrador, administrador, usuario_es_secretaria, secretaria, perfil_id_perfil, empleado_rut_empleado) OVERRIDING SYSTEM VALUE VALUES (3, '2026-06-14 04:58:00.004773-04', NULL, '2026-06-02 22:56:52.885913-04', 'juan@pb.cl', 'juan.perez', 'activa', NULL, 'Juan', NULL, 'Pérez', NULL, false, NULL, false, NULL, true, NULL, false, NULL, false, NULL, 3, '34567890-1');
INSERT INTO inventario.usuario (usuario_id_usuario, usuario_fecha_de_ultima_edicion, usuario_rut_usuario, usuario_fecha_de_creacion, usuario_correo, usuario_username, usuario_estado_cuenta, usuario_fecha_ultima_conexion, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_segundo_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, usuario_nombre_completo_segundo_apellido_usuario, usuario_es_gerencia, gerencia, usuario_es_tecnico, tecnico, usuario_es_jop, jop, usuario_es_administrador, administrador, usuario_es_secretaria, secretaria, perfil_id_perfil, empleado_rut_empleado) OVERRIDING SYSTEM VALUE VALUES (6, '2026-06-14 04:58:13.261317-04', NULL, '2026-06-09 20:31:23.829746-04', 'silgod@puertasblindadas.cl', 'silgod', 'activa', '2026-06-09 21:28:14.754778-04', 'Silvio', NULL, 'Villagra', NULL, false, NULL, false, NULL, true, NULL, false, NULL, false, NULL, NULL, NULL);
INSERT INTO inventario.usuario (usuario_id_usuario, usuario_fecha_de_ultima_edicion, usuario_rut_usuario, usuario_fecha_de_creacion, usuario_correo, usuario_username, usuario_estado_cuenta, usuario_fecha_ultima_conexion, usuario_nombre_completo_primer_nombre_usuario, usuario_nombre_completo_segundo_nombre_usuario, usuario_nombre_completo_primer_apellido_usuario, usuario_nombre_completo_segundo_apellido_usuario, usuario_es_gerencia, gerencia, usuario_es_tecnico, tecnico, usuario_es_jop, jop, usuario_es_administrador, administrador, usuario_es_secretaria, secretaria, perfil_id_perfil, empleado_rut_empleado) OVERRIDING SYSTEM VALUE VALUES (1, NULL, NULL, '2026-06-02 22:56:52.885913-04', 'alvaro@pb.cl', 'alvaro.morales', 'activa', '2026-06-14 09:44:53.96259-04', 'Álvaro', NULL, 'Morales', NULL, true, NULL, false, NULL, false, NULL, false, NULL, false, NULL, 1, '12345678-9');


--
-- TOC entry 5750 (class 0 OID 29487)
-- Dependencies: 367
-- Data for Name: alerta_faltante_pedido; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.alerta_faltante_pedido (alerta_faltante_pedido_id_alerta_faltante, alerta_faltante_pedido_fecha_generacion, alerta_faltante_pedido_cantidad_disponible, alerta_faltante_pedido_cantidad_requerida, alerta_faltante_pedido_horas_anticipacion, alerta_faltante_pedido_estado, material_sku, proveedor_id_proveedor, usuario_id_usuario, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-21 08:00:00-03', 5.0000, 15.0000, 48, 'pendiente', 'TUB-040', 1, 2, NULL);
INSERT INTO inventario.alerta_faltante_pedido (alerta_faltante_pedido_id_alerta_faltante, alerta_faltante_pedido_fecha_generacion, alerta_faltante_pedido_cantidad_disponible, alerta_faltante_pedido_cantidad_requerida, alerta_faltante_pedido_horas_anticipacion, alerta_faltante_pedido_estado, material_sku, proveedor_id_proveedor, usuario_id_usuario, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-22 08:00:00-03', 2.0000, 4.0000, 24, 'pendiente', 'PIN-GRS', 2, 2, NULL);


--
-- TOC entry 5704 (class 0 OID 29196)
-- Dependencies: 321
-- Data for Name: alerta_inventario_nivel_prioridad; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.alerta_inventario_nivel_prioridad (alerta_inventario_nivel_prioridad_id_nivel_prioridad, alerta_inventario_prioridad_nombre) OVERRIDING SYSTEM VALUE VALUES (1, 'media');
INSERT INTO inventario.alerta_inventario_nivel_prioridad (alerta_inventario_nivel_prioridad_id_nivel_prioridad, alerta_inventario_prioridad_nombre) OVERRIDING SYSTEM VALUE VALUES (2, 'alta');
INSERT INTO inventario.alerta_inventario_nivel_prioridad (alerta_inventario_nivel_prioridad_id_nivel_prioridad, alerta_inventario_prioridad_nombre) OVERRIDING SYSTEM VALUE VALUES (3, 'urgente');


--
-- TOC entry 5706 (class 0 OID 29204)
-- Dependencies: 323
-- Data for Name: alerta_inventario_tipo_alerta; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (1, 'stock_minimo', 1);
INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (2, 'stock_critico', 3);
INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (3, 'stock_maximo', 1);
INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (4, 'reposicion', 2);
INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (5, 'tiempo reposicion', 1);
INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (6, 'stock bajo minimo', 2);
INSERT INTO inventario.alerta_inventario_tipo_alerta (alerta_inventario_tipo_alerta_id_tipo_alerta, alerta_inventario_tipo_alerta_nombre, alerta_inventario_nivel_prioridad_id) OVERRIDING SYSTEM VALUE VALUES (7, 'stock critico', 3);


--
-- TOC entry 5702 (class 0 OID 29189)
-- Dependencies: 319
-- Data for Name: historial_alerta; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (1, '2024-10-20 14:30:00-03');
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (3, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (4, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (5, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (6, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (7, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (8, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (9, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (10, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (11, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (12, NULL);
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (2, '2026-06-14 04:16:43.976794-04');
INSERT INTO inventario.historial_alerta (historial_alerta_id_historial, historial_alerta_fecha_hora_resolucion) OVERRIDING SYSTEM VALUE VALUES (13, NULL);


--
-- TOC entry 5746 (class 0 OID 29460)
-- Dependencies: 363
-- Data for Name: alerta_inventario; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (2, 'Stock crítico. ACR-016 tiene 6 und, nivel crítico es 8.', '2024-11-20 09:01:00-03', '2024-11-28', 'activa', 'ACR-016', 1, 2, NULL);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (3, 'Stock bajo mínimo. TUB-040 tiene 5 und, mínimo es 15.', '2024-11-21 10:01:00-03', '2024-12-10', 'activa', 'TUB-040', 1, 1, NULL);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (4, 'Stock bajo mínimo. PIN-GRS tiene 2 litros, mínimo es 3.', '2024-11-22 11:01:00-03', '2024-12-01', 'activa', 'PIN-GRS', 2, 1, NULL);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (5, 'Stock resuelto. MAD-PIN fue repuesto.', '2024-10-15 08:00:00-03', NULL, 'resuelta', 'MAD-PIN', 3, 1, 1);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (1, 'Stock bajo mínimo. ACR-001 tiene 10 und, mínimo es 20.', '2024-11-20 09:01:00-03', '2024-12-05', 'resuelta', 'ACR-001', 1, 1, NULL);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (7, 'Stock actual (0) en nivel crítico', '2026-06-14 03:40:28.054893-04', NULL, 'activa', 'ANG-CEM-001', NULL, 7, 3);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (8, 'Stock actual (0) en nivel crítico', '2026-06-14 03:40:28.057869-04', NULL, 'activa', '1121212121W', NULL, 7, 4);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (9, 'Stock actual (0) en nivel crítico', '2026-06-14 04:03:11.905579-04', NULL, 'activa', 'SIX-SEV-067', NULL, 2, 5);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (10, 'Stock actual (0) en nivel crítico', '2026-06-14 04:03:11.908662-04', NULL, 'activa', 'ANG-CEM-001', NULL, 2, 6);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (11, 'Stock actual (0) en nivel crítico', '2026-06-14 04:03:11.911018-04', NULL, 'activa', '1121212121W', NULL, 2, 7);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (12, 'Stock actual (8) bajo el mínimo definido', '2026-06-14 04:13:32.351491-04', NULL, 'activa', 'TUB-040', NULL, 6, 8);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (13, 'Stock actual (2) bajo el mínimo definido', '2026-06-14 04:13:32.355424-04', NULL, 'activa', 'PIN-GRS', NULL, 6, 9);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (14, 'Stock actual (1) en nivel crítico', '2026-06-14 04:13:32.358118-04', NULL, 'activa', 'PIN-BLA', NULL, 2, 10);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (15, 'Stock actual (5) en nivel crítico', '2026-06-14 04:13:32.361605-04', NULL, 'activa', 'MAD-PIN', NULL, 2, 11);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (16, 'Stock actual (11) bajo el mínimo definido', '2026-06-14 04:13:32.363945-04', NULL, 'activa', 'ACR-001', NULL, 6, 12);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (6, 'Stock actual (0) en nivel crítico', '2026-06-14 03:40:28.049496-04', NULL, 'resuelta', 'SIX-SEV-067', NULL, 7, 2);
INSERT INTO inventario.alerta_inventario (alerta_inventario_id_alerta, alerta_inventario_mensaje, alerta_inventario_fecha_generacion, alerta_inventario_fecha_est_agotamiento, alerta_inventario_estado, material_sku, proveedor_id_proveedor, alerta_inventario_tipo_alerta_id_tipo_alerta, historial_alerta_id_historial) OVERRIDING SYSTEM VALUE VALUES (17, 'Stock actual (249) bajo el mínimo definido', '2026-06-14 09:53:54.111486-04', NULL, 'activa', 'ACR-016', NULL, 3, 13);


--
-- TOC entry 5724 (class 0 OID 29300)
-- Dependencies: 341
-- Data for Name: bodega; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.bodega (bodega_id_bodega, bodega_nombre_bodega, bodega_direccion, bodega_estado) OVERRIDING SYSTEM VALUE VALUES (1, 'Bodega Central', 'Av. Industrial 1234, Santiago', 'activa');
INSERT INTO inventario.bodega (bodega_id_bodega, bodega_nombre_bodega, bodega_direccion, bodega_estado) OVERRIDING SYSTEM VALUE VALUES (2, 'Bodega Secundaria', 'Calle Sur 567, Santiago', 'activa');


--
-- TOC entry 5734 (class 0 OID 29382)
-- Dependencies: 351
-- Data for Name: anaquel; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.anaquel (anaquel_id_anaquel, anaquel_descripcion, bodega_id_bodega) OVERRIDING SYSTEM VALUE VALUES (1, 'Estante A1 — Fierros', 1);
INSERT INTO inventario.anaquel (anaquel_id_anaquel, anaquel_descripcion, bodega_id_bodega) OVERRIDING SYSTEM VALUE VALUES (2, 'Estante A2 — Pinturas', 1);
INSERT INTO inventario.anaquel (anaquel_id_anaquel, anaquel_descripcion, bodega_id_bodega) OVERRIDING SYSTEM VALUE VALUES (3, 'Estante B1 — Madera', 1);
INSERT INTO inventario.anaquel (anaquel_id_anaquel, anaquel_descripcion, bodega_id_bodega) OVERRIDING SYSTEM VALUE VALUES (4, 'Estante C1 — Varios', 2);


--
-- TOC entry 5720 (class 0 OID 29276)
-- Dependencies: 337
-- Data for Name: area_trabajo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.area_trabajo (area_trabajo_id_area, area_trabajo_clasificacion, area_trabajo_activo, area_trabajo_nombre_area) OVERRIDING SYSTEM VALUE VALUES (1, 'produccion', true, 'Corte y habilitación');
INSERT INTO inventario.area_trabajo (area_trabajo_id_area, area_trabajo_clasificacion, area_trabajo_activo, area_trabajo_nombre_area) OVERRIDING SYSTEM VALUE VALUES (2, 'produccion', true, 'Pintura');
INSERT INTO inventario.area_trabajo (area_trabajo_id_area, area_trabajo_clasificacion, area_trabajo_activo, area_trabajo_nombre_area) OVERRIDING SYSTEM VALUE VALUES (3, 'produccion', true, 'Armado');
INSERT INTO inventario.area_trabajo (area_trabajo_id_area, area_trabajo_clasificacion, area_trabajo_activo, area_trabajo_nombre_area) OVERRIDING SYSTEM VALUE VALUES (4, 'logistica', true, 'Bodega');


--
-- TOC entry 5714 (class 0 OID 29241)
-- Dependencies: 331
-- Data for Name: factura_compra_tipo_cambio; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.factura_compra_tipo_cambio (factura_compra_tipo_cambio_id_tipo_cambio, factura_compra_tipo_cambio_moneda, factura_compra_tipo_cambio_valor) OVERRIDING SYSTEM VALUE VALUES (1, 'CLP', 1.0000);
INSERT INTO inventario.factura_compra_tipo_cambio (factura_compra_tipo_cambio_id_tipo_cambio, factura_compra_tipo_cambio_moneda, factura_compra_tipo_cambio_valor) OVERRIDING SYSTEM VALUE VALUES (2, 'USD', 936.5000);


--
-- TOC entry 5736 (class 0 OID 29392)
-- Dependencies: 353
-- Data for Name: factura_compra; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.factura_compra (factura_compra_id_factura, factura_compra_numero_factura, factura_compra_monto_neto, factura_compra_tipo_compra, factura_compra_fecha_emision, proveedor_id_proveedor, factura_compra_tipo_cambio_id_tipo_cambio) OVERRIDING SYSTEM VALUE VALUES (1, 'FAC-2024-001', 3700000.00, 'inventario_general', '2024-10-01', 1, 1);
INSERT INTO inventario.factura_compra (factura_compra_id_factura, factura_compra_numero_factura, factura_compra_monto_neto, factura_compra_tipo_compra, factura_compra_fecha_emision, proveedor_id_proveedor, factura_compra_tipo_cambio_id_tipo_cambio) OVERRIDING SYSTEM VALUE VALUES (2, 'FAC-2024-002', 890000.00, 'inventario_general', '2024-10-05', 2, 1);
INSERT INTO inventario.factura_compra (factura_compra_id_factura, factura_compra_numero_factura, factura_compra_monto_neto, factura_compra_tipo_compra, factura_compra_fecha_emision, proveedor_id_proveedor, factura_compra_tipo_cambio_id_tipo_cambio) OVERRIDING SYSTEM VALUE VALUES (3, 'FAC-2024-003', 560000.00, 'proyecto_especifico', '2024-11-01', 2, 1);
INSERT INTO inventario.factura_compra (factura_compra_id_factura, factura_compra_numero_factura, factura_compra_monto_neto, factura_compra_tipo_compra, factura_compra_fecha_emision, proveedor_id_proveedor, factura_compra_tipo_cambio_id_tipo_cambio) OVERRIDING SYSTEM VALUE VALUES (4, 'FAC-2024-004', 336000.00, 'inventario_general', '2024-10-10', 3, 1);


--
-- TOC entry 5765 (class 0 OID 29604)
-- Dependencies: 382
-- Data for Name: insumo_estandar_proceso; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.insumo_estandar_proceso (insumo_estandar_proceso_id_insumo_estandar, insumo_estandar_proceso_cantidad_estandar, insumo_estandar_proceso_observacion, insumo_estandar_proceso_activo, material_sku, area_trabajo_id_area) OVERRIDING SYSTEM VALUE VALUES (1, 2.0000, 'Plancha por puerta estándar en corte', true, 'ACR-001', 1);
INSERT INTO inventario.insumo_estandar_proceso (insumo_estandar_proceso_id_insumo_estandar, insumo_estandar_proceso_cantidad_estandar, insumo_estandar_proceso_observacion, insumo_estandar_proceso_activo, material_sku, area_trabajo_id_area) OVERRIDING SYSTEM VALUE VALUES (2, 1.5000, 'Tubo por marco de puerta estándar', true, 'TUB-040', 1);
INSERT INTO inventario.insumo_estandar_proceso (insumo_estandar_proceso_id_insumo_estandar, insumo_estandar_proceso_cantidad_estandar, insumo_estandar_proceso_observacion, insumo_estandar_proceso_activo, material_sku, area_trabajo_id_area) OVERRIDING SYSTEM VALUE VALUES (3, 3.0000, 'Litros por puerta proceso pintura', true, 'PIN-BLA', 2);
INSERT INTO inventario.insumo_estandar_proceso (insumo_estandar_proceso_id_insumo_estandar, insumo_estandar_proceso_cantidad_estandar, insumo_estandar_proceso_observacion, insumo_estandar_proceso_activo, material_sku, area_trabajo_id_area) OVERRIDING SYSTEM VALUE VALUES (4, 0.5000, 'Litros anticorrosiva por puerta', true, 'PIN-GRS', 2);


--
-- TOC entry 5738 (class 0 OID 29405)
-- Dependencies: 355
-- Data for Name: lote; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (1, 'L-ACR001-A', '2024-10-02', NULL, '2024-10-02', 'activo', 1, 1, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (2, 'L-ACR001-B', '2024-11-15', NULL, '2024-11-15', 'activo', 1, 1, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (3, 'L-ACR016-A', '2024-10-02', NULL, '2024-10-02', 'activo', 1, 1, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (4, 'L-TUB040-A', '2024-10-03', NULL, '2024-10-03', 'activo', 1, 1, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (5, 'L-PINBLA-A', '2024-10-06', '2026-10-06', '2024-10-06', 'activo', 2, 2, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (6, 'L-PINGRS-A', '2024-10-06', '2026-10-06', '2024-10-06', 'activo', 2, 2, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (7, 'L-PINCUS-A', '2024-11-02', '2026-11-02', '2024-11-02', 'activo', 2, 3, 1001);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (8, 'L-MADPIN-A', '2024-10-11', NULL, '2024-10-11', 'activo', 3, 4, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (9, NULL, '2026-06-08', NULL, '2026-06-08', 'activo', 3, NULL, NULL);
INSERT INTO inventario.lote (lote_id_lote, lote_numero_lote, lote_fecha_ingreso, lote_fecha_vencimiento, lote_fecha_recepcion, lote_estado, proveedor_id_proveedor, factura_compra_id_factura, proyecto_id_proyecto) OVERRIDING SYSTEM VALUE VALUES (10, NULL, '2026-06-14', NULL, '2026-06-14', 'activo', 1, NULL, NULL);


--
-- TOC entry 5741 (class 0 OID 29423)
-- Dependencies: 358
-- Data for Name: inventario_bodega; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('ACR-001', 2, 1, 5.0000, 0.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('ACR-016', 3, 1, 6.0000, 0.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('TUB-040', 4, 1, 8.0000, 3.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('PIN-GRS', 6, 1, 2.0000, 0.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('PIN-CUS', 7, 1, 3.0000, 0.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('ACR-016', 9, 1, 121.0000, 0.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('ACR-001', 1, 1, 6.0000, 2.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('MAD-PIN', 8, 1, 5.0000, 5.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('PIN-BLA', 5, 1, 1.0000, 0.0000);
INSERT INTO inventario.inventario_bodega (material_sku, lote_id_lote, bodega_id_bodega, inventario_bodega_cantidad_fisica, inventario_bodega_cantidad_reservada) VALUES ('ACR-016', 10, 1, 122.0000, 0.0000);


--
-- TOC entry 5740 (class 0 OID 29413)
-- Dependencies: 357
-- Data for Name: lote_fecha_pedido; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (1, '2024-09-25', 18500.00, 1);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-10', 19200.00, 2);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (3, '2024-09-25', 16800.00, 3);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (4, '2024-09-26', 4200.00, 4);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (5, '2024-10-01', 8900.00, 5);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (6, '2024-10-01', 9400.00, 6);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (7, '2024-10-28', 12000.00, 7);
INSERT INTO inventario.lote_fecha_pedido (lote_fecha_pedido_id, lote_fecha_pedido_fecha_pedido, lote_fecha_pedido_precio_unitario, lote_id_lote) OVERRIDING SYSTEM VALUE VALUES (8, '2024-10-08', 2800.00, 8);


--
-- TOC entry 5726 (class 0 OID 29329)
-- Dependencies: 343
-- Data for Name: material_codigo_barras; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_codigo_barras (material_sku, material_codigo_barras) VALUES ('ACR-001', '7891234560001');
INSERT INTO inventario.material_codigo_barras (material_sku, material_codigo_barras) VALUES ('ACR-016', '7891234560002');
INSERT INTO inventario.material_codigo_barras (material_sku, material_codigo_barras) VALUES ('PIN-BLA', '7891234560010');
INSERT INTO inventario.material_codigo_barras (material_sku, material_codigo_barras) VALUES ('PIN-GRS', '7891234560011');


--
-- TOC entry 5762 (class 0 OID 29583)
-- Dependencies: 379
-- Data for Name: orden_trabajo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.orden_trabajo (orden_trabajo_id_orden, orden_trabajo_fecha_hora, orden_trabajo_estado, especificaciones_puerta_id_especificacion_puerta, proyecto_id_proyecto, area_trabajo_id_area, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-01 08:00:00-03', 'cerrada', NULL, NULL, 1, 3);
INSERT INTO inventario.orden_trabajo (orden_trabajo_id_orden, orden_trabajo_fecha_hora, orden_trabajo_estado, especificaciones_puerta_id_especificacion_puerta, proyecto_id_proyecto, area_trabajo_id_area, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-05 09:00:00-03', 'en_curso', NULL, NULL, 2, 3);
INSERT INTO inventario.orden_trabajo (orden_trabajo_id_orden, orden_trabajo_fecha_hora, orden_trabajo_estado, especificaciones_puerta_id_especificacion_puerta, proyecto_id_proyecto, area_trabajo_id_area, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (3, '2024-11-10 08:30:00-03', 'pendiente', NULL, NULL, 3, 2);


--
-- TOC entry 5763 (class 0 OID 29594)
-- Dependencies: 380
-- Data for Name: material_orden_trabajo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_orden_trabajo (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado, material_orden_trabajo_consumo_real) VALUES ('ACR-001', 1, 4.0000, 4.5000);
INSERT INTO inventario.material_orden_trabajo (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado, material_orden_trabajo_consumo_real) VALUES ('TUB-040', 1, 5.0000, 5.0000);
INSERT INTO inventario.material_orden_trabajo (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado, material_orden_trabajo_consumo_real) VALUES ('PIN-BLA', 2, 6.0000, NULL);
INSERT INTO inventario.material_orden_trabajo (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado, material_orden_trabajo_consumo_real) VALUES ('PIN-GRS', 2, 4.0000, NULL);
INSERT INTO inventario.material_orden_trabajo (material_sku, orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado, material_orden_trabajo_consumo_real) VALUES ('ACR-016', 3, 3.0000, NULL);


--
-- TOC entry 5722 (class 0 OID 29286)
-- Dependencies: 339
-- Data for Name: producto_terminado; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.producto_terminado (producto_terminado_id_producto, producto_terminado_tipo_producto, producto_terminado_nombre_producto, producto_terminado_codigo_producto, producto_terminado_requerimientos_certificacion, producto_terminado_requerimientos_medidas, producto_terminado_requerimientos_produccion, producto_terminado_requerimientos_instalacion, producto_terminado_activo) OVERRIDING SYSTEM VALUE VALUES (1, 'simple', 'Puerta blindada estándar', 'PB-STD-001', NULL, NULL, NULL, NULL, true);
INSERT INTO inventario.producto_terminado (producto_terminado_id_producto, producto_terminado_tipo_producto, producto_terminado_nombre_producto, producto_terminado_codigo_producto, producto_terminado_requerimientos_certificacion, producto_terminado_requerimientos_medidas, producto_terminado_requerimientos_produccion, producto_terminado_requerimientos_instalacion, producto_terminado_activo) OVERRIDING SYSTEM VALUE VALUES (2, 'doble_hoja', 'Puerta blindada doble hoja', 'PB-DBL-001', NULL, NULL, NULL, NULL, true);


--
-- TOC entry 5732 (class 0 OID 29372)
-- Dependencies: 349
-- Data for Name: material_producto_terminado; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_producto_terminado (material_sku, producto_terminado_id_producto, material_producto_terminado_cantidad_estimada, material_producto_terminado_merma_estimada) VALUES ('ACR-001', 1, 2.0000, 0.2000);
INSERT INTO inventario.material_producto_terminado (material_sku, producto_terminado_id_producto, material_producto_terminado_cantidad_estimada, material_producto_terminado_merma_estimada) VALUES ('TUB-040', 1, 3.0000, 0.1000);
INSERT INTO inventario.material_producto_terminado (material_sku, producto_terminado_id_producto, material_producto_terminado_cantidad_estimada, material_producto_terminado_merma_estimada) VALUES ('PIN-BLA', 1, 3.0000, 0.3000);
INSERT INTO inventario.material_producto_terminado (material_sku, producto_terminado_id_producto, material_producto_terminado_cantidad_estimada, material_producto_terminado_merma_estimada) VALUES ('ACR-001', 2, 4.0000, 0.4000);
INSERT INTO inventario.material_producto_terminado (material_sku, producto_terminado_id_producto, material_producto_terminado_cantidad_estimada, material_producto_terminado_merma_estimada) VALUES ('TUB-040', 2, 6.0000, 0.2000);


--
-- TOC entry 5731 (class 0 OID 29361)
-- Dependencies: 348
-- Data for Name: material_proveedor; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('ACR-001', 1, 7, 18500.00, true);
INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('ACR-016', 1, 7, 16800.00, true);
INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('TUB-040', 1, 10, 4200.00, true);
INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('PIN-BLA', 2, 5, 8900.00, true);
INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('PIN-GRS', 2, 5, 9400.00, true);
INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('PIN-CUS', 2, 14, 12000.00, true);
INSERT INTO inventario.material_proveedor (material_sku, proveedor_id_proveedor, material_proveedor_tiempo_reposicion, material_proveedor_precio_referencial, material_proveedor_proveedor_principal) VALUES ('MAD-PIN', 3, 3, 2800.00, true);


--
-- TOC entry 5710 (class 0 OID 29223)
-- Dependencies: 327
-- Data for Name: movimiento_inventario_clasificacion_salida; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.movimiento_inventario_clasificacion_salida (movimiento_inventario_clasificacion_salida_id_clasificacion_sal, movimiento_inventario_clasificacion_salida_nombre) OVERRIDING SYSTEM VALUE VALUES (1, 'produccion');
INSERT INTO inventario.movimiento_inventario_clasificacion_salida (movimiento_inventario_clasificacion_salida_id_clasificacion_sal, movimiento_inventario_clasificacion_salida_nombre) OVERRIDING SYSTEM VALUE VALUES (2, 'merma');
INSERT INTO inventario.movimiento_inventario_clasificacion_salida (movimiento_inventario_clasificacion_salida_id_clasificacion_sal, movimiento_inventario_clasificacion_salida_nombre) OVERRIDING SYSTEM VALUE VALUES (3, 'devolucion');
INSERT INTO inventario.movimiento_inventario_clasificacion_salida (movimiento_inventario_clasificacion_salida_id_clasificacion_sal, movimiento_inventario_clasificacion_salida_nombre) OVERRIDING SYSTEM VALUE VALUES (4, 'ajuste_inventario');
INSERT INTO inventario.movimiento_inventario_clasificacion_salida (movimiento_inventario_clasificacion_salida_id_clasificacion_sal, movimiento_inventario_clasificacion_salida_nombre) OVERRIDING SYSTEM VALUE VALUES (5, 'Traslado');


--
-- TOC entry 5712 (class 0 OID 29233)
-- Dependencies: 329
-- Data for Name: movimiento_inventario_motivo_movimiento; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.movimiento_inventario_motivo_movimiento (movimiento_inventario_motivo_movimiento_id_motivo_movimiento, movimiento_inventario_motivo_movimiento_nombre, movimiento_inventario_clasificacion_salida_id_clasificacion_sal) OVERRIDING SYSTEM VALUE VALUES (1, 'compra_proveedor', NULL);
INSERT INTO inventario.movimiento_inventario_motivo_movimiento (movimiento_inventario_motivo_movimiento_id_motivo_movimiento, movimiento_inventario_motivo_movimiento_nombre, movimiento_inventario_clasificacion_salida_id_clasificacion_sal) OVERRIDING SYSTEM VALUE VALUES (2, 'consumo_produccion', 1);
INSERT INTO inventario.movimiento_inventario_motivo_movimiento (movimiento_inventario_motivo_movimiento_id_motivo_movimiento, movimiento_inventario_motivo_movimiento_nombre, movimiento_inventario_clasificacion_salida_id_clasificacion_sal) OVERRIDING SYSTEM VALUE VALUES (3, 'merma_proceso', 2);
INSERT INTO inventario.movimiento_inventario_motivo_movimiento (movimiento_inventario_motivo_movimiento_id_motivo_movimiento, movimiento_inventario_motivo_movimiento_nombre, movimiento_inventario_clasificacion_salida_id_clasificacion_sal) OVERRIDING SYSTEM VALUE VALUES (4, 'devolucion_cliente', 3);
INSERT INTO inventario.movimiento_inventario_motivo_movimiento (movimiento_inventario_motivo_movimiento_id_motivo_movimiento, movimiento_inventario_motivo_movimiento_nombre, movimiento_inventario_clasificacion_salida_id_clasificacion_sal) OVERRIDING SYSTEM VALUE VALUES (5, 'ajuste_inventario', 4);
INSERT INTO inventario.movimiento_inventario_motivo_movimiento (movimiento_inventario_motivo_movimiento_id_motivo_movimiento, movimiento_inventario_motivo_movimiento_nombre, movimiento_inventario_clasificacion_salida_id_clasificacion_sal) OVERRIDING SYSTEM VALUE VALUES (6, 'reverso_autorizado', NULL);


--
-- TOC entry 5708 (class 0 OID 29213)
-- Dependencies: 325
-- Data for Name: movimiento_inventario_tipo_movimiento; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.movimiento_inventario_tipo_movimiento (movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_tipo_movimiento_nombre) OVERRIDING SYSTEM VALUE VALUES (1, 'entrada');
INSERT INTO inventario.movimiento_inventario_tipo_movimiento (movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_tipo_movimiento_nombre) OVERRIDING SYSTEM VALUE VALUES (2, 'salida');
INSERT INTO inventario.movimiento_inventario_tipo_movimiento (movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_tipo_movimiento_nombre) OVERRIDING SYSTEM VALUE VALUES (3, 'transferencia');
INSERT INTO inventario.movimiento_inventario_tipo_movimiento (movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_tipo_movimiento_nombre) OVERRIDING SYSTEM VALUE VALUES (4, 'ajuste');
INSERT INTO inventario.movimiento_inventario_tipo_movimiento (movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_tipo_movimiento_nombre) OVERRIDING SYSTEM VALUE VALUES (5, 'reverso');


--
-- TOC entry 5743 (class 0 OID 29438)
-- Dependencies: 360
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (1, '2024-10-02 10:00:00-03', 50.0000, 'confirmado', 'ACR-001', 1, 1, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (2, '2024-10-02 10:00:00-03', 15.0000, 'confirmado', 'ACR-016', 1, 3, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (3, '2024-10-03 11:00:00-03', 20.0000, 'confirmado', 'TUB-040', 1, 4, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (4, '2024-10-06 09:00:00-03', 20.0000, 'confirmado', 'PIN-BLA', 1, 5, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (5, '2024-10-06 09:00:00-03', 10.0000, 'confirmado', 'PIN-GRS', 1, 6, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (6, '2024-11-02 14:00:00-03', 8.0000, 'confirmado', 'PIN-CUS', 1, 7, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (7, '2024-10-11 10:30:00-03', 80.0000, 'confirmado', 'MAD-PIN', 1, 8, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (8, '2024-11-15 10:00:00-03', 20.0000, 'confirmado', 'ACR-001', 1, 2, NULL, NULL, 3, 1, 1);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (9, '2024-11-02 13:00:00-03', 4.5000, 'confirmado', 'ACR-001', 1, 1, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (10, '2024-11-02 13:00:00-03', 5.0000, 'confirmado', 'TUB-040', 1, 4, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (11, '2024-11-20 09:00:00-03', 8.0000, 'confirmado', 'ACR-001', 1, 1, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (12, '2024-11-20 09:00:00-03', 7.0000, 'confirmado', 'ACR-016', 1, 3, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (13, '2024-11-21 10:00:00-03', 5.0000, 'confirmado', 'TUB-040', 1, 4, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (14, '2024-11-22 11:00:00-03', 8.0000, 'confirmado', 'PIN-GRS', 1, 6, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (15, '2024-11-10 15:00:00-03', 2.0000, 'confirmado', 'PIN-BLA', 1, 5, NULL, NULL, 3, 2, 3);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (16, '2024-11-18 08:00:00-03', 3.0000, 'confirmado', 'ACR-001', 1, 1, NULL, NULL, 3, 2, 2);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (17, '2024-11-18 10:00:00-03', 3.0000, 'confirmado', 'ACR-001', 1, 1, NULL, NULL, 1, 5, 6);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (18, '2026-06-08 01:27:58.555364-04', 121.0000, 'completado', 'ACR-016', 1, 9, NULL, NULL, 1, 1, NULL);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (19, '2026-06-10 08:45:33.974-04', 1.0000, 'completado', 'ACR-001', 1, NULL, NULL, NULL, 1, 2, 3);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (20, '2026-06-14 03:42:32.593284-04', 39.0000, 'completado', 'MAD-PIN', 1, NULL, NULL, NULL, 1, 2, 5);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (21, '2026-06-14 03:43:36.802807-04', 1.0000, 'completado', 'MAD-PIN', 1, NULL, NULL, NULL, 1, 2, 4);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (22, '2026-06-14 04:04:30.70066-04', 17.0000, 'completado', 'PIN-BLA', 1, NULL, NULL, NULL, 1, 2, 3);
INSERT INTO inventario.movimiento_inventario (movimiento_inventario_id_movimiento, movimiento_inventario_fecha_hora, movimiento_inventario_cantidad, movimiento_inventario_estado, material_sku, bodega_id_bodega, lote_id_lote, proyecto_id_proyecto, factura_compra_id_factura_compra, usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento, movimiento_inventario_motivo_movimiento_id_motivo_movimiento) OVERRIDING SYSTEM VALUE VALUES (23, '2026-06-14 09:45:30.164332-04', 122.0000, 'completado', 'ACR-016', 1, 10, NULL, NULL, 1, 1, NULL);


--
-- TOC entry 5752 (class 0 OID 29501)
-- Dependencies: 369
-- Data for Name: notificacion; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.notificacion (notificacion_id_notificacion, notificacion_tipo_notificacion, notificacion_mensaje, notificacion_fecha_generacion, notificacion_estado_lectura, notificacion_origen, alerta_inventario_id_alerta, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (1, 'alerta_stock', 'Stock bajo mínimo: ACR-001 — Stock actual: 10', '2024-11-20 09:01:00-03', 'no_leida', 'sistema', 1, 1);
INSERT INTO inventario.notificacion (notificacion_id_notificacion, notificacion_tipo_notificacion, notificacion_mensaje, notificacion_fecha_generacion, notificacion_estado_lectura, notificacion_origen, alerta_inventario_id_alerta, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (2, 'alerta_stock', 'Stock bajo mínimo: ACR-001 — Stock actual: 10', '2024-11-20 09:01:00-03', 'no_leida', 'sistema', 1, 2);
INSERT INTO inventario.notificacion (notificacion_id_notificacion, notificacion_tipo_notificacion, notificacion_mensaje, notificacion_fecha_generacion, notificacion_estado_lectura, notificacion_origen, alerta_inventario_id_alerta, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (3, 'alerta_stock', 'Stock CRÍTICO: ACR-016 — Stock actual: 6', '2024-11-20 09:01:00-03', 'no_leida', 'sistema', 2, 1);
INSERT INTO inventario.notificacion (notificacion_id_notificacion, notificacion_tipo_notificacion, notificacion_mensaje, notificacion_fecha_generacion, notificacion_estado_lectura, notificacion_origen, alerta_inventario_id_alerta, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (4, 'alerta_stock', 'Stock CRÍTICO: ACR-016 — Stock actual: 6', '2024-11-20 09:01:00-03', 'leida', 'sistema', 2, 2);
INSERT INTO inventario.notificacion (notificacion_id_notificacion, notificacion_tipo_notificacion, notificacion_mensaje, notificacion_fecha_generacion, notificacion_estado_lectura, notificacion_origen, alerta_inventario_id_alerta, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (5, 'alerta_stock', 'Stock bajo mínimo: TUB-040 — Stock actual: 5', '2024-11-21 10:01:00-03', 'no_leida', 'sistema', 3, 1);
INSERT INTO inventario.notificacion (notificacion_id_notificacion, notificacion_tipo_notificacion, notificacion_mensaje, notificacion_fecha_generacion, notificacion_estado_lectura, notificacion_origen, alerta_inventario_id_alerta, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (6, 'alerta_stock', 'Stock bajo mínimo: TUB-040 — Stock actual: 5', '2024-11-21 10:01:00-03', 'no_leida', 'sistema', 3, 2);


--
-- TOC entry 5718 (class 0 OID 29263)
-- Dependencies: 335
-- Data for Name: permiso; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (1, 'inventario', 'ver', NULL, 'inv_ver');
INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (2, 'inventario', 'crear', NULL, 'inv_crear');
INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (3, 'inventario', 'editar', NULL, 'inv_editar');
INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (4, 'inventario', 'configurar', NULL, 'inv_configurar');
INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (5, 'inventario', 'revertir', NULL, 'inv_revertir');
INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (6, 'alertas', 'resolver', NULL, 'alert_resolver');
INSERT INTO inventario.permiso (permiso_id_permiso, permiso_modulo, permiso_accion, permiso_descripcion, permiso_nombre_del_permiso) OVERRIDING SYSTEM VALUE VALUES (7, 'reportes', 'generar', NULL, 'rep_generar');


--
-- TOC entry 5757 (class 0 OID 29535)
-- Dependencies: 374
-- Data for Name: perfil_permiso; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 1, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 2, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 3, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 4, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 5, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 6, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (1, 7, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (2, 1, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (2, 2, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (2, 3, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (2, 6, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (3, 1, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (3, 2, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (3, 3, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (4, 1, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (4, 2, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (4, 3, true);
INSERT INTO inventario.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo) VALUES (4, 4, true);


--
-- TOC entry 5748 (class 0 OID 29474)
-- Dependencies: 365
-- Data for Name: reserva_inventario; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.reserva_inventario (reserva_inventario_id_reserva, reserva_inventario_cantidad_reservada, reserva_inventario_fecha_reserva, reserva_inventario_fecha_liberacion, reserva_inventario_estado_reserva, material_sku, proyecto_id_proyecto, orden_trabajo_id_orden) OVERRIDING SYSTEM VALUE VALUES (1, 3.0000, '2024-11-09 08:00:00-03', NULL, 'activa', 'PIN-BLA', NULL, 2);
INSERT INTO inventario.reserva_inventario (reserva_inventario_id_reserva, reserva_inventario_cantidad_reservada, reserva_inventario_fecha_reserva, reserva_inventario_fecha_liberacion, reserva_inventario_estado_reserva, material_sku, proyecto_id_proyecto, orden_trabajo_id_orden) OVERRIDING SYSTEM VALUE VALUES (2, 2.0000, '2024-11-09 08:00:00-03', NULL, 'activa', 'PIN-GRS', NULL, 2);
INSERT INTO inventario.reserva_inventario (reserva_inventario_id_reserva, reserva_inventario_cantidad_reservada, reserva_inventario_fecha_reserva, reserva_inventario_fecha_liberacion, reserva_inventario_estado_reserva, material_sku, proyecto_id_proyecto, orden_trabajo_id_orden) OVERRIDING SYSTEM VALUE VALUES (3, 5.0000, '2024-11-09 10:00:00-03', NULL, 'liberada', 'ACR-001', NULL, 1);
INSERT INTO inventario.reserva_inventario (reserva_inventario_id_reserva, reserva_inventario_cantidad_reservada, reserva_inventario_fecha_reserva, reserva_inventario_fecha_liberacion, reserva_inventario_estado_reserva, material_sku, proyecto_id_proyecto, orden_trabajo_id_orden) OVERRIDING SYSTEM VALUE VALUES (4, 3.0000, '2024-11-10 09:00:00-03', NULL, 'activa', 'ACR-016', NULL, 3);


--
-- TOC entry 5754 (class 0 OID 29515)
-- Dependencies: 371
-- Data for Name: preparacion_pedido; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.preparacion_pedido (preparacion_pedido_id_preparacion, preparacion_pedido_observacion, reserva_inventario_id_reserva, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (1, 'Preparación OT-2 pintura blanca', 1, 3);
INSERT INTO inventario.preparacion_pedido (preparacion_pedido_id_preparacion, preparacion_pedido_observacion, reserva_inventario_id_reserva, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (2, 'Preparación OT-2 pintura gris', 2, 3);


--
-- TOC entry 5756 (class 0 OID 29525)
-- Dependencies: 373
-- Data for Name: preparacion_pedido_estado; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.preparacion_pedido_estado (preparacion_pedido_estado_id_estado_preparacion, preparacion_pedido_estado_nombre_estado, preparacion_pedido_estado_timestamp_accion, preparacion_pedido_id_preparacion) OVERRIDING SYSTEM VALUE VALUES (1, 'retirado_de_bodega', '2024-11-11 09:00:00-03', 1);
INSERT INTO inventario.preparacion_pedido_estado (preparacion_pedido_estado_id_estado_preparacion, preparacion_pedido_estado_nombre_estado, preparacion_pedido_estado_timestamp_accion, preparacion_pedido_id_preparacion) OVERRIDING SYSTEM VALUE VALUES (2, 'cargado_en_camion', '2024-11-11 11:30:00-03', 1);
INSERT INTO inventario.preparacion_pedido_estado (preparacion_pedido_estado_id_estado_preparacion, preparacion_pedido_estado_nombre_estado, preparacion_pedido_estado_timestamp_accion, preparacion_pedido_id_preparacion) OVERRIDING SYSTEM VALUE VALUES (3, 'retirado_de_bodega', '2024-11-11 09:15:00-03', 2);


--
-- TOC entry 5730 (class 0 OID 29354)
-- Dependencies: 347
-- Data for Name: proveedor_contacto_correo; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.proveedor_contacto_correo (proveedor_id_proveedor, proveedor_contacto_correo) VALUES (1, 'ventas@acerosdelsur.cl');
INSERT INTO inventario.proveedor_contacto_correo (proveedor_id_proveedor, proveedor_contacto_correo) VALUES (2, 'contacto@sherwin.cl');
INSERT INTO inventario.proveedor_contacto_correo (proveedor_id_proveedor, proveedor_contacto_correo) VALUES (3, 'info@madereria.cl');


--
-- TOC entry 5729 (class 0 OID 29347)
-- Dependencies: 346
-- Data for Name: proveedor_contacto_telefono; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.proveedor_contacto_telefono (proveedor_id_proveedor, proveedor_contacto_telefono) VALUES (1, '+56912345678');
INSERT INTO inventario.proveedor_contacto_telefono (proveedor_id_proveedor, proveedor_contacto_telefono) VALUES (2, '+56987654321');
INSERT INTO inventario.proveedor_contacto_telefono (proveedor_id_proveedor, proveedor_contacto_telefono) VALUES (3, '+56955555555');


--
-- TOC entry 5767 (class 0 OID 29619)
-- Dependencies: 384
-- Data for Name: reporte; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-30', '2026-06-02 22:56:52.885913-04', 'PDF', 'generado', 'movimientos_mensual', '2024-11-01', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-30', '2026-06-02 22:56:52.885913-04', 'XLSX', 'generado', 'alertas_activas', '2024-11-01', 2);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (3, '2026-06-08', '2026-06-08 01:16:21.065201-04', NULL, 'completado', 'auditoria:crear_usuario:username: jgarcia1, rol: jop', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (4, '2026-06-08', '2026-06-08 01:27:58.570422-04', NULL, 'completado', 'auditoria:registrar_entrada:SKU: ACR-016, cantidad: 121, bodega: 1', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (5, '2026-06-08', '2026-06-08 02:02:25.260418-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 3, rol: jop, estado: inactivo', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (6, '2026-06-08', '2026-06-08 02:03:09.390792-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 3, rol: jop, estado: activa', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (7, '2026-06-08', '2026-06-08 02:03:18.432062-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 3, rol: jop, estado: inactivo', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (8, '2026-06-08', '2026-06-08 02:07:34.839403-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 5, rol: jop, estado: inactivo', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (9, '2026-06-08', '2026-06-08 02:07:40.931338-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 5, rol: jop, estado: activa', '2026-06-08', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (10, '2026-06-09', '2026-06-09 20:31:24.135733-04', NULL, 'completado', 'auditoria:crear_usuario:username: silgod, rol: jop', '2026-06-09', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (11, '2026-06-10', '2026-06-10 08:45:33.988708-04', NULL, 'completado', 'auditoria:registrar_salida:SKU: ACR-001, cantidad: 1, bodega: 1', '2026-06-10', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (12, '2026-06-10', '2026-06-10 08:49:40.226241-04', NULL, 'completado', 'auditoria:crear_material:SKU: ANG-CEM-001 — Acero de prueba', '2026-06-10', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (13, '2026-06-13', '2026-06-13 04:56:15.165124-04', NULL, 'completado', 'auditoria:crear_material:SKU: 1121212121W — pruebamat', '2026-06-13', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (14, '2026-06-14', '2026-06-14 03:42:32.604693-04', NULL, 'completado', 'auditoria:registrar_salida:SKU: MAD-PIN, cantidad: 39, bodega: 1', '2026-06-14', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (15, '2026-06-14', '2026-06-14 03:43:36.809526-04', NULL, 'completado', 'auditoria:registrar_salida:SKU: MAD-PIN, cantidad: 1, bodega: 1', '2026-06-14', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (16, '2026-06-14', '2026-06-14 04:02:49.204887-04', NULL, 'completado', 'auditoria:editar_material:SKU: MAD-PIN', '2026-06-14', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (17, '2026-06-14', '2026-06-14 04:04:30.709784-04', NULL, 'completado', 'auditoria:registrar_salida:SKU: PIN-BLA, cantidad: 17, bodega: 1', '2026-06-14', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (18, '2026-06-14', '2026-06-14 04:58:00.011341-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 3, rol: jop, estado: activa', '2026-06-14', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (19, '2026-06-14', '2026-06-14 04:58:13.263153-04', NULL, 'completado', 'auditoria:editar_permisos:usuario_id: 6, rol: jop, estado: activa', '2026-06-14', 1);
INSERT INTO inventario.reporte (reporte_id_reporte, reporte_periodo_fin, reporte_fecha_generacion, reporte_formato_exportacion, reporte_estado, reporte_tipo_reporte, reporte_periodo_inicio, usuario_id_usuario) OVERRIDING SYSTEM VALUE VALUES (20, '2026-06-14', '2026-06-14 09:45:30.173816-04', NULL, 'completado', 'auditoria:registrar_entrada:SKU: ACR-016, cantidad: 122, bodega: 1', '2026-06-14', 1);


--
-- TOC entry 5744 (class 0 OID 29452)
-- Dependencies: 361
-- Data for Name: reporte_movimiento_inventario; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (9, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (10, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (6, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (15, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (8, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (16, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (17, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (11, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (12, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (13, 1);
INSERT INTO inventario.reporte_movimiento_inventario (movimiento_inventario_id_movimiento, reporte_id_reporte) VALUES (14, 1);


--
-- TOC entry 5760 (class 0 OID 29573)
-- Dependencies: 377
-- Data for Name: usuario_contrasena; Type: TABLE DATA; Schema: inventario; Owner: postgres
--

INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES (2, '$2b$12$Pm3nR5sT2uWy0xGcH4iZv.B6hF8wE1dN9oQ7aK3uLyVmP2eCtDs');
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES (3, '$2b$12$Rn4oS6tU3vXz1yHdI5jAw.C7iG9xF2eO0pR8bL4vMzWnQ3fDuEt');
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES (4, '$2b$12$So5pT7uV4wYa2zIeJ6kBx.D8jH0yG3fP1qS9cM5wNaXoR4gEvFu');
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES (1, '$2b$12$CGDBWTL9NY5WyTcJbq92meEBRJVRo0mv9lYmSYL.y09C5XSKRDj96');
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES (5, '$2b$12$mOibKJNqrDI576ck09lYPe9mPcRlghomYRYn0ExhriF.lL4RZPMae');
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena) VALUES (6, '$2b$12$ylW4KuiC7AGjEms7gMF2B.IwaqIQBDoFF8fwbFiyGWARV0wlcX9Q6');


--
-- TOC entry 5773 (class 0 OID 0)
-- Dependencies: 366
-- Name: alerta_faltante_pedido_alerta_faltante_pedido_id_alerta_fal_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.alerta_faltante_pedido_alerta_faltante_pedido_id_alerta_fal_seq', 2, true);


--
-- TOC entry 5774 (class 0 OID 0)
-- Dependencies: 362
-- Name: alerta_inventario_alerta_inventario_id_alerta_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.alerta_inventario_alerta_inventario_id_alerta_seq', 17, true);


--
-- TOC entry 5775 (class 0 OID 0)
-- Dependencies: 320
-- Name: alerta_inventario_nivel_prior_alerta_inventario_nivel_prior_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.alerta_inventario_nivel_prior_alerta_inventario_nivel_prior_seq', 3, true);


--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 322
-- Name: alerta_inventario_tipo_alerta_alerta_inventario_tipo_alerta_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.alerta_inventario_tipo_alerta_alerta_inventario_tipo_alerta_seq', 7, true);


--
-- TOC entry 5777 (class 0 OID 0)
-- Dependencies: 350
-- Name: anaquel_anaquel_id_anaquel_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.anaquel_anaquel_id_anaquel_seq', 4, true);


--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 336
-- Name: area_trabajo_area_trabajo_id_area_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.area_trabajo_area_trabajo_id_area_seq', 4, true);


--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 340
-- Name: bodega_bodega_id_bodega_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.bodega_bodega_id_bodega_seq', 5, true);


--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 352
-- Name: factura_compra_factura_compra_id_factura_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.factura_compra_factura_compra_id_factura_seq', 4, true);


--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 330
-- Name: factura_compra_tipo_cambio_factura_compra_tipo_cambio_id_ti_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.factura_compra_tipo_cambio_factura_compra_tipo_cambio_id_ti_seq', 2, true);


--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 318
-- Name: historial_alerta_historial_alerta_id_historial_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.historial_alerta_historial_alerta_id_historial_seq', 13, true);


--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 381
-- Name: insumo_estandar_proceso_insumo_estandar_proceso_id_insumo_e_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.insumo_estandar_proceso_insumo_estandar_proceso_id_insumo_e_seq', 4, true);


--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 356
-- Name: lote_fecha_pedido_lote_fecha_pedido_id_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.lote_fecha_pedido_lote_fecha_pedido_id_seq', 8, true);


--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 354
-- Name: lote_lote_id_lote_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.lote_lote_id_lote_seq', 10, true);


--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 308
-- Name: material_categoria_funcional_material_categoria_funcional_i_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.material_categoria_funcional_material_categoria_funcional_i_seq', 3, true);


--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 306
-- Name: material_categoria_general_material_categoria_general_id_ca_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.material_categoria_general_material_categoria_general_id_ca_seq', 2, true);


--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 310
-- Name: material_clasificacion_catego_material_clasificacion_catego_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.material_clasificacion_catego_material_clasificacion_catego_seq', 3, true);


--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 314
-- Name: material_clasificacion_nivel__material_clasificacion_nivel__seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.material_clasificacion_nivel__material_clasificacion_nivel__seq', 7, true);


--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 312
-- Name: material_clasificacion_subcat_material_clasificacion_subcat_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.material_clasificacion_subcat_material_clasificacion_subcat_seq', 6, true);


--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 316
-- Name: material_unidad_medida_material_unidad_medida_id_unidad_med_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.material_unidad_medida_material_unidad_medida_id_unidad_med_seq', 5, true);


--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 326
-- Name: movimiento_inventario_clasifi_movimiento_inventario_clasifi_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.movimiento_inventario_clasifi_movimiento_inventario_clasifi_seq', 5, true);


--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 328
-- Name: movimiento_inventario_motivo__movimiento_inventario_motivo__seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.movimiento_inventario_motivo__movimiento_inventario_motivo__seq', 6, true);


--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 359
-- Name: movimiento_inventario_movimiento_inventario_id_movimiento_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.movimiento_inventario_movimiento_inventario_id_movimiento_seq', 23, true);


--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 324
-- Name: movimiento_inventario_tipo_mo_movimiento_inventario_tipo_mo_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.movimiento_inventario_tipo_mo_movimiento_inventario_tipo_mo_seq', 5, true);


--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 368
-- Name: notificacion_notificacion_id_notificacion_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.notificacion_notificacion_id_notificacion_seq', 6, true);


--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 378
-- Name: orden_trabajo_orden_trabajo_id_orden_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.orden_trabajo_orden_trabajo_id_orden_seq', 3, true);


--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 332
-- Name: perfil_perfil_id_perfil_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.perfil_perfil_id_perfil_seq', 4, true);


--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 334
-- Name: permiso_permiso_id_permiso_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.permiso_permiso_id_permiso_seq', 7, true);


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 372
-- Name: preparacion_pedido_estado_preparacion_pedido_estado_id_esta_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.preparacion_pedido_estado_preparacion_pedido_estado_id_esta_seq', 3, true);


--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 370
-- Name: preparacion_pedido_preparacion_pedido_id_preparacion_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.preparacion_pedido_preparacion_pedido_id_preparacion_seq', 2, true);


--
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 338
-- Name: producto_terminado_producto_terminado_id_producto_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.producto_terminado_producto_terminado_id_producto_seq', 2, true);


--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 344
-- Name: proveedor_proveedor_id_proveedor_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.proveedor_proveedor_id_proveedor_seq', 3, true);


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 383
-- Name: reporte_reporte_id_reporte_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.reporte_reporte_id_reporte_seq', 20, true);


--
-- TOC entry 5805 (class 0 OID 0)
-- Dependencies: 364
-- Name: reserva_inventario_reserva_inventario_id_reserva_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.reserva_inventario_reserva_inventario_id_reserva_seq', 4, true);


--
-- TOC entry 5806 (class 0 OID 0)
-- Dependencies: 375
-- Name: usuario_usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: inventario; Owner: postgres
--

SELECT pg_catalog.setval('inventario.usuario_usuario_id_usuario_seq', 6, true);


