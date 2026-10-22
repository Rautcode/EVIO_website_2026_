// Generates src/data/indiaOutline.js from datameet/maps Country/india-soi.geojson (Survey of India depiction).
// Usage: node scripts/india-map.cjs india-soi.geojson out.json   (then paste `d` into indiaOutline.js)
const fs = require('fs');
const g = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const feats = g.type === 'FeatureCollection' ? g.features : [g];
const polys = [];
for (const f of feats) {
  const geom = f.geometry || f;
  if (geom.type === 'Polygon') polys.push(geom.coordinates);
  else if (geom.type === 'MultiPolygon') polys.push(...geom.coordinates);
}
// Same projection the site uses for city markers: x = (lon - 68) * K, y = (37.5 - lat) * K * 1.1
const K = 12, P = (lon, lat) => [(lon - 68) * K, (37.5 - lat) * K * 1.1];
let d = '', kept = 0, minArea = 4; // drop tiny islets
const area = r => Math.abs(r.reduce((a, [x, y], i) => { const [x2, y2] = r[(i + 1) % r.length]; return a + x * y2 - x2 * y; }, 0) / 2);
for (const poly of polys) {
  const ring = poly[0].map(([lo, la]) => P(lo, la));
  if (area(ring) < minArea) continue;
  const pts = []; let last;
  for (const p of ring) { if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 1.1) { pts.push(p); last = p; } }
  if (pts.length < 4) continue;
  kept += pts.length;
  d += 'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + 'Z';
}
fs.writeFileSync(process.argv[3], JSON.stringify({ d }));
console.log('polys', polys.length, 'points', kept, 'bytes', d.length, 'props', JSON.stringify(feats[0].properties).slice(0, 200));
