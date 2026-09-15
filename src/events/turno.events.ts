import { EventEmitter } from "node:events";

export const EVENTOS_TURNO = {
  CREADO: "turno:creado",
  ACTUALIZADO: "turno:actualizado",
  ELIMINADO: "turno:eliminado",
} as const;

export const turnoEventos = new EventEmitter();
