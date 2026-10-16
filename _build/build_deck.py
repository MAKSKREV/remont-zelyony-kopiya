# -*- coding: utf-8 -*-
"""Rebuild ТРИЗ-мастер-класс deck on top of Пример.pptx template."""
import sys, shutil, os

from pptx import Presentation
from pptx.util import Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from lxml import etree

SRC = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\Пример.pptx"
OUT = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\ТРИЗ-мастер-класс (в стиле Пример).pptx"

ORANGE = RGBColor(0xFE, 0xA6, 0x21)
DARK   = RGBColor(0x26, 0x26, 0x26)
BLACK  = RGBColor(0x00, 0x00, 0x00)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
GRAY   = RGBColor(0x7F, 0x7F, 0x7F)
CREAM  = RGBColor(0xFF, 0xF4, 0xE0)
FONT   = "Roboto"

W, H = 9144000, 5143500

# ---------------------------------------------------------------- helpers

def delete_all_slides(prs):
    sldIdLst = prs.slides._sldIdLst
    for sldId in list(sldIdLst):
        rId = sldId.get(qn('r:id'))
        prs.part.drop_rel(rId)
        sldIdLst.remove(sldId)


def set_bullet(p, color="000000", char="●", sz=1800, marL="457200", indent="-342900"):
    pPr = p._p.get_or_add_pPr()
    pPr.set('marL', marL)
    pPr.set('indent', indent)
    for tag in ('a:buClrTx', 'a:buClr', 'a:buSzTx', 'a:buSzPct', 'a:buSzPts',
                'a:buFontTx', 'a:buFont', 'a:buNone', 'a:buAutoNum', 'a:buChar'):
        for el in pPr.findall(qn(tag)):
            pPr.remove(el)
    pos = 0
    for child in pPr:
        if child.tag in (qn('a:lnSpc'), qn('a:spcBef'), qn('a:spcAft')):
            pos += 1
        else:
            break
    def mk(tag, attrs=None, inner=()):
        el = pPr.makeelement(qn(tag), attrs or {})
        for t2, a2 in inner:
            el.append(mk(t2, a2))
        return el
    items = []
    items.append(mk('a:buClr', inner=(('a:srgbClr', {'val': color}),)))
    items.append(mk('a:buSzPts', {'val': str(sz)}))
    items.append(mk('a:buFont', {'typeface': 'Arial'}))
    items.append(mk('a:buChar', {'char': char}))
    for el in items:
        pPr.insert(pos, el)
        pos += 1


def add_text(slide, x, y, w, h, anchor=MSO_ANCHOR.TOP, wrap=True):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Emu(0)
    tf.margin_top = tf.margin_bottom = Emu(0)
    return tf


def para(tf, first=False, text=None, runs=None, size=18, bold=False, color=DARK,
         align=PP_ALIGN.LEFT, before=0, after=8, line=None, bullet=False,
         font=FONT, anchor=None):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    if align is not None:
        p.alignment = align
    if before:
        p.space_before = Pt(before)
    if after is not None:
        p.space_after = Pt(after)
    if line:
        p.line_spacing = line
    if bullet:
        set_bullet(p)
    seq = runs if runs is not None else [(text, {})]
    for item in seq:
        t, o = item
        r = p.add_run()
        r.text = t
        f = r.font
        f.name = o.get('font', font)
        f.size = Pt(o.get('size', size))
        f.bold = o.get('bold', bold)
        f.italic = o.get('italic', False)
        f.color.rgb = o.get('color', color)
    return p


def add_title(slide, text, size=24, align=PP_ALIGN.LEFT, color=DARK, y=15000, h=480000):
    tf = add_text(slide, 50000, y, W - 100000, h, anchor=MSO_ANCHOR.TOP)
    tf.margin_left = Emu(91425)
    para(tf, first=True, text=text, size=size, bold=True, color=color,
         align=align, after=0, font=FONT)
    return tf


def add_rect(slide, x, y, w, h, fill=WHITE, line=None, radius=0.08, line_w=1.5):
    sp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    sp.adjustments[0] = radius
    sp.shadow.inherit = False
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid()
        sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line
        sp.line.width = Pt(line_w)
    tf = sp.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = Pt(14)
    tf.margin_top = tf.margin_bottom = Pt(6)
    return sp, tf





