import { Router } from "express";

import {
  actualizarTurno,
  crearTurno,
  eliminarTurno,
  listarTurnos,
  obtenerTurnoPorId,
} from "../controllers/turno.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../schemas/appointment.schema.js";

export const turnoRouter = Router();

turnoRouter.get("/", listarTurnos);

turnoRouter.get("/:id", obtenerTurnoPorId);

turnoRouter.post(
  "/",
  validateBody(createAppointmentSchema),
  crearTurno,
);

turnoRouter.put(
  "/:id",
  validateBody(updateAppointmentSchema),
  actualizarTurno,
);

turnoRouter.delete("/:id", eliminarTurno);