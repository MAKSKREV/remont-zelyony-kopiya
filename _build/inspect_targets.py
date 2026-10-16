# -*- coding: utf-8 -*-
"""Детали целевых слайдов возвратной версии."""
import sys, os
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation
from pptx.util import Emu, Pt

BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
P = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки) 3 (2).pptx")
prs = Presentation(P)
print("слайдов:", len(prs.slides))
print("layout3 name:", prs.slide_layouts[1].name, "idx1")
for i, l in enumerate(prs.slide_layouts):
    print("  layout", i, l.name, [f"{ph.placeholder_format.idx}:{ph.placeholder_format.type}" for ph in l.placeholders])

for no in (5, 13, 16, 17, 28, 29, 47):
    s = prs.slides[no - 1]
    print(f"\n===== слайд {no} ===== layout={s.slide_layout.name}")
    for sh in s.shapes:
        info = f"  [{sh.shape_id}] {sh.shape_type} name='{sh.name}' " \
               f"({Emu(sh.left).inches:.2f},{Emu(sh.top).inches:.2f} " \
               f"{Emu(sh.width).inches:.2f}x{Emu(sh.height).inches:.2f})"
        if sh.is_placeholder:
            info += f" PH idx={sh.placeholder_format.idx}"
        print(info)
        if sh.has_text_frame:
            for pi, p in enumerate(sh.text_frame.paragraphs):
                if not p.runs:
                    continue
                r0 = p.runs[0]
                sz = r0.font.size.pt if r0.font.size else "насл"
                runs = "|".join(repr(r.text) for r in p.runs)
                print(f"      p{pi} [{sz}]: {runs}")
        if sh.shape_type == 6:
            print("      ГРУППА, состав:")
            for sub in sh.shapes:
                st = f"        {sub.shape_type} '{sub.name}' " \
                     f"({Emu(sub.left).inches:.2f},{Emu(sub.top).inches:.2f} {Emu(sub.width).inches:.2f}x{Emu(sub.height).inches:.2f})"
                if sub.has_text_frame and sub.text_frame.text.strip():
                    st += f" text='{sub.text_frame.text.strip()[:50]}'"
                print(st)

print("\n=== слайды с группами (бейдж) ===")
for i, s in enumerate(prs.slides, 1):
    gs = [sh for sh in s.shapes if sh.shape_type == 6]
    if gs:
        print(f"  слайд {i}: {len(gs)} групп -> {[g.name for g in gs]}")

print("\n=== заметки на 5,13,16,17,28,47 ===")
for no in (5, 13, 16, 17, 28, 47):
    s = prs.slides[no - 1]
    try:
        t = s.notes_slide.notes_text_frame.text
    except Exception as e:
        t = f"<нет заметок: {e}>"
    print(f"--- {no}: {t[:400]!r}")
