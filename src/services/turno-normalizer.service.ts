import type { Turno, TurnoCrudo } from "../models/turno.model.js";

function normalizarFecha(valor: unknown): string | null {
  if (typeof valor !== "string") {
    return null;
  }

  const fecha = valor.trim();
  let anio: number;
  let mes: number;
  let dia: number;

  const formatoLatino = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(fecha);
  const formatoISO = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(fecha);

  if (formatoLatino) {
    dia = Number(formatoLatino[1]);
    mes = Number(formatoLatino[2]);
    anio = Number(formatoLatino[3]);
  } else if (formatoISO) {
    anio = Number(formatoISO[1]);
    mes = Number(formatoISO[2]);
    dia = Number(formatoISO[3]);
  } else {
    return null;
  }

  const fechaComprobacion = new Date(Date.UTC(anio, mes - 1, dia));

  if (
    fechaComprobacion.getUTCFullYear() !== anio ||
    fechaComprobacion.getUTCMonth() !== mes - 1 ||
    fechaComprobacion.getUTCDate() !== dia
  ) {
    return null;
  }

  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function normalizarHora(valor: unknown): string | null {
  if (typeof valor !== "string") {
    return null;
  }

  const resultado = /^(\d{1,2})[.:](\d{2})$/.exec(valor.trim());

  if (!resultado) {
    return null;
  }

  const horas = Number(resultado[1]);
  const minutos = Number(resultado[2]);

  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
    return null;
  }

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function normalizarConfirmado(valor: unknown): boolean | null {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (valor === 1) {
    return true;
  }

  if (valor === 0) {
    return false;
  }

  if (typeof valor === "string") {
    const texto = valor
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (["si", "true", "1"].includes(texto)) {
      return true;
    }

    if (["no", "false", "0"].includes(texto)) {
      return false;
    }
  }

  return null;
}

export function normalizarTurno(
  crudo: TurnoCrudo | null | undefined,
): Turno | null {
  if (crudo === null || crudo === undefined) {
    return null;
  }
  const id = Number(crudo.id);

  const paciente =
    typeof crudo.paciente === "string"
      ? crudo.paciente.trim().replace(/\s+/g, " ")
      : "";

  const documento =
    typeof crudo.documento === "string" || typeof crudo.documento === "number"
      ? String(crudo.documento).trim()
      : "";

  const especialidad =
    typeof crudo.especialidad === "string"
      ? crudo.especialidad.trim().replace(/\s+/g, " ").toUpperCase()
      : "";

  const fecha = normalizarFecha(crudo.fecha);
  const hora = normalizarHora(crudo.hora);
  const confirmado = normalizarConfirmado(crudo.confirmado);

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    paciente === "" ||
    documento === "" ||
    especialidad === "" ||
    fecha === null ||
    hora === null ||
    confirmado === null
  ) {
    return null;
  }

  const turno: Turno = {
    id,
    paciente,
    documento,
    especialidad,
    fecha,
    hora,
    confirmado,
  };

  if (
    typeof crudo.observaciones === "string" &&
    crudo.observaciones.trim() !== ""
  ) {
    turno.observaciones = crudo.observaciones.trim();
  }

  return turno;
}
