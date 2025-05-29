var express = require('express');
var cors = require("cors");
var serverless = require ('serverless-http');
var port = process.env.PORT || 5000;
var app = express();
var usuroutes = require("../../backend/routes/usuariosrutas.js");
 
//Ejemplo de función con manejo posterior de persistencia
//segundo comentario
 
app.use(express.json());
app.use(cors());
 
var router = express.Router();
router.use("/usuarios", usuroutes);
 
app.use('/.netlify/functions', router);
module.exports.handler = serverless(app);