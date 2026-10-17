# API del backend

Referencia de la implementación de regularidad. URL base de desarrollo: `http://localhost:3000`.

La API recibe y devuelve JSON. En peticiones con cuerpo, enviar `Content-Type: application/json` y una línea vacía antes del cuerpo si se utiliza REST Client.

## Respuestas

Éxito con datos:

```json
{
  "data": {}
}
```

Los listados devuelven un arreglo dentro de `data`. Las operaciones de escritura pueden agregar `message`.

Error:

```json
{
  "message": "Descripción del problema"
}
```

| Código | Uso |
|---|---|
| 200 | Consulta o modificación realizada |
| 201 | Registro creado |
| 400 | Entrada o solicitud inválida |
| 404 | Registro o ruta inexistente |
| 409 | Conflicto de negocio, duplicado o relación que impide una operación, según el controlador |
| 500 | Error inesperado, informado con un mensaje controlado |

## Recursos

| Recurso | GET colección | GET por ID | POST | PUT / PATCH por ID | DELETE por ID |
|---|---|---|---|---|---|
| Usuarios | `/api/usuarios` | `/api/usuarios/:id` | `/api/usuarios` | `/api/usuarios/:id` | `/api/usuarios/:id` |
| Espacios | `/api/espacios` | `/api/espacios/:id` | `/api/espacios` | `/api/espacios/:id` | `/api/espacios/:id` |
| Disponibilidades | `/api/disponibilidades` | `/api/disponibilidades/:id` | `/api/disponibilidades` | `/api/disponibilidades/:id` | `/api/disponibilidades/:id` |
| Reservas | `/api/reservas` | `/api/reservas/:id` | `/api/reservas` | `/api/reservas/:id` | `/api/reservas/:id` |

`GET /api/estados` devuelve el catálogo de estados. `GET /` devuelve el texto de comprobación del backend.

No hay endpoints de login ni un CRUD público de roles en esta entrega.

## Usuario

Cuerpo de alta:

```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "email": "ana@example.com"
}
```

Opcionalmente la API admite `rol` como ID numérico de un rol existente. Si se omite, asigna el rol denominado `usuario`.

Nombre, apellido y email son obligatorios en POST y PUT. PATCH admite campos parciales. El email se normaliza y no puede repetirse. La respuesta incluye el rol relacionado.

## Espacio

```json
{
  "nombre": "Aula de ejemplo",
  "tipo": "aula",
  "capacidad": 30,
  "descripcion": "Espacio para actividades grupales"
}
```

Nombre y tipo deben ser textos no vacíos; la capacidad debe ser un entero positivo. La descripción es opcional. POST y PUT exigen los datos completos obligatorios; PATCH permite modificar campos individuales.

### Filtro de disponibilidad

```http
GET http://localhost:3000/api/espacios?disponibilidad=disponibles&fecha=2026-10-19&horaInicio=10:00:00&horaFin=11:00:00
```

| Parámetro | Valores |
|---|---|
| disponibilidad | `todos`, `disponibles`, `no_disponibles` |
| fecha | `AAAA-MM-DD` |
| horaInicio | `HH:mm:ss` |
| horaFin | `HH:mm:ss` |

Si se omite disponibilidad o se utiliza todos, se devuelve el conjunto de espacios. Los otros modos requieren fecha y horas válidas.

## Disponibilidad

Reemplazar el ID 2 por el de un espacio existente:

```json
{
  "espacio": 2,
  "diaSemana": 1,
  "horaInicio": "09:00:00",
  "horaFin": "12:00:00"
}
```

El día 1 es lunes. El día debe estar entre 0 y 6; las horas deben tener formato válido y la hora final debe superar a la inicial.

Los listados y detalles incluyen los datos del espacio asociado.

## Reserva

Reemplazar los IDs por registros existentes:

```json
{
  "usuario": 1,
  "espacio": 2,
  "fecha": "2026-10-19",
  "horaInicio": "10:00:00",
  "horaFin": "11:00:00"
}
```

El backend asigna pendiente al crearla. Comprueba usuario, espacio, fecha, formato horario, disponibilidad y reservas superpuestas.

En el cuerpo se usan `usuario` y `espacio`, no `usuarioId` ni `espacioId`.

### Consultas

```http
GET http://localhost:3000/api/reservas

###
GET http://localhost:3000/api/reservas?estado=pendiente

###
GET http://localhost:3000/api/reservas?fecha=2026-10-19

###
GET http://localhost:3000/api/reservas?estado=pendiente&fecha=2026-10-19

###
GET http://localhost:3000/api/reservas/1
```

Los resultados de reserva incluyen las relaciones usuario, espacio y estado.

### Cambiar estado

Primero consultar `GET /api/estados` y obtener el ID que corresponda al nombre deseado.

```http
PATCH http://localhost:3000/api/reservas/1
Content-Type: application/json

{
  "estado": 2
}
```

El número 2 es ilustrativo. Utilizar el ID real del catálogo de la instalación.

Las transiciones admitidas se describen en [reglas de negocio](reglas-negocio.md). La actualización también admite usuario, espacio, fecha y horas, respetando las validaciones actuales y el estado de la reserva.

### Eliminar

`DELETE /api/reservas/:id` elimina físicamente la reserva. La cancelación de la interfaz se realiza mediante PATCH de estado y conserva el registro.

## Validaciones y límites

Los controles implementados no son idénticos en todos los recursos. Por ejemplo, Usuarios valida expresamente el ID de la URL; otros controladores todavía convierten el parámetro con `Number.parseInt`. Hay seguimiento de esa uniformidad en [seguimiento](seguimiento.md).

La aplicación no usa autenticación ni autorización en esta etapa. No se debe presentar la presencia de Rol como prueba de protección de estos endpoints.

## Ejemplos existentes

Los archivos `src/usuario/usuario.http`, `src/espacio/espacio.http`, `src/disponibilidad/disponibilidad.http` y `src/reserva/reserva.http` contienen solicitudes manuales. Sus IDs y fechas se adaptan a la base local; no son una suite automatizada.
