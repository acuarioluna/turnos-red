# Propuesta de módulo de pacientes y turnos

## Objetivo

Este documento presenta una propuesta conceptual para incorporar la gestión de pacientes y la asignación de turnos médicos al proyecto TurnosRed.

La propuesta organiza las responsabilidades siguiendo principios de Clean Architecture:

- Las rutas reciben las solicitudes HTTP.
- Los controladores interpretan la solicitud y devuelven la respuesta.
- Los servicios contienen la lógica de negocio.
- Los modelos representan los datos.
- La persistencia se mantiene separada de la lógica principal.

## Modelado de datos

### Entidad Paciente

Un paciente representa a la persona que solicita atención médica.

Los datos mínimos propuestos son:

- `id`: identificador numérico único.
- `dni`: documento del paciente.
- `nombre`: nombre.
- `apellido`: apellido.
- `fechaNacimiento`: fecha de nacimiento.
- `telefono`: número de contacto.
- `email`: correo electrónico.
- `direccion`: domicilio opcional.

```typescript
export interface Paciente {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion?: string;
}
```

Ejemplo de paciente:

```json
{
  "id": 1,
  "dni": "30111222",
  "nombre": "Laura",
  "apellido": "Martínez",
  "fechaNacimiento": "1988-04-12",
  "telefono": "1123456789",
  "email": "laura.martinez@email.com",
  "direccion": "Av. Belgrano 123"
}
```

### Entidad Turno

Un turno representa una reserva de atención médica asociada a un paciente y a un médico.

Los datos mínimos propuestos son:

- `id`: identificador único del turno.
- `pacienteId`: identificador del paciente.
- `medicoId`: identificador del médico.
- `especialidad`: especialidad médica.
- `fecha`: fecha del turno.
- `hora`: horario del turno.
- `confirmado`: indica si el turno está confirmado.
- `observaciones`: información adicional opcional.

```typescript
export interface TurnoPropuesto {
  id: number;
  pacienteId: number;
  medicoId: number;
  especialidad: string;
  fecha: string;
  hora: string;
  confirmado: boolean;
  observaciones?: string;
}
```

Ejemplo de turno:

```json
{
  "id": 105,
  "pacienteId": 1,
  "medicoId": 1,
  "especialidad": "Pediatría",
  "fecha": "2026-10-05",
  "hora": "10:30",
  "confirmado": true,
  "observaciones": "Primera consulta"
}
```

## Relaciones entre las entidades

Un paciente puede tener varios turnos a lo largo del tiempo.

Un médico también puede atender varios turnos.

Cada turno debe vincularse con un paciente existente y con un médico existente. La especialidad del turno debe coincidir con la especialidad del médico seleccionado.

## Endpoints propuestos

### Crear un paciente

**Método y ruta**

```text
POST /pacientes
```

**Descripción**

Registra un nuevo paciente en el sistema.

**Cuerpo de la solicitud**

```json
{
  "dni": "30111222",
  "nombre": "Laura",
  "apellido": "Martínez",
  "fechaNacimiento": "1988-04-12",
  "telefono": "1123456789",
  "email": "laura.martinez@email.com",
  "direccion": "Av. Belgrano 123"
}
```

**Respuesta exitosa**

Código HTTP: `201 Created`

```json
{
  "id": 1,
  "dni": "30111222",
  "nombre": "Laura",
  "apellido": "Martínez",
  "fechaNacimiento": "1988-04-12",
  "telefono": "1123456789",
  "email": "laura.martinez@email.com",
  "direccion": "Av. Belgrano 123"
}
```

**Posibles errores**

- `400 Bad Request`: datos inválidos o campos obligatorios ausentes.
- `409 Conflict`: el DNI ya se encuentra registrado.
- `500 Internal Server Error`: error inesperado del servidor.

### Crear un turno

**Método y ruta**

```text
POST /turnos
```

**Descripción**

Crea un turno asociando un paciente existente con un médico, una especialidad, una fecha y un horario.

**Cuerpo de la solicitud**

```json
{
  "pacienteId": 1,
  "medicoId": 1,
  "especialidad": "Pediatría",
  "fecha": "2026-10-05",
  "hora": "10:30",
  "confirmado": true,
  "observaciones": "Primera consulta"
}
```

**Respuesta exitosa**

Código HTTP: `201 Created`

```json
{
  "id": 105,
  "pacienteId": 1,
  "medicoId": 1,
  "especialidad": "Pediatría",
  "fecha": "2026-10-05",
  "hora": "10:30",
  "confirmado": true,
  "observaciones": "Primera consulta"
}
```

**Posibles errores**

- `400 Bad Request`: datos inválidos.
- `404 Not Found`: el paciente o el médico no existe.
- `409 Conflict`: el horario ya está ocupado.
- `500 Internal Server Error`: error inesperado del servidor.

## Organización según Clean Architecture

El flujo de una solicitud sería el siguiente:

```text
Cliente HTTP
    ↓
Ruta REST
    ↓
Controlador
    ↓
Servicio de aplicación
    ↓
Modelo y validaciones
    ↓
Repositorio o archivo JSON
```

Esta separación permite que cada componente tenga una responsabilidad clara, facilita las pruebas y simplifica el mantenimiento del proyecto.