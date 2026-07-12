# WELTWURF — Projektanweisung

## Was die App ist

Weltwurf wirft den Nutzer an einen zufälligen Punkt auf festem Land und macht daraus einen **Fund**: Berg, Tal, See, Dorf, Geisterstadt — was immer dort benannt ist. Der Fund erscheint als **QSL-Karte** (Typ-Stempel, Name, Land, Steckbrief, Weltkarte mit Signalbahn, Fotos, Erzähltext) und lässt sich auf Wunsch **hören**: das nächste Radio der Gegend, mit Einfang-Ritual. Funde landen im Logbuch, Sender in der Frequenz-Sammlung.

**Leitsatz: Nichts ist erfunden.** Jede Angabe stammt aus offenen Quellen. Das ist nicht verhandelbar und schlägt jede andere Anforderung.

## Architektur

- **Eine Datei:** `index.html` — komplette App, Vanilla JS, kein Framework, kein Build, keine Webfonts, PWA-Manifest inline. Muss auch als lokale Datei (ohne Proxy) voll funktionieren.
- **`api/anthropic.js`** — Vercel-Serverless-Proxy zur Anthropic-API (Muster Klangsaat). Schlüssel nur in der Umgebungsvariable `ANTHROPIC_API_KEY`.
- **Deploy:** GitHub-Repo → Vercel. Stabile URL ist Pflicht (localStorage hängt an der Herkunft — Datei-Weitergabe zerstört Logbuch und Favoriten).

## Datenquellen (fest)

| Zweck | Quelle |
|---|---|
| Fund bestimmen | Nominatim reverse (zoom 14, extratags) |
| Fund-Fallback | Wikipedia geosearch 10/30/100 km → Gegend |
| Typ + Fakten | Wikidata (P31, P1082, P571, P2044, P18), OSM-Tags |
| Text | Wikipedia (de, dann en) |
| Fotos | Wikidata P18 zuerst, dann Commons-Geosearch mit Distanz-Malus |
| Radio | radio-browser.info (Stufen: Ort → nah ≤60 km → Region → Land) |
| Erzählung | Claude via `/api/anthropic`, Modell `claude-sonnet-4-6` |
| Übersetzung | Google-Translate-Endpunkt, Fallback: Originaltext |

## Kernmechaniken (nicht ohne ausdrücklichen Auftrag ändern)

1. **Wurf:** Ticker springt über Land-Zellen (`LAND_ZELLEN`, cos-gewichtet). Wo der Nutzer stoppt, wird gelandet — kein Sprung, kein Trick.
2. **Fund-Kaskade** in `findeFund()`: Siedlung → benanntes Naturmerkmal → nächster Wikipedia-Artikel → Gegend. Leerwürfe sind baulich unmöglich; diese Garantie darf keine Änderung brechen.
3. **Typ-Stempel:** nur aus Belegen (OSM-Schlüssel, Wikidata P31, wörtliche Wikipedia-Aussage). Ohne Beleg heißt es „Fund", nie geraten.
4. **Erzählstimme** `erzaehleFund()`: Claude bekommt Fakten + Quellenauszug, System-Prompt mit noFakeRule (nichts erfinden, keine unbelegten Floskeln; Fremd-Auszug → Bezug ausdrücklich klarmachen). Bei Ausfall lautlos Heuristik `ortsAbsatz()`. 2–4 Sätze, nie mehr.
5. **Radio als eigener Akt:** nichts spielt automatisch — erst „Wie klingt dieser Ort?". Wächter mit Stillstands-Prüfung (spuriose `stalled`-Events abfangen), max. 2 Reconnects.
6. **Fremd-Inhalte kennzeichnen:** Texte/Fotos, die nicht den Fund selbst zeigen, tragen immer sichtbare Herkunft („Der Ort selbst schweigt — …", „x km entfernt", „Region ·").
7. **Audio:** Rauschen/Morse/Klack über WebAudio; `klarstellen()` suspendiert den Context (Android-Fix — nicht anrühren). iOS: Volume nicht setzbar, Fade über muted-Pfad.

## Design-System

- **Konzept:** Post/QSL. Papier = das Gefundene, Stempelrot = Aktion/Objekt, Phosphor-Teal = lebendes Signal. Karten (Radar, Wurfbahn, Fundkarte) sind gerahmte Nachtfenster.
- **Tag/Nacht:** automatisch über `istNacht()` (20–6 Uhr) via `html[data-modus]`. **Alle Farben nur über CSS-Variablen** — kein Hexwert direkt in Regeln, sonst bricht der Nachtmodus.
- Sparsame Animation, `prefers-reduced-motion` pflegen, Fokus-Ringe erhalten, Tap-Ziele ≥ 44 px, max-width 520 px.
- Ton der Texte: lakonisch, konkret, deutsch. Keine Ausrufezeichen-Euphorie.

## Entwicklungs-Protokoll (verbindlich)

1. **Vor jeder Abgabe validieren:** Script extrahieren, `node --check`; zusätzlich prüfen: keine verwaisten Funktions-/ID-Referenzen, jede benutzte CSS-Variable definiert (Tag- und Nachtblock), jede `$("id")` hat ihr HTML-Element.
2. **Chirurgisch editieren** (str_replace-Logik), nie die Datei blind neu generieren — sie enthält große Base64-Blöcke (`LAND_B64`).
3. **Risikostufe nennen** vor jedem Eingriff: 🟢 kosmetisch / 🟡 Logik / 🔴 Kernmechanik. 🔴 nur auf wörtlichen Auftrag.
4. **Ehrlich über Grenzen:** Was Quellen nicht hergeben, wird nicht simuliert. Lieber „der Ort schweigt" als erfundene Fülle.
5. **Iteration am lebenden Objekt:** Dejan testet unter der Vercel-URL, meldet Fundname/Screenshot/Fehler — gepatcht wird gezielt gegen das Repo.
6. Neue Features erst nach Real-Nutzung bewerten, nicht auf Vorrat bauen (Treibgut-Regel).

## Speicher (localStorage)

`weltwurf_besucht_v3` (Logbuch, max 500) · `weltwurf_favoriten_v1` (Frequenz-Sammlung, max 200) · `weltwurf_sender` (zuletzt gespielt, 25, für Abwechslung) · `weltwurf_flecken`. Schemata nur abwärtskompatibel erweitern.

## Offene Punkte

- Live-Test der Fund-Kaskade in Extremlagen (Sibirien, Sahara, Ozeanien) und der Erzählqualität pro Typ.
- Sender-Qualität in radio-arm getaggten Ländern beobachten (Vietnam-Fall).
- Später prüfen: Teilen der QSL-Karte als Bild; Kosten-Monitoring der API-Aufrufe.
