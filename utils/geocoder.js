import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import NodeGeocoder from "node-geocoder";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

const geocoderOptions = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(geocoderOptions);

export default geocoder;
