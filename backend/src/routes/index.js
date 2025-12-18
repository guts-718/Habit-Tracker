import express from "express";
import dailyRoutes from "./daily.js";
import taskRoutes from "./tasks.js";

const router = express.Router();

router.use("/daily", dailyRoutes);
router.use("/tasks", taskRoutes);

export default router;
