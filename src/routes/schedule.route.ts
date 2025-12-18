import { Router } from "express";
import {
  changeCutTimeOfSchedule,
  getScheduleAvailable,
  getSchedules,
} from "../controllers/schedule.controller";

const router = Router();

router.get("/", getSchedules);

router.post("/", getScheduleAvailable);

router.put("/change-cut-time", changeCutTimeOfSchedule);

export default router;
