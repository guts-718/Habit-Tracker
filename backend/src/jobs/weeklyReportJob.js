import cron from "node-cron";
import { runWeeklyExport } from "../services/autoWeeklyExport.js";

// Sunday 11:30 PM IST
cron.schedule(
  "30 23 * * 0",
  async () => {
    console.log("⏰ Running weekly report job...");
    await runWeeklyExport();
  },
  {
    timezone: "Asia/Kolkata"
  }
);
