import { z } from "zod";
import { specialtySchema } from "./common.schema.js";

export const createDoctorSchema = z.object({
  id: z
    .number({ error: "El ID debe ser un número." })
    .int({ error: "El ID debe ser un número entero." })
    .positive({ error: "El ID debe ser mayor que cero." }),

  nombre: z
    .string({ error: "El nombre debe ser un texto." })
    .trim()
    .min(1, { error: "El nombre es obligatorio." }),

  matricula: z
    .string({ error: "La matrícula debe ser un texto." })
    .trim()
    .min(1, { error: "La matrícula es obligatoria." }),

  especialidad: specialtySchema,

  disponible: z.boolean({
    error: "La disponibilidad debe ser true o false.",
  }),
});

export const updateDoctorSchema = createDoctorSchema.omit({
  id: true,
});
export const doctorQuerySchema = z.object({
  especialidad: z
    .string({ error: "La especialidad debe ser un texto." })
    .trim()
    .min(1, { error: "La especialidad no puede estar vacía." })
    .optional(),

  disponible: z
    .enum(["true", "false"], {
      error: "El filtro disponible debe ser true o false.",
    })
    .transform((value) => value === "true")
    .optional(),
});