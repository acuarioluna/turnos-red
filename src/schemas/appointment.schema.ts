import { z } from "zod";
import {
  documentSchema,
  specialtySchema,
} from "./common.schema.js";

export const createAppointmentSchema = z.object({
  id: z
    .number({ error: "El ID debe ser un número." })
    .int({ error: "El ID debe ser un número entero." })
    .positive({ error: "El ID debe ser mayor que cero." }),

  paciente: z
    .string({ error: "El paciente debe ser un texto." })
    .trim()
    .min(1, { error: "El nombre del paciente es obligatorio." }),

  documento: documentSchema,

  especialidad: specialtySchema,

  fecha: z.iso.date({
    error: "La fecha debe ser válida y tener formato AAAA-MM-DD.",
  }),

  hora: z
    .string({ error: "La hora debe ser un texto." })
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: "La hora debe tener formato HH:MM, entre 00:00 y 23:59.",
    }),

  confirmado: z.boolean({
    error: "La confirmación debe ser true o false.",
  }),

  medicoId: z
    .number({ error: "El ID del médico debe ser un número." })
    .int({ error: "El ID del médico debe ser un número entero." })
    .positive({ error: "El ID del médico debe ser mayor que cero." }),

  observaciones: z
    .string({ error: "Las observaciones deben ser un texto." })
    .trim()
    .optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.omit({
  id: true,
});