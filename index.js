const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();
const port = 3000;

// Configuración de clave (TEMPORAL)
const YOUR_API_KEY = 'sk_V2_hgu_kQXZ1O9yDGV_ic6tKS91h9Dkwel19yNFrsdCVQSIU3pb'; // <-- ¡PEGAR CLAVE LARGA!

// 1. MIDDLEWARE
app.use(express.json());
app.use(express.static('public')); 

// 2. CORS: Habilita el manejo de la pre-petición OPTIONS
app.use(cors());

// 3. RUTA DE PRE-PETICIÓN (OPTIONS)
app.options('/get-access-token', cors()); 

// 4. RUTA POST (La que genera el Token)
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

app.listen(port, () => {
  console.log(`✅ Servidor listo en puerto ${port}`);
});
