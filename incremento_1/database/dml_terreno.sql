--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-14 21:36:51

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
-- TOC entry 5564 (class 0 OID 29977)
-- Dependencies: 387
-- Data for Name: medidas_puerta; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.medidas_puerta (id_medidas, medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor, medidas_vano_vertical_ancho, medidas_vano_vertical_alto, medidas_vano_vertical_espesor, medidas_vano_horizontal_ancho, medidas_vano_horizontal_alto, medidas_vano_horizontal_espesor, medidas_alojamiento_vertical_alto, medidas_alojamiento_vertical_ancho, medidas_alojamiento_vertical_espesor, medidas_alojamiento_horizontal_alto, medidas_alojamiento_horizontal_ancho, medidas_alojamiento_horizontal_espesor, alojamiento_vertical, medidas_de_marco_ancho, medidas_de_marco_alto, medidas_de_marco_espesor) OVERRIDING SYSTEM VALUE VALUES (14, 0.9000, 2.1000, 0.1500, 0.8800, 2.0800, 0.1400, 0.9000, 0.1000, 0.1500, 2.1000, 0.9000, 0.1400, 0.1000, 0.9000, 0.1500, 2.1000, 0.9200, 2.1200, 0.1600);
INSERT INTO terreno.medidas_puerta (id_medidas, medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor, medidas_vano_vertical_ancho, medidas_vano_vertical_alto, medidas_vano_vertical_espesor, medidas_vano_horizontal_ancho, medidas_vano_horizontal_alto, medidas_vano_horizontal_espesor, medidas_alojamiento_vertical_alto, medidas_alojamiento_vertical_ancho, medidas_alojamiento_vertical_espesor, medidas_alojamiento_horizontal_alto, medidas_alojamiento_horizontal_ancho, medidas_alojamiento_horizontal_espesor, alojamiento_vertical, medidas_de_marco_ancho, medidas_de_marco_alto, medidas_de_marco_espesor) OVERRIDING SYSTEM VALUE VALUES (15, 1.6000, 2.1000, 0.1500, 1.5800, 2.0800, 0.1400, 1.6000, 0.1000, 0.1500, 2.1000, 1.6000, 0.1400, 0.1000, 1.6000, 0.1500, 2.1000, 1.6200, 2.1200, 0.1600);
INSERT INTO terreno.medidas_puerta (id_medidas, medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor, medidas_vano_vertical_ancho, medidas_vano_vertical_alto, medidas_vano_vertical_espesor, medidas_vano_horizontal_ancho, medidas_vano_horizontal_alto, medidas_vano_horizontal_espesor, medidas_alojamiento_vertical_alto, medidas_alojamiento_vertical_ancho, medidas_alojamiento_vertical_espesor, medidas_alojamiento_horizontal_alto, medidas_alojamiento_horizontal_ancho, medidas_alojamiento_horizontal_espesor, alojamiento_vertical, medidas_de_marco_ancho, medidas_de_marco_alto, medidas_de_marco_espesor) OVERRIDING SYSTEM VALUE VALUES (16, 0.9000, 2.0000, 0.1200, 0.8800, 1.9800, 0.1100, 0.9000, 0.1000, 0.1200, 2.0000, 0.9000, 0.1100, 0.1000, 0.9000, 0.1200, 2.0000, 0.9200, 2.0200, 0.1300);


--
-- TOC entry 5566 (class 0 OID 30003)
-- Dependencies: 389
-- Data for Name: especificacion_puerta; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.especificacion_puerta (id_especificacion_puerta, modelo_puerta, zona, sentido_apertura, materialidad_vano, materialidad_marco_actual, solucion_marco, hoja_pasiva, hoja_activa, diseno_puerta, observaciones_de_diseno, cubrejuntas, bisagras, observaciones, id_medidas) OVERRIDING SYSTEM VALUE VALUES (10, 'Modelo A-900', 'Acceso principal', 'derecha', 'hormigón', 'sin marco', 'marco nuevo sin solera', 'no aplica', 'simple', 'liso sin ventana', 'Sin observaciones', true, '3 bisagras inox', 'Revisar nivelamientos', 14);
INSERT INTO terreno.especificacion_puerta (id_especificacion_puerta, modelo_puerta, zona, sentido_apertura, materialidad_vano, materialidad_marco_actual, solucion_marco, hoja_pasiva, hoja_activa, diseno_puerta, observaciones_de_diseno, cubrejuntas, bisagras, observaciones, id_medidas) OVERRIDING SYSTEM VALUE VALUES (11, 'Modelo B-1600', 'Acceso bodega', 'izquierda', 'albañilería', 'marco metálico', 'reaprovechamiento', 'hoja pasiva madera', 'doble', 'liso con ventanilla', 'Con visor lateral', false, '4 bisagras reforzadas', 'Coordinar con eléctrico', 15);
INSERT INTO terreno.especificacion_puerta (id_especificacion_puerta, modelo_puerta, zona, sentido_apertura, materialidad_vano, materialidad_marco_actual, solucion_marco, hoja_pasiva, hoja_activa, diseno_puerta, observaciones_de_diseno, cubrejuntas, bisagras, observaciones, id_medidas) OVERRIDING SYSTEM VALUE VALUES (12, 'Modelo A-900', 'Dormitorio principal', 'derecha', 'tabique', 'sin marco', 'marco nuevo con solera', 'no aplica', 'simple', 'liso sin ventana', 'Uso residencial', false, '2 bisagras estándar', 'Ninguna', 16);


