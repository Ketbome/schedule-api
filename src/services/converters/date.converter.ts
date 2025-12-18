import { ISchedule, IScheduleResponse, CutTime } from "../../models/schedule.interface";

export function buildResponse(schedule: ISchedule, sku: string, comuna: number): IScheduleResponse {
  const fechas = calcularFechasDisponibles(schedule);

  return {
    sku,
    comuna,
    fechasDisponibles: fechas,
    bodega: schedule.bodega,
    operadorLogistico: schedule.operadorLogistico,
    metodoEntrega: schedule.metodoEntrega,
  };
}

function calcularFechasDisponibles(schedule: ISchedule): string[] {
  const ahora = new Date();
  let diaActual = ahora.getDay() - 1; // 0 = Lunes, 1 = Martes, ..., 6 = Domingo
  if (diaActual < 0) {
    diaActual = 6; // Domingo
  }

  const horarioHoy = schedule.horariosCorte.find((h: CutTime) => h.dia === diaActual);

  let diasExtra = 0;
  if (horarioHoy && estaFueraDeHorarioCorte(ahora, horarioHoy.hora)) {
    diasExtra = 1;
  }

  const diasTotales = schedule.diasDesfase + diasExtra;
  const fechas: string[] = [];

  // 5 fechas generadas
  for (let i = 0; i < 5; i++) {
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() + diasTotales + i);
    fechas.push(formatearFecha(fecha));
  }

  return fechas;
}

function estaFueraDeHorarioCorte(ahora: Date, horaCorte: string): boolean {
  const [horas, minutos] = horaCorte.split(":").map(Number);
  const fechaCorte = new Date(ahora);
  fechaCorte.setHours(horas, minutos, 0, 0);

  return ahora > fechaCorte;
}

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-CL"); // DD-MM-YYYY
}
