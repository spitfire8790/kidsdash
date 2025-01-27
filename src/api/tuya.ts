import type { APIRoute } from 'astro';

export const all: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const tuyaPath = url.pathname.replace('/api/tuya', '');
  const tuyaUrl = `https://openapi.tuyaeu.com${tuyaPath}`;

  try {
    const headers = Object.fromEntries(request.headers);
    delete headers.host;
    delete headers.connection;

    const response = await fetch(tuyaUrl, {
      method: request.method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'API Error', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}; 