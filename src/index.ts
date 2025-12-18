import express from "express";
import swaggerUi from "swagger-ui-express";
import { variablesConfig } from "./config/variablesConfig";
import { connectDB } from "./config/database";
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

async function start() {
  try {
    await connectDB();

    app.listen(variablesConfig.PORT, () => {
      console.log(`
      ******************************************
      Server running at PORT: ${variablesConfig.PORT}
      Environment: ${variablesConfig.NODE_ENV}
      ******************************************
      `);
    });
  } catch (err) {
    console.error("Error iniciando servidor:", err);
    process.exit(1);
  }
}

start();
