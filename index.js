const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const path = require('path'); // <-- Importar path es crucial
const app = express();
const port = 3000;

// Configuración de clave (LECTURA SEGURA DE VERCEL)
// No es necesario pegar nada aquí, Vercel lo inyecta
const YOUR_API_KEY = process.env.HEYGEN_API_KEY; 

// 1. MIDDLEWARE
app.use(express.json());

// 2. RUTA ESTÁTICA PARA ARCHIVOS (CSS, JS)
// Express busca archivos JS/CSS en la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. CORS
app.use(cors());

// 4. RUTA RAÍZ (FIX definitivo para "Cannot GET /" en Vercel)
app.get('/', (req, res) => {
  // Envía el archivo index.html que está en la carpeta 'public'
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
    // Si la clave es inválida, HeyGen devolverá 401/403
    console.error("❌ ERROR: Clave API Inválida o Sin Permisos. Status:", error.response ? error.response.status : 'Network Error');
    res.status(500).json({ error: 'Error al obtener token' }); 
  }
});

app.listen(port, () => {
  // Este mensaje solo se ve en los logs de Vercel
  console.log(`✅ Servidor Express listo`);
});
