import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost:27017/Clima/historial';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Definir el esquema y modelo de búsqueda
const searchSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number,
  dateTime: String,
});

const Search = mongoose.model('Search', searchSchema);

// Ruta para guardar búsqueda
app.post('/api/search', async (req, res) => {
  try {
    const search = new Search(req.body);
    await search.save();
    res.status(201).json(search);
  } catch (error) {
    console.error('Error guardando búsqueda:', error);
    res.status(500).json({ error: 'Error guardando búsqueda' });
  }
});

// Ruta para obtener historial de búsqueda
app.get('/api/search', async (req, res) => {
  try {
    const searches = await Search.find().sort({ dateTime: -1 });
    res.status(200).json(searches);
  } catch (error) {
    console.error('Error obteniendo historial de búsqueda:', error);
    res.status(500).json({ error: 'Error obteniendo historial de búsqueda' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
