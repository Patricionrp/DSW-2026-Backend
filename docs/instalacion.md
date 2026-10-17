# Instalación y ejecución del sistema

## 1. Requisitos

- Git, Node.js y npm.
- Node.js 24.x es una versión común recomendada para ambos proyectos. La versión de MikroORM instalada exige Node.js 22.17 o posterior.
- MySQL Server en ejecución. Instalar únicamente un cliente gráfico no pone en marcha el servidor.
- Una cuenta MySQL con permisos para crear la base y otra, o la misma, con permisos de lectura, escritura y modificación del esquema de la base del TP.
- Dos terminales, una para cada aplicación.

Los comandos de terminal se ejecutan en la carpeta indicada. Los comandos SQL se ejecutan dentro de un cliente conectado a MySQL.

## 2. Descargar el backend

```bash
git clone https://github.com/Patricionrp/DSW-2026-Backend.git
cd DSW-2026-Backend
npm ci
```

`npm ci` instala las versiones registradas en el lockfile. Para trabajar en el proyecto se usa npm.

## 3. Preparar MySQL

Iniciar MySQL con la herramienta utilizada durante su instalación. El proyecto no inicia el servicio de MySQL.

Abrir una sesión con una cuenta administradora, por ejemplo:

```bash
mysql -u root -p
```

Introducir la contraseña local cuando la solicite el cliente. En instalaciones de macOS donde el ejecutable no esté en PATH, puede encontrarse en `/usr/local/mysql/bin/mysql`.

Dentro del cliente SQL:

```sql
CREATE DATABASE IF NOT EXISTS reservaEspacios CHARACTER SET utf8mb4;
```

### Usuario dedicado opcional

Si se quiere utilizar una cuenta específica del TP, ejecutar con la cuenta administradora, reemplazando la contraseña de ejemplo:

```sql
CREATE USER 'dsw_app'@'localhost' IDENTIFIED BY 'REEMPLAZAR_CONTRASENA_LOCAL';
GRANT ALL PRIVILEGES ON reservaEspacios.* TO 'dsw_app'@'localhost';
```

La aplicación actualiza las tablas al iniciar, por eso requiere permisos para modificar el esquema de esta base además de leer y escribir registros. Si el usuario ya existe, utilizar sus credenciales vigentes o administrarlo desde MySQL.

Para salir del cliente:

```sql
EXIT;
```

## 4. Configurar el backend

En la carpeta del backend:

```bash
cp .env.example .env
```

Editar `.env`. Para el ejemplo del usuario dedicado:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reservaEspacios
DB_USER=dsw_app
DB_PASSWORD=REEMPLAZAR_CONTRASENA_LOCAL
```

La contraseña debe coincidir con la configurada en MySQL. Se puede utilizar otra cuenta con los permisos necesarios.

El proyecto lee el archivo mediante `process.loadEnvFile()`. `.env` no se sube al repositorio.

## 5. Iniciar el backend

```bash
npm run start:dev
```

Esperar la compilación y el mensaje de escucha en http://localhost:3000/.

Durante el inicio:

1. Se establece la conexión con MySQL.
2. Se actualiza el esquema de tablas.
3. Se agregan los roles y estados que falten.
4. Se habilita el puerto 3000.

Si falla la conexión, el servidor no llega a escuchar solicitudes. No se debe interpretar la compilación correcta como confirmación de conexión a la base.

## 6. Descargar e iniciar el frontend

En una segunda terminal, desde la carpeta donde se quieran guardar los repositorios:

```bash
git clone https://github.com/mateonunez1907/DSW-2026-Frontend.git
cd DSW-2026-Frontend
npm ci
npm run dev
```

Abrir la dirección informada por Vite, normalmente http://localhost:5173/.

El proxy de desarrollo reenvía `/api` al backend en el puerto 3000.

## 7. Cargar los primeros datos

1. En **Usuarios**, crear una persona con nombre, apellido y email.
2. En **Espacios**, crear un lugar con nombre, tipo y capacidad positiva.
3. En **Disponibilidades**, asociar al espacio un día semanal y un intervalo.
4. En **Reservas**, seleccionar usuario y espacio y elegir una fecha que corresponda al día habilitado.
5. Crear la reserva para un horario dentro de la franja configurada.
6. Consultar su detalle y utilizar las acciones de estado disponibles.

Los catálogos se precargan, pero los datos anteriores no se generan solos. No se debe asumir que los IDs de estados o de otras entidades valgan 1, 2, 3 o 4.

## 8. Compilación

Backend:

```bash
npm run build
```

Frontend, desde su propia carpeta:

```bash
npm run build
```

Estos comandos comprueban la compilación. No sustituyen una prueba funcional ni ejecutan los tests automáticos solicitados para aprobación.

## 9. Problemas frecuentes

| Problema | Qué revisar |
|---|---|
| Vite muestra ECONNREFUSED para /api | Que el backend haya iniciado y escuche en 3000 |
| Error de acceso a MySQL | Usuario, contraseña, host y permisos de `.env` |
| Base desconocida | Crear `reservaEspacios` o corregir `DB_NAME` |
| No aparece ningún espacio disponible | Cargar un horario semanal que cubra la búsqueda y comprobar reservas bloqueantes |
| Usuario o espacio no encontrado | Consultar sus IDs actuales y enviarlos como números en el JSON |
| Email duplicado | Utilizar otra dirección o editar el usuario existente |
| No permite borrar usuario o espacio | Hay registros relacionados que impiden la eliminación |
| REST Client interpreta la llave como un encabezado | Dejar una línea vacía entre los encabezados y el cuerpo JSON |
| No encuentra `process.loadEnvFile` | Utilizar una versión compatible de Node.js |
| El puerto 5173 cambia | Usar la URL indicada por Vite; el puerto 3000 del backend permanece fijo |

## 10. Datos y modos de ejecución

Los datos se conservan en MySQL al reiniciar el backend. La interfaz mantiene su estado visual en React y vuelve a consultar la API al cargar cada sección.

El procedimiento descrito corresponde a desarrollo. La entrega no incluye un despliegue configurado ni un proceso de migraciones de producción.
