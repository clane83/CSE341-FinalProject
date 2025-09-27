const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Users Api',
        description: 'Users API Information'
    },
    host: '3000',
    schemes: ['http','https']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

//this will generate swagger.json
swaggerAutogen(outputFile, endpointFiles, doc);