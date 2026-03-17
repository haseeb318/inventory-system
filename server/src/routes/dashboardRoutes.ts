import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardcontroller";

const router = Router();

router.get("/", getDashboardMetrics);

export default router;
