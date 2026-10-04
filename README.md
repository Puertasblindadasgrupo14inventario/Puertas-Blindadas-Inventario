# Puertas Blindadas ERP — Módulo Inventario
**Grupo 14 · Ingeniería de Software · Scrum++**

Sistema ERP para empresa de puertas blindadas. Este repositorio corresponde al **Módulo de Inventario**, uno de los tres módulos del sistema (Inventario, Terreno, Finanzas).

---

## Estructura del repositorio

```
Puertas-Blindadas-Inventario/
├── README.md
├── informacion commits.txt
│
├── base_de_datos/
│   ├── ddl/
│   │   ├── ddl_inventario.sql        ← Schema inventario (57 tablas)
│   │   ├── ddl_terreno.sql           ← Schema terreno
│   │   └── ddl_finanzas.sql          ← Schema finanzas
│   └── dml/
│       ├── catalogos_inventario.sql  ← Catálogos base (tipos y motivos de movimiento, áreas, unidades...)
│       ├── 01_finanzas_terreno.sql   ← Clientes, proyectos, empleados y especificaciones de puerta
│       ├── 02_usuarios.sql           ← Usuarios de prueba (uno por rol)
│       ├── 03_maestros.sql           ← Bodegas, anaqueles, proveedores, materiales, códigos de barras y recetas
│       ├── 04_historia.sql           ← ~3.200 movimientos, lotes, facturas, precios y el stock
│       ├── 05_ventas_y_pedidos.sql   ← Ventas de prueba, pedidos de instalación y reservas
│       ├── 06_operacion.sql          ← Órdenes de trabajo, conteos cíclicos e historial de alertas
│       └── 07_volumen_cu76.sql       ← (Opcional) +10.000 movimientos para probar el límite de exportación
│
├── Documento 0 - grupo 14/          ← Documentación entrega inicial
│   ├── Bizagi/
│   ├── Curriculum/
│   └── Diagramas CU/
│
├── Incremento 1 - grupo 14/         ← Entrega incremento 1 (histórico)
│   └── ...
│
├── Incremento 2 - grupo 14/         ← Entrega incremento 2 (histórico)
│   └── ...
│
└── Incremento 3 - grupo 14/
    ├── Incremento 3 - Grupo 14.pptx                     ← Presentación principal incremento 3
    ├── Incremento 3 - Anexos - Grupo 14.pptx
    ├── Incremento 3 Grupo 14 Documento de instalacion.docx
    ├── Incremento 3 - Grupo 14 Casos de Uso.xlsx
    ├── Incremento 3 - Grupo 14 Requerimientos de Usuario.xlsx
    ├── Incremento 3 - Grupo 14 Organizacion Trabajo.xlsx
    ├── Incremento 3 - Product Backlog - Grupo 14 .xlsx
    ├── Incremento 3 - Sprint Backlog - Grupo 14.xlsx
    ├── BurnDown / BurnUp (incremento 3 y total).png
    ├── MERE - Puertas Blindadas.drawio
    ├── Modelo Fisico - Puertas Blindadas.drawio
    ├── Diagrama de componentes - Puertas Blindadas.drawio
    ├── Diagrama de despliegue - Puertas Blindadas.drawio
    ├── Arbol de navegacion - Grupo 14.drawio
    │
    ├── Codigo vistas y controlador/
    │   ├── Controlador/pb-backend/   ← API REST (Node.js + Express)
    │   │   ├── .env.example
    │   │   ├── package.json
    │   │   └── src/
    │   │       ├── index.js
    │   │       ├── config/
    │   │       ├── controllers/
    │   │       ├── routes/
    │   │       ├── middleware/
    │   │       └── db/
    │   └── Vistas/pb-frontend/       ← Frontend web (React + Vite)
    │       ├── package.json
    │       └── src/
    │           ├── pages/
    │           │   ├── alertas/
    │           │   ├── bodegas/
    │           │   ├── conteos/          ← nuevo: conteo cíclico y diferencias
    │           │   ├── herramientas/
    │           │   ├── integracion/      ← nuevo: reglas entre módulos y simulador
    │           │   ├── movimientos/
    │           │   ├── ordenes/
    │           │   ├── pedidos/          ← pedidos de instalación, picking, carga y despacho
    │           │   ├── pinturas/
    │           │   ├── productos/
    │           │   ├── proveedores/
    │           │   ├── recetas/          ← nuevo: plantillas de insumos por tipo de puerta
    │           │   ├── reportes/
    │           │   ├── reservas/
    │           │   └── usuarios/
    │           ├── components/
    │           ├── contexts/
    │           ├── hooks/
    │           ├── services/
    │           └── utils/
    │
    ├── Diagramas CU incremento 3/     ← drawio e imágenes, por actor (Gerencia, JOP)
    ├── Diagramas de secuencia/        ← Diagramas .drawio + imágenes
    ├── Pruebas del sistema/           ← Iteraciones caja negra
    └── Vistas del sistema/            ← Capturas de pantalla del sistema
```

