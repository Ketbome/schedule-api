import { Request, Response, NextFunction } from "express";

import * as scheduleService from "../services/schedule.service";
import { GetScheduleAvailableInput, ChangeCutTimeInput } from "../validators/schedule.validator";

export async function getSchedules(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedules = await scheduleService.getSchedules();
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
}

export async function getScheduleAvailable(
  req: Request<unknown, unknown, GetScheduleAvailableInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { sku, codigoComuna } = req.body;
    const schedules = await scheduleService.getSchedulesAvailable(sku, codigoComuna);
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
}

export async function changeCutTimeOfSchedule(
  req: Request<unknown, unknown, ChangeCutTimeInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { scheduleId, horarioCorte } = req.body;
    const schedule = await scheduleService.changeCutTimeOfSchedule(scheduleId, horarioCorte);
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
}
