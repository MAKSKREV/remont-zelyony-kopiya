# -*- coding: utf-8 -*-
import sys, zipfile
from lxml import etree
sys.stdout.reconfigure(encoding="utf-8")
PATH = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\TRIZ-master-klass.pptx"

from pptx import Presentation
prs = Presentation(PATH)
print("slides still readable:", len(prs.slides._sldIdLst))

z = zipfile.ZipFile(PATH)
names = z.namelist()
print("comment parts:", [n for n in names if "comments" in n or "commentAuthors" in n])

ct = z.read("[Content_Types].xml").decode("utf-8")
for probe in ("commentAuthors", "presentationml.comments+xml"):
    print("ct has", probe, ":", probe in ct)

rels = z.read("ppt/_rels/presentation.xml.rels").decode("utf-8")
print("presentation rels -> commentAuthors:", "commentAuthors" in rels)

s1 = z.read("ppt/slides/_rels/slide1.xml.rels").decode("utf-8")
print("slide1 rels -> comments:", "../comments/comment1.xml" in s1)

for k in (1, 9, 19):
    x = z.read(f"ppt/comments/comment{k}.xml")
    root = etree.fromstring(x)
    cm = root.find(".//{http://schemas.openxmlformats.org/presentationml/2006/main}cm")
    txt = cm.find("{http://schemas.openxmlformats.org/presentationml/2006/main}text").text
    print(f"comment{k} idx={cm.get('idx')} authorId={cm.get('authorId')} text=",
          txt[:60].replace("\n", " "))
z.close()