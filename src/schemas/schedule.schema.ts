import mongoose, { Schema } from "mongoose";
import { CutTime, ISchedule } from "../models/schedule.interface";

const cutTimeSchema = new Schema<CutTime>(
  {
    dia: { type: Number, required: true, min: 0, max: 6 },
    hora: { type: String, required: true },
  },
  { _id: false }
);

const scheduleSchema = new Schema<ISchedule>(
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
    horariosCorte: [cutTimeSchema],
    skus: [{ type: String }],
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

scheduleSchema.index({ activo: 1, comunasCubiertas: 1 });
scheduleSchema.index({ activo: 1, skus: 1 });

export const Schedule = mongoose.model<ISchedule>("Schedule", scheduleSchema);
