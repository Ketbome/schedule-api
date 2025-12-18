import app from "./app";
import { variablesConfig } from "./config/variablesConfig";
import { connectDB } from "./config/database";

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
