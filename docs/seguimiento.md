# Seguimiento de funcionalidades y errores

## Organización del trabajo

El grupo trabajó por funcionalidades, repartiendo tareas entre Mateo y Patricio. La coordinación se realizó principalmente por Discord y WhatsApp.

Los cambios se desarrollaron en ramas y se integraron mediante pull requests.

Para organizar el cierre se utiliza un seguimiento sencillo inspirado en Kanban:

- **Pendiente:** tarea identificada que todavía no se comenzó.
- **En curso:** tarea en preparación, desarrollo o revisión.
- **Realizado:** tarea terminada e integrada.

Los avances anteriores se reconstruyen mediante commits, pull requests y los acuerdos informados por los integrantes.

## Funcionalidades realizadas

En las referencias, BE corresponde al backend y FE al frontend.

| ID | Funcionalidad | Aportes identificados | Evidencia |
|---|---|---|---|
| F01 | CRUD inicial de Espacio | Patricio | [BE #1](https://github.com/Patricionrp/DSW-2026-Backend/pull/1) |
| F02 | CRUD inicial de Usuario | Mateo | [Commit de Usuario](https://github.com/Patricionrp/DSW-2026-Backend/commit/20e818d) |
| F03 | CRUD inicial de Reserva | Mateo | [BE #2](https://github.com/Patricionrp/DSW-2026-Backend/pull/2) |
| F04 | Persistencia con MySQL y catálogos iniciales | Patricio | [BE #3](https://github.com/Patricionrp/DSW-2026-Backend/pull/3) |
| F05 | CRUD de Disponibilidad | Patricio | [BE #7](https://github.com/Patricionrp/DSW-2026-Backend/pull/7) |
| F06 | Reglas de disponibilidad, superposición y estados | Patricio, con integración del grupo | [BE #8](https://github.com/Patricionrp/DSW-2026-Backend/pull/8) |
| F07 | Filtros de reservas y acciones de aprobación y rechazo | Mateo | [BE #6](https://github.com/Patricionrp/DSW-2026-Backend/pull/6), [FE #1](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/1) |
| F08 | Creación y cancelación de reservas desde el frontend | Mateo | [FE #2](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/2), [FE #3](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/3) |
| F09 | Interfaz con Tailwind, componentes compartidos y gestión de disponibilidades | Patricio | [FE #4](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/4) |
| F10 | Filtro de espacios por disponibilidad | Mateo | [BE #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11) |
| F11 | Validaciones y manejo de errores | Mateo | [BE #10](https://github.com/Patricionrp/DSW-2026-Backend/pull/10), [BE #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12) |
| F12 | Detalle de espacios con consulta a la API y horarios semanales | Mateo | [FE #7](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/7) |
| F13 | Publicación inicial de la documentación del backend | Mateo | [BE #13](https://github.com/Patricionrp/DSW-2026-Backend/pull/13) |

## Correcciones realizadas

| ID | Problema | Resolución | Evidencia |
|---|---|---|---|
| B01 | Permanecían repositorios en memoria sin uso después de integrar MySQL | Se retiraron los archivos obsoletos | [BE #5](https://github.com/Patricionrp/DSW-2026-Backend/pull/5) |
| B02 | Faltaban controles de datos de usuarios y mensajes claros ante conflictos | Se incorporaron validaciones y respuestas controladas | [BE #10](https://github.com/Patricionrp/DSW-2026-Backend/pull/10) |
| B03 | El filtro de disponibilidad devolvía todos los espacios | Se aplicaron las franjas semanales y las reservas que ocupan horario | [BE #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11) |
| B04 | Se admitían fechas inexistentes y algunos errores exponían información interna | Se mejoró la validación de fechas y el manejo de errores | [BE #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12) |

## Cierre de regularidad

| ID | Trabajo | Estado | Evidencia |
|---|---|---|---|
| C01 | Detalle de espacios con consulta y horarios | Realizado | Integrado mediante FE #7 |
| C02 | Documentación de regularidad | Publicada | Documentación disponible en ambos repositorios y propuesta externa actualizada |
| C03 | Registro de coordinación del equipo | Publicado | Acuerdos y avances registrados en avances-y-minutas.md |
| C04 | Visualización en distintos tamaños de pantalla | Verificada manualmente | Revisión de la interfaz en los tamaños requeridos |
| C05 | Ejecución local del sistema | Comprobada durante el desarrollo | Backend, MySQL y frontend ejecutados; operaciones principales comprobadas manualmente |

## Trabajo previsto para AD

| ID | Trabajo | Estado |
|---|---|---|
| A01 | Implementar autenticación y permisos por rol | Pendiente |
| A02 | Completar los CRUD necesarios para el alcance final | Pendiente |
| A03 | Incorporar tests automáticos de backend y frontend | Pendiente |
| A04 | Definir ambientes y preparar la publicación del sistema | Pendiente |
| A05 | Completar las evidencias de tests, el video y la entrega final | Pendiente |

## Issues y referencias

- [Issues del backend](https://github.com/Patricionrp/DSW-2026-Backend/issues).
- [Issues del frontend](https://github.com/mateonunez1907/DSW-2026-Frontend/issues).
- [Registro de pull requests y contribuciones](pull-requests.md).

Los identificadores F, B, C, P y A pertenecen a estas tablas. No son números de issues de GitHub.

Al completar una tarea, se actualizará su estado y se agregará el enlace al issue, commit, pull request o registro correspondiente.
