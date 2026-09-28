export interface TurnoCrudo {
  id?: unknown;
  paciente?: unknown;
  documento?: unknown;
  especialidad?: unknown;
  medicoId?: unknown;
  fecha?: unknown;
  hora?: unknown;
  confirmado?: unknown;
  observaciones?: unknown;
}

export interface Turno {
  id: number;
  paciente: string;
  documento: string;
  especialidad: string;
  medicoId: number;
  fecha: string;
  hora: string;
  confirmado: boolean;
  observaciones?: string;
}