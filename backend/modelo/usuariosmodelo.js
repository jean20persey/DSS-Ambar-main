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
            // Obtener el ID del usuario de los parámetros de ruta o query
            const iden = req.params.iden || req.query.iden;

            if (!iden) {
                return res.status(400).json({ error: 'Se requiere el ID del usuario' });
            }

            console.log('Buscando usuario con ID:', iden);

            const userDoc = await this.admin.firestore().collection('users').doc(iden).get();

            if (!userDoc.exists) {
                console.log('Usuario no encontrado:', iden);
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const userData = userDoc.data();
            console.log('Usuario encontrado:', userData);
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

            // Verificar si el usuario ya existe
            const existingUser = await this.admin.firestore()
                .collection('users')
                .doc(dni)
                .get();

            if (existingUser.exists) {
                return res.status(400).json({ 
                    error: 'Ya existe un usuario con este DNI'
                });
            }

            // Crear el nuevo usuario
            await this.admin.firestore()
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