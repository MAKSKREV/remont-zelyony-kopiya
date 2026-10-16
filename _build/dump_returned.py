# -*- coding: utf-8 -*-
"""Полный дамп вернувшейся версии + привязка комментариев к формам."""
import sys, os, zipfile, re
from xml.etree import ElementTree as ET
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation
from pptx.util import Emu

BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
P = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки) 3 (2).pptx")
prs = Presentation(P)

print("=== полный текстовый дамп ===")
for i, s in enumerate(prs.slides, 1):
    print(f"\n[{i}] макет={s.slide_layout.name}")
    for sh in s.shapes:
        kind = {13: "ФОТО", 6: "ГРУППА", 17: "ТЕКСТ", 1: "ФИГУРА", 14: "PH"}.get(sh.shape_type, str(sh.shape_type))
        if sh.has_text_frame and sh.text_frame.text.strip():
            for p in sh.text_frame.paragraphs:
                if not p.runs:
                    continue
                r0 = p.runs[0]
                sz = r0.font.size.pt if r0.font.size else "насл."
                print(f"    {kind} [{sz}pt]: {p.text.strip()[:95]}")
        elif sh.shape_type == 13:
            print(f"    ФОТО ({Emu(sh.left).inches:.2f},{Emu(sh.top).inches:.2f} "
                  f"{Emu(sh.width).inches:.2f}x{Emu(sh.height).inches:.2f})")

# замечания о наличии моих слайдов
z = zipfile.ZipFile(P)
xml_all = ""
for n in z.namelist():
    if n.startswith("ppt/slides/slide") and n.endswith(".xml"):
        xml_all += z.read(n).decode("utf-8", "ignore")
for probe in ("DIN 7985", "Комплект", "не дотягивается", "М3х10", "М3х16", "М3х20", "М3х30"):
    print(f"есть «{probe}»: {len(re.findall(re.escape(probe), xml_all))} совп.")