import { readFile, writeFile } from "node:fs/promises";

import type { Doctor } from "../models/doctor.model.js";
import { createDoctorSchema } from "../schemas/doctor.schema.js";

function getDoctorsFilePath(): string {
  return process.env.DOCTORS_FILE ?? "./data/doctors.json";
}

export async function loadDoctors(): Promise<Doctor[]> {
  const content = await readFile(getDoctorsFilePath(), "utf8");
  const data: unknown = JSON.parse(content);

  return createDoctorSchema.array().parse(data);
}

export async function saveDoctors(doctors: Doctor[]): Promise<void> {
  await writeFile(
    getDoctorsFilePath(),
    JSON.stringify(doctors, null, 2),
    "utf8",
  );
}