# ---------------------------------------------------------------- build

def main():
    shutil.copy2(SRC, OUT)
    prs = Presentation(OUT)
    delete_all_slides(prs)
    layouts = prs.slide_masters[0].slide_layouts
    L_TITLE, L_CONTENT = layouts[0], layouts[6]
    L_RAZMINKA, L_ZASHCHITA = layouts[9], layouts[14]
    L_PRAKTIKA, L_TEORIYA = layouts[15], layouts[16]

    def slide(layout):
        return prs.slides.add_slide(layout)

    # ----- 1. Титул
    s = slide(L_TITLE)
    tf = add_text(s, 1616850, 1546550, 2484000, 585900, anchor=MSO_ANCHOR.MIDDLE)
    para(tf, first=True, text="ТРИЗ", size=36, bold=True, color=ORANGE,
         align=PP_ALIGN.CENTER, after=0)
    tf2 = add_text(s, 1359100, 2483600, 3300000, 800000, anchor=MSO_ANCHOR.MIDDLE)
    para(tf2, first=True, text="теория решения", size=21, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, after=2)
    para(tf2, text="изобретательских задач", size=21, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, after=0)

    # ----- 2. План занятия
    s = slide(L_CONTENT)
    add_title(s, "План занятия · 45 минут")
    tf = add_text(s, 500000, 660000, 7300000, 3800000, anchor=MSO_ANCHOR.TOP)
    plan = [
        ("1. Разминка «Юный изобретатель»", " — 3 мин"),
        ("2. Кто такой изобретатель?", " — 2 мин"),
        ("3. Теория: ТРИЗ, Альтшуллер, противоречие, ИКР, приёмы", " — 10 мин"),
        ("4. Практика №1: рюкзак и продукты в походе", " — 8 мин"),
        ("5. Практика №2: «Бумажный мост»", " — 7 мин"),
        ("6. Защита идей", " — 4 мин"),
        ("7. Рефлексия и домашнее задание", " — 2 мин"),
    ]
    for i, (lead, rest) in enumerate(plan):
        para(tf, first=(i == 0), runs=[(lead, {'bold': True, 'size': 19}),
                                        (rest, {'size': 16, 'color': GRAY})],
             bullet=True, after=12, line=1.05)

    # ----- 3. РАЗМИНКА
    slide(L_RAZMINKA)

    # ----- 4. Кто такой изобретатель?
    s = slide(L_CONTENT)
    add_title(s, "Кто такой изобретатель?")
    sp, tf = add_rect(s, 400000, 640000, 7700000, 320000, fill=ORANGE, line=None, radius=0.14)
    para(tf, first=True, text="Задание: за 30 секунд придумайте как можно больше способов использования "
                              "обычной скрепки", size=18, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 1120000, 7000000, 2100000)
    para(tf, first=True, runs=[("Работаем командами. ", {'bold': True, 'size': 18}),
                               ("Каждая команда записывает идеи на свой листочек.", {'size': 18})],
         bullet=True, after=12)
    para(tf, runs=[("Правило изобретателей: ", {'bold': True, 'size': 18}),
                   ("идеи не критикуем — записываем всё, даже самое необычное.", {'size': 18})],
         bullet=True, after=12)
    para(tf, runs=[("Скрепка — это «ресурс». ", {'bold': True, 'size': 18}),
                   ("Уметь видеть ресурсы в обычных вещах — главный навык изобретателя.",
                    {'size': 18})], bullet=True, after=12)
    sp, tf2 = add_rect(s, 500000, 3180000, 7700000, 520000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf2, first=True, text="Запомните: изобретатель смотрит на обычную вещь и видит в ней "
                               "новые возможности", size=17, bold=True, color=DARK,
         align=PP_ALIGN.CENTER, after=0)

    # ----- 5. ТЕОРИЯ
    slide(L_TEORIYA)

    # ----- 6. Эдисон
    s = slide(L_CONTENT)
    add_title(s, "Раньше изобретатели перебирали варианты")
    sp, tf = add_rect(s, 400000, 640000, 7700000, 360000, fill=ORANGE, line=None, radius=0.12)
    para(tf, first=True, runs=[("10 000 материалов ", {'bold': True, 'size': 20}),
                               ("перепробовал Томас Эдисон, прежде чем нашёл нить для лампочки",
                                {'size': 18})], color=WHITE, align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 1160000, 7000000, 2200000)
    para(tf, first=True, runs=[("Метод «проб и ошибок» работает, ", {'size': 18}),
                               ("но это долго и дорого: сотни и тысячи вариантов, годы труда.",
                                {'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("Эдисон о неудачах: ", {'bold': True, 'size': 18}),
                   ("«Я не ошибался — я нашёл 10 000 способов, которые не работают».",
                    {'italic': True, 'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("ТРИЗ предлагает другое: ", {'bold': True, 'size': 18}),
                   ("не перебирать вслепую, а решать по правилам — за минуты, а не за годы.",
                    {'size': 18})], bullet=True, after=12, line=1.05)
    sp, tf2 = add_rect(s, 500000, 3360000, 7700000, 460000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf2, first=True, runs=[("Вывод: ", {'bold': True, 'size': 17}),
                                ("сильные решения не ищут перебором — их строят по законам ТРИЗ.",
                                 {'size': 17})], align=PP_ALIGN.CENTER, after=0)

    # ----- 7. Что такое ТРИЗ
    s = slide(L_CONTENT)
    add_title(s, "Что такое ТРИЗ")
    letters = [("Т", "Теория"), ("Р", "Решения"), ("И", "Изобретательских"), ("З", "Задач")]
    x0, wc, gap = 400000, 1700000, 130000
    for i, (ltr, word) in enumerate(letters):
        cx = x0 + i * (wc + gap)
        sp, tf = add_rect(s, cx, 700000, wc, 1100000, fill=WHITE, line=ORANGE, radius=0.1)
        para(tf, first=True, text=ltr, size=56, bold=True, color=ORANGE,
             align=PP_ALIGN.CENTER, after=6)
        para(tf, text=word, size=13, bold=False, color=DARK, align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 2080000, 7000000, 1900000)
    para(tf, first=True, text="ТРИЗ — это наука о том, как решать задачи без слепого перебора вариантов.",
         size=18, bullet=True, after=12, line=1.05)
    para(tf, runs=[("Сильные решения строятся по повторяющимся законам. ",
                    {'size': 18}), ("Эти законы можно выучить и применять.",
                                    {'bold': True, 'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("Сегодня освоим три инструмента: ", {'size': 18}),
                   ("противоречие, ИКР и 4 приёма.", {'bold': True, 'size': 18})],
         bullet=True, after=12, line=1.05)
    sp, tf2 = add_rect(s, 500000, 3400000, 7700000, 500000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf2, first=True, text="ТРИЗ = Теория Решения Изобретательских Задач",
         size=17, bold=True, color=DARK, align=PP_ALIGN.CENTER, after=0)

    # ----- 8. Альтшуллер
    s = slide(L_CONTENT)
    add_title(s, "Как появилась ТРИЗ")
    sp = s.shapes.add_shape(MSO_SHAPE.OVAL, 280000, 880000, 2100000, 2100000)
    sp.shadow.inherit = False
    sp.fill.solid(); sp.fill.fore_color.rgb = ORANGE
    sp.line.fill.background()
    tf = sp.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = Pt(20)
    tf.margin_top = tf.margin_bottom = Pt(4)
    para(tf, first=True, text="Г. Альтшуллер", size=22, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, after=4)
    para(tf, text="1926–1998", size=16, bold=False, color=WHITE,
         align=PP_ALIGN.CENTER, after=6)
    para(tf, text="создатель ТРИЗ", size=14, bold=False, color=WHITE,
         align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 2900000, 780000, 5900000, 3500000)
    para(tf, first=True, runs=[("В 17 лет ", {'bold': True, 'size': 18}),
                               ("Альтшуллер изобрёл «мотокар» — машину, которая струёй воздуха "
                                "спасает записку от огня, не туша его.", {'size': 18})],
         bullet=True, after=14, line=1.1)
    para(tf, runs=[("Изучив десятки тысяч патентов, ", {'bold': True, 'size': 18}),
                   ("он заметил: самые сильные решения повторяются.", {'size': 18})],
         bullet=True, after=14, line=1.1)
    para(tf, runs=[("В 1946 году ", {'bold': True, 'size': 18}),
                   ("он собрал эти закономерности в систему — и назвал её ТРИЗ.",
                    {'size': 18})], bullet=True, after=14, line=1.1)
    para(tf, runs=[("Он учил изобретать каждого: ", {'bold': True, 'size': 18}),
                   ("его книги и сейчас учат думать нестандартно.", {'size': 18})],
         bullet=True, after=14, line=1.1)

    # ----- 9. Противоречие
    s = slide(L_CONTENT)
    add_title(s, "Противоречие — главный инструмент ТРИЗ")
    sp, tf = add_rect(s, 400000, 640000, 7700000, 380000, fill=ORANGE, line=None, radius=0.12)
    para(tf, first=True, runs=[("ПРОТИВОРЕЧИЕ — ", {'bold': True, 'size': 19}),
                               ("когда одно и то же должно быть «таким» И «не таким» одновременно.",
                                {'size': 18})], color=WHITE, align=PP_ALIGN.CENTER, after=0)
    sp1, tf1 = add_rect(s, 400000, 1260000, 3720000, 1600000, fill=WHITE, line=ORANGE, radius=0.08)
    para(tf1, first=True, text="Хотим: зонт БОЛЬШОЙ", size=22, bold=True, color=ORANGE,
         align=PP_ALIGN.CENTER, after=8)
    para(tf1, text="чтобы спрятаться от ливня", size=17, color=DARK,
         align=PP_ALIGN.CENTER, after=0)
    sp2, tf2 = add_rect(s, 4420000, 1260000, 3720000, 1600000, fill=WHITE, line=ORANGE, radius=0.08)
    para(tf2, first=True, text="Хотим: зонт МАЛЕНЬКИЙ", size=22, bold=True, color=ORANGE,
         align=PP_ALIGN.CENTER, after=8)
    para(tf2, text="чтобы помещался в рюкзак", size=17, color=DARK,
         align=PP_ALIGN.CENTER, after=0)
    sp, tf = add_rect(s, 400000, 3050000, 7700000, 1150000, fill=CREAM, line=ORANGE, radius=0.08)
    para(tf, first=True, runs=[("Одновременно и большой, и маленький? ", {'bold': True, 'size': 18}),
                               ("Это и есть противоречие.", {'size': 18})],
         align=PP_ALIGN.CENTER, after=8)
    para(tf, runs=[("Решение ТРИЗ: ", {'bold': True, 'size': 18, 'color': ORANGE}),
                   ("зонт-складышка — большой, когда нужен, и маленький, когда в рюкзаке.",
                    {'size': 18})], align=PP_ALIGN.CENTER, after=0)

    # ----- 10. ИКР
    s = slide(L_CONTENT)
    add_title(s, "ИКР — Идеальный Конечный Результат")
    sp, tf = add_rect(s, 400000, 640000, 7700000, 400000, fill=ORANGE, line=None, radius=0.12)
    para(tf, first=True, runs=[("ИКР: ", {'bold': True, 'size': 19}),
                               ("представь, как задача решается САМА — «по идеалу», без затрат.",
                                {'size': 18})], color=WHITE, align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 1220000, 7000000, 2000000)
    para(tf, first=True, runs=[("Системы нет, а результат есть: ", {'bold': True, 'size': 18}),
                               ("посуда моется сама, свет зажигается без щелчка.",
                                {'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("Чем ближе твоё решение к ИКР — ", {'bold': True, 'size': 18}),
                   ("тем оно сильнее и проще.", {'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("ИКР почти никогда не выполняется на 100%, ", {'size': 18}),
                   ("но он показывает верное направление.", {'bold': True, 'size': 18})],
         bullet=True, after=12, line=1.05)
    sp, tf = add_rect(s, 500000, 3260000, 7700000, 520000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf, first=True, text="Помни: сначала сформулируй ИКР — и только потом ищи ответ!",
         size=18, bold=True, color=DARK, align=PP_ALIGN.CENTER, after=0)

    # ----- 11. 4 приёма
    s = slide(L_CONTENT)
    add_title(s, "4 приёма, которые решают задачи")
    cards_cfg = [
        ("ДРОБЛЕНИЕ", "Раздели объект на части: шоколад на дольки, лист на полоски."),
        ("ОБЪЕДИНЕНИЕ", "Соедини полезное в одном: ручка с ластиком, мост из слоёв бумаги."),
        ("МАТРЁШКА", "Вложи одно в другое: стопка бумаг, складная мебель."),
        ("НАОБОРОТ", "Сделай наоборот: груз не тащим — пусть катится сам."),
    ]
    cw, ch, gx, gy = 3720000, 1420000, 190000, 190000
    bx, by = 850000, 720000
    for i, (t1, b1) in enumerate(cards_cfg):
        cx = bx + (i % 2) * (cw + gx)
        cy = by + (i // 2) * (ch + gy)
        sp, tf = add_rect(s, cx, cy, cw, ch, fill=WHITE, line=ORANGE, radius=0.09)
        para(tf, first=True, text=t1, size=22, bold=True, color=ORANGE,
             align=PP_ALIGN.CENTER, after=10)
        para(tf, text=b1, size=16, color=DARK, align=PP_ALIGN.CENTER, after=0)

    # ----- 12. ПРАКТИКА
    slide(L_PRAKTIKA)

    # ----- 13. Рюкзак
    s = slide(L_CONTENT)
    add_title(s, "Задача «Тяжёлый рюкзак» · 4 минуты")
    sp, tf = add_rect(s, 400000, 640000, 7700000, 880000, fill=WHITE, line=ORANGE, radius=0.08)
    para(tf, first=True, text="Ситуация", size=17, bold=True, color=ORANGE, after=6)
    para(tf, text="Каждое утро ученик тащит в школу тяжёлый рюкзак: там все учебники. "
                  "А выбросить ничего нельзя — всё нужно.", size=18, color=DARK, after=0)
    sp, tf = add_rect(s, 400000, 1620000, 7700000, 420000, fill=ORANGE, line=None, radius=0.12)
    para(tf, first=True, runs=[("Задание: ", {'bold': True, 'size': 19}),
                               ("сделай рюкзак лёгким так, чтобы всё нужное осталось под рукой.",
                                {'size': 18})], color=WHITE, align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 2220000, 7000000, 1700000)
    para(tf, first=True, runs=[("Подумай: ", {'bold': True, 'size': 18}),
                               ("что на самом деле делает рюкзак тяжёлым? Какие учебники нужны "
                                "сегодня, а какие нет?", {'size': 18})], bullet=True, after=12)
    para(tf, runs=[("Какие приёмы помогут: ", {'bold': True, 'size': 18}),
                   ("ДРОБЛЕНИЕ, ОБЪЕДИНЕНИЕ, НАОБОРОТ?", {'size': 18})],
         bullet=True, after=12)
    para(tf, runs=[("ИКР: ", {'bold': True, 'size': 18}),
                   ("рюкзак сам становится лёгким, как только что-то перестаёт быть нужным.",
                    {'size': 18})], bullet=True, after=12)
    sp, tf = add_rect(s, 500000, 3560000, 7700000, 460000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf, first=True, text="Сильное решение найдёт та команда, которая сначала сформулирует "
                              "ИКР, а потом будет искать приёмы", size=16, bold=True, color=DARK,
         align=PP_ALIGN.CENTER, after=0)

    # ----- 14. Продукты
    s = slide(L_CONTENT)
    add_title(s, "Задача «Продукты в походе» · 4 минуты")
    sp, tf = add_rect(s, 400000, 640000, 7700000, 880000, fill=WHITE, line=ORANGE, radius=0.08)
    para(tf, first=True, text="Ситуация", size=17, bold=True, color=ORANGE, after=6)
    para(tf, text="Семья идёт в однодневный поход. Хочется есть вкусно и полезно, "
                  "но нести тяжело, а продукты портятся.", size=18, color=DARK, after=0)
    sp, tf = add_rect(s, 400000, 1620000, 7700000, 460000, fill=ORANGE, line=None, radius=0.12)
    para(tf, first=True, runs=[("Задание: ", {'bold': True, 'size': 19}),
                               ("собери обед на день так, чтобы было и вкусно, и легко, "
                                "и ничего не испортилось.", {'size': 18})],
         color=WHITE, align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 2240000, 7000000, 1700000)
    para(tf, first=True, runs=[("Выбирай лёгкое и сытное: ", {'bold': True, 'size': 18}),
                               ("орехи, сухофрукты, батончики, бутерброды.", {'size': 18})],
         bullet=True, after=12)
    para(tf, runs=[("Свежее быстро портится: ", {'bold': True, 'size': 18}),
                   ("бери то, что переживёт день. Горячее — в термосе.", {'size': 18})],
         bullet=True, after=12)
    para(tf, runs=[("ИКР: ", {'bold': True, 'size': 18}),
                   ("еда сама сохраняется, сама утоляет голод и почти ничего не весит.",
                    {'size': 18})], bullet=True, after=12)
    sp, tf = add_rect(s, 500000, 3580000, 7700000, 440000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf, first=True, text="Вспомни приёмы: ОБЪЕДИНЕНИЕ и НАОБОРОТ — лучшие друзья "
                              "туриста", size=16, bold=True, color=DARK,
         align=PP_ALIGN.CENTER, after=0)

    # ----- 15. Бумажный мост
    s = slide(L_CONTENT)
    add_title(s, "Практика №2 «Бумажный мост» · 7 минут")
    chips_x = 400000
    for chip in ("лист А4", "ножницы", "скотч", "2 книги-опоры", "ластик-груз"):
        wch = Emu(int(len(chip) * 115000 + 200000))
        sp, tf = add_rect(s, chips_x, 660000, wch, 360000, fill=WHITE, line=ORANGE,
                          radius=0.5, line_w=1.25)
        para(tf, first=True, text=chip, size=13, bold=True, color=DARK,
             align=PP_ALIGN.CENTER, after=0)
        chips_x += wch + 90000
    sp, tf = add_rect(s, 400000, 1120000, 7700000, 640000, fill=ORANGE, line=None, radius=0.1)
    para(tf, first=True, runs=[("Задание: ", {'bold': True, 'size': 19}),
                               ("построй мост из ОДНОГО листа А4 между двумя книгами, который "
                                "выдержит ластик не меньше 5 секунд.", {'size': 18})],
         color=WHITE, align=PP_ALIGN.CENTER, after=0)
    sp, tf = add_rect(s, 400000, 1880000, 7700000, 480000, fill=WHITE, line=ORANGE, radius=0.1)
    para(tf, first=True, runs=[("Проверка: ", {'bold': True, 'size': 17, 'color': ORANGE}),
                               ("пролёт не меньше 8 см · мост стоит сам · только выданные "
                                "материалы", {'size': 17})], align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 2500000, 7000000, 1600000)
    para(tf, first=True, runs=[("Сложи лист «гармошкой» — ", {'bold': True, 'size': 18}),
                               ("он станет жёсткой балкой.", {'size': 18})],
         bullet=True, after=12, line=1.05)
    para(tf, runs=[("Сделай рёбра жёсткости: ", {'bold': True, 'size': 18}),
                   ("загни края, как у гофрокартона.", {'size': 18})],
         bullet=True, after=12, line=1.05)
    para(tf, runs=[("Приём «наоборот»: ", {'bold': True, 'size': 18}),
                   ("не ищем толстый материал — усиливаем форму.", {'size': 18})],
         bullet=True, after=12, line=1.05)

    # ----- 16. ЗАЩИТА
    slide(L_ZASHCHITA)

    # ----- 17. Как докладывать решение
    s = slide(L_CONTENT)
    add_title(s, "Как докладывать решение · 3 минуты")
    steps = ["1 Проблема", "2 Противоречие", "3 ИКР", "4 Приёмы", "5 Решение"]
    x0, wch, gap = 400000, 1560000, 70000
    for i, st in enumerate(steps):
        cx = x0 + i * (wch + gap)
        sp, tf = add_rect(s, cx, 680000, wch, 520000, fill=ORANGE, line=None, radius=0.14)
        para(tf, first=True, text=st, size=17, bold=True, color=WHITE,
             align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 500000, 1380000, 7000000, 1900000)
    para(tf, first=True, runs=[("За 1 минуту команда проходит шаги 1–5: ", {'bold': True, 'size': 18}),
                               ("так получается короткий и понятный рассказ о решении.",
                                {'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("Говорят все, кто придумал. ", {'bold': True, 'size': 18}),
                   ("Не читают листочек, а рассказывают своими словами.", {'size': 18})],
         bullet=True, after=12, line=1.05)
    para(tf, runs=[("Побеждает не «правильный ответ», ", {'bold': True, 'size': 18}),
                   ("а ход мысли — ТРИЗ-алгоритм.", {'size': 18})], bullet=True, after=12, line=1.05)
    sp, tf = add_rect(s, 500000, 3360000, 7700000, 460000, fill=CREAM, line=ORANGE, radius=0.1)
    para(tf, first=True, text="1 минута на команду · слушаем всех · обязательный дежурный вопрос: "
                              "«Где здесь противоречие?»", size=16, bold=True, color=DARK,
         align=PP_ALIGN.CENTER, after=0)

    # ----- 18. Рефлексия
    s = slide(L_CONTENT)
    add_title(s, "Рефлексия: чему мы научились · 2 минуты")
    tf = add_text(s, 500000, 700000, 7000000, 1900000)
    para(tf, first=True, runs=[("1. ", {'bold': True, 'size': 18, 'color': ORANGE}),
                               ("Объясни соседу своими словами, что такое противоречие.",
                                {'size': 18})], bullet=True, after=12, line=1.05)
    para(tf, runs=[("2. ", {'bold': True, 'size': 18, 'color': ORANGE}),
                   ("Назови два ТРИЗ-приёма из сегодняшнего урока.", {'size': 18})],
         bullet=True, after=12, line=1.05)
    para(tf, runs=[("3. ", {'bold': True, 'size': 18, 'color': ORANGE}),
                   ("Придумай, где дома ты уже сегодня применишь ТРИЗ.", {'size': 18})],
         bullet=True, after=12, line=1.05)
    sp, tf = add_rect(s, 400000, 2660000, 7700000, 1200000, fill=CREAM, line=ORANGE, radius=0.08)
    para(tf, first=True, text="Домашнее задание изобретателя", size=18, bold=True,
         color=ORANGE, align=PP_ALIGN.CENTER, after=8)
    para(tf, text="Найди дома одно противоречие и предложи, как его решить. "
                  "Принеси решение на следующий урок.", size=17, color=DARK,
         align=PP_ALIGN.CENTER, after=0)

    # ----- 19. Спасибо
    s = slide(L_CONTENT)
    tf = add_text(s, 500000, 1500000, 7700000, 900000, anchor=MSO_ANCHOR.MIDDLE)
    para(tf, first=True, text="Спасибо за идеи!", size=44, bold=True, color=ORANGE,
         align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 1000000, 2560000, 6200000, 700000, anchor=MSO_ANCHOR.MIDDLE)
    para(tf, first=True, text="ТРИЗ — это не магия, а навык: находи противоречие, "
                              "рисуй ИКР, применяй приёмы.", size=18, color=DARK,
         align=PP_ALIGN.CENTER, after=0)
    tf = add_text(s, 1000000, 3400000, 6200000, 400000, anchor=MSO_ANCHOR.MIDDLE)
    para(tf, first=True, text="Школа изобретателей «Эра Инженеров» · era.obraz.pro",
         size=14, color=GRAY, align=PP_ALIGN.CENTER, after=0)

    prs.save(OUT)
    print("saved:", OUT)
    print("slides:", len(prs.slides._sldIdLst))


if __name__ == "__main__":
    main()