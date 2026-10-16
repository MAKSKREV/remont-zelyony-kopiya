# -*- coding: utf-8 -*-
"""Шагоход, правки №2: слайд 24 (ссылка), список деталей на занятие 2, слайд с гифкой."""
import sys, copy
sys.stdout.reconfigure(encoding="utf-8")
from io import BytesIO

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn

PATH = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\Копия Инструкция по сборке (фото) - шагоход (правки).pptx"

FONT = "Arial"
ORANGE = RGBColor(0xFE, 0xA6, 0x21)
DARK = RGBColor(0x21, 0x21, 0x21)
GRAY = RGBColor(0x5F, 0x5F, 0x5F)
CARD = RGBColor(0xF2, 0xF3, 0xF5)

prs = Presentation(PATH)
layout = prs.slide_layouts[1]
BADGE_SRC = prs.slides[36]


def set_bullet(p, color="FEA621", indent=0.32):
    pPr = p._p.get_or_add_pPr()
    pPr.set("marL", str(Inches(indent)))
    pPr.set("indent", str(-Inches(indent)))
    buClr = pPr.makeelement(qn("a:buClr"), {})
    buClr.append(pPr.makeelement(qn("a:srgbClr"), {"val": color}))
    pPr.append(buClr)
    pPr.append(pPr.makeelement(qn("a:buSzPct"), {"val": "80000"}))
    pPr.append(pPr.makeelement(qn("a:buFont"), {"typeface": FONT}))
    pPr.append(pPr.makeelement(qn("a:buChar"), {"char": "\u25cf"}))


def para(tf, first=False, text=None, runs=None, size=18, bold=False, color=DARK,
         align=PP_ALIGN.LEFT, after=10, line=None, bullet=False):
    if runs is None:
        runs = [(text or "", {})]
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    if align is not None:
        p.alignment = align
    p.space_after = Pt(after)
    if line:
        p.line_spacing = line
    if bullet:
        set_bullet(p)
    for t, o in runs:
        r = p.add_run()
        r.text = t
        f = r.font
        f.name = o.get("font", FONT)
        f.size = Pt(o.get("size", size))
        f.bold = o.get("bold", bold)
        f.color.rgb = o.get("color", color)
    return p


def card(slide, x, y, w, h):
    sh = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    sh.fill.solid()
    sh.fill.fore_color.rgb = CARD
    sh.line.fill.background()
    sh.shadow.inherit = False
    sh.adjustments[0] = 0.06
    return sh


def set_notes(slide, goal, text, note):
    tf = slide.notes_slide.notes_text_frame
    tf.text = ""
    para(tf, first=True, text="Цель слайда:", size=12, bold=True, after=2)
    para(tf, text=goal, size=12, after=6)
    para(tf, text="Текст:", size=12, bold=True, after=2)
    para(tf, text=text, size=12, after=6)
    para(tf, text="Примечания:", size=12, bold=True, after=2)
    para(tf, text=note, size=12, after=0)


# ---------- A. Слайд 24: понятная ссылка + фото со слайда 17 ----------

s24 = prs.slides[23]
s24.shapes.title.text_frame.text = "Устанавливаем электронику - смотри слайд 17"

pics17 = [sh for sh in prs.slides[16].shapes if sh.shape_type == 13]
pics17.sort(key=lambda sh: -sh.width)          # берём самое крупное фото
blob, w, h = pics17[0].image.blob, pics17[0].width, pics17[0].height
box_w, box_h = Inches(2.15), Inches(2.35)
scale = min(box_w / w, box_h / h)
pw, ph = int(w * scale), int(h * scale)
s24.shapes.add_picture(BytesIO(blob), Inches(0.32) + int((box_w - pw) / 2),
                       Inches(1.0) + int((box_h - ph) / 2), pw, ph)
