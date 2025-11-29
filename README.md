# OSMATA · Sanatorio San Cayetano

Aplicación full-stack para la obra social OSMATA que centraliza turnos médicos, gestión de stock de insumos, perfiles de usuarios y reportes operativos del Sanatorio San Cayetano.

## Tecnologías principales

- **Backend:** Node.js, Express, Prisma ORM (SQLite por defecto), JWT, bcrypt, Nodemailer, express-validator.
- **Frontend:** React + Vite + TypeScript, React Router, TailwindCSS, React Hook Form.
- **Infraestructura:** Arquitectura por capas (rutas → controladores → servicios → Prisma), validación centralizada, middlewares de autenticación/roles, documentación Swagger y seeds de datos.

## Estructura del repositorio

```
backend/   API REST, Prisma, Jest
frontend/  SPA en React + Tailwind
```

## Visión general del proyecto

- **Problema que resuelve:** digitaliza la operatoria diaria del Sanatorio San Cayetano para la obra social OSMATA. Centraliza turnos médicos, inventario de insumos, perfiles de usuarios y reportes operativos en una sola plataforma accesible por roles (afiliados, empleados y administradores).
- **Arquitectura:** monorepo con un backend Express + Prisma y un frontend React + Vite. Ambos comparten contratos (tipos de dominio) y se comunican vía API REST protegida con JWT.
- **Flujos principales:** registro/login, gestión de turnos (alta manual, reserva, cancelación, tablero administrativo), gestión de stock con alertas, reportes, recuperación de contraseña y capa visual unificada con modo claro/oscuro y nueva estética verde.

### Backend (API REST Node.js)

- `src/app.ts` y `src/server.ts`: configuración global de Express (CORS, compresión, seguridad básica) y bootstrap del servidor.
- `src/routes/*.ts`: definición de endpoints agrupados por dominio (auth, appointments, stock, reportes, catálogos, usuarios).
- `src/controllers/*.ts`: validan requests, orquestan servicios y manejan respuestas/errores HTTP.
- `src/services/*.ts`: núcleo de negocio (reservas, creación de turnos, ajustes de stock, autenticación, mailing, reportes).
- `src/middlewares/*.ts`: autenticación JWT, chequeos de rol y validaciones expresadas con `express-validator`.
- `src/config/*.ts`: configuración de entorno, Swagger y Nodemailer (con transporte SMTP real u opción stub JSON para desarrollo).
- `src/utils/*.ts`: helpers para Prisma y JWT (`token.ts` usa `jsonwebtoken` con tiempos de expiración configurables).
- `prisma/schema.prisma`: definición del modelo (usuarios, turnos, doctores, sectores, items de stock, tokens de recuperación).
- `prisma/seed.ts`: generación de datos demo (roles, doctores, sectores, stock inicial) para arrancar rápidamente.
- `tests/*.test.ts`: reglas críticas validadas con Jest (reservas de turnos y ajustes de inventario).

### Frontend (SPA React + Tailwind)

- `src/main.tsx` y `src/App.tsx`: montaje de la aplicación, ruteo protegido y layout raíz.
- `src/state/AuthContext.tsx` y `ThemeContext.tsx`: manejan sesión (persistencia + axios interceptors) y modo visual (verde claro/oscuro con almacenamiento local).
- `src/pages/*`: vistas por rol (login, registro, recuperación de contraseña, tableros de afiliado/empleado/admin, stock, reportes, perfil, configuraciones).
- `src/components/*`: piezas reutilizables (layout con sidebar/topbar, badges de estado, guards, secciones). Toda la capa visual comparte la paleta verde aplicada en el login.
- `src/services/api.ts`: cliente Axios centralizado con baseURL configurable y manejo de tokens.
- `src/index.css` + `tailwind.config.js`: estilos base, tipografías, gradientes y utilidades Tailwind extendidas según la nueva identidad verde.

## Configuración rápida

### 1. Variables de entorno

1. Duplicá cada archivo `.env.example` en `backend/` y `frontend/`.
2. Ajustá las credenciales (BD, JWT, SMTP, URL del cliente, etc.).

### 2. Backend

```bash
cd backend
npm install
npm run migrate      # crea el schema SQLite
npm run seed         # datos iniciales: usuarios demo, sectores, doctores, stock
npm run dev          # levanta API en http://localhost:4000
```

Scripts útiles:

