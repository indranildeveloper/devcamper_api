import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import bootcampRoutes from "../routes/bootcampRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

const app = express();

// Mount routes
app.use("/api/v1/bootcamps", bootcampRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
  );
});
