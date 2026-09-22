import { Router } from "express";

import {
  listDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../schemas/doctor.schema.js";

export const doctorRouter = Router();

doctorRouter.get("/", listDoctors);
doctorRouter.get("/:id", getDoctorById);

doctorRouter.post(
  "/",
  validateBody(createDoctorSchema),
  createDoctor,
);

doctorRouter.put(
  "/:id",
  validateBody(updateDoctorSchema),
  updateDoctor,
);

doctorRouter.delete("/:id", deleteDoctor);