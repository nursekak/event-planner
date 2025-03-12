import { Router } from "express";
import categoryController from "../controllers/categoryController.ts";
const router = Router();

// router.get('/', deviceController.getAll)
router.post('/', categoryController.create)
// router.get('/:id', deviceController.getOne)
// router.delete('/:id', deviceController.delete)


export default router