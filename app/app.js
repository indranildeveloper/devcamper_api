import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import qs from "qs";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import connectDB from "../database/database.js";
import authRoutes from "../routes/authRoutes.js";
import bootcampRoutes from "../routes/bootcampRoutes.js";
import courseRoutes from "../routes/courseRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
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
// Cookie parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, parameterLimit: 10000 }));
app.set("query parser", (str) => qs.parse(str, { parameterLimit: 10000 }));

// Set static folder
app.use(express.static(path.join(__dirname, "../public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileUpload());

// Sanitize data
// app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// XSS clean
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routes
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

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
