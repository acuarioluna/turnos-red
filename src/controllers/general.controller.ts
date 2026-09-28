import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

export async function inicioController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    return void res.status(status).json({
      mensaje: "Servidor TurnosRed funcionando correctamente.",
    });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function rutaNoEncontradaController(
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 404;

  try {
    throw new AppError(
      status,
      "La ruta solicitada no existe.",
      "ROUTE_NOT_FOUND",
    );
  } catch (error: unknown) {
    return next(error);
  }
}