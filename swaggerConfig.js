
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe Reservation',
      version: '1.0.0', 
      description: 'can manage users,cafes and add reserves ',
    },
    servers: [
      {
        url: 'http://localhost:5000'
      },
      
    ],
  },
  // Point to your controllers and routes where you've added your Swagger comments.
  apis: ['./controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
