import {
  getScheduleAvailableSchema,
  changeCutTimeSchema,
} from "../../validators/schedule.validator";

describe("getScheduleAvailableSchema", () => {
  it("valida request correcto", () => {
    const result = getScheduleAvailableSchema.safeParse({
      sku: "SKU-12345",
      codigoComuna: 13101,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza sku vacío", () => {
    const result = getScheduleAvailableSchema.safeParse({
      sku: "",
      codigoComuna: 13101,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza sku sin prefijo SKU-", () => {
    const result = getScheduleAvailableSchema.safeParse({
      sku: "12345",
      codigoComuna: 13101,
    });
    expect(result.success).toBe(false);
  });

  it("convierte codigoComuna string a number", () => {
    const result = getScheduleAvailableSchema.safeParse({
      sku: "SKU-12345",
      codigoComuna: "13101",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.codigoComuna).toBe(13101);
    }
  });

  it("rechaza codigoComuna no numérico", () => {
    const result = getScheduleAvailableSchema.safeParse({
      sku: "SKU-12345",
      codigoComuna: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza request sin sku", () => {
    const result = getScheduleAvailableSchema.safeParse({
      codigoComuna: 13101,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza request sin codigoComuna", () => {
    const result = getScheduleAvailableSchema.safeParse({
      sku: "SKU-12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("changeCutTimeSchema", () => {
  it("valida request correcto", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "abc123",
      horarioCorte: { dia: 1, hora: "18:00" },
    });
    expect(result.success).toBe(true);
  });

  it("rechaza scheduleId vacío", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "",
      horarioCorte: { dia: 1, hora: "18:00" },
    });
    expect(result.success).toBe(false);
  });

  it("rechaza dia fuera de rango (mayor a 6)", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "abc123",
      horarioCorte: { dia: 7, hora: "18:00" },
    });
    expect(result.success).toBe(false);
  });

  it("rechaza dia negativo", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "abc123",
      horarioCorte: { dia: -1, hora: "18:00" },
    });
    expect(result.success).toBe(false);
  });

  it("rechaza hora con formato inválido", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "abc123",
      horarioCorte: { dia: 1, hora: "8:00" },
    });
    expect(result.success).toBe(false);
  });

  it("acepta hora con formato HH:MM correcto", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "abc123",
      horarioCorte: { dia: 1, hora: "08:30" },
    });
    expect(result.success).toBe(true);
  });

  it("rechaza request sin horarioCorte", () => {
    const result = changeCutTimeSchema.safeParse({
      scheduleId: "abc123",
    });
    expect(result.success).toBe(false);
  });
});
