import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import NodeGeocoder from "node-geocoder";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

/**
 * @typedef {Object} GeocoderOptions
 * @property {string} provider - The geocoding service provider (e.g., 'mapquest')
 * @property {string} apiKey - API key for the geocoding service
 * @property {null} formatter - Custom formatter for results (null uses default)
 */

/**
 * Configuration options for the geocoder
 * @type {GeocoderOptions}
 */

/**
 * Initialized NodeGeocoder instance
 * @type {import('node-geocoder').Geocoder}
 */
const geocoderOptions = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(geocoderOptions);

export default geocoder;
