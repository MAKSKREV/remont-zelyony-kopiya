# -*- coding: utf-8 -*-
"""Ищем, где ещё встречаются размеры винтов в файлах проекта."""
import sys, re, glob, os
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation

BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
for f in sorted(glob.glob(os.path.join(BASE, "*.pptx"))):
    try:
        prs = Presentation(f)
    except Exception as e:
        print("не открывается:", os.path.basename(f), e)
        continue
    hits = []
    for i, s in enumerate(prs.slides, 1):
        texts = []
        for sh in s.shapes:
            if sh.has_text_frame:
                texts.append(sh.text_frame.text)
        try:
            texts.append(s.notes_slide.notes_text_frame.text)
        except Exception:
            pass
        blob = " ".join(texts)
        for m in re.finditer(r"[Вв]инт[а-я]*\s*[Мм]3?\s*[хx]\s*\d+|3\s*[хx]\s*\d{1,3}\s*(?=DIN|7985)", blob):
            hits.append((i, m.group(0).strip()))
    print(f"\n=== {os.path.basename(f)} — слайдов {len(prs.slides._sldIdLst)}")
    seen = {}
    for i, t in hits:
        seen.setdefault(t, []).append(i)
    for t, ss in sorted(seen.items()):
        print(f"   {t!r}: слайды {ss}")
    if not hits:
        print("   размеров винтов не найдено")
    # отдельно: любое упоминание 16 рядом с винт/штук/мм
    for i, s in enumerate(prs.slides, 1):
        for sh in s.shapes:
            if sh.has_text_frame and re.search(r"16", sh.text_frame.text):
                t = sh.text_frame.text.strip().replace("\n", " / ")
                if "винт" in t.lower() or "мм" in t.lower():
                    print(f"   !! слайд {i}: {t[:90]}")