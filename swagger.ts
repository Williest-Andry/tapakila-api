import swaggerAutogen from "swagger-autogen";

const doc = {
  openapi: "3.0.0",
  info: {
    title: "Tapakila API",
    description: "Event ticketing REST API",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000", description: "Development" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./doc/swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
