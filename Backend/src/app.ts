import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import router from "./routes";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    const app = express();

    // Configurar CORS
    app.use(cors({ origin: "http://localhost:5173" }));

    // Middlewares
    app.use(express.json());
    app.use("/api", router); // Asegúrate de que el prefijo "/api" esté configurado

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((error) => console.log("Database connection error:", error));