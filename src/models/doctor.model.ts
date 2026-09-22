import type { z } from "zod";
import type { createDoctorSchema } from "../schemas/doctor.schema.js";

export type Doctor = z.infer<typeof createDoctorSchema>;

export type DoctorUpdate = Omit<Doctor, "id">;