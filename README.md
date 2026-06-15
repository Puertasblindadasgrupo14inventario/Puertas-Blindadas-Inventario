# Puertas Blindadas ERP — Módulo Inventario
**Grupo 14 · Ingeniería de Software · Scrum++**

Sistema ERP para empresa de puertas blindadas. Este repositorio corresponde al **Módulo de Inventario**, uno de los tres módulos del sistema (Inventario, Terreno, Finanzas).

---

## Estructura del repositorio

```
puertas-blindadas/
├── README.md
├── .gitignore
│
├── src/
│   ├── frontend/          ← Interfaz web (HTML + CSS + JS vanilla)
│   └── backend/           ← API REST (Node.js + Express)
│
├── database/
│   ├── ddl_inventario.sql    ← DDL schema inventario
│   ├── ddl_terreno.sql       ← DDL schema terreno
│   ├── ddl_finanzas.sql      ← DDL schema finanzas
│   ├── dml_inventario.sql    ← Datos de prueba inventario
│   ├── dml_terreno.sql       ← Datos de prueba terreno
│   └── dml_finanzas.sql      ← Datos de prueba finanzas
│
└── docs/
    ├── requerimientos/
    ├── modelamiento/
    ├── diagramas/
    │   └── diagramas_secuencia/      ← 98 diagramas .drawio
    ├── pruebas/
    └── informes/
```

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| PostgreSQL | 14.x o superior |
| Python | 3.x (solo para servidor frontend) |

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd puertas-blindadas
```

### 2. Configurar PostgreSQL — Cambio de método de autenticación

> **IMPORTANTE:** Este paso es obligatorio. El driver `pg` de Node.js requiere autenticación `md5` en lugar del método por defecto `scram-sha-256` de PostgreSQL.

Ubicar el archivo `pg_hba.conf`:
- **Windows:** `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
- **Linux/Mac:** `/etc/postgresql/18/main/pg_hba.conf`

Buscar las líneas que contienen `scram-sha-256` y cambiarlas a `md5`:

```
# Antes:
host    all    all    127.0.0.1/32    scram-sha-256
# Después:
host    all    all    127.0.0.1/32    md5
```

Luego **reiniciar el servicio de PostgreSQL**:
- **Windows:** Abrir Servicios → PostgreSQL 18 → Reiniciar
- **Linux:** `sudo systemctl restart postgresql`

### 3. Crear la base de datos

En pgAdmin o psql ejecutar:

```sql
CREATE DATABASE puertas_blindadas;
```

### 4. Ejecutar el DDL y DML

En pgAdmin, conectarse a `puertas_blindadas`, abrir el **Query Tool** y ejecutar los archivos en este orden. Para cada uno: **File → Open → seleccionar archivo → F5**.

**Fase 1 — Crear los schemas (DDL):**

```
1. ddl_inventario.sql   ← crea el schema inventario (~45 tablas)
2. ddl_terreno.sql      ← crea el schema terreno
3. ddl_finanzas.sql     ← crea el schema finanzas
```

**Fase 2 — Insertar datos de prueba (DML):**

```
4. dml_inventario.sql   ← datos inventario
5. dml_terreno.sql      ← datos terreno
6. dml_finanzas.sql     ← datos finanzas
```

> **Nota:** Las referencias cross-schema son FKs blandas sin constraint formal, por lo que el orden entre schemas es flexible. Los datos de catálogo (tipos de alerta, clasificación Traslado, etc.) ya están incluidos en `dml_inventario.sql`.

### 5. Configurar contraseñas de usuarios — Hash bcrypt

Las contraseñas ya vienen hasheadas en el DML. El usuario de prueba alvaro.moreno usa la contraseña `password123`. Si necesitas crear un usuario nuevo directamente en la BD (sin usar la interfaz web), debes generar el hash bcrypt manualmente.

Desde la carpeta `src/backend/` ejecutar:

```bash
node -e "const b=require('bcrypt'); b.hash('tu_contraseña',12).then(h=>console.log(h))"
```

Copiar el hash generado e insertarlo en la BD:

```sql
-- Primero insertar el usuario
INSERT INTO inventario.usuario (usuario_username, usuario_correo, usuario_estado_cuenta, usuario_es_gerencia)
VALUES ('nuevo.usuario', 'correo@pb.cl', 'activa', false);

-- Luego insertar la contraseña hasheada
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena)
VALUES (
  (SELECT usuario_id_usuario FROM inventario.usuario WHERE usuario_username = 'nuevo.usuario'),
  '$2b$12$HASH_GENERADO_AQUI'
);
```

> Si usas la interfaz web para crear usuarios, el hash se genera automáticamente — no necesitas hacer este paso.

### 6. Configurar variables de entorno del backend

Dentro de `src/backend/`, crear un archivo `.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos — IMPORTANTE: usar 127.0.0.1, NO localhost
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=puertas_blindadas
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_SCHEMA=inventario

# Autenticación JWT
JWT_SECRET=clave_secreta_minimo_32_caracteres_aqui
JWT_EXPIRES_IN=8h
```