cap = s24.shapes.add_textbox(Inches(0.15), Inches(3.45), Inches(2.5), Inches(0.6))
cap.text_frame.word_wrap = True
para(cap.text_frame, first=True, size=13, color=GRAY, align=PP_ALIGN.CENTER, after=0,
     text="Кнопку и схему ставим как на слайде 17")
set_notes(s24, "Показать установку электроники в корпус.",
          "Электроника ставится так же, как кнопка и схема на слайде 17.",
          "Раньше тут была ссылка «как на слайде» без номера - ребёнок не понимал, куда смотреть. "
          "Теперь номер указан и рядом добавлено фото со слайда 17.")

# ---------- B. Слайд 41: убрать заглушку, гифка уже есть ----------

s41 = prs.slides[40]
for sh in s41.shapes:
    if sh.has_text_frame and "Добавить гифку" in sh.text_frame.text:
        sh.text_frame.paragraphs[0].runs[0].text = "Шагоход в движении"
        print("заглушка заменена на:", sh.text_frame.text.strip())
set_notes(s41, "Показать готовый результат - как шагоход ходит.",
          "Гифка работы шагохода.",
          "Гифка уже вставлена в этот слайд (файл 1,8 МБ) - подпись «Добавить гифку работы» "
          "была незакрытой задачей, заменил на название слайда.")

# ---------- C. Новый слайд «Что понадобится на занятии 2" ----------

s = prs.slides.add_slide(layout)
for ph in list(s.placeholders):
    if ph.placeholder_format.idx != 0:
        ph._element.getparent().remove(ph._element)
s.shapes.title.text_frame.text = "Занятие 2: что понадобится"
for sh in BADGE_SRC.shapes:
    if sh.shape_type == 6:
        s.shapes._spTree.append(copy.deepcopy(sh._element))

c = card(s, Inches(0.35), Inches(0.78), Inches(9.3), Inches(2.9))
tf = c.text_frame
tf.word_wrap = True
tf.margin_left = Inches(0.28)
tf.margin_right = Inches(0.22)
tf.margin_top = Inches(0.2)
tf.vertical_anchor = MSO_ANCHOR.TOP
items = [
    "Винты М3х20 - 2 шт. и гайки М3 - 2 шт.",
    "Деревянные шайбы - на 3 места: вал двигателя, крепление, вторая деталь.",
    "Электроника с занятия 1: батарейки, кнопка, двигатель, провода.",
    "Клей и инструмент - как на занятии 1.",
]
for i, t in enumerate(items):
    para(tf, first=(i == 0), runs=[(t, {})], size=17, after=11, line=1.1, bullet=True)

hint = s.shapes.add_textbox(Inches(0.35), Inches(3.9), Inches(9.3), Inches(1.0))
hint.text_frame.word_wrap = True
para(hint.text_frame, first=True, size=15, bold=True, color=ORANGE, after=4,
     text="Перед занятием разложи все детали по группам - так соберешь быстрее.")
para(hint.text_frame, size=13, color=GRAY,
     text="Винты на стенку и корпус (слайды 27, 33 и 36) в списке не указаны: "
          "допишите количество по факту - на слайдах видно, сколько гайок закручено.")
set_notes(s, "Дать ребенку заранее подготовить все детали на занятие 2.",
          "Список деталей перед началом занятия.",
          "ДОПОЛНИТЬ: точные количества гаек на слайдах 27, 33 и 36 в файле не указаны, "
          "в списке их нет. Посчитайте по фото и допишите в этот слайд и на слайды 27, 33, 36.")

# ---------- D. Перестановка: новый слайд на позицию 26 ----------

sldIdLst = prs.slides._sldIdLst
ids = list(sldIdLst)
new_id, rest = ids[-1], ids[:-1]
order = rest[:25] + [new_id] + rest[25:]
for el in list(sldIdLst):
    sldIdLst.remove(el)
for el in order:
    sldIdLst.append(el)

prs.save(PATH)
print("сохранено, слайдов:", len(prs.slides._sldIdLst))
