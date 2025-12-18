import { AppError } from "../errors/app.error";
import { CutTime, ISchedule, IScheduleResponse } from "../models/schedule.interface";
import { Schedule } from "../schemas/schedule.schema";
import { buildResponse } from "./converters/date.converter";

export async function getSchedules(): Promise<ISchedule[]> {
  const schedules = await Schedule.find({ activo: true });
  return schedules;
}

export async function getSchedulesAvailable(
  sku: string,
  codigoComuna: number
): Promise<IScheduleResponse[]> {
  const schedules = await Schedule.find({
    activo: true,
    comunasCubiertas: codigoComuna,
    skus: sku,
  });

  if (!schedules.length) {
    throw AppError.notFound("No hay schedules disponibles para este SKU y comuna");
  }

  return schedules.map((schedule) => buildResponse(schedule, sku, codigoComuna));
}

export async function changeCutTimeOfSchedule(
  scheduleId: string,
  cutTime: CutTime
): Promise<ISchedule> {
  const schedule = await Schedule.findOne({ _id: scheduleId });
  if (!schedule || !schedule.horariosCorte.some((h: CutTime) => h.dia === cutTime.dia)) {
    throw AppError.notFound("No se encontró la agenda o el horario de corte");
  }
  schedule.horariosCorte.find((h: CutTime) => h.dia === cutTime.dia)!.hora = cutTime.hora;
  await schedule.save();
  return schedule;
}
