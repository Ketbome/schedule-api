import express, { Request, Response } from "express";
import { variablesConfig } from "./enviroments/variablesConfig";

const app = express();

const PORT = variablesConfig.PORT;

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

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
