import { AppError } from "../errors/app-error.js";
import { EVENTOS_TURNO, turnoEventos } from "../events/turno.events.js";
import type { Turno, TurnoCrudo } from "../models/turno.model.js";
import { doctorService } from "./doctor.service.js";
import { cargarTurnos, guardarTurnos } from "./turno-file.service.js";
import { normalizarTurno } from "./turno-normalizer.service.js";

export interface FiltrosTurno {
  especialidad?: string;
  fecha?: string;
  medicoId?: number;
}

function simplificarTexto(valor: string): string {
  return valor
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export class TurnoService {
  private turnos: Turno[] = [];
  private pendiente: Promise<void> = Promise.resolve();

  async inicializar(): Promise<void> {
    const turnos = await cargarTurnos();

    for (const turno of turnos) {
      this.validarMedico(turno);
    }

    this.turnos = turnos;
  }

    obtenerTodos(filtros: FiltrosTurno = {}): Turno[] {
    return this.turnos
      .filter((turno) => {
        const coincideEspecialidad =
          filtros.especialidad === undefined ||
          simplificarTexto(turno.especialidad) ===
            simplificarTexto(filtros.especialidad);

        const coincideFecha =
          filtros.fecha === undefined ||
          turno.fecha === filtros.fecha;

        const coincideMedico =
          filtros.medicoId === undefined ||
          turno.medicoId === filtros.medicoId;

        return coincideEspecialidad && coincideFecha && coincideMedico;
      })
      .map((turno) => ({ ...turno }));
  }

  obtenerPorId(id: number): Turno | undefined {
    const turno = this.turnos.find((item) => item.id === id);
    return turno ? { ...turno } : undefined;
  }

  private validarMedico(turno: Turno): void {
    const medico = doctorService.getById(turno.medicoId);

    if (!medico) {
      throw new AppError(
        400,
        "El médico asignado no existe.",
        "VALIDATION_ERROR",
        [
          {
            field: "medicoId",
            message: "Seleccioná un médico registrado.",
          },
        ],
      );
    }

    if (medico.especialidad !== turno.especialidad) {
      throw new AppError(
        400,
        "La especialidad del turno no coincide con la del médico.",
        "VALIDATION_ERROR",
        [
          {
            field: "especialidad",
            message: `El médico seleccionado atiende ${medico.especialidad}.`,
          },
        ],
      );
    }
  }

  private encolar<T>(operacion: () => Promise<T>): Promise<T> {
    const resultado = this.pendiente.then(operacion);

    this.pendiente = resultado.then(
      () => undefined,
      () => undefined,
    );

    return resultado;
  }

  async crear(datos: TurnoCrudo): Promise<Turno | null> {
    return this.encolar(async () => {
      const nuevoTurno = normalizarTurno(datos);

      if (nuevoTurno === null) {
        return null;
      }

      if (this.obtenerPorId(nuevoTurno.id)) {
        throw new AppError(
          400,
          "Ya existe un turno con ese ID.",
          "DUPLICATE_APPOINTMENT_ID",
          [{ field: "id", message: "El ID ya está registrado." }],
        );
      }

      this.validarMedico(nuevoTurno);

      const actualizados = [...this.turnos, nuevoTurno];
      await guardarTurnos(actualizados);
      this.turnos = actualizados;

      turnoEventos.emit(EVENTOS_TURNO.CREADO, { ...nuevoTurno });

      return { ...nuevoTurno };
    });
  }

  async actualizar(id: number, datos: TurnoCrudo): Promise<Turno | null> {
    return this.encolar(async () => {
      if (!this.obtenerPorId(id)) {
        throw new AppError(
          404,
          "Turno no encontrado.",
          "APPOINTMENT_NOT_FOUND",
        );
      }

      const turnoActualizado = normalizarTurno({ ...datos, id });

      if (turnoActualizado === null) {
        return null;
      }

      this.validarMedico(turnoActualizado);

      const actualizados = this.turnos.map((turno) =>
        turno.id === id ? turnoActualizado : turno,
      );

      await guardarTurnos(actualizados);
      this.turnos = actualizados;

      turnoEventos.emit(EVENTOS_TURNO.ACTUALIZADO, {
        ...turnoActualizado,
      });

      return { ...turnoActualizado };
    });
  }

  async eliminar(id: number): Promise<Turno | null> {
    return this.encolar(async () => {
      const turnoEliminado = this.obtenerPorId(id);

      if (!turnoEliminado) {
        return null;
      }

      const actualizados = this.turnos.filter((turno) => turno.id !== id);
      await guardarTurnos(actualizados);
      this.turnos = actualizados;

      turnoEventos.emit(EVENTOS_TURNO.ELIMINADO, {
        ...turnoEliminado,
      });

      return { ...turnoEliminado };
    });
  }
}

export const turnoService = new TurnoService();