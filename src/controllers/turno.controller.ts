import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";
import type { TurnoCrudo } from "../models/turno.model.js";
import { turnoService } from "../services/turno.service.js";
import { appointmentQuerySchema } from "../schemas/appointment.schema.js";

function convertirId(valor: string | string[] | undefined): number {
  if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
    throw new AppError(
      400,
      "El ID debe ser un entero positivo.",
      "VALIDATION_ERROR",
      [{ field: "id", message: "Usá un identificador numérico positivo." }],
    );
  }

  const id = Number(valor);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new AppError(
      400,
      "El ID debe ser un entero positivo válido.",
      "VALIDATION_ERROR",
      [{ field: "id", message: "El identificador está fuera del rango válido." }],
    );
  }

  return id;
}

export async function listarTurnos(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    const filtros = appointmentQuerySchema.parse(req.query);
    const turnos = turnoService.obtenerTodos(filtros);

    return void res.status(status).json(turnos);
  } catch (error: unknown) {
    return next(error);
  }
}



export async function obtenerTurnoPorId(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    const id = convertirId(req.params.id);
    const turno = turnoService.obtenerPorId(id);

    if (!turno) {
      throw new AppError(404, "Turno no encontrado.", "APPOINTMENT_NOT_FOUND");
    }

    return void res.status(status).json(turno);
  } catch (error: unknown) {
    return next(error);
  }
}
export async function crearTurno(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 201;

  try {
    const turno = await turnoService.crear(req.body as TurnoCrudo);

    if (!turno) {
      throw new AppError(
        400,
        "Los datos son inválidos o el ID ya existe.",
        "VALIDATION_ERROR",
      );
    }

    return void res.status(status).json(turno);
  } catch (error: unknown) {
    return next(error);
  }
}


export async function actualizarTurno(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    const id = convertirId(req.params.id);

    if (!turnoService.obtenerPorId(id)) {
      throw new AppError(
        404,
        "Turno no encontrado.",
        "APPOINTMENT_NOT_FOUND",
      );
    }

    const turno = await turnoService.actualizar(
      id,
      req.body as TurnoCrudo,
    );

    if (!turno) {
      throw new AppError(
        400,
        "Los datos del turno son inválidos.",
        "VALIDATION_ERROR",
      );
    }

    return void res.status(status).json(turno);
  } catch (error: unknown) {
    return next(error);
  }
}
   


export async function eliminarTurno(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 204;

  try {
    const id = convertirId(req.params.id);
    const turno = await turnoService.eliminar(id);

    if (!turno) {
      throw new AppError(
        404,
        "Turno no encontrado.",
        "APPOINTMENT_NOT_FOUND",
      );
    }

    return void res.status(status).send();
  } catch (error: unknown) {
    return next(error);
  }
}