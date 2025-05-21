import fs from "fs";
import specs from "./swagger.js";

// Wrire the specs to openapi.json
fs.writeFileSync(
  "./public/openapi/openapi.json",
  JSON.stringify(specs, null, 2),
);
