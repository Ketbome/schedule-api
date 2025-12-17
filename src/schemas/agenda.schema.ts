import mongoose, { Schema } from "mongoose";
import { HorarioCorte, IAgenda } from "../models/agenda.interface";

const horarioCorteSchema = new Schema<HorarioCorte>(
  {
    dia: { type: Number, required: true, min: 0, max: 6 },
    hora: { type: String, required: true },
  },
  { _id: false }
);

const agendaSchema = new Schema<IAgenda>(
  {
    bodega: { type: String, required: true },
    operadorLogistico: { type: String, required: true },
    metodoEntrega: {
      type: String,
      required: true,
      enum: ["Despacho a domicilio", "Retiro en tienda"],
    },
    comunasCubiertas: [{ type: Number }],
    diasDesfase: { type: Number, required: true, min: 0 },
    horariosCorte: [horarioCorteSchema],
    skus: [{ type: String }],
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

agendaSchema.index({ activo: 1, comunasCubiertas: 1 });
agendaSchema.index({ activo: 1, skus: 1 });

export const Agenda = mongoose.model<IAgenda>("Agenda", agendaSchema);
