const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user');

const app = express();
app.use(express.json()); // Corrección aquí

// Conectar a MongoDB con manejo de errores
mongoose.connect('mongodb+srv://renovado:Valery2207@cluster0.jjch1.mongodb.net/auth?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

app.post('/register', async (req, res) => {
    try {
        const { body } = req; 
        console.log("Body recibido:", body);

        // Verificar si el usuario ya existe
        const isUser = await User.findOne({ email: body.email });
        if (isUser) {
            return res.status(403).json({ message: 'El usuario ya existe' });
        }

        // Hash de la contraseña con 10 rondas de salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        // Crear usuario
        const user = await User.create({ email: body.email, password: hashedPassword });

        res.status(201).json({ _id: user._id, message: "Usuario registrado exitosamente" });

    } catch (err) {
        console.error('Error en /register:', err);
        res.status(500).json({ error: err.message });
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