---

## Requisitos previos

Instalar las siguientes herramientas antes de continuar:

| Herramienta | Versión mínima | Uso | Descarga |
|---|---|---|---|
| **Node.js** | 18.x | Backend API y Frontend (React) | [nodejs.org](https://nodejs.org/en/download) |
| **npm** | 9.x | Dependencias backend y frontend | Incluido con Node.js |
| **PostgreSQL** | 14.x o superior | Base de datos | [postgresql.org](https://www.postgresql.org/download/) |
| **pgAdmin** | Cualquier versión | Administrar BD | Incluido con PostgreSQL |
| **Git** | Cualquier versión | Clonar repositorio | [git-scm.com](https://git-scm.com) |
| **Visual Studio Code** | Cualquier versión | Editor de código | [code.visualstudio.com](https://code.visualstudio.com/) |

> El sistema se desarrolló con Node.js 24 y PostgreSQL 18.

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Puertasblindadasgrupo14inventario/Puertas-Blindadas-Inventario.git
cd Puertas-Blindadas-Inventario
```

### 2. Configurar PostgreSQL — Cambio de método de autenticación

> **IMPORTANTE:** Este paso es obligatorio. Sin él, el controlador no podrá conectarse a la base de datos.

Al instalar PostgreSQL, dejar el puerto predeterminado y usar `Grupo14inventario.` como contraseña.

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

> Usar siempre una base de datos **nueva** (vacía). Los archivos están pensados para cargarse desde cero.

### 4. Ejecutar el DDL

En pgAdmin, conectarse a `puertas_blindadas`, abrir el **Query Tool** y ejecutar los archivos DDL en este orden. Para cada uno: **File → Open → seleccionar archivo → F5**.

```
1. base_de_datos/ddl/ddl_inventario.sql   ← crea el schema inventario
2. base_de_datos/ddl/ddl_terreno.sql      ← crea el schema terreno
3. base_de_datos/ddl/ddl_finanzas.sql     ← crea el schema finanzas
```

> Los tres DDL ya vienen en este repositorio. `ddl_finanzas.sql` incluye la columna `item_nota_venta.sku_material`, que usa Inventario para las ventas de materiales sueltos.

### 5. Ejecutar los catálogos y el DML

Ejecutar los archivos en este orden (el orden importa: cada archivo usa datos de los anteriores):

```
4.  base_de_datos/dml/catalogos_inventario.sql   ← catálogos base (obligatorio)
5.  base_de_datos/dml/01_finanzas_terreno.sql
6.  base_de_datos/dml/02_usuarios.sql            ← usuarios de prueba (sin él no hay con quién entrar)
7.  base_de_datos/dml/03_maestros.sql
8.  base_de_datos/dml/04_historia.sql
9.  base_de_datos/dml/05_ventas_y_pedidos.sql
10. base_de_datos/dml/06_operacion.sql
11. base_de_datos/dml/07_volumen_cu76.sql        ← opcional: solo para probar el límite de exportación a CSV
```

Cada archivo se ejecuta igual: **File → Open → seleccionar archivo → F5**.

> Las fechas de los datos de prueba son **relativas al día de carga** (por ejemplo "hace 10 días"). Si se dejan pasar varios días, recargar la base de datos antes de una sesión de pruebas.

### 6. Instalar dependencias del backend

> **Importante:** Usar **cmd** (símbolo del sistema). NO usar PowerShell — puede tener problemas con npm.

```bash
cd "Incremento 3 - grupo 14/Codigo vistas y controlador/Controlador/pb-backend"
npm install
```

Esperar a que termine. Se instalarán Express, pg, bcrypt, jsonwebtoken, pdfkit, nodemon y las demás dependencias.

### 7. Configurar variables de entorno del backend

Dentro de `Incremento 3 - grupo 14/Codigo vistas y controlador/Controlador/pb-backend/`, copiar `.env.example` como un archivo llamado exactamente `.env` (sin nombre antes del punto) y dejarlo con este contenido:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos — IMPORTANTE: usar 127.0.0.1, NO localhost
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=puertas_blindadas
DB_USER=postgres
DB_PASSWORD=tu_contraseña_de_postgres
DB_SCHEMA=inventario

# JWT — cambiar por una clave larga y segura
JWT_SECRET=secreto_seguro_123
JWT_EXPIRES_IN=8h
```

> **Crítico:** Usar `DB_HOST=127.0.0.1` y NO `localhost`. En Windows, `localhost` puede intentar conexión por socket Unix en lugar de TCP, causando error de autenticación incluso con `pg_hba.conf` correcto.
>
> Reemplazar `DB_PASSWORD` por la contraseña definida al instalar PostgreSQL (paso 2). El `.env` tiene contraseñas: **no se sube** al repositorio.

### 8. Levantar el backend

```bash
npm run dev
```

Si la instalación fue exitosa, la consola mostrará:

```
Servidor corriendo en http://localhost:3000
Conectado a PostgreSQL
```

### 9. Instalar dependencias y levantar el frontend

Abrir una nueva ventana de cmd y ejecutar:

```bash
cd "Incremento 3 - grupo 14/Codigo vistas y controlador/Vistas/pb-frontend"
npm install
npm run dev
```

El servidor de desarrollo de Vite quedará escuchando en el puerto **5173**.

### 10. Acceder al sistema

Abrir el navegador (Chrome o Edge recomendado) y navegar a:

**http://localhost:5173/login**

Debe aparecer la pantalla de login.

---

## Usuarios de prueba

Ya vienen cargados por `02_usuarios.sql`, uno por rol. Todos usan la contraseña **`Prueba2026!`**:

| Username | Rol | Para qué |
|---|---|---|
| `gerente.prueba` | Gerencia | La mayoría de los casos de prueba |
| `gerente2.prueba` | Gerencia | Probar el bloqueo tras 3 contraseñas incorrectas al revertir (CU-42), sin bloquear al otro gerente |
| `jop.prueba` | JOP | Operación sin ver precios; tiene la regla de integración de Terreno (CU-107) |
| `admin.prueba` | Administrador | Reglas de integración entre módulos (CU-108) |
| `tecnico.prueba` | Técnico | Solo lectura, sin ver precios |
| `secretaria.prueba` | Secretaria | Solo lectura |

> En caso de tener problemas con algún usuario, crear uno a través de la interfaz web (o manualmente, ver sección siguiente).

---

## Crear un usuario nuevo directamente en la BD

> Este procedimiento es solo si necesitas crear un usuario sin usar la interfaz web. Si usas la interfaz, el hash se genera automáticamente.

**Paso 1 — Generar el hash bcrypt** desde la carpeta `Controlador/pb-backend/` (con dependencias instaladas):

```bash
node -e "const b=require('bcrypt'); b.hash('tu_contraseña',12).then(h=>console.log(h))"
```

El resultado será algo similar a: `$2b$12$AbCdEfGhIj...`

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

Las contraseñas se almacenan siempre hasheadas con bcrypt (12 rondas) en `inventario.usuario_contrasena` — nunca en texto plano.

---

## Verificación final

- `http://localhost:5173/login` debe cargar la pantalla de login
- Ingresar con `gerente.prueba` / `Prueba2026!` debe redirigir al dashboard
- Navegar a **Productos** debe mostrar el catálogo de materiales, con su código de barras
- Navegar a **Bodegas** debe mostrar las 4 bodegas de prueba
- Navegar a **Alertas** debe mostrar las alertas activas y las pestañas de Reposición e Historial
- Navegar a **Conteo cíclico**, **Recetas** e **Instalaciones** debe mostrar los conteos, recetas y pedidos de prueba
- Cerrar sesión e ingresar con `jop.prueba` / `Prueba2026!` (rol JOP) — no debe ver precios

---

## Solución de problemas frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| **Error de autenticación al conectar BD** | `pg_hba.conf` aún usa `scram-sha-256` | Cambiar a `md5` y reiniciar servicio PostgreSQL (ver sección 2) |
| **ECONNREFUSED al conectar BD** | `DB_HOST=localhost` en lugar de `127.0.0.1`, o contraseña incorrecta en `.env` | Cambiar a `DB_HOST=127.0.0.1` y verificar `DB_PASSWORD` en el archivo `.env` |
| **npm: comando no reconocido** | Node.js no instalado o no en el PATH | Instalar Node.js 18+ y reiniciar cmd |
| **nodemon: comando no reconocido** | nodemon no instalado globalmente | Ejecutar: `npm install -g nodemon` |
| **Login funciona pero dashboard vacío** | Backend no levantado o puerto incorrecto | Verificar que `npm run dev` (pb-backend) esté corriendo en el puerto 3000 |
| **Frontend no carga / puerto 5173 no responde** | Dependencias del frontend no instaladas o `npm run dev` no ejecutado en `pb-frontend/` | Ejecutar `npm install` y `npm run dev` dentro de `Vistas/pb-frontend/` |
| **"No se pudo conectar con el servidor"** | Los puertos son fijos: el frontend busca el backend en el 3000 y el backend solo acepta peticiones del 5173 | Cerrar el programa que ocupe alguno de esos puertos |
| **Acentos dañados ("InstalaciÃ³n")** | La BD se cargó con una copia antigua de los DDL o del catálogo | Recargar en una BD nueva con los archivos de este repositorio |
| **Datos de prueba con fechas raras** | Las fechas son relativas al día de carga | Recargar la base de datos |

---

## Endpoints principales de la API

Todos requieren header `Authorization: Bearer <token>` excepto `/api/auth/login`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/reautenticar` | Reingresar contraseña para revertir un movimiento (solo Gerencia) |
| GET | `/api/materiales` | Listar productos |
| POST | `/api/materiales` | Crear producto |
| PUT | `/api/materiales/:sku` | Actualizar producto |
| DELETE | `/api/materiales/:sku` | Eliminar (solo Gerencia) |
| GET | `/api/materiales/:sku/comparar-proveedores` | Comparar proveedores de un producto |
| GET | `/api/codigos/:valor` | Identificar un producto por código de barras o SKU |
| GET | `/api/bodegas` | Listar bodegas |
| POST | `/api/movimientos/entrada` | Registrar entrada |
| POST | `/api/movimientos/salida` | Registrar salida |
| POST | `/api/movimientos/:id/revertir` | Revertir un movimiento (solo Gerencia, con reautenticación) |
| GET | `/api/movimientos` | Historial |
| GET | `/api/conteos` | Conteos cíclicos |
| POST | `/api/conteos/:id/procesar` | Registrar las diferencias de un conteo (solo Gerencia) |
| GET | `/api/alertas` | Listar alertas activas |
| POST | `/api/alertas/reposicion/evaluar` | Evaluar cobertura de stock por tiempo de reposición |
| GET | `/api/alertas/historial` | Historial de alertas |
| GET | `/api/proveedores` | Listar proveedores |
| GET | `/api/proveedores/metricas` | Métricas de cumplimiento de proveedores |
| GET | `/api/recetas` | Recetas (plantillas de insumos por tipo de puerta) |
| GET | `/api/pedidos-venta` | Pedidos de instalación por venta |
| GET | `/api/reservas` | Reservas de stock |
| POST | `/api/reservas/ventas/:id` | Reservar stock para una venta aprobada |
| GET | `/api/reportes/movimientos` | Reporte movimientos |
| GET | `/api/reportes/rotacion` | Índice de rotación |
| GET | `/api/reportes/historico` | Histórico consolidado de inventario (solo Gerencia) |
| GET | `/api/reportes/desviaciones` | Ranking de desviaciones de consumo |
| POST | `/api/integracion/movimientos` | Registrar un movimiento desde Terreno o Finanzas |
| GET | `/api/integracion/stock` | Consultar stock desde Terreno o Finanzas |
| GET | `/api/usuarios` | Listar usuarios (solo Gerencia) |
| GET | `/api/auditoria` | Auditoría (solo Gerencia) |

---

## Roles y permisos

| Funcionalidad | Gerencia | Administrador | JOP | Técnico | Secretaria |
|---|---|---|---|---|---|
| Ver catálogo, stock, movimientos y alertas | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ver precios y montos | ✓ | ✓ | ✗ | ✗ | ✓ |
| Crear / editar productos, registrar entradas y salidas | ✓ | ✓ | ✓ | ✗ | ✗ |
| Ejecutar conteos cíclicos | ✓ | ✓ | ✓ | ✗ | ✗ |
| Registrar diferencias de conteo y aprobar ajustes | ✓ | ✗ | ✗ | ✗ | ✗ |
| Eliminar productos, revertir movimientos, aprobar mermas | ✓ | ✗ | ✗ | ✗ | ✗ |
| Instalaciones, reservas para venta y evaluación de reposición | ✓ | ✗ | ✓ | ✗ | ✗ |
| Configurar reglas de integración entre módulos | ✓ | ✓ | ✗ | ✗ | ✗ |
| Gestionar usuarios | ✓ | ✗ | ✗ | ✗ | ✗ |
| Ver reportes financieros (valorización, histórico) | ✓ | ✗ | ✗ | ✗ | ✗ |

> Técnico y Secretaria quedan en **solo lectura** hasta la migración a perfiles y permisos del schema común.

---

## Decisiones de arquitectura

- **Schema único PostgreSQL:** Una sola BD `puertas_blindadas` con schemas `inventario`, `terreno`, `finanzas`. Referencias cross-schema como FKs blandas sin constraint formal.
- **Autenticación PostgreSQL:** Método `md5` requerido en `pg_hba.conf` para compatibilidad con driver `pg` de Node.js.
- **FIFO:** Salidas descuentan primero del lote con `lote_fecha_ingreso` más antigua (`ASC NULLS LAST`).
- **PK ternaria en `inventario_bodega`:** `(material_sku, lote_id_lote, bodega_id_bodega)`. Stock consolidado siempre con `SUM GROUP BY`.
- **SKU:** Siempre en mayúsculas. Validación de duplicados con `UPPER()` en backend.
- **Contraseñas:** Hash bcrypt 12 rondas en tabla `usuario_contrasena`. Nunca en texto plano.
- **JWT:** Expiración 8h. Rol embebido en el token (`gerencia`, `administrador`, `jop`, `tecnico` o `secretaria`).
- **Datos financieros:** El backend omite precios y montos de las respuestas para los roles JOP y Técnico.
- **Conexión BD:** `DB_HOST=127.0.0.1` obligatorio (no `localhost`) para conexión TCP en Windows.
- **Transacciones (Incremento 3):** Toda operación que toca varias tablas va en una transacción; las validaciones se hacen antes de mover stock, así que un rechazo nunca altera los saldos.
- **Reservas (Incremento 3):** Lo reservado en `inventario_bodega` siempre es igual a la suma de las reservas activas. Al despachar un pedido, la reserva se libera en la misma transacción.
- **Códigos de barras (Incremento 3):** Un código interno por producto, solo dígitos con prefijo 2. El lector funciona como teclado y el ingreso manual por SKU siempre está disponible.
- **Conteo cíclico (Incremento 3):** Por bodega y ciego: el stock teórico no se muestra al contar y se guarda al confirmar el conteo.
- **Reportes históricos (Incremento 3):** El stock a una fecha se reconstruye hacia atrás desde los movimientos; los movimientos revertidos y sus inversos no cuentan.
- **Integración entre módulos (Incremento 3):** Terreno y Finanzas registran movimientos y consultan stock por `/api/integracion`, con el token del usuario; las reglas por rol se configuran en Inventario.

---

## Tecnologías

**Frontend:** React 19 + Vite · react-router-dom 7 · JsBarcode (etiquetas) · jsPDF (exportación PDF) · CSS

**Backend:** Node.js 18+ · Express 4 · pg (node-postgres) · jsonwebtoken · bcrypt · pdfkit · nodemon

**Base de datos:** PostgreSQL 18 · Schema `inventario` · 57 tablas

---

## Metodología

**Scrum++** con dos semestres de desarrollo iterativo. Incremento 3: iteraciones de pruebas de caja negra sobre el sistema completo (backend + frontend React + base de datos), con datos de prueba que se cargan sobre una base de datos nueva.

---

## Integrantes Grupo 14

- Sofía Cariñe
- Jhoe Castillo
- Karla Curín
- Omar Olmos
- Lenin Reyes
- Silvio Villagra

*Sistema Puertas Blindadas ERP — Módulo Inventario — Grupo 14*
