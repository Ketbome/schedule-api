import { Router } from "express";
import { getAgendas } from "../controllers/agenda.controller";

const router = Router();

router.get("/", getAgendas);

export default router;
