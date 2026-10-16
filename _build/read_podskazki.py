# -*- coding: utf-8 -*-
import sys, zipfile
from lxml import etree
from pptx import Presentation
sys.stdout.reconfigure(encoding="utf-8")
P = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\подсказки.pptx"

z = zipfile.ZipFile(P)
names = z.namelist()
cm = sorted([n for n in names if n.startswith("ppt/comments/comment") and n.endswith(".xml")])
print("comment files:", len(cm))
print("notesSlides parts:", len([n for n in names if n.startswith("ppt/notesSlides/")]))

# map comments to slides via rels
NS_REL = "http://schemas.openxmlformats.org/package/2006/relationships"
NS_P = "http://schemas.openxmlformats.org/presentationml/2006/main"
slide_to_comment = {}
for sl in range(1, 30):
    rp = f"ppt/slides/_rels/slide{sl}.xml.rels"
    if rp not in names:
        continue
    rel = etree.fromstring(z.read(rp))
    for r in rel:
        if r.get("Type","").endswith("/comments"):
            slide_to_comment[sl] = r.get("Target")

NS = NS_P
def comments_for(slide_no):
    target = slide_to_comment.get(slide_no)
    if not target:
        return []
    path = "ppt/" + target.replace("..","ppt").replace("ppt/ppt","ppt") if target.startswith("../") else target
    path = "ppt/" + target[3:].replace("../","")
    # easier: compute
    txts = []
    return txts

def read_comments(fname):
    xml = etree.fromstring(z.read(fname))
    out = []
    for cm in xml:
        txt = cm.find(f"{{{NS}}}text").text or ""
        out.append(txt)
    return out

print("\n--- comments per slide ---")
for sl in sorted(slide_to_comment):
    tgt = slide_to_comment[sl]
    # target like ../comments/comment3.xml
    relpath = tgt.replace("../", "")
    path = "ppt/comments/" + relpath.replace("comments/", "")
    txts = read_comments(path)
    for i, t in enumerate(txts, 1):
        print(f"[slide {sl}][cmt {i}]\n{t}\n{'-'*40}")
z.close()