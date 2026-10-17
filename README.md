# DSW 2026 — Backend de reserva de espacios

Backend del Trabajo Práctico Integrador de Desarrollo de Software. Permite gestionar usuarios, espacios, disponibilidades semanales y reservas.

## Integrantes

- Mateo Nicolás Nuñez — Legajo 49200.
- Patricio Riquelme — Legajo 47539.

## Tecnologías

- Node.js y TypeScript.
- Express.
- MikroORM.
- MySQL.
- npm.

## Requisitos previos

- Git.
- Node.js 24.x.
- npm.
- MySQL Server en ejecución.
- Una cuenta de MySQL con permisos para consultar, modificar y crear tablas en la base utilizada por el proyecto.

## Instalación

### 1. Descargar el proyecto

```bash
git clone https://github.com/Patricionrp/DSW-2026-Backend.git
cd DSW-2026-Backend
npm ci
```

### 2. Crear la base de datos

Desde un cliente conectado a MySQL, ejecutar:

```sql
CREATE DATABASE IF NOT EXISTS reservaEspacios CHARACTER SET utf8mb4;
```

La base debe existir antes de iniciar el backend.

### 3. Configurar la conexión

En la carpeta del backend, copiar el archivo de configuración de ejemplo:

```bash
cp .env.example .env
```

Completar `.env` con los datos de la instalación local:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reservaEspacios
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contrasena_mysql
```

Reemplazar `tu_usuario_mysql` y `tu_contrasena_mysql` por las credenciales correspondientes.

El archivo `.env` está excluido del repositorio.

### 4. Iniciar el backend

```bash
npm run start:dev
```

El proceso compila TypeScript e inicia el servidor en:

[http://localhost:3000/](http://localhost:3000/)

Durante el inicio, MikroORM actualiza las tablas y se cargan los roles y estados iniciales que falten.

Para instrucciones adicionales y problemas frecuentes, consultar la [guía de instalación del sistema](docs/instalacion.md).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Compila e inicia el servidor, siguiendo los cambios del código |
| `npm run build` | Compila TypeScript y genera los archivos de la carpeta `dist` |

Todavía no hay tests automáticos implementados. El script `npm test` conserva el marcador inicial del proyecto.

## Recursos de la API

- `/api/usuarios`
- `/api/espacios`
- `/api/disponibilidades`
- `/api/reservas`
- `/api/estados`

La referencia de endpoints y ejemplos está en la [documentación de la API](docs/api.md).

## Ejecutar el sistema completo

Con MySQL y el backend funcionando, iniciar el [frontend](https://github.com/mateonunez1907/DSW-2026-Frontend) siguiendo las instrucciones de su README.

La dirección habitual del frontend es:

[http://localhost:5173/](http://localhost:5173/)

## Documentación

Consultar el [índice de documentación](docs/README.md).

Incluye la propuesta, el modelo de dominio, las instrucciones de instalación, los pull requests, las minutas, el seguimiento, las reglas de negocio y la referencia de la API.

## Estado de la entrega

La entrega actual corresponde a regularidad y se ejecuta en un entorno de desarrollo.

Los datos se almacenan en MySQL. Los roles están modelados y precargados, pero la autenticación y la autorización por roles todavía no están implementadas.