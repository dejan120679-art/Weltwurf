// Weltwurf — Radio-Garden-Proxy (umgeht CORS). Nur radio.garden-URLs erlaubt.
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const u = req.query.u;
  if (!u || !/^https:\/\/radio\.garden\//.test(u)) {
    return res.status(400).json({ error: "nur radio.garden" });
  }
  try {
    const r = await fetch(u, { headers: { "User-Agent": "Weltwurf/1.0 (+https://github.com/dejan120679-art/Weltwurf)" } });
    const txt = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(r.status).send(txt);
  } catch (e) {
    return res.status(502).json({ error: "fetch fehlgeschlagen" });
  }
}
