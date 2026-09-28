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
export const appointmentQuerySchema = z.object({
  especialidad: z
    .string({ error: "La especialidad debe ser un texto." })
    .trim()
    .min(1, { error: "La especialidad no puede estar vacía." })
    .optional(),

  fecha: z
    .string({ error: "La fecha debe ser un texto." })
    .trim()
    .transform((valor) => {
      const formatoLatino = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);

      if (formatoLatino) {
        return `${formatoLatino[3]}-${formatoLatino[2]}-${formatoLatino[1]}`;
      }

      return valor;
    })
    .pipe(
      z.iso.date({
        error: "Ingresá una fecha válida en formato DD/MM/AAAA o AAAA-MM-DD.",
      }),
    )
    .optional(),

  medicoId: z
    .string({ error: "El filtro medicoId debe ser un texto numérico." })
    .trim()
    .regex(/^\d+$/, {
      error: "El ID del médico debe contener solamente números.",
    })
    .transform((valor) => Number(valor))
    .pipe(
      z
        .number()
        .int({ error: "El ID del médico debe ser un entero válido." })
        .positive({ error: "El ID del médico debe ser mayor que cero." }),
    )
    .optional(),
});