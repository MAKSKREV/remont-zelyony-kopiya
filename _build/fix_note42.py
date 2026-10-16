# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation

P = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\Копия Инструкция по сборке (фото) - шагоход (правки).pptx"
prs = Presentation(P)
ntf = prs.slides[41].notes_slide.notes_text_frame
old = "Фото взяты из слайдов 23, 25, 29 и 35"
new = "Фото взяты из слайдов 23, 25, 30 и 36"
for p in ntf.paragraphs:
    for r in p.runs:
        if old in r.text:
            r.text = r.text.replace(old, new)
            print("было :", r.text)
            print("стало:", r.text)
prs.save(P)
print("\nпроверка:", prs.slides[41].notes_slide.notes_text_frame.text.replace("\n", " | ")[-120:])