- `npm run start`: servidor productivo (build + node dist).
- `npm run test`: tests unitarios (appointments/stock).
- `npm run lint`: verificación TypeScript.
- `npm run docs`: genera /api/docs con Swagger.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev          # SPA en http://localhost:5173
```

Scripts útiles: `npm run build`, `npm run preview`, `npm run lint`.

### 4. Desarrollo y pruebas

- **Backend en modo dev:** `cd backend && npm run dev`. Usa `PORT` del `.env` (4000 por defecto). Si ves `EADDRINUSE`, cerrá procesos previos o cambiá el puerto.
- **Frontend en modo dev:** `cd frontend && npm run dev` para abrir Vite (por defecto en `5173`).
- **Lint/TypeScript:** `npm run lint` en `backend/` ejecuta `tsc --noEmit` y garantiza que Prisma + tests compilen.
- **Tests de negocio:** `npm run test` (backend) levanta Jest, mockea Prisma/mails y cubre reglas clave de turnos y stock.
- **Seeds/migraciones:** cada vez que cambie el schema corré `npm run migrate` seguido de `npm run seed` para recrear datos demo.

## Funcionalidades clave

### Autenticación y roles

- Registro/login con JWT y contraseñas encriptadas con bcrypt.
- Roles: **Afiliado**, **Empleado**, **Admin** con middleware de autorización.
- Contexto de autenticación en el frontend (persistencia localStorage + interceptores Axios).
- Recupero de contraseña con envío de enlace temporal y formulario de reseteo seguro.

### Gestión de usuarios

- CRUD de perfil del afiliado + cálculo de antigüedad en la obra social.
- ABM de empleados/admins y cambio de roles desde la vista Admin.
- Familiares relacionados listos para extender (`FamilyMember`).

### Turnos médicos

- Catálogo de sectores, doctores y tipos de turno.
- Grilla de turnos (`appointments`) con estados DISPONIBLE/RESERVADO/CANCELADO/COMPLETADO.
- Reserva de turnos con verificación transaccional y envío de mail automático.
- Cancelación controlada según rol/propiedad.
- Vistas dedicadas:
  - Afiliado: turnos disponibles + módulo "Mis turnos" con cancelación autogestionada.
  - Empleado/Admin: tablero con filtros por fecha, sector, estado y detalle de afiliados.
- Empleados pueden crear turnos manuales, darlos de baja y reservarlos en nombre de un afiliado desde la misma vista.

### Stock de insumos

- Modelo `stock_items` con categorías (farmacia, cirugía, etc.), mínimos y ubicaciones.
- CRUD completo vía API protegido para empleados/admins + acciones rápidas para sumar/restar existencias.
- UI con tarjetas destacando insumos bajo stock y formulario de alta rápida.
- Apariencia renovada con vidrio esmerilado, gradientes y soporte de modo claro/oscuro con toggle persistente.

### Configuración y reportes

- ABM de sectores y doctores sólo para Admin.
- Reporte de turnos por sector y rango de fechas + alerta de stock crítico.
- Endpoint `/api/reports/*` protegido para Admin.

### Correos transaccionales

- Servicio `sendAppointmentConfirmationEmail` (Nodemailer) con datos del afiliado, sector, doctor, fecha y requisitos adicionales.
- Si no configurás SMTP real, el mailer entra en **modo stub** y vuelca cada correo en consola como JSON, evitando fallos durante el desarrollo.

### Documentación y testing

- Swagger disponible en `http://localhost:4000/api/docs`.
- Tests Jest de reglas de negocio críticas (turnos y stock).

## Datos seed (credenciales demo)

| Rol      | Email                | Contraseña |
|----------|----------------------|------------|
| Admin    | admin@osmata.com     | Cambio123  |
| Empleado | empleado@osmata.com  | Cambio123  |
| Afiliado | afiliado@osmata.com  | Cambio123  |

## Endpoints destacados

- `POST /api/auth/register` · registro de afiliados.
- `POST /api/auth/login` · login con JWT.
- `POST /api/auth/password/forgot` · dispara email de recuperación.
- `POST /api/auth/password/reset` · establece la nueva contraseña.
- `GET /api/users/me` · perfil del usuario autenticado.
- `GET /api/appointments/available` · turnos libres (Afiliado).
- `POST /api/appointments/:id/reserve` · reserva y correo.
- `POST /api/appointments/:id/cancel` · libera un turno reservado (Afiliado/Staff).
- `POST /api/appointments` · crea turnos manuales (Empleado/Admin).
- `DELETE /api/appointments/:id` · da de baja un turno disponible.
- `GET /api/appointments` · tablero para Empleado/Admin.
- `GET /api/stock` · stock completo.
- `POST /api/stock/:id/adjust` · incrementa o decrementa la cantidad disponible.
- `GET /api/catalog/appointment-types` · catálogo de tipos de turno.
- `GET /api/catalog/sectors|doctors` · catálogos.
- `GET /api/reports/turnos|stock` · reportes Admin.

## Roadmap sugerido

1. Conectar SMTP real y dominio corporativo para correos.
2. Agregar tabla de movimientos de stock para históricos.
3. Integrar notificaciones push/SMS recordatorios.
4. Automatizar despliegues (Docker + CI/CD) y backups de SQLite → PostgreSQL.**

¡Listo! Con estos pasos ya podés levantar la plataforma, probar los flujos por rol y seguir iterando sobre las necesidades del Sanatorio San Cayetano.
