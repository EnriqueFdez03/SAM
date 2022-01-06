const express = require('express');
const { createServer } = require("http");
require('dotenv').config();

const port = process.env.PORT;
const app = express();
const server = createServer(app);


app.use('/',express.static('public'));
server.listen(port, () => {console.log(`corriendo en el puerto ${port}`)});