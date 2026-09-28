import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";
import type { Doctor, DoctorUpdate } from "../models/doctor.model.js";
import { doctorQuerySchema } from "../schemas/doctor.schema.js";
import { doctorService } from "../services/doctor.service.js";

function parseId(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new AppError(
      400,
      "El ID debe ser un entero positivo.",
      "VALIDATION_ERROR",
      [{ field: "id", message: "Usá un identificador numérico positivo." }],
    );
  }

  const id = Number(value);

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

export async function listDoctors(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    const filters = doctorQuerySchema.parse(req.query);
    const doctors = doctorService.getAll(filters);

    return void res.status(status).json(doctors);
  } catch (error: unknown) {
    return next(error);
  }
}

export async function getDoctorById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    const id = parseId(req.params.id);
    const doctor = doctorService.getById(id);

    if (!doctor) {
      throw new AppError(404, "Médico no encontrado.", "DOCTOR_NOT_FOUND");
    }

    return void res.status(status).json(doctor);
  } catch (error: unknown) {
    return next(error);
  }
}

export async function createDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 201;

  try {
    const doctor = await doctorService.create(req.body as Doctor);

    return void res.status(status).json(doctor);
  } catch (error: unknown) {
    return next(error);
  }
}

export async function updateDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 200;

  try {
    const id = parseId(req.params.id);
    const doctor = await doctorService.update(id, req.body as DoctorUpdate);

    return void res.status(status).json(doctor);
  } catch (error: unknown) {
    return next(error);
  }
}

export async function deleteDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const status = 204;

  try {
    const id = parseId(req.params.id);
    await doctorService.delete(id);

    return void res.status(status).send();
  } catch (error: unknown) {
    return next(error);
  }
}