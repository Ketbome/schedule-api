import { Agenda } from "../schemas/agenda.schema";
import { IAgenda } from "../models/agenda.interface";
import { AppError } from "../errors/app.error";

export async function getAgendas(): Promise<IAgenda[]> {
  const agendas = await Agenda.find();

  if (!agendas) {
    throw AppError.notFound("No se encontraron agendas");
  }

  return agendas.map((agenda) => agenda.toObject());
}
