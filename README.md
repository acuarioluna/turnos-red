# TurnosRed

Backend para gestionar turnos médicos, desarrollado con Node.js,
TypeScript, Express y Socket.IO.

Permite leer y normalizar datos desde un archivo JSON, consultar turnos,
crearlos, modificarlos y eliminarlos. Los cambios se notifican a los
clientes conectados en tiempo real.

## Requisitos previos

- Node.js 24.21.0, indicado en `.nvmrc`.
- npm.
- Git.
- NVM para administrar la versión de Node.js.
- Postman para probar la API.

## Instalación

Clonar el repositorio y entrar en la carpeta:

```bash
git clone https://github.com/acuarioluna/turnos-red.git
cd turnos-red
```

Instalar y activar la versión de Node.js con NVM:

```bash
nvm install 24.21.0
nvm use 24.21.0
```

Instalar las dependencias:

```bash
npm ci
```

Crear `.env` copiando el contenido de `.env.example`.

En PowerShell, si se bloquea `npm.ps1`, utilizar `npm.cmd`
en lugar de `npm`.

## Variables de entorno

| Variable | Descripción | Valor de ejemplo |
| --- | --- | --- |
| PORT | Puerto del servidor | 3000 |
| DATA_FILE | Ruta del archivo de turnos, relativa a la carpeta del proyecto | ./data/turnos.json |

El archivo `.env` no se incluye en Git. El archivo `.env.example`
documenta la configuración necesaria.

## Ejecución

Ejecutar los comandos desde la carpeta principal del proyecto.

Compilar TypeScript:

```bash
npm run build
```

Iniciar el servidor compilado:

```bash
npm start
```

Consultar los turnos:

http://localhost:3000/turnos

Abrir el cliente de eventos:

http://localhost:3000/cliente.html

Estas direcciones corresponden al puerto de ejemplo 3000.

## Scripts disponibles

| Script | Función |
| --- | --- |
| npm run dev | Ejecuta TypeScript con reinicio ante cambios mediante tsx |
| npm run build | Compila el código de src en dist |
| npm start | Ejecuta dist/server.js |
| npm run lint | Revisa el código con ESLint |
| npm run format | Aplica Prettier a los archivos TypeScript de src |

## Estructura del proyecto

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| `src/server.ts` | Configuración e inicio de Express y Socket.IO |
| `src/controllers` | Procesamiento de solicitudes y respuestas HTTP |
| `src/routes` | Rutas REST para médicos y turnos |
| `src/schemas` | Validación de datos con Zod |
| `src/middlewares` | Validación de solicitudes y manejo de errores |
| `src/models` | Interfaces y modelos de médicos y turnos |
| `src/services` | Operaciones CRUD, lectura y escritura de archivos |
| `src/events` | Eventos internos de la aplicación |
| `src/sockets` | Emisión de eventos en tiempo real |
| `data/doctors.json` | Datos de los médicos |
| `data/turnos.json` | Datos de los turnos |
| `public/cliente.html` | Cliente para visualizar eventos en tiempo real |
| `dist` | Código compilado, generado mediante `npm run build` |

## Procesamiento de datos

El archivo JSON se lee de forma asíncrona utilizando
node:fs/promises, async/await y try...catch.

La normalización convierte los identificadores a números y los documentos
a texto, limpia los espacios de los nombres, unifica las especialidades
en mayúsculas y estandariza fechas, horas y valores booleanos.

Los registros inválidos se descartan. La consola informa cuántos registros
fueron aceptados y rechazados.

El archivo src/services/callback-example.ts incluye una comparación
entre callbacks y promesas.

Las operaciones de creación, actualización y eliminación guardan
la lista resultante en data/turnos.json. Por eso, después de modificar
datos mediante la API, el archivo puede contener solamente los registros
válidos y normalizados.

## Endpoints

