import { Request, Response, NextFunction } from "express";

import { AppError } from "../errors/app.error";
import * as scheduleService from "../services/schedule.service";

export async function getSchedules(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedules = await scheduleService.getSchedules();
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
}

export async function getScheduleAvailable(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { sku, codigoComuna } = req.body;

    if (!sku || codigoComuna === undefined) {
      throw AppError.badRequest("Se requiere sku y codigoComuna");
    }

    const comunaNum = Number(codigoComuna);
    if (Number.isNaN(comunaNum)) {
      throw AppError.badRequest("codigoComuna debe ser numérico");
    }

    const schedules = await scheduleService.getSchedulesAvailable(sku, comunaNum);
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
}

export async function changeCutTimeOfSchedule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { scheduleId, horarioCorte } = req.body;

    if (!scheduleId || !horarioCorte) {
      throw AppError.badRequest("Se requiere scheduleId y horario de corte");
    }

    const schedule = await scheduleService.changeCutTimeOfSchedule(scheduleId, horarioCorte);
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
}
