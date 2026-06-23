# Puertas Blindadas ERP — Módulo Inventario
**Grupo 14 · Ingeniería de Software · Scrum++**

Sistema ERP para empresa de puertas blindadas. Este repositorio corresponde al **Módulo de Inventario**, uno de los tres módulos del sistema (Inventario, Terreno, Finanzas).

---

## Estructura del repositorio

```
Puertas-Blindadas-Inventario/
├── README.md
│
├── base_de_datos/
│   ├── ddl/
│   │   ├── ddl_inventario.sql        ← Schema inventario (~45 tablas)
│   │   ├── ddl_terreno.sql           ← Schema terreno
│   │   └── ddl_finanzas.sql          ← Schema finanzas
│   └── dml/
│       ├── dml_inventario.sql        ← Datos de prueba inventario
│       ├── dml_terreno.sql           ← Datos de prueba terreno
│       └── dml_finanzas.sql          ← Datos de prueba finanzas
│
├── Documento 0 - grupo 14/          ← Documentación entrega inicial
│   ├── Bizagi/
│   ├── Curriculum/
│   └── Diagramas CU/
│
└── Incremento 1 - grupo 14/
    ├── Incremento 1 - Grupo 14.docx  ← Documento principal incremento 1
    ├── Incremento 1 Grupo 14 Documento de instalacion.docx
    ├── MERE - Puertas Blindadas.drawio
    ├── Modelo Fisico - Puertas Blindadas.drawio
    ├── Diagrama de componentes - Puertas Blindadas.drawio
    ├── Diagrama de despliegue - Puertas Blindadas.drawio
    │
    ├── Codigo vistas y controlador/
    │   ├── Controlador/              ← API REST (Node.js + Express)
    │   │   ├── .env.example
    │   │   ├── package.json
    │   │   └── src/
    │   │       ├── index.js
    │   │       ├── controllers/
    │   │       ├── routes/
    │   │       ├── middleware/
    │   │       └── db/
    │   └── Vistas/                   ← Interfaz web (HTML + CSS + JS vanilla)
    │       ├── login.html
    │       ├── dashboard.html
    │       ├── productos/
    │       ├── movimientos/
    │       ├── bodegas/
    │       ├── alertas/
    │       ├── proveedores/
    │       ├── reportes/
    │       ├── pedidos/
    │       ├── usuarios/
    │       └── shared/
    │
    ├── Diagramas CU incremento 1/
    ├── Diagramas Secuencia/          ← 41 diagramas .drawio + imágenes
    ├── Pruebas del sistema/          ← 3 iteraciones caja negra
    ├── Videos explicativos/
    └── Vistas pagina web - Grupo 14/ ← Capturas de pantalla del sistema
```

---

## Requisitos previos

Instalar las siguientes herramientas antes de continuar:

