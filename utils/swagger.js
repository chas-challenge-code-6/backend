// utils/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Sentinel API",
      version: '1.0.0',
      description: 'API documentation for user authentication and other routes',
    },
    servers: [
      {
        url: 'https://backend-pvrm.onrender.com',
      },
    ],
  },
  apis: ['./routes/*.js'], // Scans all route files for Swagger comments
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
