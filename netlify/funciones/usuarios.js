var express = require('express');
var cors = require("cors");
var serverless = require('serverless-http');
var app = express();
var usuroutes = require("../../backend/routes/usuariosrutas.js");

// Configuración mejorada de CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sistema de logging avanzado
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    if (req.body) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la aplicación
app.use('/.netlify/functions/usuarios', usuroutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Manejador para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports.handler = serverless(app);