| Herramienta | Versión mínima | Uso | Descarga |
|---|---|---|---|
| **Node.js** | 18.x | Backend API | [nodejs.org](https://nodejs.org/en/download) |
| **npm** | 9.x | Dependencias backend | Incluido con Node.js |
| **PostgreSQL** | 14.x o superior | Base de datos | [postgresql.org](https://www.postgresql.org/download/) |
| **pgAdmin** | Cualquier versión | Administrar BD | Incluido con PostgreSQL |
| **Python** | 3.x | Servidor frontend | [python.org](https://www.python.org/downloads/) |
| **Git** | Cualquier versión | Clonar repositorio | [git-scm.com](https://git-scm.com) |
| **Visual Studio Code** | Cualquier versión | Editor de código | [code.visualstudio.com](https://code.visualstudio.com/) |

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Puertas-Blindadas-Inventario
```

### 2. Configurar PostgreSQL — Cambio de método de autenticación

> **IMPORTANTE:** Este paso es obligatorio. Sin él, el controlador no podrá conectarse a la base de datos.

Al instalar PostgreSQL, dejar el puerto predeterminado y usar `1234` como contraseña.

El driver `pg` de Node.js requiere autenticación `md5` en lugar del método por defecto `scram-sha-256`. Hay que modificar el archivo `pg_hba.conf`.

**Ubicación del archivo:**
- Windows: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
- Linux: `/etc/postgresql/18/main/pg_hba.conf`
- Mac (Homebrew): `/usr/local/var/postgresql@18/pg_hba.conf`

Abrir el archivo con un editor de texto (como administrador en Windows) y buscar las líneas con `scram-sha-256`. Cambiarlas a `md5`:

```
# Antes:
host    all    all    127.0.0.1/32    scram-sha-256
host    all    all    ::1/128         scram-sha-256

# Después:
host    all    all    127.0.0.1/32    md5
host    all    all    ::1/128         md5
```

**Reiniciar el servicio de PostgreSQL:**
- Windows: Inicio → Servicios → `postgresql-x64-18` → clic derecho → Reiniciar
- Linux: `sudo systemctl restart postgresql`
- Mac: `brew services restart postgresql@18`

> Si no se reinicia el servicio, los cambios en `pg_hba.conf` no tendrán efecto.

### 3. Crear la base de datos

En pgAdmin, clic derecho sobre **Databases → Create → Database** y nombrarla `puertas_blindadas`. O ejecutar en psql:

```sql
CREATE DATABASE puertas_blindadas;
```

### 4. Ejecutar el DDL

En pgAdmin, conectarse a `puertas_blindadas`, abrir el **Query Tool** y ejecutar los archivos DDL en este orden. Para cada uno: **File → Open → seleccionar archivo → F5**.

```
1. base_de_datos/ddl/ddl_inventario.sql   ← crea el schema inventario
2. base_de_datos/ddl/ddl_terreno.sql      ← crea el schema terreno
3. base_de_datos/ddl/ddl_finanzas.sql     ← crea el schema finanzas
```

> **Importante:** Ejecutar el DDL de los otros schemas (finanzas, terreno) según instrucciones de cada grupo antes de continuar.

### 5. Ejecutar el DML

Ejecutar los archivos de datos en el mismo orden:

```
4. base_de_datos/dml/dml_inventario.sql   ← datos de prueba inventario
5. base_de_datos/dml/dml_terreno.sql      ← datos de prueba terreno
6. base_de_datos/dml/dml_finanzas.sql     ← datos de prueba finanzas
```

Cada archivo se ejecuta igual: **File → Open → seleccionar archivo → F5**.

### 6. Configurar variables de entorno del backend

Dentro de `Incremento 1 - grupo 14/Codigo vistas y controlador/Controlador/`, crear un archivo llamado exactamente `.env` (sin nombre antes del punto) con el siguiente contenido:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos — IMPORTANTE: usar 127.0.0.1, NO localhost
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=puertas_blindadas
DB_USER=postgres
DB_PASSWORD=1234
DB_SCHEMA=inventario

# JWT — cambiar por una clave larga y segura
JWT_SECRET=cambia_esto_por_un_secreto_en_produccion
JWT_EXPIRES_IN=8h
```

> **Crítico:** Usar `DB_HOST=127.0.0.1` y NO `localhost`. En Windows, `localhost` puede intentar conexión por socket Unix en lugar de TCP, causando error de autenticación incluso con `pg_hba.conf` correcto.

### 7. Instalar dependencias del backend

> **Importante:** Usar **cmd** (símbolo del sistema). NO usar PowerShell — puede tener problemas con npm.

```bash
cd "Incremento 1 - grupo 14/Codigo vistas y controlador/Controlador"
npm install
```

Esperar a que termine. Se instalarán Express, pg, bcrypt, jsonwebtoken, nodemon y las demás dependencias.

### 8. Levantar el backend

```bash
npm run dev
```

Si la instalación fue exitosa, la consola mostrará:

```
Servidor corriendo en http://localhost:3000
Entorno: development
```

### 9. Levantar el frontend

Abrir una nueva ventana de cmd y ejecutar:

```bash
cd "Incremento 1 - grupo 14/Codigo vistas y controlador/Vistas"
python -m http.server 5500
```

> **Importante:** No abrir los archivos HTML con doble clic ni usar Live Server de VS Code. Ambos métodos causan errores de CORS y rutas relativas rotas.

### 10. Acceder al sistema

Abrir el navegador (Chrome o Edge recomendado) y navegar a:

**http://localhost:5500/login.html**

Debe aparecer la pantalla de login.

---

## Usuarios de prueba

| Username | Contraseña | Rol |
|---|---|---|
| `alvaro.morales` | `password123` | Gerencia |
| `silgod` | `silgod1234` | JOP |

> En caso de tener problemas con el usuario JOP, crear uno a través de la interfaz web.

---

## Verificación final

- `http://localhost:5500/login.html` debe cargar la pantalla de login
- Ingresar con `alvaro.morales` / `password123` debe redirigir al dashboard
- Navegar a **Productos** debe mostrar el catálogo de materiales
- Navegar a **Movimientos** debe mostrar el historial
- Navegar a **Alertas** debe mostrar las alertas activas
- Cerrar sesión e ingresar con `silgod` / `silgod1234` (rol JOP) — no debe ver precios

---

## Solución de problemas frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| **Error de autenticación al conectar BD** | `pg_hba.conf` aún usa `scram-sha-256` | Cambiar a `md5` y reiniciar servicio PostgreSQL (ver sección 2) |
| **ECONNREFUSED al conectar BD** | `DB_HOST=localhost` en lugar de `127.0.0.1` | Cambiar a `DB_HOST=127.0.0.1` en el archivo `.env` |
| **Error de CORS en las vistas** | Vistas abiertas con doble clic o Live Server | Usar `python -m http.server 5500` desde la carpeta `Vistas/` |
| **npm: comando no reconocido** | Node.js no instalado o no en el PATH | Instalar Node.js 18+ y reiniciar cmd |
| **nodemon: comando no reconocido** | nodemon no instalado globalmente | Ejecutar: `npm install -g nodemon` |
| **Login funciona pero dashboard vacío** | Backend no levantado o puerto incorrecto | Verificar que `npm run dev` esté corriendo en el puerto 3000 |

---

## Crear un usuario nuevo directamente en la BD

> Este procedimiento es solo si necesitas crear un usuario sin usar la interfaz web. Si usas la interfaz, el hash se genera automáticamente.

**Paso 1 — Generar el hash bcrypt** desde la carpeta `Controlador/` (con dependencias instaladas):

```bash
node -e "const b=require('bcrypt'); b.hash('tu_contraseña',12).then(h=>console.log(h))"
```

**Paso 2 — Insertar en la base de datos** en pgAdmin Query Tool:

```sql
-- 1. Insertar el usuario
INSERT INTO inventario.usuario (
  usuario_username, usuario_correo,
  usuario_estado_cuenta, usuario_es_gerencia, usuario_es_jop)
VALUES ('nuevo.usuario', 'correo@pb.cl', 'activa', false, true);

-- 2. Insertar la contraseña hasheada
INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena)
VALUES (
  (SELECT usuario_id_usuario FROM inventario.usuario
   WHERE usuario_username = 'nuevo.usuario'),
  '$2b$12$HASH_GENERADO_EN_PASO_1');
```

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

- Sofía Cariñe
- Jhoe Castillo
- Karla Curín
- Valentín García
- Omar Olmos
- Silvio Villagra

*Sistema Puertas Blindadas ERP — Módulo Inventario — Grupo 14*
