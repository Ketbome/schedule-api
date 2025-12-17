import express from "express";
import { variablesConfig } from "./config/variablesConfig";
import agendaRoutes from "./routes/agenda.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

const PORT = variablesConfig.PORT;

app.use("/api/agenda", agendaRoutes);

app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`
      ******************************************
      Server running at PORT: ${PORT}
      Environment: ${variablesConfig.NODE_ENV}
      ******************************************
    `);
  })
  .on("error", (error: Error) => {
    throw new Error(error.message);
  });
