import { Document } from "mongoose";

export interface CutTime {
  dia: number; // 0 = Lunes, 1 = Martes, ..., 6 = Domingo
  hora: string;
}

export interface ScheduleInput {
  bodega: string;
  operadorLogistico: string;
  metodoEntrega: "Despacho a domicilio" | "Retiro en tienda";
  comunasCubiertas: number[];
  diasDesfase: number;
  horariosCorte: CutTime[];
  skus: string[];
  activo: boolean;
}

export interface IScheduleResponse {
  sku: string;
  comuna: number;
  fechasDisponibles: string[];
  bodega: string;
  operadorLogistico: string;
  metodoEntrega: string;
}

export interface ISchedule extends ScheduleInput, Document {}
