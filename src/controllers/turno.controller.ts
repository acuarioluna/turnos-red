import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";
import type { TurnoCrudo } from "../models/turno.model.js";
import { turnoService } from "../services/turno.service.js";

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

export function listarTurnos(_req: Request, res: Response): void {
  const turnos = turnoService.obtenerTodos();
  res.status(200).json(turnos);
}

export function obtenerTurnoPorId(req: Request, res: Response): void {
  const id = convertirId(req.params.id);
  const turno = turnoService.obtenerPorId(id);

  if (!turno) {
    throw new AppError(404, "Turno no encontrado.", "APPOINTMENT_NOT_FOUND");
  }

  res.status(200).json(turno);
}

export async function crearTurno(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const turno = await turnoService.crear(req.body as TurnoCrudo);

    if (!turno) {
      throw new AppError(
        400,
        "Los datos son inválidos o el ID ya existe.",
        "VALIDATION_ERROR",
      );
    }

    res.status(201).json(turno);
  } catch (error: unknown) {
    next(error);
  }
}

export async function actualizarTurno(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = convertirId(req.params.id);

    if (!turnoService.obtenerPorId(id)) {
      throw new AppError(
        404,
        "Turno no encontrado.",
        "APPOINTMENT_NOT_FOUND",
      );
    }

    const turno = await turnoService.actualizar(id, req.body as TurnoCrudo);

    if (!turno) {
      throw new AppError(
        400,
        "Los datos del turno son inválidos.",
        "VALIDATION_ERROR",
      );
    }

    res.status(200).json(turno);
  } catch (error: unknown) {
    next(error);
  }
}

export async function eliminarTurno(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
}