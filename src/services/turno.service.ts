import { EVENTOS_TURNO, turnoEventos } from "../events/turno.events.js";
import type { Turno, TurnoCrudo } from "../models/turno.model.js";
import { cargarTurnos, guardarTurnos } from "./turno-file.service.js";
import { normalizarTurno } from "./turno-normalizer.service.js";

export class TurnoService {
  private turnos: Turno[] = [];

  async inicializar(): Promise<void> {
    this.turnos = await cargarTurnos();
  }

  obtenerTodos(): Turno[] {
    return [...this.turnos];
  }

  obtenerPorId(id: number): Turno | undefined {
    return this.turnos.find((turno) => turno.id === id);
  }

  async crear(datos: TurnoCrudo): Promise<Turno | null> {
    const nuevoTurno = normalizarTurno(datos);

    if (nuevoTurno === null || this.obtenerPorId(nuevoTurno.id)) {
      return null;
    }

    this.turnos.push(nuevoTurno);
    await guardarTurnos(this.turnos);

    turnoEventos.emit(EVENTOS_TURNO.CREADO, nuevoTurno);

    return nuevoTurno;
  }

  async actualizar(id: number, datos: TurnoCrudo): Promise<Turno | null> {
    const indice = this.turnos.findIndex((turno) => turno.id === id);

    if (indice === -1) {
      return null;
    }

    const turnoActualizado = normalizarTurno({
      ...datos,
      id,
    });

    if (turnoActualizado === null) {
      return null;
    }

    this.turnos[indice] = turnoActualizado;
    await guardarTurnos(this.turnos);

    turnoEventos.emit(EVENTOS_TURNO.ACTUALIZADO, turnoActualizado);

    return turnoActualizado;
  }

  async eliminar(id: number): Promise<Turno | null> {
    const indice = this.turnos.findIndex((turno) => turno.id === id);

    if (indice === -1) {
      return null;
    }

    const turnoEliminado = this.turnos[indice];

    if (!turnoEliminado) {
      return null;
    }

    this.turnos.splice(indice, 1);
    await guardarTurnos(this.turnos);

    turnoEventos.emit(EVENTOS_TURNO.ELIMINADO, turnoEliminado);

    return turnoEliminado;
  }
}

export const turnoService = new TurnoService();
