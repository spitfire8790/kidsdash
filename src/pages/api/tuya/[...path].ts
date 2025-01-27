import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const tuyaPath = Array.isArray(path) ? path.join('/') : path;
  const tuyaUrl = `https://openapi.tuyaeu.com/v1.0/${tuyaPath}`;

  try {
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
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'API Error', details: error.message });
  }
} 