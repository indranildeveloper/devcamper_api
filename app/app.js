import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import qs from "qs";
import connectDB from "../database/database.js";
import bootcampRoutes from "../routes/bootcampRoutes.js";
import coursesRoutes from "../routes/courseRoutes.js";
import errorHandler from "../middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

// Connect to database
connectDB();

const app = express();

// Middlewares
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true, parameterLimit: 10000 }));
app.set("query parser", (str) => qs.parse(str, { parameterLimit: 10000 }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routes
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", coursesRoutes);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