La API escucha por defecto en `http://localhost:3000`.

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/medicos` | Listar médicos; admite filtros |
| GET | `/medicos/:id` | Consultar un médico |
| POST | `/medicos` | Crear un médico |
| PUT | `/medicos/:id` | Actualizar un médico |
| DELETE | `/medicos/:id` | Eliminar un médico |
| GET | `/turnos` | Listar turnos; admite filtros |
| GET | `/turnos/:id` | Consultar un turno |
| POST | `/turnos` | Crear un turno |
| PUT | `/turnos/:id` | Actualizar un turno |
| DELETE | `/turnos/:id` | Eliminar un turno |

Ejemplos de filtros:

- `GET /medicos?especialidad=Pediatria&disponible=true`
- `GET /turnos?especialidad=Pediatria&fecha=14/08/2026&medicoId=1`

Para `POST` y `PUT`, selecciona **Body → raw → JSON** en Postman. Al crear un turno, incluye `medicoId`; el médico debe existir y su especialidad debe coincidir con la del turno.

La API devuelve `200` para consultas y actualizaciones exitosas, `201` al crear, `204` al eliminar, `400` ante datos inválidos, `404` cuando no encuentra el recurso y `500` ante errores internos.

Ejemplo de cuerpo para POST:

```json
{
  "id": 105,
  "paciente": "Laura Martínez",
  "documento": "30111222",
  "especialidad": "Pediatría",
  "fecha": "2026-08-19",
  "hora": "15:00",
  "confirmado": true,
  "medicoId": 1,
  "observaciones": "Primera consulta"
}
```

El ID debe ser único. PUT requiere los campos obligatorios completos;
el identificador se toma de la URL.

Los datos incluidos para las pruebas son ficticios.

## Eventos en tiempo real

| Evento interno | Evento enviado al cliente |
| --- | --- |
| turno:creado | turno:nuevo |
| turno:actualizado | turno:actualizado |
| turno:eliminado | turno:eliminado |

Para comprobarlos, abrir cliente.html desde el servidor y mantenerlo
conectado mientras se realizan solicitudes POST, PUT y DELETE en Postman.
Los eventos deben aparecer sin recargar la página.

## Pruebas con Postman

La colección y el entorno exportados se encuentran en la carpeta principal del proyecto. Para probar la API, impórtalos en Postman y selecciona el entorno `TurnosRed Local`, que configura `baseUrl` como `http://localhost:3000`.

La ejecución completa de la colección obtuvo 28 pruebas aprobadas y 0 fallidas. Las respuestas guardadas como ejemplos también se utilizan para el mock `TurnosRed Mock`.

El mock es privado y requiere una clave Postman en el encabezado `x-api-key`. No guardes esa clave en la colección, el entorno ni el repositorio.

## Uso de Inteligencia Artificial

Se utilizó ChatGPT como apoyo durante el desarrollo y la documentación. Las propuestas se revisaron y probaron en el proyecto.

| Tarea | Herramienta | Prompt | Respuesta generada | Ajuste manual aplicado |
| --- | --- | --- | --- | --- |
| Validaciones con Zod | ChatGPT | ¿Cómo validar con Zod los datos de médicos y turnos, incluyendo tipos, formatos y mensajes de error claros? | Propuso esquemas para validar los campos y comunicar errores por campo. | Se adaptaron los esquemas a los nombres de campos, formatos y reglas de TurnosRed. |
| Pruebas de la API en Postman | ChatGPT | ¿Cómo probar los endpoints de médicos y turnos con casos exitosos y errores, y verificar sus respuestas automáticamente? | Propuso aserciones para estados HTTP y datos de respuesta. | Se ajustaron las pruebas a las rutas, respuestas y datos reales de la API. |
| Documentación del proyecto | ChatGPT | Ayúdame a documentar la instalación, ejecución, endpoints, filtros y pruebas de TurnosRed. | Propuso una estructura y ejemplos para el README. | Se corrigieron los ejemplos y se contrastaron con el comportamiento implementado. |

## Verificación del código

```bash
npm run format
npm run lint
npm run build
```
## Controladores y manejo de errores

La API separa las rutas de la lógica de cada entidad mediante controladores para médicos y turnos. El controlador general gestiona la ruta de bienvenida y las rutas inexistentes.

Los controladores usan funciones asincrónicas y bloques `try/catch`. Los errores se envían con `next(error)` al middleware central, que devuelve una respuesta JSON uniforme. El middleware maneja errores de validación, errores de la aplicación, JSON inválido y errores internos.

Las respuestas exitosas usan los códigos HTTP correspondientes: 200 para consultas y actualizaciones, 201 para creaciones y 204 para eliminaciones. Las rutas inexistentes responden 404.

## Propuesta de módulo de pacientes y turnos

La propuesta conceptual del módulo de pacientes y turnos se encuentra documentada en el archivo [`pacientes-turnos.md`](./pacientes-turnos.md).

El documento incluye:

- Modelado conceptual de las entidades Paciente y Turno.
- Datos mínimos necesarios para cada entidad.
- Relaciones entre pacientes, médicos y turnos.
- Endpoints RESTful propuestos.
- Ejemplos de solicitudes y respuestas JSON.
- Organización de responsabilidades según principios de Clean Architecture.

Los endpoints propuestos son:

| Método | Ruta | Función |
| --- | --- | --- |
| POST | `/pacientes` | Registrar un nuevo paciente |
| POST | `/turnos` | Crear un turno asociado a un paciente y un médico |

Las peticiones de Postman utilizan la variable de entorno `{{baseUrl}}`, cuyo valor local es:

```text
http://localhost:3000