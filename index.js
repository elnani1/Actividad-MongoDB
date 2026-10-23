require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Conectado exitosamente a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

// Esquema y Modelo para la colección "Empleados"
const empleadoSchema = new mongoose.Schema({
  clave: { type: Number },
  nombre: { type: String },
  direccion: { type: String },
  fechadenacimiento: { type: Date},
  sexo: { type: String }, // Puede ser string o número según tu preferencia
  tipodesangre: { type: String}
});

const Empleado = mongoose.model('Empleado', empleadoSchema, 'Empleados');

// --- MÉTODOS REST ---

// 1. GET: Obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// 2. GET (Opcional): Obtener un empleado por su clave numérica
app.get('/api/empleados/:clave', async (req, res) => {
  try {
    const empleado = await Empleado.findOne({ clave: req.params.clave });
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// 3. POST: Crear un nuevo empleado
app.post('/api/empleados', async (req, res) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const guardado = await nuevoEmpleado.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// 4. PUT: Actualizar un empleado existente buscándolo por su clave
app.put('/api/empleados/:clave', async (req, res) => {
  try {
    const actualizado = await Empleado.findOneAndUpdate(
      { clave: req.params.clave },
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado para actualizar' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// 5. DELETE: Eliminar un empleado por su clave
app.delete('/api/empleados/:clave', async (req, res) => {
  try {
    const eliminado = await Empleado.findOneAndDelete({ clave: req.params.clave });
    if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado para eliminar' });
    res.json({ mensaje: 'Empleado eliminado correctamente', eliminado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Configuración de puerto dinámico para hosting (Render, Railway, etc.) o local (3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));