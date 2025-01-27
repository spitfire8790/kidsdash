import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Forward requests to Tuya API
app.all('/tuya/*', async (req, res) => {
  try {
    const tuyaUrl = `https://openapi.tuyaeu.com${req.url.replace('/tuya', '')}`;
    console.log('Proxying request to:', tuyaUrl);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    // Forward all headers except host and connection
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;

    const response = await fetch(tuyaUrl, {
      method: req.method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    console.log('Response:', data);
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 