import { Router } from "express";
import { postReport, listReports } from "../controllers/reports.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// router.use(authMiddleware);

//public endpoints
router.post("/client", postReport);
router.post("/", postReport);
router.get("/", listReports);

export default router;
