# -*- coding: utf-8 -*-
"""Все комментарии вернувшейся презентации."""
import sys, os, zipfile, re
from xml.etree import ElementTree as ET
sys.stdout.reconfigure(encoding="utf-8")

BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
P = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки) 3 (2).pptx")
z = zipfile.ZipFile(P)
names = z.namelist()

# авторы
authors = {}
root = ET.fromstring(z.read("ppt/commentAuthors.xml"))
for el in root:
    authors[el.get("id")] = el.get("name") or "?"
print("авторы:", authors)

# связь слайд <-> файл комментариев
slide_file = {}
for n in names:
    m = re.match(r"ppt/slides/_rels/slide(\d+)\.xml\.rels", n)
    if m:
        txt = z.read(n).decode("utf-8", "ignore")
        r = re.search(r'Target="\.\./(comments/comment\d+\.xml)"', txt)
        if r:
            slide_file["ppt/" + r.group(1)] = int(m.group(1))

print("\n=== КОММЕНТАРИИ ===")
for fname in sorted(n for n in names if re.match(r"ppt/comments/comment\d+\.xml", n)):
    no = slide_file.get(fname, "?")
    tree = ET.fromstring(z.read(fname))
    for cm in tree:
        tag = cm.tag.split("}")[-1]
        if tag != "cm":
            continue
        who = authors.get(cm.get("authorId"), "?")
        date = cm.get("dt", "")[:16]
        pos = cm.find("{http://schemas.openxmlformats.org/presentationml/2006/main}pos")
        xy = f"x={pos.get('x')} y={pos.get('y')}" if pos is not None else ""
        txtel = cm.find("{http://schemas.openxmlformats.org/presentationml/2006/main}text")
        body = "".join(txtel.itertext()) if txtel is not None else ""
        print(f"\n[слайд {no}] {who} · {date} · {xy}")
        print(f"   «{body}»")

# позиция комментария внутри слайда: индекс параграфа/фигуры
print("\n=== привязка к тексту слайда ===")
from pptx import Presentation
prs = Presentation(P)
for n in names:
    m = re.match(r"ppt/slides/_rels/slide(\d+)\.xml\.rels", n)
    if not m:
        continue
    no = int(m.group(1))
    txt = z.read(n).decode("utf-8", "ignore")
    for mm in re.finditer(r'<p:cm\w*:commentRangeStart[^>]*id="(\d+)"[^>]*/>', txt):
        print(f"  слайд {no}: commentRangeStart id={mm.group(1)}")