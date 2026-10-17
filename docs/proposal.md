# Propuesta TP DSW — Sistema de reserva de espacios

## Grupo

### Integrantes

- **49200 — Nuñez, Mateo Nicolás**
- **47539 — Riquelme, Patricio**

### Repositorios

- [Frontend app](https://github.com/mateonunez1907/DSW-2026-Frontend)
- [Backend app](https://github.com/Patricionrp/DSW-2026-Backend)
- [Documentación](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/README.md)

## Tema

### Descripción

El sistema permite organizar las reservas de aulas, laboratorios y otros espacios compartidos.
Se registran usuarios, espacios y sus horarios semanales de atención.
Para una fecha y un intervalo horario, se consulta qué espacios pueden reservarse.
Las reservas quedan pendientes y luego pueden aprobarse, rechazarse o cancelarse, evitando superposiciones entre reservas que ocupan el mismo espacio.

### Modelo

- [Modelo de dominio y relaciones](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/modelo-dominio.md)
- [Modelo de datos](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/modelo-datos.md)

El modelo se presenta con Mermaid en Markdown.

### Tecnologías

- Frontend: React, TypeScript, Vite y Tailwind CSS.
- Backend: Node.js, TypeScript y Express.
- Persistencia: MySQL mediante MikroORM.
- Gestión del código y revisión: Git, GitHub y pull requests.

TypeScript se compila a JavaScript. Frontend y backend son proyectos separados y se comunican mediante una API HTTP con JSON.

## Alcance funcional

### Alcance mínimo — Regularidad

| Requisito | Detalle |
|---|---|
| CRUD simple propuesto | 1. CRUD Espacio.<br>2. CRUD Usuario. |
| CRUD dependiente | 1. CRUD Reserva, relacionado con Usuario, Espacio y Estado.<br>2. CRUD Disponibilidad, relacionado con Espacio. |
| Listado con filtro y detalle | 1. Espacios filtrados por disponibilidad para fecha y horario, con acceso al detalle del espacio.<br>2. Reservas filtradas por estado y fecha, con detalle que reúne los datos de la reserva, del usuario y del espacio. |
| CUU / Epic | 1. Realizar una reserva de espacio.<br>2. Aprobar o rechazar una reserva pendiente. |

#### Precisiones del alcance

- Disponibilidad define horarios semanales: día de la semana, hora inicial y hora final.
- Reserva define una fecha concreta, un horario y las relaciones con usuario y espacio.
- Pendiente y aprobada ocupan el horario. Rechazada y cancelada lo liberan.
- La interfaz permite crear y consultar reservas y modificar su estado. La API también dispone de actualización de datos y eliminación física de reservas. La cancelación de la interfaz conserva el registro.
- El usuario recibe por defecto el rol precargado `usuario`. Actualmente existe una referencia obligatoria a Rol, aunque el alta del frontend no exige seleccionarlo. La clasificación de Usuario como CRUD simple proviene del alcance original; debe validarse con el docente frente a la definición estricta de CRUD simple de la FAQ.
- El detalle de espacios consulta al backend los datos del espacio y sus horarios semanales relacionados. El ajuste está integrado en el [PR #7 del frontend](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/7).

### Adicionales para aprobación

| Requisito | Alcance previsto |
|---|---|
| CRUD | Completar la administración de Roles y de las clases de negocio que requiera el alcance final. |
| CUU / Epic | 1. Registro e inicio de sesión.<br>2. Reserva de espacio.<br>3. Cancelación de reserva.<br>4. Aprobación o rechazo por un administrador autorizado.<br>5. Consulta del historial de reservas. |
| Acceso | Implementar autenticación y proteger API e interfaz con al menos dos niveles de acceso. |
| Calidad | Incorporar los tests de backend y frontend correspondientes a la etapa y documentar sus resultados. |
| Entrega | Completar ambientes, documentación de API, video y los requisitos de publicación que confirme la cátedra para aprobación. |

La reserva, la cancelación y los cambios de estado ya cuentan con una implementación inicial. El acceso autenticado y la comprobación de permisos todavía no están implementados.

### Alcance adicional voluntario

No se comprometen funcionalidades voluntarias adicionales para esta entrega de regularidad.

## Implementación y reglas

- [Reglas de negocio y casos de uso](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/reglas-negocio.md)
- [Arquitectura](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/arquitectura.md)
- [Instalación](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/instalacion.md)

## Gestión y evidencia

El trabajo se desarrolla por funcionalidades, con ramas y revisión mediante pull requests. El seguimiento documental del cierre utiliza un tablero sencillo inspirado en Kanban, con estados Pendiente, En curso y Realizado. El registro combina avances verificables por commits y PR con la reconstrucción de acuerdos reales de coordinación por Discord y WhatsApp, informados al preparar la entrega. Se aclara cuando no se registró la fecha exacta de una conversación.

- [Seguimiento](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/seguimiento.md)
- [Avances y minutas](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/avances-y-minutas.md)
- [PR del backend](https://github.com/Patricionrp/DSW-2026-Backend/pulls?q=is%3Apr)
- [PR del frontend](https://github.com/mateonunez1907/DSW-2026-Frontend/pulls?q=is%3Apr)
- [Relación de PR y aportes](https://github.com/Patricionrp/DSW-2026-Backend/blob/main/docs/pull-requests.md)

## Referencias de entrega

- [Backend: último cierre de validaciones, PR #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12)
- [Backend: filtro por disponibilidad, PR #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11)
- [Frontend: detalle con consulta y horarios, PR #7](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/7)

Los PR anteriores ya están integrados. Los PR de documentación deben agregarse al registro una vez publicados.
