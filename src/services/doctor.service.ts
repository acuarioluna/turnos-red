import { AppError } from "../errors/app-error.js";
import type { Doctor, DoctorUpdate } from "../models/doctor.model.js";
import { loadDoctors, saveDoctors } from "./doctor-file.service.js";

export interface DoctorFilters {
  especialidad?: string;
  disponible?: boolean;
}

function normalizeText(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

class DoctorService {
  private doctors: Doctor[] = [];
  private pending: Promise<void> = Promise.resolve();

  async initialize(): Promise<void> {
    this.doctors = await loadDoctors();
  }

  getAll(filters: DoctorFilters = {}): Doctor[] {
    return this.doctors
      .filter((doctor) => {
        const matchesSpecialty =
          filters.especialidad === undefined ||
          normalizeText(doctor.especialidad) ===
            normalizeText(filters.especialidad);

        const matchesAvailability =
          filters.disponible === undefined ||
          doctor.disponible === filters.disponible;

        return matchesSpecialty && matchesAvailability;
      })
      .map((doctor) => ({ ...doctor }));
  }

  getById(id: number): Doctor | undefined {
    const doctor = this.doctors.find((item) => item.id === id);
    return doctor ? { ...doctor } : undefined;
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.pending.then(operation);

    this.pending = result.then(
      () => undefined,
      () => undefined,
    );

    return result;
  }

  private checkDuplicates(doctor: Doctor, ignoreId?: number): void {
    const others = this.doctors.filter((item) => item.id !== ignoreId);

    if (others.some((item) => item.id === doctor.id)) {
      throw new AppError(
        400,
        "Ya existe un médico con ese ID.",
        "DUPLICATE_DOCTOR_ID",
        [{ field: "id", message: "El ID ya está registrado." }],
      );
    }

    if (
      others.some(
        (item) =>
          normalizeText(item.matricula) === normalizeText(doctor.matricula),
      )
    ) {
      throw new AppError(
        400,
        "Ya existe un médico con esa matrícula.",
        "DUPLICATE_LICENSE",
        [{ field: "matricula", message: "La matrícula ya está registrada." }],
      );
    }
  }

  async create(data: Doctor): Promise<Doctor> {
    return this.enqueue(async () => {
      this.checkDuplicates(data);

      const doctor = { ...data };
      const updated = [...this.doctors, doctor];

      await saveDoctors(updated);
      this.doctors = updated;

      return { ...doctor };
    });
  }

  async update(id: number, data: DoctorUpdate): Promise<Doctor> {
    return this.enqueue(async () => {
      if (!this.getById(id)) {
        throw new AppError(404, "Médico no encontrado.", "DOCTOR_NOT_FOUND");
      }

      const doctor: Doctor = { ...data, id };
      this.checkDuplicates(doctor, id);

      const updated = this.doctors.map((item) =>
        item.id === id ? doctor : item,
      );

      await saveDoctors(updated);
      this.doctors = updated;

      return { ...doctor };
    });
  }

  async delete(id: number): Promise<void> {
    return this.enqueue(async () => {
      if (!this.getById(id)) {
        throw new AppError(404, "Médico no encontrado.", "DOCTOR_NOT_FOUND");
      }

      const updated = this.doctors.filter((item) => item.id !== id);

      await saveDoctors(updated);
      this.doctors = updated;
    });
  }
}

export const doctorService = new DoctorService();