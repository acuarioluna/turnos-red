import "dotenv/config";

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { turnoRouter } from "./routes/turno.routes.js";
import { turnoService } from "./services/turno.service.js";
import { configurarSocket } from "./sockets/socket.js";

import { errorHandler } from "./middlewares/error.middleware.js";
import { doctorRouter } from "./routes/doctor.routes.js";
import { doctorService } from "./services/doctor.service.js";
import {
  inicioController,
  rutaNoEncontradaController,
} from "./controllers/general.controller.js";

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

app.get("/", inicioController);

app.use("/turnos", turnoRouter);
app.use("/medicos", doctorRouter);
app.use(rutaNoEncontradaController);

app.use(errorHandler);
async function iniciarServidor(): Promise<void> {
  await doctorService.initialize();
  await turnoService.inicializar();

  servidorHttp.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });
}

iniciarServidor().catch((error: unknown) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exitCode = 1;
});
