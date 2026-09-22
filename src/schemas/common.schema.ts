import { z } from "zod";

export const specialtySchema = z.enum(
  ["Clínica médica", "Pediatría", "Odontología", "Nutrición"],
  {
    error:
      "La especialidad debe ser Clínica médica, Pediatría, Odontología o Nutrición.",
  },
);

export const documentSchema = z
  .string({ error: "El documento debe ser un texto." })
  .trim()
  .min(1, { error: "El documento no puede estar vacío." });