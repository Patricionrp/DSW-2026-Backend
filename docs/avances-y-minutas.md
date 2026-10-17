# Registro de avances y minutas

## Naturaleza del registro

Los avances anteriores se reconstruyen a partir de commits y PR. No representan actas de reuniones cuya realización no se registró.

Los acuerdos funcionales siguientes fueron informados durante el seguimiento del proyecto y coinciden con el código: usar npm, distribuir el trabajo entre los dos integrantes, priorizar regularidad, usar disponibilidades semanales y reservar para fechas concretas.

## Registro retrospectivo de avances

| Fecha o período | Avance comprobable | Evidencia |
|---|---|---|
| 20–21/09/2026 | Inicio del backend y CRUD de Espacio | [BE #1](https://github.com/Patricionrp/DSW-2026-Backend/pull/1) |
| 02–08/10/2026 | CRUD de Usuario, uso de npm y Reserva dependiente | [Usuario](https://github.com/Patricionrp/DSW-2026-Backend/commit/20e818d), [BE #2](https://github.com/Patricionrp/DSW-2026-Backend/pull/2) |
| 07–13/10/2026 | Inicio de React y operaciones de usuarios; primeras pantallas de espacios | [Historial del frontend](https://github.com/mateonunez1907/DSW-2026-Frontend/commits/main/) |
| 12–14/10/2026 | Integración de MySQL y MikroORM, catálogos y Disponibilidad | [BE #3](https://github.com/Patricionrp/DSW-2026-Backend/pull/3), [BE #7](https://github.com/Patricionrp/DSW-2026-Backend/pull/7) |
| 14–15/10/2026 | Filtros de reserva, reglas de superposición y transiciones | [BE #6](https://github.com/Patricionrp/DSW-2026-Backend/pull/6), [BE #8](https://github.com/Patricionrp/DSW-2026-Backend/pull/8) |
| 15–16/10/2026 | Creación y acciones de reservas en frontend, Tailwind y UI compartida | [FE #1](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/1), [FE #4](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/4) |
| 16/10/2026 | Filtro efectivo de espacios, detalle inicial y validaciones | [BE #11](https://github.com/Patricionrp/DSW-2026-Backend/pull/11), [BE #12](https://github.com/Patricionrp/DSW-2026-Backend/pull/12), [FE #6](https://github.com/mateonunez1907/DSW-2026-Frontend/pull/6) |

## Decisiones de diseño registradas al cierre

| Decisión | Aplicación |
|---|---|
| npm como gestor común | Ambos repositorios tienen package-lock.json |
| Persistencia externa mediante mapper | MySQL y MikroORM |
| Disponibilidad semanal | Día 0–6 e intervalo horario |
| Reserva concreta | Fecha e intervalo asociados a usuario y espacio |
| Estados iniciales | Pendiente, aprobada, rechazada, cancelada |
| Prioridad de regularidad | Autenticación, permisos y tests automáticos se planifican para aprobación |
| CSS actual | Tailwind, integrado por el grupo en el frontend |


## Minuta retrospectiva — Inicio y reparto de trabajo


**Período:** inicio del desarrollo. Los commits iniciales del backend son de septiembre de 2026; no se registró el día exacto de la coordinación.

**Canales habituales:** Discord y WhatsApp. Las reuniones se realizaban generalmente de noche, por ser el horario cómodo para ambos.

**Participantes:** Mateo Nicolás Nuñez y Patricio Riquelme.

**Temas y acuerdos recuperados:**

1. Patricio creó el repositorio e inició el boilerplate tomando como referencia los videos de la cátedra.
2. Patricio comenzó el CRUD de Espacio.
3. Mateo comenzó el CRUD de Usuario.
4. Se acordó usar npm como gestor de paquetes.
5. El trabajo posterior se distribuyó por funcionalidades y se integró mediante GitHub.

**Evidencia de implementación:**

- [CRUD inicial de Espacio, PR #1](https://github.com/Patricionrp/DSW-2026-Backend/pull/1).
- [CRUD inicial de Usuario](https://github.com/Patricionrp/DSW-2026-Backend/commit/20e818d).

## Registro de coordinación — Unificación de dependencias

**Período:** durante el desarrollo inicial, con una corrección registrada en Git el 06/10/2026. No se conservó la fecha exacta del intercambio.

**Participantes:** Mateo Nicolás Nuñez y Patricio Riquelme.

**Situación:** aunque se había acordado npm, Mateo continuó utilizando pnpm durante parte del trabajo. Fue necesario unificar la gestión de dependencias con npm para integrar el proyecto.

**Acuerdo aplicado:** utilizar npm como gestor común y mantener su lockfile.

**Evidencia:** [Unificar la gestión de dependencias con npm, commit aac1acb](https://github.com/Patricionrp/DSW-2026-Backend/commit/aac1acb).

## Continuidad del reparto

El historial y el seguimiento del proyecto permiten reconstruir la continuidad:

- Mateo desarrolló el CRUD inicial de Usuario y Reserva, el inicio del frontend y el flujo de usuarios y reservas, filtros y validaciones.
- Patricio desarrolló el inicio de Espacio, la integración de persistencia, Disponibilidad, reglas iniciales de reservas y la reorganización visual y de servicios del frontend.
- Ambos participaron de la integración mediante ramas, resolución de cambios y PR.

Esta lista describe contribuciones comprobables; no se presenta como la transcripción de una única reunión posterior.

