import { Router } from "express";

import {
  actualizarTurno,
  crearTurno,
  eliminarTurno,
  listarTurnos,
  obtenerTurnoPorId,
} from "../controllers/turno.controller.js";

export const turnoRouter = Router();

turnoRouter.get("/", listarTurnos);
turnoRouter.get("/:id", obtenerTurnoPorId);
turnoRouter.post("/", crearTurno);
turnoRouter.put("/:id", actualizarTurno);
turnoRouter.delete("/:id", eliminarTurno);
