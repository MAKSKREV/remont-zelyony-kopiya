# -*- coding: utf-8 -*-
"""«Правки 5»: убрать неопределённость, писать только фактами.

Что делаем:
  - слайды 5 и 13: удаляем условные плашки «Не дотягивается М3х16 — возьми М3х20»
  - заметки слайдов 5 и 13: только факт (используются винты М3х16, 2 шт)
  - слайд 28: «как на слайде» -> «как на фото»
  - слайд 30: вопрос -> факт (разбор неисправностей в конце инструкции)
  - слайд 47: вопрос -> факт (после проверки пунктов проверяем ход)
"""
import sys, os

sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation
from pptx.util import Pt

BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
SRC = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки 4).pptx")
OUT = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки 5).pptx")

OLD_NOTE = ("Основной винт здесь - М3х16. Если М3х16 нет, ставь М3х20 "
            "(в комплекте их 6 шт, на эти два шага нужно 4). В комплекте винтов М3х16 нет - "
            "докупить 4 шт: по 2 на этот слайд и на слайд «Подготавливаем детали для установки».")
NEW_NOTE = "В этом шаге используются винты М3х16 - 2 шт."

prs = Presentation(SRC)

# ---- 1. слайды 5 и 13: снять плашки, заметки -> факт
for no in (5, 13):
    s = prs.slides[no - 1]
    for sh in list(s.shapes):
        if sh.has_text_frame and "Не дотягивается" in sh.text_frame.text:
            sh._element.getparent().remove(sh._element)
            print(f"[{no}] плашка удалена")
    ntf = s.notes_slide.notes_text_frame
    if OLD_NOTE in ntf.text:
        ntf.text = ntf.text.replace(OLD_NOTE, NEW_NOTE)
        print(f"[{no}] заметки -> факт")

# ---- 2. слайд 28: «как на слайде» -> «как на фото»
s28 = prs.slides[27]
for sh in s28.shapes:
    if sh.has_text_frame and "как на слайде" in sh.text_frame.text:
        for p in sh.text_frame.paragraphs:
            runs = p.runs
            if not runs:
                continue
            full = "".join(r.text for r in runs)
            if "как на слайде" in full:
                for r in runs[1:]:
                    r.text = ""
                runs[0].text = full.replace("как на слайде", "так же, как на фото")
        print("[28] «как на слайде» -> «так же, как на фото»")

# ---- 3. слайд 30: вопрос -> факт
s30 = prs.slides[29]
for sh in s30.shapes:
    if not sh.has_text_frame:
        continue
    for p in sh.text_frame.paragraphs:
        runs = p.runs
        if not runs:
            continue
        full = "".join(r.text for r in runs)
        if "Шагоход не поедет?" in full:
            for r in runs[1:]:
                r.text = ""
            runs[0].text = "Разбор неисправностей шагохода - в конце инструкции."
            print("[30] вопрос -> факт")

# ---- 4. слайд 47: вопрос -> факт
s47 = prs.slides[46]
for sh in s47.shapes:
    if not sh.has_text_frame:
        continue
    for p in sh.text_frame.paragraphs:
        runs = p.runs
        if not runs:
            continue
        full = "".join(r.text for r in runs)
        if "Все пункты в порядке?" in full:
            for r in runs[1:]:
                r.text = ""
            runs[0].text = ("Проверяем все пункты по порядку, затем ставим шагоход "
                            "на ровную поверхность и проверяем ход.")
            print("[47] вопрос -> факт")

prs.save(OUT)
print("\nсохранено:", OUT)
print("слайдов:", len(prs.slides))
