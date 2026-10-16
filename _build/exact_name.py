# -*- coding: utf-8 -*-
import os, glob, sys
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
files = sorted(glob.glob(os.path.join(BASE, "*.pptx")), key=os.path.getmtime, reverse=True)
for f in files:
    print(os.path.getmtime(f), "|", os.path.basename(f), "|", repr(f))