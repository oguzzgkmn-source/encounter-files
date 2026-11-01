"""Project Natural Earth 50m land to SVG paths for map views (Mercator). Usage: make_maps.py land50.geojson out.json"""
import json, math, sys
g = json.load(open(sys.argv[1]))
def merc(lat): return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
VIEWS = {
  "pacific": dict(lon=(-172, -48), lat=(-58, 68), W=1920, H=1080, pad=40),
  "baja":    dict(lon=(-123, -103), lat=(20.5, 35.5), W=1920, H=1080, pad=0),
}
out = {}
for name, v in VIEWS.items():
    lo0, lo1 = v["lon"]; y0, y1 = merc(v["lat"][0]), merc(v["lat"][1])
    sx = (v["W"] - 2 * v["pad"]) / math.radians(lo1 - lo0); sy = (v["H"] - 2 * v["pad"]) / (y1 - y0)
    s = min(sx, sy)
    ox = (v["W"] - s * math.radians(lo1 - lo0)) / 2; oy = (v["H"] - s * (y1 - y0)) / 2
    def P(lon, lat): return (ox + s * math.radians(lon - lo0), v["H"] - (oy + s * (merc(lat) - y0)))
    paths = []
    for feat in g["features"]:
        geom = feat["geometry"]; polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        for poly in polys:
            for ring in poly:
                lons = [p[0] for p in ring]; lats = [p[1] for p in ring]
                if max(lons) < lo0 - 10 or min(lons) > lo1 + 10 or max(lats) < v["lat"][0] - 10 or min(lats) > v["lat"][1] + 10: continue
                pts, last = [], None
                for lon, lat in ring:
                    lat = max(min(lat, 85), -85); x, y = P(lon, lat)
                    if last is None or abs(x - last[0]) + abs(y - last[1]) > 1.5: pts.append((x, y)); last = (x, y)
                if len(pts) > 2: paths.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z")
    out[name] = {"d": " ".join(paths), "lon0": lo0, "y0": y0, "s": s, "ox": ox, "oy": oy, "H": v["H"]}
    print(name, len(paths), "rings", len(out[name]["d"]) // 1024, "KB")
json.dump(out, open(sys.argv[2], "w"))
