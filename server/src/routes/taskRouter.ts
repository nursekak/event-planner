import { Router } from "express";
import taskController from "../controllers/taskController.ts";

const router = Router();

router.get('/', taskController.getAll);
router.post('/', taskController.create);

export default router;