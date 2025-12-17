import { Document } from "mongoose";

export interface HorarioCorte {
  dia: number; // 0 = Lunes, 1 = Martes, ..., 6 = Domingo
  hora: string;
}

export interface AgendaInput {
  bodega: string;
  operadorLogistico: string;
  metodoEntrega: "Despacho a domicilio" | "Retiro en tienda";
  comunasCubiertas: number[];
  diasDesfase: number;
  horariosCorte: HorarioCorte[];
  skus: string[];
  activo: boolean;
}

export interface IAgenda extends AgendaInput, Document {}
