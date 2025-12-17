import express from "express";
import "./db/index.js";
import routes from "./routes/index.js";


const app = express();

app.use(express.json());
app.use("/api",routes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
