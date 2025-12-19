import express from "express";
import dailyRoutes from "./daily.js";
import taskRoutes from "./tasks.js";
import summaryRoutes from "./summary.js";

const router = express.Router();

router.use("/daily", dailyRoutes);
router.use("/tasks", taskRoutes);
router.use("/summary", summaryRoutes);


export default router;
