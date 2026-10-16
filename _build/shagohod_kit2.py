# -*- coding: utf-8 -*-
"""Шагоход: возврат М3х10, слайд «Комплект на набор», пересчёт ссылок на слайды."""
import sys, copy, re
sys.stdout.reconfigure(encoding="utf-8")
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn

P = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\Копия Инструкция по сборке (фото) - шагоход (правки).pptx"
FONT = "Arial"
ORANGE = RGBColor(0xFE, 0xA6, 0x21)
DARK = RGBColor(0x21, 0x21, 0x21)
GRAY = RGBColor(0x5F, 0x5F, 0x5F)
CARD = RGBColor(0xF2, 0xF3, 0xF5)

prs = Presentation(P)
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


def para(tf, first=False, text=None, runs=None, size=17, bold=False, color=DARK,
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


# ---------- 1. Возврат М3х10 на слайдах 5 и 13 ----------

for no in (5, 13):
    for sh in prs.slides[no-1].shapes:
        if not sh.has_text_frame:
            continue
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                if "М3х16" in r.text:
                    r.text = r.text.replace("М3х16", "М3х10")
                    print(f"слайд {no}: -> {r.text}")

# ---------- 2. Новый слайд «Комплект на набор» ----------

s = prs.slides.add_slide(layout)
for ph in list(s.placeholders):
    if ph.placeholder_format.idx != 0:
        ph._element.getparent().remove(ph._element)
s.shapes.title.text_frame.text = "Комплект на набор"
for sh in BADGE_SRC.shapes:
    if sh.shape_type == 6:
        s.shapes._spTree.append(copy.deepcopy(sh._element))

cardsh = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.35), Inches(0.8),
                            Inches(9.3), Inches(2.85))
cardsh.fill.solid()
cardsh.fill.fore_color.rgb = CARD
cardsh.line.fill.background()
cardsh.shadow.inherit = False
cardsh.adjustments[0] = 0.06
tf = cardsh.text_frame
tf.word_wrap = True
tf.margin_left = Inches(0.28)
tf.margin_right = Inches(0.22)
tf.margin_top = Inches(0.2)
tf.vertical_anchor = MSO_ANCHOR.TOP
kit = [
    "Винты М3х10 (DIN 7985) - 4 шт.",
    "Винты М3х20 (DIN 7985) - 6 шт.",
    "Винты М3х30 (DIN 7985) - 2 шт.",
    "Гайки М3 - 23 шт.",
]
for i, t in enumerate(kit):
    para(tf, first=(i == 0), text=t, size=17, after=12, line=1.1, bullet=True)

hint = s.shapes.add_textbox(Inches(0.35), Inches(3.9), Inches(9.3), Inches(1.0))
hint.text_frame.word_wrap = True
para(hint.text_frame, first=True, size=15, bold=True, color=ORANGE, after=4,
     text="Проверь комплект до первого занятия и разложи детали по группам.")
para(hint.text_frame, size=13, color=GRAY,
     text="Винты 3х20 нужны в двух местах: крепления на слайдах 6-8 и детали на слайде 32. "
          "Каждая деталь дается с запасом - если винты закончились, возьми из запаса.")

ntf = s.notes_slide.notes_text_frame
ntf.text = ""
para(ntf, first=True, text="Цель слайда:", size=12, bold=True, after=2)
para(ntf, text="Дать ребенку и педагогу проверить комплект перед началом работы.", size=12, after=6)
para(ntf, text="Текст:", size=12, bold=True, after=2)
para(ntf, text="Комплект на набор: 3х10 - 4 шт., 3х20 - 6 шт., 3х30 - 2 шт., гайки М3 - 23 шт.",
    size=12, after=6)
para(ntf, text="Примечания:", size=12, bold=True, after=2)
para(ntf, text="Занятие 1 использует комплект полностью: 3х10 - слайды 5 и 13, "
               "3х20 - слайды 6, 7 и 8, 3х30 - слайд 19, гайки - 12 шт. "
               "На Занятие 2 нужно еще 2 винта 3х20 (слайд 32) и 10 гаек - "
               "гайки в комплекте есть (23 шт.), винты берутся из запаса. "
               "По заявлению преподавателя винты 3х16 нужны вместо 3х10, "
               "но в комплекте их нет - уточнить у поставщика.",
    size=12, after=0)

# ---------- 3. Перестановка: комплект на позицию 4 ----------

sldIdLst = prs.slides._sldIdLst
ids = list(sldIdLst)
new_id, rest = ids[-1], ids[:-1]
order = rest[:3] + [new_id] + rest[3:]
for el in list(sldIdLst):
    sldIdLst.remove(el)
for el in order:
    sldIdLst.append(el)

# ---------- 4. Пересчёт ссылок на номера слайдов (все >= 4 сдвинулись на +1) ----------

REF = re.compile(r"(слайд[а-я]*\s+)(\d+(?:\s*[-–]\s*\d+)?(?:\s*(?:,|и)\s*\d+)*)", re.I)
changed = []


def bump_list(s):
    def repl_num(m):
        return str(int(m.group(0)) + 1) if int(m.group(0)) >= 4 else m.group(0)
    return re.sub(r"\d+", repl_num, s)


def fix_tf(tf, where):
    for p in tf.paragraphs:
        runs = p.runs
        if not runs:
            continue
        full = "".join(r.text for r in runs)
        if "слайд" not in full.lower():
            continue
        new = REF.sub(lambda m: m.group(1) + bump_list(m.group(2)), full)
        if new != full:
            for r in runs[1:]:
                r.text = ""
            runs[0].text = new
            changed.append((where, full, new))


for i, sl in enumerate(prs.slides, 1):
    for sh in sl.shapes:
        if sh.has_text_frame:
            fix_tf(sh.text_frame, f"слайд {i}")
    try:
        fix_tf(sl.notes_slide.notes_text_frame, f"заметки {i}")
    except Exception:
        pass

print("\nобновлено ссылок:", len(changed))
for w, a, b in changed:
    print(f"  [{w}] {a}  ->  {b}")

prs.save(P)
print("\nсохранено, слайдов:", len(prs.slides._sldIdLst))