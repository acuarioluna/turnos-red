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
| src/server.ts | Configuración e inicio de Express y Socket.IO |
| src/models | Interfaces TurnoCrudo y Turno |
| src/services | Lectura, escritura, normalización y operaciones CRUD |
| src/controllers | Procesamiento de solicitudes y respuestas HTTP |
| src/routes | Definición de las rutas REST |
| src/events | Bus de eventos internos con EventEmitter |
| src/sockets | Transmisión de eventos mediante Socket.IO |
| data/turnos.json | Datos de los turnos |
| public/cliente.html | Cliente para visualizar eventos en tiempo real |
| dist | Código compilado, generado mediante build |

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

| Método | Ruta | Función |
| --- | --- | --- |
| GET | /turnos | Listar todos los turnos |
| GET | /turnos/:id | Obtener un turno por ID |
| POST | /turnos | Crear un turno |
| PUT | /turnos/:id | Actualizar un turno |
| DELETE | /turnos/:id | Eliminar un turno |

Las respuestas utilizan 200 para operaciones exitosas, 201 para creación,
400 para validaciones rechazadas, 404 para turnos inexistentes y
500 para errores internos.

Para POST y PUT, seleccionar Body → raw → JSON en Postman.

Ejemplo de cuerpo para POST:

```json
{
  "id": "105",
  "paciente": "  Laura Martínez ",
  "documento": 30111222,
  "especialidad": "clínica médica",
  "fecha": "19/08/2026",
  "hora": "15.00",
  "confirmado": "sí",
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

## Verificación del código

```bash
npm run format
npm run lint
npm run build
```