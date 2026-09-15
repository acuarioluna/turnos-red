import type { Server } from "socket.io";

import { EVENTOS_TURNO, turnoEventos } from "../events/turno.events.js";
import type { Turno } from "../models/turno.model.js";

export function configurarSocket(io: Server): void {
  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  turnoEventos.on(EVENTOS_TURNO.CREADO, (turno: Turno) => {
    io.emit("turno:nuevo", turno);
  });

  turnoEventos.on(EVENTOS_TURNO.ACTUALIZADO, (turno: Turno) => {
    io.emit("turno:actualizado", turno);
  });

  turnoEventos.on(EVENTOS_TURNO.ELIMINADO, (turno: Turno) => {
    io.emit("turno:eliminado", turno);
  });
}
