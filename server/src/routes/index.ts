import { Router } from "express";
import userRouter from './userRouter.ts';
import roleRouter from "./roleRouter.ts";
import formRouter from "./eventFormRouter.ts";
import taskRouter from "./taskRouter.ts";
const router = Router();

router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/eventForm', formRouter)
router.use('/task', taskRouter)
// router.use('/task', formRouter)

export default router