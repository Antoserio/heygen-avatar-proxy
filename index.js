const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 3000; 

// La clave se lee de Vercel (segura)
const YOUR_API_KEY = process.env.HEYGEN_API_KEY; 

// 1. MIDDLEWARE
app.use(express.json());
app.use(cors()); // Global CORS

// 2. RUTA DE PRE-PETICIÓN (OPTIONS)
app.options('/get-access-token', cors()); 

// 3. RUTA POST (Token Generator)
app.post('/get-access-token', async (req, res) => {
  try {
    const { data } = await axios.post(
      'https://api.heygen.com/v1/streaming.new_token',
      {},
      { 
        headers: { 
          'X-Api-Key': YOUR_API_KEY, 
        } 
      }
    );
    res.json(data);
  } catch (error) {
    console.error("❌ ERROR: Clave API Inválida o Sin Permisos. Status:", error.response ? error.response.status : 'Network Error');
    res.status(500).json({ error: 'Error al obtener token' }); 
  }
});

// Nota: No hay app.listen() porque Vercel lo maneja automáticamente.
