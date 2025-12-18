import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import scheduleRoutes from "./routes/schedule.route";

const app = express();

app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/schedule", scheduleRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use(errorHandler);

export default app;

