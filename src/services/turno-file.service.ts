import { readFile, writeFile } from "node:fs/promises";

import type { Turno, TurnoCrudo } from "../models/turno.model.js";
import { normalizarTurno } from "./turno-normalizer.service.js";

export async function cargarTurnos(): Promise<Turno[]> {
  const rutaArchivo = process.env.DATA_FILE ?? "./data/turnos.json";

  try {
    const contenido = await readFile(rutaArchivo, "utf-8");
    const datos: unknown = JSON.parse(contenido);

    if (!Array.isArray(datos)) {
      throw new Error("El archivo turnos.json debe contener una lista.");
    }

    const turnosAceptados: Turno[] = [];
    let cantidadRechazados = 0;

    for (const registro of datos) {
      if (typeof registro !== "object" || registro === null) {
        cantidadRechazados++;
        continue;
      }

      const turno = normalizarTurno(registro as TurnoCrudo);

      if (turno === null) {
        cantidadRechazados++;
      } else {
        turnosAceptados.push(turno);
      }
    }

    console.log(`Registros aceptados: ${turnosAceptados.length}`);
    console.log(`Registros rechazados: ${cantidadRechazados}`);

    return turnosAceptados;
  } catch (error) {
    console.error(`Error al leer el archivo ${rutaArchivo}:`, error);
    throw error;
  }
}
export async function guardarTurnos(turnos: Turno[]): Promise<void> {
  const rutaArchivo = process.env.DATA_FILE ?? "./data/turnos.json";

  try {
    const contenido = JSON.stringify(turnos, null, 2);
    await writeFile(rutaArchivo, contenido, "utf-8");
  } catch (error) {
    console.error(`Error al guardar el archivo ${rutaArchivo}:`, error);
    throw error;
  }
}
