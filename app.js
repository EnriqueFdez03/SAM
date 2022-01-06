const express = require('express');
const { createServer } = require("http");

const app = express();
const server = createServer(app);


app.use('/',express.static('public'));
server.listen(8080, () => {console.log('servidor corriendo en el 8080')});