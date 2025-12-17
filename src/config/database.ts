import mongoose from "mongoose";
import { variablesConfig } from "./variablesConfig";

export async function connectDB(): Promise<void> {
  const uri = variablesConfig.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está definida");
  }

  await mongoose.connect(uri);
  console.log("MongoDB conectado");
}
