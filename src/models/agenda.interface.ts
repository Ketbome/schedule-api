import { Document } from "mongoose";

export interface HorarioCorte {
  dia: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  hora: string; // "HH:mm"
}

export interface IAgenda extends Document {
  bodega: string;
  operadorLogistico: string;
  metodoEntrega: "Despacho a domicilio" | "Retiro en tienda";
  comunasCubiertas: number[];
  diasDesfase: number;
  horariosCorte: HorarioCorte[];
  skus: string[];
  activo: boolean;
}
