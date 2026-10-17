# DSW 2026 — Backend de reserva de espacios

API del Trabajo Práctico Integrador de Desarrollo de Software. Permite gestionar usuarios, espacios, horarios semanales y reservas.

- [Frontend](https://github.com/mateonunez1907/DSW-2026-Frontend)
- [Documentación del proyecto](docs/README.md)
- [Propuesta](docs/proposal.md)
- [Modelo de dominio](docs/modelo-dominio.md)

## Tecnologías

Node.js, TypeScript, Express, MikroORM, MySQL y npm.

## Requisitos

- Git.
- Node.js 24.x como versión común recomendada para los dos repositorios. En la preparación de esta entrega se identificó Node.js 26.5.0 en la computadora de desarrollo.
- npm.
- MySQL Server en ejecución y una base de datos accesible por red.
- Un usuario de MySQL con permisos sobre esa base para consultar, modificar y crear/actualizar tablas.

La versión instalada de MikroORM requiere Node.js 22.17 o posterior. No usar el requisito anterior de Node.js 20 del README inicial.

## Instalación

```bash
git clone https://github.com/Patricionrp/DSW-2026-Backend.git
cd DSW-2026-Backend
npm ci
```

Crear la base en MySQL, con una cuenta que tenga permisos:

```sql
CREATE DATABASE IF NOT EXISTS reservaEspacios CHARACTER SET utf8mb4;
```

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Completar `.env` con los datos reales de la instalación:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reservaEspacios
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contrasena_mysql
```

`DB_USER` y `DB_PASSWORD` son valores a reemplazar, no credenciales incluidas en el proyecto. El archivo `.env` queda fuera de Git.

Para crear un usuario dedicado o resolver problemas de conexión, consultar la [guía completa de instalación](docs/instalacion.md).

## Ejecutar en desarrollo

```bash
npm run start:dev
```

El proceso compila TypeScript y arranca el servidor. Abrir:

- Comprobación básica: http://localhost:3000/
- Usuarios: http://localhost:3000/api/usuarios
- Espacios: http://localhost:3000/api/espacios
- Estados de reserva: http://localhost:3000/api/estados

Al iniciar, la aplicación actualiza las tablas mediante MikroORM y carga los catálogos de roles y estados que falten. La base de datos debe existir previamente. Los catálogos se cargan automáticamente; no hay que ejecutar un comando separado de seed.

## Scripts

| Comando | Función |
|---|---|
| `npm run start:dev` | Compilar y ejecutar con seguimiento de cambios |
| `npm run build` | Compilar el backend en `dist` |

El script `npm test` todavía es el marcador inicial del proyecto: no ejecuta una suite de tests. Las comprobaciones manuales se describen en la documentación.

## Usar el sistema completo

Con este servidor funcionando, iniciar el frontend en otra terminal siguiendo su README. El navegador se abre normalmente en http://localhost:5173/.

## Documentación

La entrada es [docs/README.md](docs/README.md). Incluye reglas de negocio, modelos, API, seguimiento, avances y alcance de regularidad.

La entrega actual es académica y se ejecuta en desarrollo. Los roles están modelados, pero el login y la autorización por roles corresponden a una etapa posterior.
