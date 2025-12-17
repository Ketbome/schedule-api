import express from "express";
import { variablesConfig } from "./config/variablesConfig";
import { connectDB } from "./config/database";
import agendaRoutes from "./routes/agenda.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/agenda", agendaRoutes);

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
