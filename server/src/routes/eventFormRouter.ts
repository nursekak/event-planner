import { Router } from "express";
import formController from "../controllers/EventFormController.ts";
import CheckRolesMiddleware from "../middleware/CheckRolesMiddleware.ts";
const router = Router();

router.post('/', formController.sendForm)
router.get('/', CheckRolesMiddleware(['ADMIN']),formController.getAll)
export default router