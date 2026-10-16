# -*- coding: utf-8 -*-
"""Читаем комментарии в файлах «правки 4» и «правки) 3 (2)»."""
import sys, os, re, zipfile
sys.stdout.reconfigure(encoding="utf-8")
from xml.etree import ElementTree as ET

BASE = r"C:\Users\Maks\Desktop\ремонтзелёный  копия"
P1 = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки 4).pptx")
P2 = os.path.join(BASE, "Инструкция по сборке (фото) - шагоход (правки) 3 (2).pptx")

for label, P in (("правки 4", P1), ("правки 3 (2)", P2)):
    print("=" * 60)
    print(label, os.path.getsize(P) // 1024, "КБ")
    z = zipfile.ZipFile(P)
    names = z.namelist()
    print("media gif:", [n for n in names if n.endswith(".gif")])
    comments = sorted(n for n in names if re.match(r"ppt/comments/comment\d+\.xml", n))
    print("файлов комментариев:", len(comments))
    # карта слайд -> комментарий
    slide_file = {}
    for n in names:
        m = re.match(r"ppt/slides/_rels/slide(\d+)\.xml\.rels", n)
        if m:
            txt = z.read(n).decode("utf-8", "ignore")
            r = re.search(r'Target="\.\./(comments/comment\d+\.xml)"', txt)
            if r:
                slide_file["ppt/" + r.group(1)] = int(m.group(1))
    for f in comments:
        no = slide_file.get(f, "?")
        root = ET.fromstring(z.read(f))
        for cm in root:
            if not cm.tag.endswith("cm"):
                continue
            t = cm.find("{http://schemas.openxmlformats.org/presentationml/2006/main}text")
            body = "".join(t.itertext()) if t is not None else ""
            print(f"  [слайд {no}] «{body}»")
