import { Router } from "express";
import {
  changeCutTimeOfSchedule,
  getScheduleAvailable,
  getSchedules,
} from "../controllers/schedule.controller";
import { validate } from "../middlewares/validate";
import { getScheduleAvailableSchema, changeCutTimeSchema } from "../validators/schedule.validator";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ScheduleResponse:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *         comuna:
 *           type: number
 *         fechasDisponibles:
 *           type: array
 *           items:
 *             type: string
 *         bodega:
 *           type: string
 *         operadorLogistico:
 *           type: string
 *         metodoEntrega:
 *           type: string
 *           enum: [Despacho a domicilio, Retiro en tienda]
 *     CutTime:
 *       type: object
 *       properties:
 *         dia:
 *           type: number
 *           minimum: 0
 *           maximum: 6
 *           description: "0=Lunes, 6=Domingo"
 *         hora:
 *           type: string
 *           example: "18:00"
 */

/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Obtener todas las agendas activas
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: Lista de agendas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", getSchedules);

/**
 * @swagger
 * /api/schedule/available:
 *   post:
 *     summary: Obtener agendas disponibles por SKU y comuna
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - codigoComuna
 *             properties:
 *               sku:
 *                 type: string
 *                 example: "SKU-12345"
 *               codigoComuna:
 *                 type: number
 *                 example: 13101
 *     responses:
 *       200:
 *         description: Agendas disponibles con fechas calculadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ScheduleResponse'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No hay agendas disponibles
 */
router.post("/available", validate(getScheduleAvailableSchema), getScheduleAvailable);

/**
 * @swagger
 * /api/schedule/change-cut-time:
 *   put:
 *     summary: Cambiar horario de corte de una agenda
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - horarioCorte
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 example: "6789abc123def456"
 *               horarioCorte:
 *                 $ref: '#/components/schemas/CutTime'
 *     responses:
 *       200:
 *         description: Agenda actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Agenda no encontrada
 */
router.put("/change-cut-time", validate(changeCutTimeSchema), changeCutTimeOfSchedule);

export default router;
