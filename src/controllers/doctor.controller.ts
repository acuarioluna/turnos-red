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

export function listDoctors(req: Request, res: Response): void {
  const filters = doctorQuerySchema.parse(req.query);
  const doctors = doctorService.getAll(filters);

  res.status(200).json(doctors);
}

export function getDoctorById(req: Request, res: Response): void {
  const id = parseId(req.params.id);
  const doctor = doctorService.getById(id);

  if (!doctor) {
    throw new AppError(404, "Médico no encontrado.", "DOCTOR_NOT_FOUND");
  }

  res.status(200).json(doctor);
}

export async function createDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const doctor = await doctorService.create(req.body as Doctor);
    res.status(201).json(doctor);
  } catch (error: unknown) {
    next(error);
  }
}

export async function updateDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseId(req.params.id);
    const doctor = await doctorService.update(id, req.body as DoctorUpdate);

    res.status(200).json(doctor);
  } catch (error: unknown) {
    next(error);
  }
}

export async function deleteDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseId(req.params.id);
    await doctorService.delete(id);

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
}