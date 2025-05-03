import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "colors";
import Bootcamp from "../models/BootcampModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

// Connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected".bgCyan))
  .catch((error) =>
    console.log(`Error while connecting to database: \n ${error}`.red.bold)
  );

// Read json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Import into database
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Imported...".green.inverse);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
