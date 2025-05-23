import express from "express";
import authRouter from "./authRouter.js";
import doctorRouter from "./doctorRouter.js";
import patientRouter from "./patientRouter.js";
import statisticRouter from "./statisticRouter.js";
import { handleUnexpectedError } from "../middlewares/handleUnexpectedError.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/doctor", doctorRouter);
router.use("/patient", patientRouter);
router.use("/statistic", statisticRouter);

router.use(handleUnexpectedError);

export default router;
