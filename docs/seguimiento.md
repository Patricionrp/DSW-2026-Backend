# Seguimiento de funcionalidades y errores

## Metodología y seguimiento

Durante el desarrollo el grupo trabajó de forma iterativa por funcionalidades: se repartieron tareas, se coordinaron por Discord y WhatsApp y se integraron cambios mediante ramas y pull requests.

Para el registro del cierre se organiza un tablero sencillo inspirado en Kanban, con tres estados:

- **Pendiente:** tarea identificada que todavía no se comenzó.
- **En curso:** trabajo en preparación, desarrollo o revisión.
- **Realizado:** cambio integrado, con el resultado o la evidencia correspondiente cuando aplique.

Esta organización describe el seguimiento del cierre. El historial anterior se reconstruye mediante commits, PR y los acuerdos informados por Mateo. No se afirma que el grupo haya usado un tablero formal durante todo el proyecto ni se atribuyen ceremonias de Scrum, sprints o estimaciones que no se registraron.

Cada tarea nueva debe indicar responsable, estado, criterio de aceptación y PR o commit. La revisión de avance se realiza en la coordinación del grupo. Los aportes conocidos y los pendientes se detallan en las tablas siguientes.

## Funcionalidades realizadas

| ID | Trabajo | Aportes identificados | Evidencia |
|---|---|---|---|
| F01 | CRUD inicial de Espacio | Patricio | [BE #1](https://github.com/Patricionrp/DSW-2026-Backend/pull/1) |
| F02 | CRUD inicial de Usuario | Mateo | [Commit](https://github.com/Patricionrp/DSW-2026-Backend/commit/20e818d) |
| F03 | CRUD inicial de Reserva | Mateo | [BE #2](https://github.com/Patricionrp/DSW-2026-Backend/pull/2) |
| F04 | Persistencia MySQL y catálogos | Patricio | [BE #3](https://github.com/Patricionrp/DSW-2026-Backend/pull/3) |
| F05 | CRUD de Disponibilidad | Patricio | [BE #7](https://github.com/Patricionrp/DSW-2026-Backend/pull/7) |
| F06 | Reglas de reserva y estados | Patricio y resolución de integración del grupo | [BE #8](https://github.com/Patricionrp/DSW-2026-Backend/pull/8) |
| F07 | Listado de reservas con filtros y detalle | Mateo | [BE #6](https://github.com/Patricionrp/DSW-2026-Backend/pull/6), [FE #1](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/1) |
| F08 | Crear y cancelar reservas desde la interfaz | Mateo | [FE #2](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/2), [FE #3](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/3) |
| F09 | Interfaz Tailwind, UI compartida y disponibilidades | Patricio | [FE #4](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/4) |
| F10 | Filtro efectivo de espacios | Mateo | [BE #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11) |
| F11 | Validaciones y errores del cierre | Mateo | [BE #10](https://github.com/Patricionrp/DSW-2026-Backend/pull/10), [BE #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12) |

## Correcciones realizadas

| ID | Situación | Resolución | Evidencia |
|---|---|---|---|
| B01 | Seguían repositorios en memoria sin uso tras la migración | Retirar archivos obsoletos | [BE #5](https://github.com/Patricionrp/DSW-2026-Backend/pull/5) |
| B02 | Usuarios sin validación suficiente y errores poco claros | Normalización, email único y errores controlados | [BE #10](https://github.com/Patricionrp/DSW-2026-Backend/pull/10) |
| B03 | Búsqueda de disponibilidad devolvía todos los espacios | Aplicar franjas y reservas bloqueantes | [BE #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11) |
| B04 | Fechas inexistentes y mensajes internos en respuestas | Validación de calendario y manejo de errores | [BE #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12) |

## Cierre documental y funcional

| ID | Trabajo | Estado al preparar los archivos | Criterio de cierre |
|---|---|---|---|
| C01 | Detalle de espacios con consulta y horarios | Realizado e integrado | [FE #7](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/7); finalización informada por Mateo y código revisado |
| C02 | Propuesta, modelos, README y documentación | Documentación en preparación para publicar | Archivos en main y enlaces accesibles |
| C03 | Registro de coordinación del equipo | Minutas retrospectivas preparadas con información real de Mateo | Revisar y publicar el registro; agregar la coordinación final cuando ocurra |
| C04 | Comprobación visual en breakpoints | Pendiente de evidencia específica | Revisar tamaños y registrar resultado |
| C05 | Comprobación de instalación y persistencia | Pendiente de evidencia específica | Seguir los README y comprobar datos tras reinicio |
| C06 | Validación de clasificación de Usuario | Pendiente de confirmación docente | Acordar su consideración como CRUD simple con Rol precargado |

## Backlog conocido

| ID | Trabajo | Etapa / criterio |
|---|---|---|
| P01 | Uniformar validación de IDs de URL y cuerpos en todos los recursos | Mejora de validaciones; Usuarios ya tiene control de ID |
| P02 | Definir validaciones de tamaño de textos y límites compatibles con columnas | Mejora de datos y mensajes |
| P03 | Definir política para modificar horarios con reservas existentes | Acuerdo de negocio y futura implementación |
| P04 | Resolver concurrencia al registrar dos reservas al mismo tiempo | Evolución de consistencia |
| A01 | Login y permisos efectivos por rol | Aprobación |
| A02 | CRUD de roles y alcance final acordado | Aprobación |
| A03 | Tests de backend y frontend | Aprobación |
| A04 | Ambientes y configuración de despliegue | Aprobación |
| A05 | Evidencias automáticas, video y entrega final | Aprobación |

## Issues

- [Issues del backend](https://github.com/Patricionrp/DSW-2026-Backend/issues).
- [Issues del frontend](https://github.com/mateonunez1907/DSW-2026-Frontend/issues).

En la consulta del 16/10/2026 no se encontraron issues de tareas. Los IDs de esta página son identificadores del seguimiento Markdown, no números de GitHub.

El paquete de cierre incluye borradores de issues para registrar el trabajo pendiente desde ahora. No deben backdatearse ni presentarse como tickets que existían durante todo el desarrollo.

C01 está integrado. Actualizar C02–C06 al cerrarlos, con los PR o registros que realmente se generen.
