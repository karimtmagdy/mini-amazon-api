import { Router } from "express";
import { cronController } from "../controllers/cron.controller";

const router = Router();

// Route for Vercel Cron
// GET /api/cron
router.get("/cron", cronController.runCleanup);

export const CronProjectRoutes = router;