--
-- TOC entry 5575 (class 0 OID 30116)
-- Dependencies: 398
-- Data for Name: adicionales_pagados; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.adicionales_pagados (id_adicionales, retiro_escombros, retiro_puerta_actual, alarma, subida_escalera, endolados, pilastras_alto, pilastras_ancho, pilastras_espesor, observaciones, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (1, true, true, false, 'Sin subida', false, 0.0000, 0.0000, 0.0000, 'Retiro escombros incluido', 10);
INSERT INTO terreno.adicionales_pagados (id_adicionales, retiro_escombros, retiro_puerta_actual, alarma, subida_escalera, endolados, pilastras_alto, pilastras_ancho, pilastras_espesor, observaciones, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (2, false, false, true, 'Piso 3', false, 2.1000, 0.1000, 0.0500, 'Alarma magnética adicional', 11);
INSERT INTO terreno.adicionales_pagados (id_adicionales, retiro_escombros, retiro_puerta_actual, alarma, subida_escalera, endolados, pilastras_alto, pilastras_ancho, pilastras_espesor, observaciones, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (3, false, true, false, 'Sin subida', false, 0.0000, 0.0000, 0.0000, 'Solo retiro puerta', 12);


--
-- TOC entry 5585 (class 0 OID 30205)
-- Dependencies: 408
-- Data for Name: checklist_de_materiales; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.checklist_de_materiales (id_checklist_de_materiales, tipo_inicio_tarea, tipo_cierre_tarea, item, es_marcado, marcado, es_no_marcado, no_marcado) OVERRIDING SYSTEM VALUE VALUES (1, 'verificacion_herramientas', 'verificacion_instalacion', 'Nivel de burbuja', true, 'presente', false, NULL);
INSERT INTO terreno.checklist_de_materiales (id_checklist_de_materiales, tipo_inicio_tarea, tipo_cierre_tarea, item, es_marcado, marcado, es_no_marcado, no_marcado) OVERRIDING SYSTEM VALUE VALUES (2, 'verificacion_herramientas', 'verificacion_instalacion', 'Taladro percutor', true, 'presente', false, NULL);
INSERT INTO terreno.checklist_de_materiales (id_checklist_de_materiales, tipo_inicio_tarea, tipo_cierre_tarea, item, es_marcado, marcado, es_no_marcado, no_marcado) OVERRIDING SYSTEM VALUE VALUES (3, 'verificacion_herramientas', 'verificacion_instalacion', 'Disco de corte', true, 'presente', false, NULL);
INSERT INTO terreno.checklist_de_materiales (id_checklist_de_materiales, tipo_inicio_tarea, tipo_cierre_tarea, item, es_marcado, marcado, es_no_marcado, no_marcado) OVERRIDING SYSTEM VALUE VALUES (4, 'verificacion_herramientas', 'verificacion_instalacion', 'Sellador', false, NULL, true, 'faltante');


--
-- TOC entry 5562 (class 0 OID 29962)
-- Dependencies: 385
-- Data for Name: cliente; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.cliente (rut_cliente, razon_social, contacto_principal, correo, telefono, es_cliente_b2c, cliente_b2c_rut, cliente_b2c_correo, cliente_b2c_primer_nombre, cliente_b2c_segundo_nombre, cliente_b2c_primer_apellido, cliente_b2c_segundo_apellido, cliente_b2c_telefono_contacto, cliente_b2c_fecha_registro, cliente_b2c_telefono_contacto_adicional, cliente_b2c_fecha_ultima_edicion, es_cliente_b2b, cliente_b2b_fecha_ultima_edicion, cliente_b2b_correo_institucional, cliente_b2b_fecha_registro, cliente_b2b_telefono_corporativo, cliente_b2b_razon_social, cliente_b2b_rut_empresa, cliente_b2b_telefono_corp_adicional, cliente_b2b_representante_legal_primer_nombre, cliente_b2b_representante_legal_segundo_nombre, cliente_b2b_representante_legal_primer_apellido, cliente_b2b_representante_legal_segundo_apellido) VALUES ('76543210-1', 'Constructora Andes SpA', 'Carlos Peña', 'contacto@andes.cl', '+56922334455', false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, 'cpeña@andes.cl', NULL, '+56222334455', 'Constructora Andes SpA', '76543210-1', NULL, 'Carlos', NULL, 'Peña', NULL);
INSERT INTO terreno.cliente (rut_cliente, razon_social, contacto_principal, correo, telefono, es_cliente_b2c, cliente_b2c_rut, cliente_b2c_correo, cliente_b2c_primer_nombre, cliente_b2c_segundo_nombre, cliente_b2c_primer_apellido, cliente_b2c_segundo_apellido, cliente_b2c_telefono_contacto, cliente_b2c_fecha_registro, cliente_b2c_telefono_contacto_adicional, cliente_b2c_fecha_ultima_edicion, es_cliente_b2b, cliente_b2b_fecha_ultima_edicion, cliente_b2b_correo_institucional, cliente_b2b_fecha_registro, cliente_b2b_telefono_corporativo, cliente_b2b_razon_social, cliente_b2b_rut_empresa, cliente_b2b_telefono_corp_adicional, cliente_b2b_representante_legal_primer_nombre, cliente_b2b_representante_legal_segundo_nombre, cliente_b2b_representante_legal_primer_apellido, cliente_b2b_representante_legal_segundo_apellido) VALUES ('87654321-2', 'Inmobiliaria del Sur Ltda', 'Ana Rojas', 'info@inmsur.cl', '+56933445566', false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, 'arojas@inmsur.cl', NULL, '+56233445566', 'Inmobiliaria del Sur Ltda', '87654321-2', NULL, 'Ana', NULL, 'Rojas', NULL);
INSERT INTO terreno.cliente (rut_cliente, razon_social, contacto_principal, correo, telefono, es_cliente_b2c, cliente_b2c_rut, cliente_b2c_correo, cliente_b2c_primer_nombre, cliente_b2c_segundo_nombre, cliente_b2c_primer_apellido, cliente_b2c_segundo_apellido, cliente_b2c_telefono_contacto, cliente_b2c_fecha_registro, cliente_b2c_telefono_contacto_adicional, cliente_b2c_fecha_ultima_edicion, es_cliente_b2b, cliente_b2b_fecha_ultima_edicion, cliente_b2b_correo_institucional, cliente_b2b_fecha_registro, cliente_b2b_telefono_corporativo, cliente_b2b_razon_social, cliente_b2b_rut_empresa, cliente_b2b_telefono_corp_adicional, cliente_b2b_representante_legal_primer_nombre, cliente_b2b_representante_legal_segundo_nombre, cliente_b2b_representante_legal_primer_apellido, cliente_b2b_representante_legal_segundo_apellido) VALUES ('98765432-3', 'Roberto Figueroa', 'Roberto Figueroa', 'rfigueroa@gmail.com', '+56944556677', true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- TOC entry 5573 (class 0 OID 30103)
-- Dependencies: 396
-- Data for Name: detalles_herraje; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.detalles_herraje (id_detalles_herraje, ubicacion, color, cantidad, observacion, sku_material, id_especificacion_puerta) VALUES (1, 'Manilla exterior', 'Inox satinado', 1, 'Par manilla exterior', NULL, 10);
INSERT INTO terreno.detalles_herraje (id_detalles_herraje, ubicacion, color, cantidad, observacion, sku_material, id_especificacion_puerta) VALUES (2, 'Cerradura', 'Negro mate', 1, 'Mul-T-Lock 3 puntos', NULL, 10);
INSERT INTO terreno.detalles_herraje (id_detalles_herraje, ubicacion, color, cantidad, observacion, sku_material, id_especificacion_puerta) VALUES (3, 'Manillón', 'Inox pulido', 1, 'Manillón barra 60cm', NULL, 11);
INSERT INTO terreno.detalles_herraje (id_detalles_herraje, ubicacion, color, cantidad, observacion, sku_material, id_especificacion_puerta) VALUES (4, 'Cerradura', 'Inox', 1, 'Cerber 5 puntos', NULL, 11);


--
-- TOC entry 5570 (class 0 OID 30060)
-- Dependencies: 393
-- Data for Name: especificacion_metalmecanica; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.especificacion_metalmecanica (id_metalmecanica, bastidor, cerradura, manillon, pernos_fijos, manilla, herraje, cerrojo, ojo, otros, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (4, 'Perfil 40x40 cal.14', 'Mul-T-Lock 3 puntos', 'Sin manillón', '4 pernos pasantes', 'Manilla horizontal acero', 'Kit estándar', 'Cerrojo superior', 'Sin ojo', 'Ninguno', 10);
INSERT INTO terreno.especificacion_metalmecanica (id_metalmecanica, bastidor, cerradura, manillon, pernos_fijos, manilla, herraje, cerrojo, ojo, otros, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (5, 'Perfil 50x50 cal.12', 'Cerber 5 puntos', 'Manillón acero inox', '6 pernos pasantes', 'Manilla barra acero', 'Kit reforzado', 'Sin cerrojo', 'Con ojo gran angular', 'Alarma magnética', 11);
INSERT INTO terreno.especificacion_metalmecanica (id_metalmecanica, bastidor, cerradura, manillon, pernos_fijos, manilla, herraje, cerrojo, ojo, otros, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (6, 'Perfil 40x40 cal.14', 'Mul-T-Lock 2 puntos', 'Sin manillón', '3 pernos pasantes', 'Manilla estándar', 'Kit básico', 'Sin cerrojo', 'Sin ojo', 'Ninguno', 12);


--
-- TOC entry 5583 (class 0 OID 30187)
-- Dependencies: 406
-- Data for Name: especificacion_proyecto_terreno; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.especificacion_proyecto_terreno (id_especificacion_proyecto_terreno, estado_operacional, estado_produccion, estado_instalacion, fecha_inicio, fecha_cierre_operativo, observacion_estado, conformidad_cliente, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (1, 'completado', 'completado', 'completado', '2024-09-01', '2024-11-15', 'Sin observaciones', 'conforme', 10);
INSERT INTO terreno.especificacion_proyecto_terreno (id_especificacion_proyecto_terreno, estado_operacional, estado_produccion, estado_instalacion, fecha_inicio, fecha_cierre_operativo, observacion_estado, conformidad_cliente, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (2, 'en_curso', 'en_produccion', 'pendiente', '2024-10-01', '2025-01-15', 'En proceso de fabricación', 'pendiente', 11);
INSERT INTO terreno.especificacion_proyecto_terreno (id_especificacion_proyecto_terreno, estado_operacional, estado_produccion, estado_instalacion, fecha_inicio, fecha_cierre_operativo, observacion_estado, conformidad_cliente, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (3, 'iniciado', 'pendiente', 'pendiente', '2024-11-01', '2024-12-01', 'Inicio reciente', 'pendiente', 12);


--
-- TOC entry 5587 (class 0 OID 30219)
-- Dependencies: 410
-- Data for Name: servicio_terreno; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.servicio_terreno (id_servicio_terreno, tipo_servicio, fecha_real, bloque_horario, prioridad, fecha_programada, estado, observaciones, id_usuario, id_checklist_de_materiales) OVERRIDING SYSTEM VALUE VALUES (1, 'instalacion', '2024-11-01', '09:00:00', 'alta', '09:00:00', 'completado', 'Instalación puerta principal Andes', 1, 1);
INSERT INTO terreno.servicio_terreno (id_servicio_terreno, tipo_servicio, fecha_real, bloque_horario, prioridad, fecha_programada, estado, observaciones, id_usuario, id_checklist_de_materiales) OVERRIDING SYSTEM VALUE VALUES (2, 'instalacion', '2024-11-05', '10:00:00', 'alta', '10:00:00', 'en_curso', 'Instalación puerta bodega Inmosur', 1, 2);
INSERT INTO terreno.servicio_terreno (id_servicio_terreno, tipo_servicio, fecha_real, bloque_horario, prioridad, fecha_programada, estado, observaciones, id_usuario, id_checklist_de_materiales) OVERRIDING SYSTEM VALUE VALUES (3, 'visita_tecnica', '2024-11-10', '11:00:00', 'media', '11:00:00', 'programado', 'Visita técnica residencial Figueroa', 2, 3);


--
-- TOC entry 5590 (class 0 OID 30243)
-- Dependencies: 413
-- Data for Name: especificacion_servicio_terreno; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.especificacion_servicio_terreno (id_servicio_terreno, id_especificacion_puerta) VALUES (1, 10);
INSERT INTO terreno.especificacion_servicio_terreno (id_servicio_terreno, id_especificacion_puerta) VALUES (2, 11);
INSERT INTO terreno.especificacion_servicio_terreno (id_servicio_terreno, id_especificacion_puerta) VALUES (3, 12);


--
-- TOC entry 5572 (class 0 OID 30081)
-- Dependencies: 395
-- Data for Name: especificacion_terminaciones; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.especificacion_terminaciones (id_terminacion, herrajes, pletina, funda, medida_final, manilla, marco_metalico, bisagras, molduras, rebaje, canterias, enchape, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (4, 'Inox satinado', 0.0500, 0.0200, 2.1500, 0.1200, 0.0800, 0.0400, 'Sin molduras', 'Sin rebaje', 'Sin canterias', 'Sin enchape', 10);
INSERT INTO terreno.especificacion_terminaciones (id_terminacion, herrajes, pletina, funda, medida_final, manilla, marco_metalico, bisagras, molduras, rebaje, canterias, enchape, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (5, 'Inox pulido', 0.0500, 0.0200, 2.1500, 0.1200, 0.0800, 0.0400, 'Con molduras', 'Rebaje 10mm', 'Sin canterias', 'Enchape madera', 11);
INSERT INTO terreno.especificacion_terminaciones (id_terminacion, herrajes, pletina, funda, medida_final, manilla, marco_metalico, bisagras, molduras, rebaje, canterias, enchape, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (6, 'Negro mate', 0.0400, 0.0200, 2.0500, 0.1000, 0.0600, 0.0300, 'Sin molduras', 'Sin rebaje', 'Sin canterias', 'Sin enchape', 12);


--
-- TOC entry 5592 (class 0 OID 30251)
-- Dependencies: 415
-- Data for Name: tarea; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.tarea (id_tarea, descripcion, fecha_de_visita, fecha_de_termino, bloque_horario, fecha_de_creacion, fecha_de_ultima_actualizacion, fecha_de_inicio, fecha_de_inicio_en_terreno, titulo, horario_limite, instrucciones_de_oficina, urgencia, estado_de_tarea, id_usuario, id_servicio_terreno, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (1, 'Instalación puerta principal edificio Andes', '2024-11-01', '2024-11-01', '2024-11-01 09:00:00', '2024-10-28', '2024-11-01', '2024-11-01', '2024-11-01', 'Instalación Andes P1', '2024-11-01 18:00:00', 'Coordinar acceso con conserje', 'alta', 'completada', 3, 1, 10);
INSERT INTO terreno.tarea (id_tarea, descripcion, fecha_de_visita, fecha_de_termino, bloque_horario, fecha_de_creacion, fecha_de_ultima_actualizacion, fecha_de_inicio, fecha_de_inicio_en_terreno, titulo, horario_limite, instrucciones_de_oficina, urgencia, estado_de_tarea, id_usuario, id_servicio_terreno, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (2, 'Instalación puerta bodega Inmosur', '2024-11-05', '2024-11-06', '2024-11-05 10:00:00', '2024-11-01', '2024-11-05', '2024-11-05', '2024-11-05', 'Instalación Inmosur B1', '2024-11-06 18:00:00', 'Solicitar ingreso a RRHH', 'alta', 'en_curso', 3, 2, 11);
INSERT INTO terreno.tarea (id_tarea, descripcion, fecha_de_visita, fecha_de_termino, bloque_horario, fecha_de_creacion, fecha_de_ultima_actualizacion, fecha_de_inicio, fecha_de_inicio_en_terreno, titulo, horario_limite, instrucciones_de_oficina, urgencia, estado_de_tarea, id_usuario, id_servicio_terreno, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (3, 'Visita técnica medición Figueroa', '2024-11-10', '2024-11-10', '2024-11-10 11:00:00', '2024-11-05', '2024-11-05', '2024-11-10', '2024-11-10', 'Medición Figueroa', '2024-11-10 14:00:00', 'Llevar planos de referencia', 'media', 'programada', 2, 3, 12);


--
-- TOC entry 5599 (class 0 OID 30305)
-- Dependencies: 422
-- Data for Name: formulario_de_cierre; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.formulario_de_cierre (id_formulario_de_cierre, detalle_de_observaciones, sentido_de_apertura_correcto, pilastras_incluidas_y_ajustadas, resultado_finalizado, cilindro_correcto, ausencia_de_rayones_o_danos, id_tarea) OVERRIDING SYSTEM VALUE VALUES (1, 'Instalación conforme. Sin observaciones.', true, true, 'aprobado', true, true, 1);


--
-- TOC entry 5577 (class 0 OID 30136)
-- Dependencies: 400
-- Data for Name: historial_cambio_orden_trabajo; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.historial_cambio_orden_trabajo (id_cambio, version_nueva, version_antigua, fecha_hora, descripcion, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (1, 'sentido_apertura: izquierda', 'sentido_apertura: derecha', '2024-10-05 14:00:00', 'Cliente solicitó cambio de sentido apertura', 10);
INSERT INTO terreno.historial_cambio_orden_trabajo (id_cambio, version_nueva, version_antigua, fecha_hora, descripcion, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (2, 'cerradura: Cerber 5 puntos', 'cerradura: Mul-T-Lock 3 puntos', '2024-10-12 10:00:00', 'Upgrade de cerradura por requerimiento seguridad', 11);


--
-- TOC entry 5568 (class 0 OID 30037)
-- Dependencies: 391
-- Data for Name: hoja_doble; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.hoja_doble (id_especificacion_puerta, medidas_derecha, medidas_derecha_vertical_alto, medidas_derecha_vertical_ancho, medidas_derecha_vertical_espesor, medidas_derecha_horizontal_alto, medidas_derecha_horizontal_ancho, medidas_derecha_horizontal_espesor, actividad_izquierda, medidas_izquierda_vertical_alto, medidas_izquierda_vertical_ancho, medidas_izquierda_vertical_espesor, medidas_izquierda_horizontal_alto, medidas_izquierda_horizontal_ancho, medidas_izquierda_horizontal_espesor) VALUES (11, 'activa', 2.0800, 0.7800, 0.0600, 0.1000, 0.7800, 0.0600, 'pasiva', 2.0800, 0.7800, 0.0600, 0.1000, 0.7800, 0.0600);


--
-- TOC entry 5567 (class 0 OID 30025)
-- Dependencies: 390
-- Data for Name: hoja_simple; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.hoja_simple (id_especificacion_puerta, medidas_vertical_alto, medidas_vertical_ancho, medidas_vertical_espesor, medidas_horizontal_alto, medidas_horizontal_ancho, medidas_horizontal_espesor) VALUES (10, 2.0800, 0.8800, 0.0600, 0.1000, 0.8800, 0.0600);
INSERT INTO terreno.hoja_simple (id_especificacion_puerta, medidas_vertical_alto, medidas_vertical_ancho, medidas_vertical_espesor, medidas_horizontal_alto, medidas_horizontal_ancho, medidas_horizontal_espesor) VALUES (12, 1.9800, 0.8800, 0.0600, 0.1000, 0.8800, 0.0600);


--
-- TOC entry 5603 (class 0 OID 30337)
-- Dependencies: 426
-- Data for Name: notificacion_tecnico; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.notificacion_tecnico (id_notificacion_tecnico, fecha_emision, mensaje, id_usuario, id_servicio_terreno) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-01 07:00:00-03', 'Tarea programada hoy 09:00. Dirección: Av. Providencia 123', 1, 1);
INSERT INTO terreno.notificacion_tecnico (id_notificacion_tecnico, fecha_emision, mensaje, id_usuario, id_servicio_terreno) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-04 17:00:00-03', 'Tarea mañana 10:00. Solicitar acceso en recepción Inmosur', 1, 2);
INSERT INTO terreno.notificacion_tecnico (id_notificacion_tecnico, fecha_emision, mensaje, id_usuario, id_servicio_terreno) OVERRIDING SYSTEM VALUE VALUES (3, '2024-11-09 16:00:00-03', 'Visita técnica mañana 11:00. Llevar planos', 2, 3);


--
-- TOC entry 5605 (class 0 OID 30350)
-- Dependencies: 428
-- Data for Name: notificacion_terreno; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.notificacion_terreno (id_notificacion_terreno, mensaje, id_usuario, id_tarea) OVERRIDING SYSTEM VALUE VALUES (1, 'Tarea completada: Instalación Andes P1 — Conforme', 1, 1);
INSERT INTO terreno.notificacion_terreno (id_notificacion_terreno, mensaje, id_usuario, id_tarea) OVERRIDING SYSTEM VALUE VALUES (2, 'Tarea en curso: Instalación Inmosur B1 — Sin novedad', 1, 2);


--
-- TOC entry 5581 (class 0 OID 30166)
-- Dependencies: 404
-- Data for Name: obra; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.obra (id_obra, nombre_obra, direccion_obra, comuna, region, tipo_obra, fecha_de_creacion, fecha_de_ultima_edicion, estado, cantidad_puerta, referencia, observaciones, rut_cliente, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (1, 'Edificio A Andes', 'Av. Providencia 123', 'Providencia', 'Metropolitana', 'residencial', '2024-09-01', '2024-11-15', 'activa', 4, 'Andes-A1', 'Edificio 4 pisos', '76543210-1', 10);
INSERT INTO terreno.obra (id_obra, nombre_obra, direccion_obra, comuna, region, tipo_obra, fecha_de_creacion, fecha_de_ultima_edicion, estado, cantidad_puerta, referencia, observaciones, rut_cliente, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (2, 'Torre B Inmosur', 'Las Condes 456', 'Las Condes', 'Metropolitana', 'comercial', '2024-10-01', '2024-11-01', 'activa', 2, 'Inm-B1', 'Torre corporativa', '87654321-2', 11);
INSERT INTO terreno.obra (id_obra, nombre_obra, direccion_obra, comuna, region, tipo_obra, fecha_de_creacion, fecha_de_ultima_edicion, estado, cantidad_puerta, referencia, observaciones, rut_cliente, id_especificacion_puerta) OVERRIDING SYSTEM VALUE VALUES (3, 'Residencial Figueroa', 'Maipú 789', 'Maipú', 'Metropolitana', 'residencial', '2024-11-01', '2024-11-01', 'activa', 1, 'Fig-001', 'Casa unifamiliar', '98765432-3', 12);


--
-- TOC entry 5601 (class 0 OID 30322)
-- Dependencies: 424
-- Data for Name: prestamo_herramientas; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.prestamo_herramientas (id_prestamo_herramienta, fecha_entrega, fecha_devolucion, cantidad, estado_de_prestamo, observacion, rut_empleado, sku_material) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-01 08:00:00-03', '2024-11-01 18:00:00-03', 1, 'devuelto', 'Taladro percutor devuelto en buen estado', '34567890-1', 1);
INSERT INTO terreno.prestamo_herramientas (id_prestamo_herramienta, fecha_entrega, fecha_devolucion, cantidad, estado_de_prestamo, observacion, rut_empleado, sku_material) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-05 09:00:00-03', '2024-11-06 17:00:00-03', 1, 'devuelto', 'Nivel de burbuja devuelto', '34567890-1', 1);


--
-- TOC entry 5579 (class 0 OID 30150)
-- Dependencies: 402
-- Data for Name: proyecto; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.proyecto (id_proyecto, codigo_proyecto, nombre_referencia, fecha_instalacion, fecha_ingreso, estado_operacional, estado_produccion, rut_cliente) OVERRIDING SYSTEM VALUE VALUES (1, 'PRY-2024-001', 'Proyecto Andes Edificio A', '2024-11-15', '2024-09-01', 'instalacion', 'produccion_terminada', '76543210-1');
INSERT INTO terreno.proyecto (id_proyecto, codigo_proyecto, nombre_referencia, fecha_instalacion, fecha_ingreso, estado_operacional, estado_produccion, rut_cliente) OVERRIDING SYSTEM VALUE VALUES (2, 'PRY-2024-002', 'Proyecto Inmosur Torre B', '2025-01-15', '2024-10-01', 'produccion', 'en_produccion', '87654321-2');
INSERT INTO terreno.proyecto (id_proyecto, codigo_proyecto, nombre_referencia, fecha_instalacion, fecha_ingreso, estado_operacional, estado_produccion, rut_cliente) OVERRIDING SYSTEM VALUE VALUES (3, 'PRY-2024-003', 'Residencial Figueroa', '2024-12-01', '2024-11-01', 'cotizacion', 'pendiente', '98765432-3');


--
-- TOC entry 5597 (class 0 OID 30292)
-- Dependencies: 420
-- Data for Name: receptor; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.receptor (id_receptor, primer_nombre_receptor, segundo_nombre_receptor, primer_apellido_receptor, segundo_apellido_receptor, rut_receptor, id_tarea) OVERRIDING SYSTEM VALUE VALUES (1, 'Carlos', NULL, 'Peña', NULL, '11111111-1', 1);
INSERT INTO terreno.receptor (id_receptor, primer_nombre_receptor, segundo_nombre_receptor, primer_apellido_receptor, segundo_apellido_receptor, rut_receptor, id_tarea) OVERRIDING SYSTEM VALUE VALUES (2, 'Ana', NULL, 'Rojas', NULL, '22222222-2', 2);
INSERT INTO terreno.receptor (id_receptor, primer_nombre_receptor, segundo_nombre_receptor, primer_apellido_receptor, segundo_apellido_receptor, rut_receptor, id_tarea) OVERRIDING SYSTEM VALUE VALUES (3, 'Roberto', NULL, 'Figueroa', NULL, '98765432-3', 3);


--
-- TOC entry 5589 (class 0 OID 30236)
-- Dependencies: 412
-- Data for Name: servicio_terreno_herramientas_materiales; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.servicio_terreno_herramientas_materiales (id_servicio_terreno_herramientas_materiales, id_servicio_terreno) OVERRIDING SYSTEM VALUE VALUES (1, 1);
INSERT INTO terreno.servicio_terreno_herramientas_materiales (id_servicio_terreno_herramientas_materiales, id_servicio_terreno) OVERRIDING SYSTEM VALUE VALUES (2, 2);
INSERT INTO terreno.servicio_terreno_herramientas_materiales (id_servicio_terreno_herramientas_materiales, id_servicio_terreno) OVERRIDING SYSTEM VALUE VALUES (3, 3);


--
-- TOC entry 5594 (class 0 OID 30275)
-- Dependencies: 417
-- Data for Name: tarea_tipo; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.tarea_tipo (id_tarea_tipo, tiempo_estimado_tarea, remuneracion_tarea, id_tarea) OVERRIDING SYSTEM VALUE VALUES (1, '2024-11-01 08:00:00', 120000, 1);
INSERT INTO terreno.tarea_tipo (id_tarea_tipo, tiempo_estimado_tarea, remuneracion_tarea, id_tarea) OVERRIDING SYSTEM VALUE VALUES (2, '2024-11-05 08:00:00', 180000, 2);
INSERT INTO terreno.tarea_tipo (id_tarea_tipo, tiempo_estimado_tarea, remuneracion_tarea, id_tarea) OVERRIDING SYSTEM VALUE VALUES (3, '2024-11-10 08:00:00', 45000, 3);


--
-- TOC entry 5595 (class 0 OID 30284)
-- Dependencies: 418
-- Data for Name: tarea_usuario; Type: TABLE DATA; Schema: terreno; Owner: postgres
--

INSERT INTO terreno.tarea_usuario (id_tarea, id_usuario) VALUES (1, 3);
INSERT INTO terreno.tarea_usuario (id_tarea, id_usuario) VALUES (2, 3);
INSERT INTO terreno.tarea_usuario (id_tarea, id_usuario) VALUES (3, 2);


--
-- TOC entry 5611 (class 0 OID 0)
-- Dependencies: 397
-- Name: adicionales_pagados_id_adicionales_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.adicionales_pagados_id_adicionales_seq', 3, true);


--
-- TOC entry 5612 (class 0 OID 0)
-- Dependencies: 407
-- Name: checklist_de_materiales_id_checklist_de_materiales_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.checklist_de_materiales_id_checklist_de_materiales_seq', 4, true);


--
-- TOC entry 5613 (class 0 OID 0)
-- Dependencies: 392
-- Name: especificacion_metalmecanica_id_metalmecanica_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.especificacion_metalmecanica_id_metalmecanica_seq', 6, true);


--
-- TOC entry 5614 (class 0 OID 0)
-- Dependencies: 405
-- Name: especificacion_proyecto_terre_id_especificacion_proyecto_te_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.especificacion_proyecto_terre_id_especificacion_proyecto_te_seq', 3, true);


--
-- TOC entry 5615 (class 0 OID 0)
-- Dependencies: 388
-- Name: especificacion_puerta_id_especificacion_puerta_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.especificacion_puerta_id_especificacion_puerta_seq', 12, true);


--
-- TOC entry 5616 (class 0 OID 0)
-- Dependencies: 394
-- Name: especificacion_terminaciones_id_terminacion_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.especificacion_terminaciones_id_terminacion_seq', 6, true);


--
-- TOC entry 5617 (class 0 OID 0)
-- Dependencies: 421
-- Name: formulario_de_cierre_id_formulario_de_cierre_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.formulario_de_cierre_id_formulario_de_cierre_seq', 1, true);


--
-- TOC entry 5618 (class 0 OID 0)
-- Dependencies: 399
-- Name: historial_cambio_orden_trabajo_id_cambio_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.historial_cambio_orden_trabajo_id_cambio_seq', 2, true);


--
-- TOC entry 5619 (class 0 OID 0)
-- Dependencies: 386
-- Name: medidas_puerta_id_medidas_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.medidas_puerta_id_medidas_seq', 16, true);


--
-- TOC entry 5620 (class 0 OID 0)
-- Dependencies: 425
-- Name: notificacion_tecnico_id_notificacion_tecnico_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.notificacion_tecnico_id_notificacion_tecnico_seq', 3, true);


--
-- TOC entry 5621 (class 0 OID 0)
-- Dependencies: 427
-- Name: notificacion_terreno_id_notificacion_terreno_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.notificacion_terreno_id_notificacion_terreno_seq', 2, true);


--
-- TOC entry 5622 (class 0 OID 0)
-- Dependencies: 403
-- Name: obra_id_obra_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.obra_id_obra_seq', 3, true);


--
-- TOC entry 5623 (class 0 OID 0)
-- Dependencies: 423
-- Name: prestamo_herramientas_id_prestamo_herramienta_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.prestamo_herramientas_id_prestamo_herramienta_seq', 2, true);


--
-- TOC entry 5624 (class 0 OID 0)
-- Dependencies: 401
-- Name: proyecto_id_proyecto_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.proyecto_id_proyecto_seq', 3, true);


--
-- TOC entry 5625 (class 0 OID 0)
-- Dependencies: 419
-- Name: receptor_id_receptor_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.receptor_id_receptor_seq', 3, true);


--
-- TOC entry 5626 (class 0 OID 0)
-- Dependencies: 411
-- Name: servicio_terreno_herramientas_id_servicio_terreno_herramien_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.servicio_terreno_herramientas_id_servicio_terreno_herramien_seq', 3, true);


--
-- TOC entry 5627 (class 0 OID 0)
-- Dependencies: 409
-- Name: servicio_terreno_id_servicio_terreno_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.servicio_terreno_id_servicio_terreno_seq', 3, true);


--
-- TOC entry 5628 (class 0 OID 0)
-- Dependencies: 414
-- Name: tarea_id_tarea_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.tarea_id_tarea_seq', 3, true);


--
-- TOC entry 5629 (class 0 OID 0)
-- Dependencies: 416
-- Name: tarea_tipo_id_tarea_tipo_seq; Type: SEQUENCE SET; Schema: terreno; Owner: postgres
--

SELECT pg_catalog.setval('terreno.tarea_tipo_id_tarea_tipo_seq', 3, true);


-- Completed on 2026-06-14 21:36:51

--
-- PostgreSQL database dump complete
--


