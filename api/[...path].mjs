import { api } from '../server.mjs';

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host ?? 'localhost'}`);
  try {
    await api(req, res, url.pathname);
  } catch (error) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Unexpected sandbox API error.' }));
    }
  }
}
