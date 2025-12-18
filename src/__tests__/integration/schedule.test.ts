import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app";
import { Schedule } from "../../schemas/schedule.schema";

let mongoServer: MongoMemoryServer;

const testSchedule = {
  bodega: "Bodega Test",
  operadorLogistico: "Test Express",
  metodoEntrega: "Despacho a domicilio",
  comunasCubiertas: [13101, 13102],
  diasDesfase: 1,
  horariosCorte: [
    { dia: 0, hora: "18:00" },
    { dia: 1, hora: "18:00" },
    { dia: 2, hora: "18:00" },
    { dia: 3, hora: "18:00" },
    { dia: 4, hora: "17:00" },
    { dia: 5, hora: "14:00" },
    { dia: 6, hora: "12:00" },
  ],
  skus: ["SKU-12345", "SKU-67890"],
  activo: true,
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Schedule.deleteMany({});
});

describe("GET /api/schedule", () => {
  it("retorna array vacío cuando no hay agendas", async () => {
    const res = await request(app).get("/api/schedule");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("retorna agendas activas", async () => {
    await Schedule.create(testSchedule);

    const res = await request(app).get("/api/schedule");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].bodega).toBe("Bodega Test");
  });

  it("no retorna agendas inactivas", async () => {
    await Schedule.create({ ...testSchedule, activo: false });

    const res = await request(app).get("/api/schedule");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe("POST /api/schedule (crear agenda)", () => {
  it("crea agenda correctamente", async () => {
    const res = await request(app).post("/api/schedule").send({
      bodega: "Bodega Nueva",
      operadorLogistico: "Nuevo Express",
      metodoEntrega: "Retiro en tienda",
      comunasCubiertas: [13101],
      diasDesfase: 0,
      horariosCorte: [{ dia: 0, hora: "18:00" }],
      skus: ["SKU-99999"],
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bodega).toBe("Bodega Nueva");
    expect(res.body.data.activo).toBe(true);
  });

  it("retorna 400 cuando falta campo requerido", async () => {
    const res = await request(app).post("/api/schedule").send({
      bodega: "Bodega Nueva",
    });

    expect(res.status).toBe(400);
  });

  it("retorna 400 con metodoEntrega inválido", async () => {
    const res = await request(app).post("/api/schedule").send({
      bodega: "Bodega Nueva",
      operadorLogistico: "Test",
      metodoEntrega: "Invalido",
      comunasCubiertas: [13101],
      diasDesfase: 0,
      horariosCorte: [{ dia: 0, hora: "18:00" }],
      skus: ["SKU-99999"],
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/schedule/available", () => {
  beforeEach(async () => {
    await Schedule.create(testSchedule);
  });

  it("retorna agendas disponibles para SKU y comuna válidos", async () => {
    const res = await request(app).post("/api/schedule/available").send({
      sku: "SKU-12345",
      codigoComuna: 13101,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].sku).toBe("SKU-12345");
    expect(res.body.data[0].comuna).toBe(13101);
    expect(res.body.data[0].fechasDisponibles).toHaveLength(5);
    expect(res.body.data[0].bodega).toBe("Bodega Test");
    expect(res.body.data[0].operadorLogistico).toBe("Test Express");
    expect(res.body.data[0].metodoEntrega).toBe("Despacho a domicilio");
  });

  it("retorna 404 cuando no hay agendas para el SKU", async () => {
    const res = await request(app).post("/api/schedule/available").send({
      sku: "SKU-99999",
      codigoComuna: 13101,
    });

    expect(res.status).toBe(404);
  });

  it("retorna 404 cuando no hay agendas para la comuna", async () => {
    const res = await request(app).post("/api/schedule/available").send({
      sku: "SKU-12345",
      codigoComuna: 99999,
    });

    expect(res.status).toBe(404);
  });

  it("retorna 400 cuando falta sku", async () => {
    const res = await request(app).post("/api/schedule/available").send({
      codigoComuna: 13101,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("retorna 400 cuando sku no tiene prefijo SKU-", async () => {
    const res = await request(app).post("/api/schedule/available").send({
      sku: "12345",
      codigoComuna: 13101,
    });

    expect(res.status).toBe(400);
  });

  it("convierte codigoComuna string a number", async () => {
    const res = await request(app).post("/api/schedule/available").send({
      sku: "SKU-12345",
      codigoComuna: "13101",
    });

    expect(res.status).toBe(200);
    expect(res.body.data[0].comuna).toBe(13101);
  });
});

describe("PUT /api/schedule/change-cut-time", () => {
  let scheduleId: string;

  beforeEach(async () => {
    const schedule = await Schedule.create(testSchedule);
    scheduleId = schedule._id.toString();
  });

  it("actualiza horario de corte correctamente", async () => {
    const res = await request(app).put("/api/schedule/change-cut-time").send({
      scheduleId,
      horarioCorte: { dia: 1, hora: "14:00" },
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("retorna 404 para scheduleId inexistente", async () => {
    const res = await request(app).put("/api/schedule/change-cut-time").send({
      scheduleId: "507f1f77bcf86cd799439011",
      horarioCorte: { dia: 1, hora: "14:00" },
    });

    expect(res.status).toBe(404);
  });

  it("retorna 400 cuando falta scheduleId", async () => {
    const res = await request(app).put("/api/schedule/change-cut-time").send({
      horarioCorte: { dia: 1, hora: "14:00" },
    });

    expect(res.status).toBe(400);
  });

  it("retorna 400 cuando dia está fuera de rango", async () => {
    const res = await request(app).put("/api/schedule/change-cut-time").send({
      scheduleId,
      horarioCorte: { dia: 7, hora: "14:00" },
    });

    expect(res.status).toBe(400);
  });

  it("retorna 400 cuando hora tiene formato inválido", async () => {
    const res = await request(app).put("/api/schedule/change-cut-time").send({
      scheduleId,
      horarioCorte: { dia: 1, hora: "2pm" },
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /health", () => {
  it("retorna status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

