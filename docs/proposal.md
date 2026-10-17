# Propuesta TP DSW — Sistema de reserva de espacios

## Grupo

### Integrantes

- Mateo Nicolás Nuñez — Legajo 49200.
- Patricio Riquelme — Legajo 47539.

### Repositorios

- [Frontend](https://github.com/mateonunez1907/DSW-2026-Frontend).
- [Backend](https://github.com/Patricionrp/DSW-2026-Backend).
- [Documentación del proyecto](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/README.md).

## Tema

### Descripción

El sistema permite organizar las reservas de aulas, laboratorios y otros espacios compartidos.

Se registran usuarios, espacios y sus horarios semanales de disponibilidad. Para una fecha y un intervalo horario, se pueden consultar los espacios disponibles y realizar una reserva.

Las reservas se crean como pendientes. Luego pueden aprobarse, rechazarse o cancelarse. El backend comprueba la disponibilidad del espacio y evita superposiciones con otras reservas pendientes o aprobadas.

### Modelo de dominio

El modelo representa las entidades Usuario, Rol, Espacio, Disponibilidad, Reserva y Estado, junto con sus relaciones.

[Consultar el modelo de dominio](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/modelo-dominio.md).

### Tecnologías

- Frontend: React, TypeScript, Vite y Tailwind CSS.
- Backend: Node.js, TypeScript y Express.
- Persistencia: MySQL mediante MikroORM.
- Gestión de dependencias: npm.
- Gestión del código: Git, GitHub y pull requests.

Frontend y backend son proyectos separados y se comunican mediante una API HTTP que intercambia datos en formato JSON.

## Alcance funcional

### Regularidad

| Requisito | Funcionalidades propuestas |
|---|---|
| CRUD simple propuesto | CRUD de Espacio y CRUD de Usuario |
| CRUD dependiente | CRUD de Reserva, relacionado con Usuario, Espacio y Estado; CRUD de Disponibilidad, relacionado con Espacio |
| Listados con filtro y detalle | Espacios filtrados por disponibilidad para una fecha y horario; reservas filtradas por estado y fecha |
| Casos de uso | Realizar una reserva de espacio; aprobar o rechazar una reserva pendiente |

### Funcionamiento de los listados

**Espacios:**

1. Se ingresa una fecha y un intervalo horario.
2. Se selecciona el filtro de disponibilidad.
3. El backend devuelve los espacios que corresponden a la búsqueda.
4. Al seleccionar un espacio, se consultan sus datos y sus horarios semanales para mostrar el detalle.

**Reservas:**

1. Se selecciona un estado, una fecha o ambos filtros.
2. El backend devuelve las reservas correspondientes.
3. Al seleccionar una reserva, se muestra su detalle con los datos del usuario, el espacio y el estado.

### Precisiones de la implementación

- Disponibilidad representa una franja semanal: día de la semana, hora inicial y hora final.
- Reserva representa una solicitud para una fecha concreta y un intervalo horario.
- Las reservas pendientes y aprobadas ocupan el horario.
- Las reservas rechazadas y canceladas liberan el horario.
- Una franja semanal debe cubrir completamente el intervalo solicitado.
- La interfaz permite crear reservas, consultarlas y modificar su estado.
- La API también permite actualizar los datos y eliminar físicamente una reserva.
- La cancelación desde la interfaz conserva el registro.
- Los roles se precargan. El alta de usuario asigna por defecto el rol `usuario`.
- La autenticación y las restricciones de acceso por rol todavía no están implementadas.

Usuario fue propuesto inicialmente como CRUD simple. La implementación actual tiene una relación obligatoria con Rol, aunque su selección no se exige en el formulario de alta. Su clasificación debe confirmarse con el docente.

### Aprobación directa o en examen

| Área | Alcance previsto |
|---|---|
| CRUD | Completar la administración de las clases de negocio necesarias para el alcance final |
| Casos de uso | Registro e inicio de sesión; reserva de espacio; cancelación de reserva; aprobación o rechazo por un administrador autorizado; consulta del historial de reservas |
| Acceso | Implementar autenticación y proteger backend y frontend con al menos dos niveles de acceso |
| Tests | Incorporar los tests de backend y frontend solicitados para la etapa y documentar sus resultados |
| Configuración y entrega | Definir ambientes y completar las evidencias, el video y las condiciones de publicación de la entrega final |

La creación, cancelación y modificación de estados de reservas ya tienen una implementación inicial. Para aprobación se deberá incorporar la identidad del usuario autenticado y comprobar sus permisos.

### Alcance adicional voluntario

No se comprometen funcionalidades voluntarias adicionales para esta entrega de regularidad.

## Gestión del proyecto

El trabajo se distribuye por funcionalidades entre los dos integrantes. La coordinación se realiza principalmente por Discord y WhatsApp.

Los cambios se desarrollan en ramas y se integran mediante pull requests.

Para el cierre se utiliza un seguimiento sencillo inspirado en Kanban, con estados Pendiente, En curso y Realizado. Los avances anteriores se reconstruyen mediante commits, pull requests y los acuerdos informados por los integrantes.

- [Seguimiento de funcionalidades y errores](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/seguimiento.md).
- [Avances y minutas](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/avances-y-minutas.md).
- [Pull requests y contribuciones](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/pull-requests.md).

## Documentación complementaria

- [Instalación y ejecución](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/instalacion.md).
- [Reglas de negocio](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/reglas-negocio.md).
- [API del backend](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/api.md).

## Referencias de implementación y entrega

- [Backend: filtro de espacios por disponibilidad, PR #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11).
- [Backend: validaciones y manejo de errores, PR #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12).
- [Backend: documentación de regularidad, PR #13](https://github.com/Patricionrp/DSW-2026-Backend/pull/13).
- [Frontend: detalle de espacios y horarios, PR #7](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/7).

Estos pull requests están integrados. Los cambios posteriores se incorporarán al registro cuando se publiquen.