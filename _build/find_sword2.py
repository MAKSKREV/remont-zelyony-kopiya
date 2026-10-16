# -*- coding: utf-8 -*-
import os, sys
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"C:\Users\Maks\Desktop"
SKIP = {"node_modules", ".git", "DCIM", "Pictures", "MiFlash20220507", "platform-tools"}
NEEDLES = ["световой", "световому", "меч ", " меч", "светодиод", "arduino", "робототехн",
           "короткое замыкание", " схема", "схем", "переключ", "замыкан"]
hits = []
exts = {".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".py", ".txt", ".html", ".csv",
        ".sql", ".ino", ".cpp", ".c", ".xml", ".yml", ".yaml", ".db", ".sqlite", ".cfg", ".env"}
for base, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in SKIP]
    if base[ len(ROOT):].count(os.sep) > 5:
        dirs[:] = []
    for f in files:
        lowf = f.lower()
        if any(s in lowf for s in ("меч", "светов", "урок", "занят", "arduino")):
            hits.append(("NAME", os.path.join(base, f)))
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext not in exts:
            continue
        p = os.path.join(base, f)
        try:
            if os.path.getsize(p) > 3_000_000:
                continue
            with open(p, "rb") as fh:
                data = fh.read()
        except Exception:
            continue
        try:
            txt = data.decode("utf-8", errors="ignore")
        except Exception:
            continue
        low = txt.lower()
        for needle in NEEDLES:
            if needle in low:
                hits.append(("TEXT:" + needle, p))
                break
seen = set()
for kind, p in hits:
    if p in seen:
        continue
    seen.add(p)
    print(kind, "|", p)
print("total:", len(seen))