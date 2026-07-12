# Weltwurf

Ein Wurf, ein Fund: Berg, Tal, See, Dorf, Geisterstadt — irgendwo auf der Welt.
Weltwurf zeigt, was gefunden wurde (QSL-Karte mit Typ-Stempel, Steckbrief, Fotos,
Wurfkarte), lässt Claude den Fund aus belegten Quellen erzählen und spielt auf
Wunsch das nächste Radio der Gegend. Funde landen im Logbuch, Sender in der
Frequenz-Sammlung. Tagsüber Papieroptik, ab 20 Uhr die Nachtausgabe.

## Deploy (einmalig, ~5 Minuten)

1. **Repo:** Dieses Verzeichnis als GitHub-Repo `weltwurf` hochladen
   (`index.html`, `api/anthropic.js`, `README.md`).
2. **Vercel:** vercel.com → *Add New Project* → das Repo importieren →
   Framework „Other", keine Build-Einstellungen nötig → *Deploy*.
3. **API-Schlüssel:** Projekt → *Settings → Environment Variables* →
   `ANTHROPIC_API_KEY` = dein Anthropic-Schlüssel → *Save* → *Redeploy*.

Fertig: `https://weltwurf.vercel.app` (bzw. dein Projektname).

## Verhalten ohne Schlüssel

Fehlt der Proxy oder der Schlüssel, fällt die Erzählung lautlos auf die
eingebaute Satz-Auswahl-Heuristik zurück — die App bleibt voll funktionsfähig.

## Quellen

OpenStreetMap/Nominatim · Wikipedia · Wikidata · Wikimedia Commons ·
radio-browser.info · Übersetzung: Google-Translate-Endpunkt (frei).
Grundregel der App: **Nichts ist erfunden** — Claude formuliert ausschließlich
aus dem mitgelieferten Quellenmaterial (System-Prompt mit noFakeRule).

## Dateien

- `index.html` — die gesamte App (eine Datei, PWA-Manifest inline)
- `api/anthropic.js` — Vercel-Serverless-Proxy zur Anthropic-API
