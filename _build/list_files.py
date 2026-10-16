# -*- coding: utf-8 -*-
import os, sys
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
for f in sorted(os.listdir(BASE)):
    p = os.path.join(BASE, f)
    if os.path.isfile(p) and f.lower().endswith((".pptx", ".pdf", ".docx", ".xlsx", ".txt", ".md")):
        print(f"{os.path.getsize(p)/1e6:8.2f} MB  |  {f}")