> **Crítico:** Usar `DB_HOST=127.0.0.1` en lugar de `localhost`. En Windows, `localhost` puede intentar conexión por socket Unix en lugar de TCP, causando error de autenticación.

### 7. Instalar dependencias del backend

> **Importante:** Usar **cmd** (no PowerShell) en Windows.

```bash
cd src/backend
npm install
```

### 8. Levantar el backend

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Verificar que funciona:
# GET http://localhost:3000/api/health → { "status": "ok" }
```

### 9. Levantar el frontend

```bash
cd src/frontend
python -m http.server 5500
```

Abrir en el navegador: **http://localhost:5500**

> **Importante:** No usar Live Server de VS Code ni abrir el HTML directamente con doble clic. Ambos métodos causan problemas de CORS y rutas relativas.

---

## Usuarios de prueba
### En caso de tener problemas con el usuario JOP, crear uno a través de la página web.

| Username | Contraseña | Rol |
|---|---|---|
| `alvaro.morales` | `password123` | Gerencia |
| `silgod` | `silgod1234` | JOP |

---

## Endpoints principales de la API

Todos requieren header `Authorization: Bearer <token>` excepto `/api/auth/login`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/materiales` | Listar productos |
| POST | `/api/materiales` | Crear producto |
| PUT | `/api/materiales/:sku` | Actualizar producto |
| DELETE | `/api/materiales/:sku` | Eliminar (solo Gerencia) |
| GET | `/api/bodegas` | Listar bodegas |
| POST | `/api/movimientos/entrada` | Registrar entrada |
| POST | `/api/movimientos/salida` | Registrar salida |
| GET | `/api/movimientos` | Historial |
| POST | `/api/alertas/generar` | Generar alertas automáticas |
| GET | `/api/alertas` | Listar alertas activas |
| GET | `/api/proveedores` | Listar proveedores |
| GET | `/api/reportes/movimientos` | Reporte movimientos |
| GET | `/api/reportes/mermas` | Reporte mermas |
| GET | `/api/usuarios` | Listar usuarios (solo Gerencia) |
| GET | `/api/auditoria` | Auditoría (solo Gerencia) |

---

## Roles y permisos

| Funcionalidad | Gerencia | JOP |
|---|---|---|
| Ver catálogo de productos | ✓ | ✓ |
| Crear / editar productos | ✓ | ✗ |
| Eliminar / desactivar productos | ✓ | ✗ |
| Registrar entradas | ✓ | ✗ |
| Registrar salidas | ✓ | ✓ |
| Ver historial movimientos | ✓ | ✓ |
| Ver alertas | ✓ | ✓ |
| Ver precios referenciales | ✓ | ✗ |
| Gestionar proveedores | ✓ | ✗ |
| Gestionar usuarios | ✓ | ✗ |
| Ver reportes financieros | ✓ | ✗ |
| Ver pedidos / checklist | ✓ | ✓ |

---

## Decisiones de arquitectura

- **Schema único PostgreSQL:** Una sola BD `puertas_blindadas` con schemas `inventario`, `terreno`, `finanzas`. Referencias cross-schema como FKs blandas sin constraint formal.
- **Autenticación PostgreSQL:** Método `md5` requerido en `pg_hba.conf` para compatibilidad con driver `pg` de Node.js.
- **FIFO:** Salidas descuentan primero del lote con `lote_fecha_ingreso` más antigua (`ASC NULLS LAST`).
- **PK ternaria en `inventario_bodega`:** `(material_sku, lote_id_lote, bodega_id_bodega)`. Stock consolidado siempre con `SUM GROUP BY`.
- **SKU:** Siempre en mayúsculas. Validación de duplicados con `UPPER()` en backend.
- **Contraseñas:** Hash bcrypt 12 rondas en tabla `usuario_contrasena`. Nunca en texto plano.
- **JWT:** Expiración 8h. Rol embebido en el token (`gerencia` o `jop`).
- **Datos financieros:** Backend omite `precio_referencial` de respuestas para tokens con rol JOP.
- **Conexión BD:** `DB_HOST=127.0.0.1` obligatorio (no `localhost`) para conexión TCP en Windows.

---

## Tecnologías

**Frontend:** HTML5 + CSS3 + JavaScript vanilla · Sin frameworks

**Backend:** Node.js 18 · Express 4 · pg (node-postgres) · jsonwebtoken · bcrypt · nodemon

**Base de datos:** PostgreSQL 18 · Schema `inventario` · ~45 tablas

---

## Metodología

**Scrum++** con dos semestres de desarrollo iterativo. Incremento 1: 28 FR distribuidos en 41 Casos de Uso. 3 iteraciones de pruebas de caja negra.

---

## Integrantes Grupo 14

> Completar con los nombres del grupo.

--- Sofía Cariñe

--- Jhoe Castillo

--- Karla Curín

--- Valentín García

--- Omar Olmos

--- Silvio Villagra

*Sistema Puertas Blindadas ERP — Módulo Inventario — Grupo 14*
