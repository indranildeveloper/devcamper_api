import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevCamper API",
      version: "1.0.0",
      description:
        "Backend api for the DevCamper application to manage bootcamps, courses, reviews, users and authentication.",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development Server",
      },
      {
        url: "https://devcamper-prod.com",
        description: "Production Server",
      },
    ],
  },
  apis: ["./routes/*.js"],
  basePath: "/",
};

const specs = swaggerJsdoc(options);

export default specs;
