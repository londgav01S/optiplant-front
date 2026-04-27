# Especificación Técnica del Frontend
## Sistema de Inventario Multi-Sucursal — OptiPlant Consultores
### Fase 3 · Documento de diseño previo a la implementación

> **Stack definido:** React 18 · Vite 5 · React Router v6 · React Query (TanStack Query) · Axios · Tailwind CSS · shadcn/ui · Recharts · React Hook Form · Zod  
> **API base:** `http://localhost:8080` (desarrollo) · `http://backend:8080` (Docker)

---

## Tabla de contenido

1. [Identidad visual y estilo de la aplicación](#1-identidad-visual-y-estilo-de-la-aplicación)
2. [Paleta de colores y tipografía](#2-paleta-de-colores-y-tipografía)
3. [Componentes UI base](#3-componentes-ui-base)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Configuración del proyecto](#5-configuración-del-proyecto)
6. [Gestión de estado y peticiones HTTP](#6-gestión-de-estado-y-peticiones-http)
7. [Autenticación y protección de rutas](#7-autenticación-y-protección-de-rutas)
8. [Módulos y páginas — especificación por vista](#8-módulos-y-páginas--especificación-por-vista)
9. [Formularios y validaciones](#9-formularios-y-validaciones)
10. [Manejo de errores en el frontend](#10-manejo-de-errores-en-el-frontend)
11. [Navegación y layout](#11-navegación-y-layout)
12. [Checklist de construcción](#12-checklist-de-construcción)

---

## 1. Identidad visual y estilo de la aplicación

### Concepto visual

La aplicación es una herramienta de gestión operativa B2B. El diseño prioriza **claridad, densidad de información y eficiencia operativa** por encima de la estética decorativa. Los usuarios (operadores, gerentes) usan la aplicación durante toda su jornada laboral, por lo que el diseño debe reducir la fatiga visual y facilitar la lectura rápida de datos.

### Principios de diseño

- **Densidad moderada:** las tablas y listados deben mostrar suficiente información sin requerir scroll horizontal. Se prefieren filas compactas sobre tarjetas grandes.
- **Jerarquía clara:** cada página tiene un solo elemento de acción primaria (botón principal). Las acciones secundarias son más discretas.
- **Feedback inmediato:** toda acción del usuario (guardar, confirmar, cancelar) debe mostrar un indicador visual de carga y luego una notificación de resultado (toast).
- **Consistencia:** el mismo tipo de dato siempre se muestra igual. Las fechas, los números de stock y los montos tienen un formato único en toda la aplicación.
- **Modo claro por defecto:** no se implementa modo oscuro en la versión inicial. El fondo base es blanco/gris muy claro.

### Tono de la interfaz

- Profesional pero amigable. No corporativo-frío.
- Lenguaje en español colombiano. Sin anglicismos innecesarios en la UI.
- Los mensajes de error son descriptivos y orientados a la acción ("El stock es insuficiente. Disponible: 8 unidades. Solicitado: 15 unidades."), no técnicos ("422 Unprocessable Entity").

### Layout general

La aplicación tiene un layout de dos columnas:
- **Sidebar izquierdo fijo** con la navegación principal (240px de ancho en desktop).
- **Área de contenido** que ocupa el resto del ancho.
- En mobile (< 768px) el sidebar colapsa a un menú hamburguesa en la parte superior.

Encima del área de contenido hay una **topbar** con: breadcrumb de la página actual, nombre del usuario autenticado, su sucursal y un botón de cerrar sesión.

---

## 2. Paleta de colores y tipografía

### Colores primarios

| Token | Valor HEX | Uso |
|---|---|---|
| `primary-600` | `#E8630A` | Color principal de la marca OptiPlant. Botones primarios, íconos activos, badges de acción |
| `primary-700` | `#C2410C` | Hover de botones primarios |
| `primary-100` | `#FFF7ED` | Fondos de secciones con acento naranja, tooltips informativos |
| `primary-50` | `#FFF3E8` | Highlight de fila activa en tablas |

### Colores de estado

| Token | Valor HEX | Uso |
|---|---|---|
| `success-500` | `#22C55E` | Badges de estado positivo (CONFIRMADA, RECIBIDA, activo) |
| `success-100` | `#F0FDF4` | Fondo de alertas de éxito |
| `warning-500` | `#F59E0B` | Badges de estado pendiente (PENDIENTE_APROBACION, EN_TRANSITO) |
| `warning-100` | `#FFFBEB` | Fondo de alertas de advertencia |
| `danger-500` | `#EF4444` | Badges de error (ANULADA, RECHAZADA), alertas de stock mínimo |
| `danger-100` | `#FEF2F2` | Fondo de alertas de error |
| `info-500` | `#3B82F6` | Badges informativos (EN_PREPARACION) |
| `info-100` | `#EFF6FF` | Fondo de información neutral |

### Colores neutros

| Token | Valor HEX | Uso |
|---|---|---|
| `gray-50` | `#F9FAFB` | Fondo principal de la aplicación |
| `gray-100` | `#F3F4F6` | Fondo de filas alternas en tablas, sidebar |
| `gray-200` | `#E5E7EB` | Bordes de inputs, separadores |
| `gray-400` | `#9CA3AF` | Texto de placeholder, íconos inactivos |
| `gray-600` | `#4B5563` | Texto secundario, labels |
| `gray-900` | `#111827` | Texto principal |

### Colores de roles (sidebar y badges)

| Rol | Color del badge | HEX |
|---|---|---|
| ADMIN | Morado | `#7C3AED` |
| GERENTE | Azul oscuro | `#1E3A5F` |
| OPERADOR | Gris teal | `#0D9488` |

### Tipografía

| Elemento | Fuente | Tamaño | Peso |
|---|---|---|---|
| Títulos de página (H1) | Inter | 24px | 700 |
| Subtítulos de sección (H2) | Inter | 18px | 600 |
| Títulos de tarjeta (H3) | Inter | 16px | 600 |
| Texto de tabla (cuerpo) | Inter | 14px | 400 |
| Labels de formulario | Inter | 14px | 500 |
| Texto de botones | Inter | 14px | 600 |
| Texto auxiliar, timestamps | Inter | 12px | 400 |
| Datos numéricos (stock, montos) | JetBrains Mono | 14px | 500 |

> **¿Por qué JetBrains Mono para números?** La fuente monoespaciada alinea verticalmente los dígitos en las columnas de tablas numéricas (stock, precios, cantidades), mejorando la lectura comparativa sin necesidad de alineación especial.

### Bordes y sombras

- **Border radius base:** `6px` para inputs, botones y tarjetas pequeñas.
- **Border radius de modales y tarjetas grandes:** `10px`.
- **Sombra de tarjeta:** `0 1px 3px rgba(0,0,0,0.10)`.
- **Sombra de dropdown:** `0 4px 12px rgba(0,0,0,0.15)`.
- **Bordes:** `1px solid #E5E7EB` para inputs y tablas.

---

## 3. Componentes UI base

Todos los componentes base se instalan con **shadcn/ui** y se personalizan con la paleta definida arriba. No se crean componentes desde cero cuando shadcn/ui ya los provee.

### Componentes shadcn/ui a instalar

- `Button` — variantes: default (naranja), outline, ghost, destructive
- `Input` — con soporte para error state (borde rojo + mensaje debajo)
- `Select` — para dropdowns de sucursal, estado, rol, lista de precios
- `Table` — con `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- `Dialog` — para modales de confirmación y formularios
- `Sheet` — para paneles laterales deslizantes (formulario de creación en mobile)
- `Badge` — para estados de venta, transferencia, orden de compra
- `Toast` (Sonner) — notificaciones de éxito y error
- `Skeleton` — placeholder de carga mientras llegan datos del backend
- `Tabs` — para separar vistas dentro de una misma página
- `Dropdown Menu` — para el menú de acciones por fila en tablas
- `Pagination` — para navegar entre páginas de listados
- `Alert` — para mensajes informativos dentro de páginas
- `Card` — para los KPI cards del dashboard
- `Separator` — separador visual horizontal
- `Avatar` — avatar del usuario en la topbar

### Componentes propios a construir

Estos componentes no existen en shadcn/ui y se construyen una sola vez para reutilizarlos en toda la aplicación:

- **`StatusBadge`** — recibe un enum value (EstadoVenta, EstadoTransferencia, etc.) y retorna un Badge con el color y texto correcto. Centraliza el mapeo de estados a colores.
- **`DataTable`** — tabla con paginación integrada, skeleton de carga, estado vacío y slot para filtros encima. Recibe las columnas y los datos como props.
- **`FormField`** — wrapper de Input + Label + mensaje de error de Zod. Reduce repetición en formularios.
- **`PageHeader`** — título de la página + breadcrumb + botón de acción primaria opcional.
- **`ConfirmDialog`** — modal de confirmación reutilizable ("¿Está seguro de cancelar esta orden?") con variante destructiva.
- **`StockIndicator`** — barra visual que muestra el stock actual relativo al mínimo y máximo. Se usa en las tablas de inventario.
- **`CurrencyDisplay`** — formatea un número como moneda colombiana (COP). Siempre usa la misma función de formato.
- **`EmptyState`** — ilustración + texto cuando una lista no tiene resultados.
- **`ErrorState`** — mensaje de error cuando una petición falla.

---

## 4. Estructura de carpetas

```
frontend/
├── Dockerfile
├── nginx.conf
├── package.json
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json          (si se usa TypeScript — recomendado)
├── index.html
├── .env.example           → VITE_API_URL=http://localhost:8080
│
└── src/
    │
    ├── main.jsx           ← Punto de entrada. Monta <App /> con QueryClientProvider y BrowserRouter
    ├── App.jsx            ← Define las rutas con React Router
    │
    ├── config/
    │   └── constants.js   ← API_BASE_URL, PAGE_SIZE_DEFAULT, TOKEN_KEY, roles permitidos
    │
    ├── services/          ← Capa de comunicación con el backend. Una función por endpoint.
    │   ├── axiosClient.js ← Instancia de Axios con baseURL, interceptor JWT, manejo 401
    │   ├── authService.js
    │   ├── usuariosService.js
    │   ├── sucursalesService.js
    │   ├── productosService.js
    │   ├── inventarioService.js
    │   ├── ventasService.js
    │   ├── comprasService.js
    │   ├── transferenciasService.js
    │   ├── alertasService.js
    │   ├── logisticaService.js
    │   └── dashboardService.js
    │
    ├── hooks/             ← React Query hooks. Un archivo por módulo.
    │   ├── useAuth.js     ← Estado del usuario autenticado, login, logout
    │   ├── useUsuarios.js
    │   ├── useSucursales.js
    │   ├── useProductos.js
    │   ├── useInventario.js
    │   ├── useVentas.js
    │   ├── useCompras.js
    │   ├── useTransferencias.js
    │   ├── useAlertas.js
    │   ├── useLogistica.js
    │   └── useDashboard.js
    │
    ├── store/             ← Estado global que no es del servidor
    │   └── authStore.js   ← Guarda token + usuario autenticado (Context API o Zustand)
    │
    ├── components/        ← Componentes reutilizables sin lógica de negocio
    │   ├── ui/            ← Componentes shadcn/ui (generados, no editar manualmente)
    │   │   ├── button.jsx
    │   │   ├── input.jsx
    │   │   ├── table.jsx
    │   │   └── ... (resto de shadcn)
    │   │
    │   ├── common/        ← Componentes propios reutilizables
    │   │   ├── StatusBadge.jsx
    │   │   ├── DataTable.jsx
    │   │   ├── FormField.jsx
    │   │   ├── PageHeader.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── StockIndicator.jsx
    │   │   ├── CurrencyDisplay.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── ErrorState.jsx
    │   │
    │   └── layout/        ← Componentes de estructura de la app
    │       ├── MainLayout.jsx     ← Sidebar + Topbar + área de contenido
    │       ├── Sidebar.jsx        ← Navegación principal con íconos y menú colapsable
    │       ├── Topbar.jsx         ← Breadcrumb + usuario + logout
    │       ├── SidebarItem.jsx    ← Ítem individual del menú con estado activo
    │       └── AuthLayout.jsx     ← Layout minimalista solo para la página de login
    │
    ├── pages/             ← Una carpeta por módulo, un archivo por vista
    │   │
    │   ├── auth/
    │   │   └── LoginPage.jsx
    │   │
    │   ├── dashboard/
    │   │   └── DashboardPage.jsx
    │   │
    │   ├── inventario/
    │   │   ├── InventarioPage.jsx         ← Listado global con filtros
    │   │   ├── InventarioDetallePage.jsx  ← Detalle de un registro + historial movimientos
    │   │   └── InventarioConfigModal.jsx  ← Modal para editar stock mínimo/máximo
    │   │
    │   ├── productos/
    │   │   ├── ProductosPage.jsx          ← Listado paginado con búsqueda
    │   │   ├── ProductoFormPage.jsx       ← Crear y editar producto (misma vista)
    │   │   └── ProductoDetallePage.jsx    ← Ver producto con sus unidades de medida
    │   │
    │   ├── ventas/
    │   │   ├── VentasPage.jsx             ← Listado con filtros por fecha y sucursal
    │   │   ├── VentaFormPage.jsx          ← Formulario de nueva venta con líneas dinámicas
    │   │   └── VentaDetallePage.jsx       ← Ver detalle + botón de anular
    │   │
    │   ├── compras/
    │   │   ├── ComprasPage.jsx            ← Listado de órdenes de compra
    │   │   ├── CompraFormPage.jsx         ← Crear orden de compra
    │   │   ├── CompraDetallePage.jsx      ← Ver detalle + recepcionar
    │   │   └── RecepcionCompraModal.jsx   ← Modal para ingresar cantidades recibidas
    │   │
    │   ├── transferencias/
    │   │   ├── TransferenciasPage.jsx        ← Listado con filtros
    │   │   ├── TransferenciaFormPage.jsx     ← Crear solicitud de transferencia
    │   │   ├── TransferenciaDetallePage.jsx  ← Ver detalle con timeline de estados
    │   │   ├── DespachoModal.jsx             ← Modal para registrar despacho
    │   │   └── RecepcionTransferenciaModal.jsx ← Modal para confirmar recepción
    │   │
    │   ├── logistica/
    │   │   └── LogisticaPage.jsx          ← Reporte de cumplimiento + transferencias en tránsito
    │   │
    │   ├── alertas/
    │   │   └── AlertasPage.jsx            ← Listado de alertas activas con filtros
    │   │
    │   ├── proveedores/
    │   │   ├── ProveedoresPage.jsx        ← Listado de proveedores
    │   │   ├── ProveedorFormPage.jsx      ← Crear/editar proveedor
    │   │   └── ProveedorHistorialPage.jsx ← Historial de compras por proveedor
    │   │
    │   ├── usuarios/
    │   │   ├── UsuariosPage.jsx           ← Listado de usuarios (solo ADMIN)
    │   │   └── UsuarioFormPage.jsx        ← Crear/editar usuario
    │   │
    │   ├── sucursales/
    │   │   ├── SucursalesPage.jsx         ← Listado de sucursales (solo ADMIN)
    │   │   └── SucursalFormPage.jsx       ← Crear/editar sucursal
    │   │
    │   └── errors/
    │       ├── NotFoundPage.jsx           ← Página 404
    │       └── ForbiddenPage.jsx          ← Página 403 (acceso denegado)
    │
    └── utils/             ← Funciones puras sin estado
        ├── formatters.js  ← formatCurrency, formatDate, formatStock
        ├── validators.js  ← Esquemas Zod reutilizables
        ├── roleGuards.js  ← canAccess(user, requiredRole) → boolean
        └── constants.js   ← Mapeos de enums a texto/colores en español
```

---

## 5. Configuración del proyecto

### Variables de entorno

El archivo `.env` (no se commitea) define:
- `VITE_API_URL` — URL base del backend sin trailing slash. Ej: `http://localhost:8080`

En Docker, se pasa como variable de entorno al contenedor y Vite la inyecta en el build.

### `vite.config.js`

Configurar el proxy de desarrollo para evitar CORS al trabajar localmente sin Docker:
- Redirigir `/api/**` hacia `http://localhost:8080`

Esto permite que en desarrollo el frontend corra en el puerto 5173 y las peticiones a `/api` se redirijan automáticamente al backend sin necesidad de configurar CORS en el backend para desarrollo.

### `nginx.conf`

Para el contenedor de producción, Nginx sirve la carpeta `dist/`. Configurar:
- `try_files $uri /index.html` — necesario para que React Router funcione con rutas directas (deep linking).
- Servir la app en el puerto 80.

### Tailwind CSS

El archivo `tailwind.config.js` debe extender la configuración base con:
- Los colores de la paleta definida en la sección 2, registrados como tokens: `primary`, `success`, `warning`, `danger`, `info`.
- La fuente `Inter` como `fontFamily.sans` y `JetBrains Mono` como `fontFamily.mono`.
- Directivas `content` apuntando a `./src/**/*.{js,jsx,ts,tsx}`.

### Dependencias principales

| Paquete | Versión | Para qué |
|---|---|---|
| `react` | 18.x | Framework UI |
| `react-dom` | 18.x | Renderizado en el DOM |
| `react-router-dom` | 6.x | Navegación y rutas |
| `@tanstack/react-query` | 5.x | Estado del servidor, caché, refetch automático |
| `axios` | 1.x | Cliente HTTP con interceptores |
| `react-hook-form` | 7.x | Manejo de formularios con rendimiento |
| `zod` | 3.x | Validación de esquemas de formularios |
| `@hookform/resolvers` | 3.x | Integración React Hook Form + Zod |
| `recharts` | 2.x | Gráficas del dashboard |
| `sonner` | 1.x | Notificaciones toast |
| `lucide-react` | 0.x | Íconos SVG consistentes |
| `clsx` | 2.x | Composición condicional de clases CSS |
| `tailwind-merge` | 2.x | Resolución de conflictos de clases Tailwind |
| `date-fns` | 3.x | Formateo y manipulación de fechas |

---

## 6. Gestión de estado y peticiones HTTP

### Axios Client (`axiosClient.js`)

Se crea una única instancia de Axios con:
- `baseURL` tomada de `import.meta.env.VITE_API_URL`
- `headers` con `Content-Type: application/json`
- **Interceptor de request:** antes de cada petición, lee el token del `localStorage` (clave: `inventario_token`) y agrega el header `Authorization: Bearer <token>` automáticamente.
- **Interceptor de response:** si la respuesta es un error 401, elimina el token del localStorage y redirige al usuario a `/login`. Esto maneja la expiración del token sin intervención manual.

### Servicios (`services/`)

Cada archivo de servicio exporta funciones que llaman a los endpoints del backend. Estas funciones:
- Reciben parámetros tipados (IDs, filtros, request bodies).
- Llaman al Axios Client con el método y path correctos.
- **Solo retornan `response.data.data`** — desenvuelven el `ApiResponse<T>` para que el hook reciba el dato directamente.
- No manejan errores ellos mismos — los errores se propagan hacia arriba para que React Query los capture.

**Ejemplo de estructura de un servicio:**

`ventasService.js` exporta:
- `getVentas(params)` → `GET /api/ventas` con query params de paginación y filtros
- `getVentaById(id)` → `GET /api/ventas/{id}`
- `createVenta(body)` → `POST /api/ventas`
- `anularVenta(id, body)` → `PATCH /api/ventas/{id}/anular`

### React Query Hooks (`hooks/`)

Cada archivo de hook encapsula las llamadas al servicio con `useQuery` (para GET) y `useMutation` (para POST/PATCH/PUT/DELETE). Los componentes solo importan los hooks, nunca los servicios directamente.

**Convenciones de query keys:**

Las query keys determinan qué datos se invalidan cuando se hace una mutación. Estructura recomendada:
- `['ventas']` — lista de ventas
- `['ventas', id]` — detalle de una venta específica
- `['inventario', { sucursalId }]` — inventario filtrado por sucursal
- `['dashboard', sucursalId]` — KPIs de una sucursal

Cuando se crea una venta exitosamente, se invalidan las queries `['ventas']` y `['inventario']` para que los listados se actualicen automáticamente.

**Configuración global de React Query:**

- `staleTime`: 30 segundos para datos relativamente estables (sucursales, productos, usuarios).
- `staleTime`: 0 para datos en tiempo real (inventario, alertas, transferencias activas).
- `retry`: 2 reintentos para errores de red, 0 reintentos para errores 4xx.
- `refetchOnWindowFocus`: `true` para inventario y alertas. `false` para el resto.

### Paginación

Los endpoints que devuelven Page de Spring tienen la estructura:
```
data.content → array de elementos
data.totalElements → total de registros
data.totalPages → total de páginas
data.number → página actual (0-indexed)
data.size → tamaño de página
```

El componente `DataTable` recibe estos campos y renderiza el componente `Pagination` de shadcn/ui. El número de página se maneja como estado local del componente de la página (`useState`), no en la URL (en una primera versión).

---

## 7. Autenticación y protección de rutas

### Flujo de autenticación

1. Usuario accede a la app → React Router verifica si hay token en localStorage.
2. Si no hay token → redirige a `/login`.
3. En `/login` → formulario con email y password → `POST /api/auth/login`.
4. Si el login es exitoso → guarda el token en localStorage bajo la clave `inventario_token` → guarda el objeto del usuario autenticado en el store de auth → redirige a `/dashboard`.
5. En cada request → el interceptor de Axios adjunta el token automáticamente.
6. Si el backend retorna 401 → interceptor limpia el token y redirige a `/login`.

### `authStore.js`

Implementar con Context API (sin librería externa para mantener simplicidad). El store expone:
- `user` — objeto con id, nombre, email, rolNombre, sucursalId, sucursalNombre.
- `token` — string JWT.
- `isAuthenticated` — boolean.
- `login(token, user)` — guarda en estado y en localStorage.
- `logout()` — limpia estado y localStorage y redirige a `/login`.

Al iniciar la app, leer el token del localStorage y llamar a `GET /api/auth/me` para validar que el token sigue vigente y obtener los datos del usuario. Si `auth/me` retorna 401, hacer logout.

### Protección de rutas por rol

Crear un componente `ProtectedRoute` que:
1. Si el usuario no está autenticado → redirige a `/login`.
2. Si el usuario no tiene el rol requerido → redirige a `/403`.
3. Si pasa ambas verificaciones → renderiza el children.

La verificación de rol se hace con la función `canAccess(user, allowedRoles)` en `utils/roleGuards.js`:
- Recibe el usuario del store y un array de roles permitidos.
- Retorna `true` si `user.rolNombre` está en `allowedRoles`.
- El rol `ADMIN` siempre tiene acceso a todo.

**Mapeo de rutas a roles requeridos:**

| Ruta | Roles que pueden acceder |
|---|---|
| `/dashboard` | ADMIN, GERENTE |
| `/inventario` | ADMIN, GERENTE, OPERADOR |
| `/productos` | ADMIN, GERENTE, OPERADOR |
| `/ventas` | ADMIN, GERENTE, OPERADOR |
| `/ventas/nueva` | ADMIN, GERENTE, OPERADOR |
| `/compras` | ADMIN, GERENTE, OPERADOR |
| `/transferencias` | ADMIN, GERENTE, OPERADOR |
| `/alertas` | ADMIN, GERENTE, OPERADOR |
| `/logistica` | ADMIN, GERENTE |
| `/proveedores` | ADMIN, GERENTE |
| `/usuarios` | ADMIN |
| `/sucursales` | ADMIN |

---

## 8. Módulos y páginas — especificación por vista

### Login (`/login`)

**Layout:** `AuthLayout` — pantalla centrada con logo de OptiPlant y formulario.  
**Componentes:** Card con formulario, 2 inputs (email, password), botón de ingresar.  
**Comportamiento:**  
- Validar formato de email y que la contraseña no esté vacía antes de enviar.
- Mientras carga → botón con spinner y deshabilitado.
- Error de credenciales → mostrar mensaje debajo del formulario (no toast).
- Éxito → redirigir a `/dashboard`.

**Petición:** `POST /api/auth/login`

---

### Dashboard (`/dashboard`)

**Layout:** `MainLayout`.  
**Acceso:** ADMIN, GERENTE.

**Contenido:**

**Sección KPIs (fila de 4 cards):**
- Ventas del día (monto total en COP)
- Ventas del mes (monto total en COP)
- Alertas activas (conteo con ícono de campana en rojo si > 0)
- Transferencias pendientes (conteo)

**Sección gráfica — Ventas mensuales:**
- Gráfica de barras con Recharts.
- Eje X: 4 últimos meses (nombre del mes en español).
- Eje Y: monto en millones de COP.
- Al pasar el cursor → tooltip con el monto exacto formateado.
- Si un mes tiene 0 ventas → barra de altura 0 (no se omite).

**Sección — Productos bajo stock mínimo:**
- Tabla con columnas: Producto, Sucursal, Stock actual, Stock mínimo, Diferencia.
- `StockIndicator` en la columna de stock actual.
- Si la lista está vacía → `EmptyState` con texto "Todos los productos tienen stock suficiente".
- Cada fila tiene un botón "Ver inventario" que navega a `/inventario/{id}`.

**Sección — Transferencias activas:**
- Lista compacta de transferencias en estado distinto a RECIBIDA o RECHAZADA.
- Cada ítem muestra: origen → destino, urgencia, estado.

**Petición:** `GET /api/dashboard/sucursal/{sucursalId}` con el ID de la sucursal del usuario autenticado. Para ADMIN → `GET /api/dashboard/global`.

---

### Inventario (`/inventario`)

**Layout:** `MainLayout`.  
**Acceso:** Todos los roles.

**Filtros en la parte superior:**
- Selector de sucursal (carga de `GET /api/sucursales`).
- Input de búsqueda por nombre de producto.
- Botón "Aplicar filtros".

**Tabla principal** con columnas:
- Producto (SKU + nombre)
- Sucursal
- Stock actual (`StockIndicator` visual + número en JetBrains Mono)
- Stock mínimo
- CPP (costo promedio ponderado formateado en COP)
- Última actualización
- Acciones: "Ver detalle", "Configurar umbrales" (solo ADMIN/GERENTE)

**Paginación:** `page=0&size=20`.

**Petición:** `GET /api/inventario` con query params `sucursalId` y `page/size`.

---

### Detalle de inventario (`/inventario/:id`)

**Secciones:**

1. **Encabezado:** nombre del producto, sucursal, estado de alertas.
2. **Card de stock:** stock actual, mínimo, máximo, CPP. Botón "Configurar" abre `InventarioConfigModal`.
3. **Botones de movimiento manual:** "Registrar Ingreso" y "Registrar Retiro" — abren un Dialog.
4. **Historial de movimientos:** tabla paginada con columnas: Fecha, Tipo, Cantidad, Stock antes, Stock después, Motivo, Usuario. Los tipos se muestran como `StatusBadge`.

**Peticiones:**
- `GET /api/inventario/{id}` — datos del registro
- `GET /api/inventario/{id}/movimientos` — historial paginado
- `PATCH /api/inventario/{id}/config` — guardar configuración de umbrales
- `POST /api/inventario/{id}/ingresos` — registrar ingreso manual
- `POST /api/inventario/{id}/retiros` — registrar retiro manual

---

### Productos (`/productos`)

**Tabla** con columnas: SKU, Nombre, Unidades de medida, Estado, Acciones.  
**Filtros:** búsqueda por nombre (parcial) y SKU (exacto).  
**Botón "Nuevo producto"** en el `PageHeader` → navega a `/productos/nuevo`.  
Cada fila tiene acciones: Ver, Editar, Desactivar (con `ConfirmDialog`).

**Peticiones:**
- `GET /api/productos` — lista paginada con filtros
- `PATCH /api/productos/{id}/desactivar` — desactivar con confirmación

---

### Formulario de producto (`/productos/nuevo` y `/productos/:id/editar`)

**Campos:**
- SKU — input texto, requerido, único.
- Nombre — input texto, requerido.
- Descripción — textarea, opcional.
- Unidades de medida — sección dinámica: lista de unidades con selector (carga de `GET /api/unidades-medida` si existe ese endpoint, o lista hardcodeada), factor de conversión y checkbox "Es principal". Al menos una unidad marcada como principal.

**Peticiones:**
- `POST /api/productos` — crear
- `PUT /api/productos/{id}` — editar

---

### Ventas (`/ventas`)

**Tabla** con columnas: ID, Fecha, Sucursal, Total, Estado, Acciones.  
**Filtros:** sucursal, rango de fechas (desde/hasta).  
**Botón "Nueva venta"** → navega a `/ventas/nueva`.

**Petición:** `GET /api/ventas` con filtros y paginación.

---

### Formulario de venta (`/ventas/nueva`)

Esta es la vista más compleja del módulo de ventas.

**Paso 1 — Configuración de la venta:**
- Selector de sucursal (carga `GET /api/sucursales`).
- Selector de lista de precios (carga `GET /api/listas-precios`), opcional.
- Input de descuento global (porcentaje, default 0).

**Paso 2 — Líneas de productos:**
- Buscador de productos (llama `GET /api/productos?nombre=X`).
- Al seleccionar un producto → se agrega una fila a la tabla de líneas.
- Cada fila tiene: nombre del producto, input de cantidad, input de descuento de línea, subtotal calculado, botón de eliminar.
- El subtotal de cada línea y el total de la venta se calculan en el frontend en tiempo real conforme el usuario ingresa cantidades.
- Botón "Agregar otro producto".

**Paso 3 — Resumen y confirmación:**
- Tabla resumen de líneas, subtotal, descuento global, total.
- Botón "Confirmar venta".
- Si el backend retorna 422 por stock insuficiente → mostrar el mensaje del backend en un Alert rojo (no como toast, sino en la vista).

**Petición:** `POST /api/ventas`

---

### Detalle de venta (`/ventas/:id`)

Muestra el detalle completo: encabezado con estado y fecha, tabla de líneas, totales.  
Si el estado es `CONFIRMADA` y el usuario es ADMIN o GERENTE → botón "Anular venta" que abre `ConfirmDialog` con campo de motivo.

**Peticiones:**
- `GET /api/ventas/{id}`
- `PATCH /api/ventas/{id}/anular`

---

### Compras (`/compras`)

**Tabla** con columnas: ID, Proveedor, Sucursal, Fecha, Total, Estado, Acciones.  
**Filtros:** sucursal, proveedor, estado.  
**Botón "Nueva orden"** → `/compras/nueva`.

**Petición:** `GET /api/compras`

---

### Formulario de orden de compra (`/compras/nueva`)

**Campos:**
- Selector de proveedor (carga `GET /api/proveedores`).
- Selector de sucursal.
- Fecha estimada de entrega — date picker.
- Plazo de pago en días — input numérico.
- Líneas de productos: buscador, cantidad, precio unitario, descuento. Subtotal calculado en tiempo real.

**Petición:** `POST /api/compras`

---

### Detalle de orden de compra (`/compras/:id`)

Muestra el detalle completo con tabla de líneas.

**Estados del flujo y botones disponibles:**
- `PENDIENTE` → botones "Recepcionar mercancía" y "Cancelar orden" (con confirmación).
- `RECIBIDA` o `RECIBIDA_CON_FALTANTES` → solo lectura, sin botones de acción.
- `CANCELADA` → solo lectura.

**Recepcionar mercancía** abre `RecepcionCompraModal`: muestra cada línea con la cantidad pedida y un input para ingresar la cantidad recibida. Al confirmar → llama al endpoint de recepción → invalida el inventario y la orden.

**Peticiones:**
- `GET /api/compras/{id}`
- `POST /api/compras/{id}/recepcion`
- `PATCH /api/compras/{id}/cancelar`

---

### Transferencias (`/transferencias`)

**Tabla** con columnas: ID, Origen, Destino, Urgencia, Estado, Fecha solicitud, Acciones.  
**Filtros:** sucursal (origen o destino), estado.  
**Botón "Solicitar transferencia"** → `/transferencias/nueva`.

Las filas con urgencia `ALTA` se resaltan con un fondo de color `warning-100`.

**Petición:** `GET /api/transferencias`

---

### Formulario de solicitud de transferencia (`/transferencias/nueva`)

**Campos:**
- Sucursal origen — selector. Al seleccionarla, el usuario puede consultar el stock disponible.
- Sucursal destino — selector, no puede ser igual a origen (validación en frontend y backend).
- Nivel de urgencia — radio buttons: Normal / Alta.
- Observaciones — textarea opcional.
- Líneas de productos: buscador, cantidad solicitada.

**Flujo de consulta de stock:** al seleccionar la sucursal origen y el producto, el frontend puede llamar `GET /api/inventario?sucursalId=X&productoId=Y` para mostrar el stock disponible junto a la línea, ayudando al usuario a pedir una cantidad razonable.

**Petición:** `POST /api/transferencias`

---

### Detalle de transferencia (`/transferencias/:id`)

Esta es la vista más compleja de la aplicación porque gestiona el flujo de 5 pasos.

**Timeline de estado:** componente visual que muestra los 5 pasos del flujo y resalta el estado actual:
1. Solicitud enviada
2. Aprobación (o Rechazo)
3. Despacho
4. En tránsito
5. Recepción

**Tabla de líneas:** producto, cantidad solicitada, cantidad despachada (si aplica), cantidad recibida (si aplica), faltante (si aplica).

**Botones disponibles según estado:**

| Estado actual | Botones visibles | Roles que los ven |
|---|---|---|
| `PENDIENTE_APROBACION` | "Aprobar", "Rechazar" | ADMIN, GERENTE |
| `EN_PREPARACION` | "Registrar despacho" | ADMIN, GERENTE |
| `EN_TRANSITO` | "Confirmar recepción" | ADMIN, GERENTE, OPERADOR |
| `RECIBIDA_CON_FALTANTES` | "Definir tratamiento" por cada línea con faltante | ADMIN, GERENTE |
| `RECIBIDA`, `RECHAZADA` | Sin botones de acción | — |

**Modales:**
- `DespachoModal` — formulario con transportista, fecha estimada y cantidades a despachar por línea.
- `RecepcionTransferenciaModal` — formulario con cantidades recibidas por línea.
- Para faltantes: dropdown por línea con opciones REENVIO, AJUSTE_ACEPTADO, RECLAMACION.

**Peticiones:**
- `GET /api/transferencias/{id}`
- `PATCH /api/transferencias/{id}/aprobar`
- `PATCH /api/transferencias/{id}/rechazar`
- `POST /api/transferencias/{id}/despacho`
- `POST /api/transferencias/{id}/recepcion`
- `PATCH /api/transferencias/{id}/faltantes/{detalleId}`

---

### Alertas (`/alertas`)

**Tabla** con columnas: Producto, Sucursal, Tipo de alerta, Stock al momento, Umbral, Fecha generación, Estado, Acciones.  
Las alertas de tipo `STOCK_MINIMO` se destacan con ícono de advertencia en rojo.  
**Filtros:** sucursal, tipo de alerta.  
**Botón "Resolver"** por cada alerta activa → llama al endpoint y refresca la lista.

**Petición:** `GET /api/alertas` y `PATCH /api/alertas/{id}/resolver`

---

### Logística (`/logistica`)

**Tabs en la parte superior:**
1. **Tab "Reporte de cumplimiento":** tabla con columnas: ID transferencia, Estado, % Cumplimiento, Faltante total. Filtros de fecha y sucursal. Las filas con cumplimiento < 90% se resaltan.
2. **Tab "En tránsito":** lista de transferencias actualmente en tránsito con origen, destino, fecha estimada de llegada y días restantes.

**Peticiones:**
- `GET /api/logistica/reporte`
- `GET /api/logistica/en-transito`

---

### Proveedores (`/proveedores`)

**Tabla** con columnas: Nombre, Contacto, Teléfono, Email, Condiciones de pago, Estado, Acciones.  
**Botón "Nuevo proveedor"** → `ProveedorFormPage`.  
Cada fila tiene botón "Ver historial" → `/proveedores/:id/historial`.

---

### Historial de proveedor (`/proveedores/:id/historial`)

Tabla de órdenes de compra del proveedor con filtros de fecha.  
Indicadores en el encabezado: tiempo promedio de entrega, tasa de órdenes completas.

**Petición:** `GET /api/proveedores/{id}/historial`

---

### Usuarios (`/usuarios`) — Solo ADMIN

**Tabla** con columnas: Nombre, Email, Rol, Sucursal, Estado, Acciones (Editar, Desactivar).  
**Filtros:** activo/inactivo, sucursal.  
**Botón "Nuevo usuario"** → `UsuarioFormPage`.

---

### Formulario de usuario (`/usuarios/nuevo` y `/usuarios/:id/editar`)

**Campos:**
- Nombre, Apellido — inputs de texto.
- Email — input email.
- Contraseña — input password (solo visible en creación; en edición es un botón separado "Cambiar contraseña").
- Rol — selector con opciones: Administrador, Gerente, Operador.
- Sucursal — selector. Requerido excepto si el rol es ADMIN.

**Peticiones:**
- `POST /api/usuarios`
- `PUT /api/usuarios/{id}`
- `PATCH /api/usuarios/{id}/password`

---

### Sucursales (`/sucursales`) — Solo ADMIN

**Tabla** con columnas: Nombre, Dirección, Teléfono, Estado, Acciones.  
**Formulario:** nombre (requerido), dirección y teléfono (opcionales).

**Peticiones:**
- `GET /api/sucursales`
- `POST /api/sucursales`
- `PUT /api/sucursales/{id}`
- `PATCH /api/sucursales/{id}/desactivar`

---

## 9. Formularios y validaciones

### Estrategia general

Todos los formularios usan **React Hook Form** con **Zod** como validador. El componente `FormField` encapsula el patrón label + input + mensaje de error.

### Validaciones del lado del frontend

Las validaciones del frontend son una primera línea de defensa para mejorar la UX. No reemplazan las validaciones del backend.

**Reglas generales:**
- Campos obligatorios: mensaje "Este campo es requerido".
- Email: formato válido.
- Contraseña: mínimo 8 caracteres.
- Cantidades y precios: números positivos, no cero.
- Descuentos: entre 0 y 100.
- Fechas: no pueden ser anteriores al día actual si son fechas futuras (ej: fecha estimada de entrega).
- Sucursal origen ≠ sucursal destino en transferencias.

### Manejo del estado de los formularios

- **Enviando:** botón deshabilitado con texto "Guardando..." y spinner.
- **Error del backend (422):** mostrar el mensaje de `response.data.message` en un Alert rojo encima del formulario, no como toast. El usuario debe ver el error junto al formulario.
- **Éxito:** mostrar toast de éxito (verde) y navegar de vuelta al listado.
- **Error de red (500):** toast rojo con mensaje genérico "Ocurrió un error inesperado. Intente de nuevo."

---

## 10. Manejo de errores en el frontend

### Mapa de códigos HTTP a comportamiento

| Código HTTP | Comportamiento |
|---|---|
| `400` | Mostrar los errores de campo en el formulario (si viene de un formulario) o Alert rojo con el mensaje |
| `401` | El interceptor de Axios limpia el token y redirige a `/login` automáticamente |
| `403` | Mostrar Alert con "No tiene permiso para realizar esta acción" dentro de la vista, o redirigir a `/403` |
| `404` | Mostrar `ErrorState` con mensaje "El recurso solicitado no fue encontrado" |
| `409` | Mostrar Alert con el mensaje de conflicto (ej: "Ya existe un producto con ese SKU") |
| `422` | Mostrar Alert con el mensaje del backend. Es un error de negocio, no de formulario |
| `500` | Toast rojo con mensaje genérico. Registrar en console.error para debug |

### Errores de red

Si Axios no puede conectar con el backend (timeout, sin conexión) → mostrar un banner en la parte superior de la app con "Sin conexión con el servidor. Verificando..." y reintentar cada 30 segundos.

### Estados de carga

- Mientras carga una página entera → mostrar `Skeleton` en lugar de la tabla o contenido.
- Mientras carga una acción (botón) → spinner en el botón, el resto de la vista sigue visible.
- Nunca bloquear toda la pantalla con un spinner global, excepto en el login.

---

## 11. Navegación y layout

### Sidebar — Menú de navegación

El sidebar muestra solo los ítems a los que el usuario tiene acceso según su rol.

**Estructura del menú:**

```
Inicio
└── Dashboard

Operaciones
├── Inventario
├── Ventas
├── Compras
└── Transferencias

Análisis
├── Alertas
└── Logística

Configuración (solo ADMIN/GERENTE)
├── Productos
├── Proveedores
├── Listas de precios
├── Usuarios (solo ADMIN)
└── Sucursales (solo ADMIN)
```

Cada ítem tiene un ícono de Lucide React. El ítem activo se resalta con fondo `primary-100` y texto `primary-600`.

### Topbar

Muestra de izquierda a derecha:
- Breadcrumb dinámico (ej: "Transferencias › Detalle #4").
- Espacio flexible.
- Badge del rol del usuario (con color según rol definido en sección 2).
- Nombre del usuario + sucursal.
- Botón de cerrar sesión (ícono de logout).

### Rutas definidas en `App.jsx`

```
/login                           → LoginPage (sin MainLayout)
/                                → redirige a /dashboard
/dashboard                       → DashboardPage
/inventario                      → InventarioPage
/inventario/:id                  → InventarioDetallePage
/productos                       → ProductosPage
/productos/nuevo                 → ProductoFormPage
/productos/:id/editar            → ProductoFormPage
/ventas                          → VentasPage
/ventas/nueva                    → VentaFormPage
/ventas/:id                      → VentaDetallePage
/compras                         → ComprasPage
/compras/nueva                   → CompraFormPage
/compras/:id                     → CompraDetallePage
/transferencias                  → TransferenciasPage
/transferencias/nueva            → TransferenciaFormPage
/transferencias/:id              → TransferenciaDetallePage
/alertas                         → AlertasPage
/logistica                       → LogisticaPage
/proveedores                     → ProveedoresPage
/proveedores/nuevo               → ProveedorFormPage
/proveedores/:id/editar          → ProveedorFormPage
/proveedores/:id/historial       → ProveedorHistorialPage
/usuarios                        → UsuariosPage
/usuarios/nuevo                  → UsuarioFormPage
/usuarios/:id/editar             → UsuarioFormPage
/sucursales                      → SucursalesPage
/sucursales/nuevo                → SucursalFormPage
/sucursales/:id/editar           → SucursalFormPage
/403                             → ForbiddenPage
*                                → NotFoundPage
```

### Formateo de datos en la UI

Centralizar en `utils/formatters.js`:

| Función | Entrada | Salida |
|---|---|---|
| `formatCurrency(amount)` | `475000` | `$475.000 COP` |
| `formatDate(dateStr)` | `"2025-04-26T10:00:00"` | `"26 abr 2025, 10:00"` |
| `formatDateShort(dateStr)` | `"2025-04-26"` | `"26/04/2025"` |
| `formatStock(amount)` | `150.5` | `"150,50"` en JetBrains Mono |
| `formatPercent(n)` | `93.33` | `"93,33 %"` |

El archivo `utils/constants.js` define el mapeo de enums a texto en español y colores:

```
EstadoVenta:
  CONFIRMADA → texto: "Confirmada", color: success
  ANULADA    → texto: "Anulada",    color: danger

EstadoTransferencia:
  PENDIENTE_APROBACION  → texto: "Pendiente de aprobación", color: warning
  EN_PREPARACION        → texto: "En preparación",          color: info
  EN_TRANSITO           → texto: "En tránsito",             color: info
  RECIBIDA              → texto: "Recibida",                color: success
  RECIBIDA_CON_FALTANTES → texto: "Recibida con faltantes", color: warning
  RECHAZADA             → texto: "Rechazada",              color: danger

(idem para EstadoOrdenCompra, TipoMovimiento, TipoAlerta, NivelUrgencia)
```

---

## 12. Checklist de construcción

### Configuración inicial
- [ ] `vite.config.js` con proxy de `/api` hacia el backend para desarrollo local
- [ ] Tailwind configurado con la paleta de colores y fuentes definidas
- [ ] `axiosClient.js` con `baseURL` desde variable de entorno
- [ ] Interceptor de request que adjunta el token JWT
- [ ] Interceptor de response que redirige a `/login` en 401
- [ ] `authStore.js` con Context API y persistencia en localStorage
- [ ] `App.jsx` con rutas y `ProtectedRoute` funcional
- [ ] shadcn/ui inicializado con los componentes listados en la sección 3

### Componentes base
- [ ] `StatusBadge` implementado con todos los mapeos de enums
- [ ] `DataTable` con paginación, skeleton y estado vacío
- [ ] `FormField` con soporte de error message de Zod
- [ ] `PageHeader` con breadcrumb y slot de acción
- [ ] `ConfirmDialog` reutilizable
- [ ] `CurrencyDisplay` y `formatters.js` completos
- [ ] `MainLayout` con Sidebar y Topbar responsivos

### Por cada módulo
- [ ] Servicio implementado con todas las funciones del módulo
- [ ] Hook de React Query con `useQuery` y `useMutation` correspondientes
- [ ] Página de listado con filtros, tabla y paginación
- [ ] Página de detalle (donde aplica)
- [ ] Formulario de creación/edición con validación Zod
- [ ] Invalidación de queries relacionadas en las mutaciones exitosas

### Módulos críticos (validar con especial atención)
- [ ] Flujo completo de venta: selección de productos, cálculo de totales, manejo de stock insuficiente
- [ ] Flujo completo de transferencia: los 5 pasos con sus modales correspondientes
- [ ] Dashboard: las 4 cards de KPIs y la gráfica de barras de ventas mensuales
- [ ] Alertas: se muestran en tiempo real, el número en la card del dashboard coincide con `/api/alertas`

### Seguridad y calidad
- [ ] Los botones de acciones administrativas (desactivar usuario, cancelar orden) no aparecen para roles sin permiso
- [ ] Las rutas restringidas redirigen a `/403` si el rol no tiene acceso
- [ ] Los formularios tienen el estado de "enviando" correctamente implementado
- [ ] Los errores 422 del backend se muestran en la vista, no solo como toast
- [ ] Las fechas y montos tienen formato consistente en toda la aplicación
- [ ] La app funciona correctamente con `docker compose up` sin configuración adicional

---

*Documento de especificación técnica — Frontend — Sistema de Inventario Multi-Sucursal*  
*OptiPlant Consultores · Versión 1.0 · 2026*
