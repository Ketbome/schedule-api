import * as agendaService from "../services/agenda.service";
import { Request, Response, NextFunction } from "express";

export const getAgendas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agendas = await agendaService.getAgendas();
    res.status(200).json({ success: true, data: agendas });
  } catch (error) {
    next(error);
  }
};
