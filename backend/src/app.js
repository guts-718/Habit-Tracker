import express from "express";
import "./db/index.js";
import "./jobs/weeklyReportJob.js";
import routes from "./routes/index.js";
import cors from "cors";



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use("/api",routes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
