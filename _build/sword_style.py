# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation
from pptx.util import Emu
P = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\5. Инструкция для сборки Светового меча.pptx"
prs = Presentation(P)

layouts = prs.slide_masters[0].slide_layouts
for i, L in enumerate(layouts, 1):
    print(i, L.name)

print("\n===== slide 24 layout indices =====")
s24 = prs.slides[23]
print("layout:", s24.slide_layout.name)
print("slide size:", prs.slide_width, prs.slide_height)

print("\n===== slide 24 shapes =====")
for sh in s24.shapes:
    print(type(sh).__name__, "| name:", sh.shape_type,
          "| pos:", round(sh.left), round(sh.top), "| size:", round(sh.width), round(sh.height))
    if sh.has_text_frame and sh.text_frame.text.strip():
        print("   TEXT:", sh.text_frame.text.strip().replace("\n", " // ")[:120])
        for p in sh.text_frame.paragraphs[:2]:
            for r in p.runs:
                f = r.font
                print("     run:", repr(r.text[:40]), "sz", f.size, "name", f.name, "bold", f.bold,
                      "color", f.color.rgb if f.color and f.color.type else None,
                      "align", p.alignment)

print("\n===== CUSTOM_2 layout placeholders (used by slide 24) =====")
idx = [i for i, L in enumerate(layouts, 1) if L.name == "CUSTOM_2"][0]
L = layouts[idx - 1]
for ph in L.placeholders:
    pf = ph.placeholder_format
    print("PH idx", pf.idx, pf.type, "pos", round(ph.left), round(ph.top),
          "size", round(ph.width), round(ph.height))