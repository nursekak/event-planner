import { Router } from "express";
import userController from "../controllers/userController.ts";
import AuthMiddleware from "../middleware/AuthMiddleware.ts";
// import checkRole from "../middleware/CheckRolesMiddleware";
const router = Router();

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.get('/auth', AuthMiddleware, userController.check)
router.get('/', userController.getAll)
export default router