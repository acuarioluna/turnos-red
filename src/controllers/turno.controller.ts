import type { Request, Response } from "express";

import type { TurnoCrudo } from "../models/turno.model.js";
import { turnoService } from "../services/turno.service.js";

function convertirId(valor: string | string[] | undefined): number | null {
  if (typeof valor !== "string") {
    return null;
  }

  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export function listarTurnos(_req: Request, res: Response): void {
  const turnos = turnoService.obtenerTodos();
  res.status(200).json(turnos);
}

export function obtenerTurnoPorId(req: Request, res: Response): void {
  const id = convertirId(req.params.id);

  if (id === null) {
    res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
    return;
  }

  const turno = turnoService.obtenerPorId(id);

  if (!turno) {
    res.status(404).json({ mensaje: "Turno no encontrado." });
    return;
  }

  res.status(200).json(turno);
}

export async function crearTurno(req: Request, res: Response): Promise<void> {
  try {
    const turno = await turnoService.crear(req.body as TurnoCrudo);

    if (!turno) {
      res.status(400).json({
        mensaje: "Los datos son inválidos o el ID ya existe.",
      });
      return;
    }

    res.status(201).json(turno);
  } catch (error) {
    console.error("Error al crear el turno:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function actualizarTurno(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = convertirId(req.params.id);

    if (id === null) {
      res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
      return;
    }

    if (!turnoService.obtenerPorId(id)) {
      res.status(404).json({ mensaje: "Turno no encontrado." });
      return;
    }

    const turno = await turnoService.actualizar(id, req.body as TurnoCrudo);

    if (!turno) {
      res.status(400).json({ mensaje: "Los datos son inválidos." });
      return;
    }

    res.status(200).json(turno);
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

export async function eliminarTurno(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = convertirId(req.params.id);

    if (id === null) {
      res.status(400).json({ mensaje: "El ID debe ser un entero positivo." });
      return;
    }

    const turno = await turnoService.eliminar(id);

    if (!turno) {
      res.status(404).json({ mensaje: "Turno no encontrado." });
      return;
    }

    res.status(200).json({
      mensaje: "Turno eliminado correctamente.",
      turno,
    });
  } catch (error) {
    console.error("Error al eliminar el turno:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}
