# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation
from pptx.util import Emu

P = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\Копия Инструкция по сборке (фото) - шагоход (правки).pptx"
prs = Presentation(P)

lay = prs.slide_layouts[1]
print("=== LAYOUT CUSTOM_2 placeholders ===")
for ph in lay.placeholders:
    print(f"  idx={ph.placeholder_format.idx} type={ph.placeholder_format.type} "
          f"name={ph.name!r} pos=({Emu(ph.left).inches:.2f},{Emu(ph.top).inches:.2f}) "
          f"size=({Emu(ph.width).inches:.2f}x{Emu(ph.height).inches:.2f})")

s37 = prs.slides[36]
print("\n=== слайд 37 shapes detail ===")
for sh in s37.shapes:
    print(" ", sh.shape_type, repr(sh.name))
    if sh.shape_type == 6:  # group
        for sub in sh.shapes:
            print("    sub:", sub.shape_type, repr(sub.name),
                  "has_image:", sub.shape_type == 13)
    if sh.is_placeholder:
        print("    PH idx=", sh.placeholder_format.idx, "type=", sh.placeholder_format.type)
    if sh.has_text_frame:
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                col = None
                try:
                    col = r.font.color.rgb
                except Exception:
                    col = r.font.color.type
                print(f"    run: {r.text[:50]!r} font={r.font.name} "
                      f"size={r.font.size.pt if r.font.size else None} bold={r.font.bold} color={col}")

# посмотрим на текстовый слайд 2 - какие шрифты по умолчанию
print("\n=== слайд 2: master txStyles ===")
master = prs.slide_masters[0]
for style_name in ("title_style", "body_style", "other_style"):
    st = getattr(master, style_name, None)
    if st is not None:
        print(f"  {style_name}: lvl1 font={st.font.name} size={st.font.size}")
from pptx.oxml.ns import qn
theme = master.element.getroottree()
print("\n=== цвета темы ===")
for el in master.element.iter():
    if el.tag in (qn("a:dk1"), qn("a:lt1"), qn("a:dk2"), qn("a:lt2"), qn("a:accent1"), qn("a:accent2"), qn("a:accent3")):
        child = el[0] if len(el) else None
        print("  ", el.tag.split("}")[1], child.get("val") if child is not None else None)