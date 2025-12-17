import mongoose from "mongoose";
import { Agenda } from "../schemas/agenda.schema";
import dotenv from "dotenv";
import { AgendaInput } from "../models/agenda.interface";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const agendas: AgendaInput[] = [
  {
    bodega: "Bodega Central Santiago",
    operadorLogistico: "Chilexpress",
    metodoEntrega: "Despacho a domicilio",
    comunasCubiertas: [13101, 13102, 13103, 13104, 13105, 13106],
    diasDesfase: 1,
    horariosCorte: [
      { dia: 0, hora: "18:00" },
      { dia: 1, hora: "18:00" },
      { dia: 2, hora: "18:00" },
      { dia: 3, hora: "18:00" },
      { dia: 4, hora: "17:00" },
      { dia: 5, hora: "14:00" },
      { dia: 6, hora: "12:00" },
    ],
    skus: ["SKU-12345", "SKU-67890", "SKU-11111"],
    activo: true,
  },
  {
    bodega: "Bodega Ripley Mall Plaza",
    operadorLogistico: "BlueExpress",
    metodoEntrega: "Retiro en tienda",
    comunasCubiertas: [13101, 13201, 13301, 13401, 13402, 13501],
    diasDesfase: 0,
    horariosCorte: [
      { dia: 0, hora: "20:00" },
      { dia: 1, hora: "20:00" },
      { dia: 2, hora: "20:00" },
      { dia: 3, hora: "20:00" },
      { dia: 4, hora: "20:00" },
      { dia: 5, hora: "18:00" },
      { dia: 6, hora: "10:00" },
    ],
    skus: ["SKU-12345", "SKU-22222", "SKU-33333"],
    activo: true,
  },
  {
    bodega: "Bodega Sur",
    operadorLogistico: "Starken",
    metodoEntrega: "Despacho a domicilio",
    comunasCubiertas: [13401, 13402, 13501, 13601, 13602, 13603],
    diasDesfase: 2,
    horariosCorte: [
      { dia: 0, hora: "16:00" },
      { dia: 1, hora: "16:00" },
      { dia: 2, hora: "16:00" },
      { dia: 3, hora: "16:00" },
      { dia: 4, hora: "15:00" },
      { dia: 5, hora: "12:00" },
      { dia: 6, hora: "00:00" },
    ],
    skus: ["SKU-67890", "SKU-44444", "SKU-55555"],
    activo: true,
  },
];

async function seed() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI no está definida");
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    await Agenda.deleteMany({});
    console.log("Agendas anteriores eliminadas");

    await Agenda.insertMany(agendas);
    console.log(`${agendas.length} agendas insertadas`);

    console.log("\nAgendas creadas:");
    agendas.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.bodega} | ${a.operadorLogistico} | ${a.metodoEntrega}`);
      console.log(`     Comunas: ${a.comunasCubiertas.join(", ")}`);
      console.log(`     Días desfase: ${a.diasDesfase}`);
    });

    await mongoose.disconnect();
    console.log("\nSeed completado");
  } catch (err) {
    console.error("Error en seed:", err);
    process.exit(1);
  }
}

seed();
