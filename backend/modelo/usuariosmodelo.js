class UsuariosController {
    constructor() {
        // Inicializar Firebase Admin al crear la instancia
        try {
            this.admin = require('./firebaseAdmin');
        } catch (error) {
            console.error('Error al inicializar Firebase Admin:', error);
            throw error;
        }
    }

    async consultarDetalle(req, res) {
        try {
            let iden = req.query.iden;
            if (!iden) {
                return res.status(400).json({ error: 'Se requiere el parámetro iden' });
            }

            const userDoc = await this.admin.firestore().collection('users').doc(iden).get();

            if (!userDoc.exists) {
                return res.status(404).json({ error: 'Usuario no encontrado: ' + iden });
            }

            const userData = userDoc.data();
            return res.status(200).json(userData);
        } catch (err) {
            console.error('Error al consultar usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
        }
    }

    async ingresar(req, res) {
        try {
            // Validar que todos los campos requeridos estén presentes
            const { dni, nombre, apellidos, email } = req.body;
            if (!dni || !nombre || !apellidos || !email) {
                return res.status(400).json({ 
                    error: 'Faltan campos requeridos',
                    required: ['dni', 'nombre', 'apellidos', 'email'],
                    received: req.body
                });
            }

            // Usar el DNI como ID del documento
            const docRef = await this.admin.firestore()
                .collection('users')
                .doc(dni)
                .set({
                    dni,
                    nombre,
                    apellidos,
                    email,
                    createdAt: this.admin.firestore.FieldValue.serverTimestamp()
                });

            res.status(200).json({ 
                message: "Usuario agregado exitosamente",
                userId: dni
            });
        } catch (err) {
            console.error('Error al crear usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
        }
    }
}

module.exports = new UsuariosController();