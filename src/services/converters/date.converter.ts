import { ISchedule, IScheduleResponse, CutTime } from "../../models/schedule.interface";

export function buildResponse(
  schedule: ISchedule,
  sku: string,
  comuna: number,
  now: Date = new Date()
): IScheduleResponse {
  const fechas = calcularFechasDisponibles(schedule, now);

  return {
    sku,
    comuna,
    fechasDisponibles: fechas,
    bodega: schedule.bodega,
    operadorLogistico: schedule.operadorLogistico,
    metodoEntrega: schedule.metodoEntrega,
  };
}

export function calcularFechasDisponibles(schedule: ISchedule, now: Date = new Date()): string[] {
  const diaActual = getDiaChile(now.getDay());
  const diasConEntrega = new Set(schedule.horariosCorte.map((h: CutTime) => h.dia));

  const horarioHoy = schedule.horariosCorte.find((h: CutTime) => h.dia === diaActual);

  let diasExtra = 0;
  if (horarioHoy && estaFueraDeHorarioCorte(now, horarioHoy.hora)) {
    diasExtra = 1;
  }

  const fechaInicio = new Date(now);
  fechaInicio.setDate(fechaInicio.getDate() + schedule.diasDesfase + diasExtra);

  const fechas: string[] = [];
  let intentos = 0;
  const maxIntentos = 30;

  while (fechas.length < 5 && intentos < maxIntentos) {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + intentos);
    const diaFecha = getDiaChile(fecha.getDay());

    if (diasConEntrega.has(diaFecha)) {
      fechas.push(formatearFecha(fecha));
    }

    intentos++;
  }

  return fechas;
}

export function estaFueraDeHorarioCorte(ahora: Date, horaCorte: string): boolean {
  const [horas, minutos] = horaCorte.split(":").map(Number);
  const fechaCorte = new Date(ahora);
  fechaCorte.setHours(horas, minutos, 0, 0);

  return ahora > fechaCorte;
}

export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-CL");
}

export function getDiaChile(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}
