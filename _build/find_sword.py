# -*- coding: utf-8 -*-
import os, sys
sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"C:\Users\Maks\Desktop"
SKIP_DIRS = {"node_modules", ".git", "DCIM", "Pictures", "MiFlash20220507",
             "platform-tools", "protoc-35.0-rc-2-win64", "Digistump Drivers",
             "usb_driver", "How to Fish", "Yolo", "vpn", "unlock", "bat",
             "CV", "dcim"}
PATTERNS = ["световой меч", "световому мечу", "меч", "короткое замыкание", "КЗ"]
hits = []
exts = {".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".py", ".txt", ".html", ".csv", ".sql"}
for base, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    depth = base[len(ROOT):].count(os.sep)
    if depth > 4:
        dirs[:] = []
        continue
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext not in exts:
            continue
        p = os.path.join(base, f)
        try:
            if os.path.getsize(p) > 2_000_000:
                continue
            with open(p, "r", encoding="utf-8", errors="ignore") as fh:
                data = fh.read()
        except Exception:
            continue
        low = data.lower()
        for pat in PATTERNS:
            if pat.lower() in low:
                hits.append((p, pat, low.count(pat.lower())))
                break
for p, pat, c in hits:
    print(c, "|", pat, "|", p)
print("total hits:", len(hits))