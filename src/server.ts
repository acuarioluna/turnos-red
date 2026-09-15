import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { turnoRouter } from "./routes/turno.routes.js";
import { turnoService } from "./services/turno.service.js";
import { configurarSocket } from "./sockets/socket.js";

const app = express();
const servidorHttp = createServer(app);
const puerto = Number(process.env.PORT ?? 3000);

const io = new Server(servidorHttp, {
  cors: {
    origin: "*",
  },
});

configurarSocket(io);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.status(200).json({
    mensaje: "Servidor TurnosRed funcionando correctamente.",
  });
});

app.use("/turnos", turnoRouter);

async function iniciarServidor(): Promise<void> {
  await turnoService.inicializar();

  servidorHttp.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });
}

iniciarServidor().catch((error: unknown) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exitCode = 1;
});
