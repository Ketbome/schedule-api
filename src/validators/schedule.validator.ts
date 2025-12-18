import { z } from "zod";

const cutTimeSchema = z.object({
  dia: z.number().min(0).max(6, "dia debe ser entre 0 y 6"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "hora debe tener formato HH:MM"),
});

export const getScheduleAvailableSchema = z.object({
  sku: z.string().min(1, "sku es requerido").startsWith("SKU-", "sku debe empezar con SKU-"),
  codigoComuna: z.coerce.number({
    error: "codigoComuna es requerido",
  }),
});

export const changeCutTimeSchema = z.object({
  scheduleId: z.string().min(1, "scheduleId es requerido"),
  horarioCorte: cutTimeSchema,
});

export const createScheduleSchema = z.object({
  bodega: z.string().min(1, "bodega es requerida"),
  operadorLogistico: z.string().min(1, "operadorLogistico es requerido"),
  metodoEntrega: z.enum(["Despacho a domicilio", "Retiro en tienda"], {
    error: "metodoEntrega debe ser 'Despacho a domicilio' o 'Retiro en tienda'",
  }),
  comunasCubiertas: z.array(z.number()).min(1, "debe cubrir al menos una comuna"),
  diasDesfase: z.number().min(0, "diasDesfase debe ser >= 0"),
  horariosCorte: z.array(cutTimeSchema).min(1, "debe tener al menos un horario de corte"),
  skus: z.array(z.string()).min(1, "debe tener al menos un SKU"),
});

export type GetScheduleAvailableInput = z.infer<typeof getScheduleAvailableSchema>;
export type ChangeCutTimeInput = z.infer<typeof changeCutTimeSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
