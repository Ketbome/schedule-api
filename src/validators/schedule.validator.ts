import { z } from "zod";

export const getScheduleAvailableSchema = z.object({
  sku: z.string().min(1, "sku es requerido").startsWith("SKU-", "sku debe empezar con SKU-"),
  codigoComuna: z.coerce.number({
    error: "codigoComuna es requerido",
  }),
});

export const changeCutTimeSchema = z.object({
  scheduleId: z.string().min(1, "scheduleId es requerido"),
  horarioCorte: z.object({
    dia: z.number().min(0).max(6, "dia debe ser entre 0 y 6"),
    hora: z.string().regex(/^\d{2}:\d{2}$/, "hora debe tener formato HH:MM"),
  }),
});

export type GetScheduleAvailableInput = z.infer<typeof getScheduleAvailableSchema>;
export type ChangeCutTimeInput = z.infer<typeof changeCutTimeSchema>;
