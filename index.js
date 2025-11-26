const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const path = require('path'); // <-- ¡Librería clave que faltaba!
const app = express();
const port = 3000; // Vercel ignora esto, pero es necesario para Express

// Configuración de clave (LEÍDA DE VERCEL)
const YOUR_API_KEY = process.env.HEYGEN_API_KEY; 

// 1. MIDDLEWARE
app.use(express.json());

// 2. RUTA ESTÁTICA PARA ARCHIVOS (CSS, JS)
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. CORS
app.use(cors());

// 4. RUTA RAÍZ (FIX para "Cannot GET /")
app.get('/', (req, res) => {
  // Ahora Express encuentra el archivo en cualquier hosting
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. RUTA DE PRE-PETICIÓN (OPTIONS) - FIX para 404/405
app.options('/get-access-token', cors()); 

// 6. RUTA POST (Token Generator)
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
    // Devolvemos 500 para indicar fallo de autenticación
    res.status(500).json({ error: 'Error al obtener token' }); 
  }
});

app.listen(port, () => {
  console.log(`✅ Servidor Express listo`);
});
