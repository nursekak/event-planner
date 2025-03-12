import { Router } from "express";
import roleController from "../controllers/roleController.ts";
import checkRole from "../middleware/CheckRolesMiddleware.ts";
const router = Router();

router.get('/', roleController.getAll);
router.post('/', roleController.create);

export default router;