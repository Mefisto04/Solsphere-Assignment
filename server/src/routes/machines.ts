import { Router } from "express";
import { listMachines, getMachine, exportCsv } from "../controllers/machines.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", listMachines);
router.get("/export/csv", exportCsv);
router.get("/:id", getMachine);

export default router;
