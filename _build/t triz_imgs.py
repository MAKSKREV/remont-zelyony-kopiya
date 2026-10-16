# -*- coding: utf-8 -*-
import sys
from pptx import Presentation
from pptx.opc.constants import RELATIONSHIP_TYPE as RT

sys.stdout.reconfigure(encoding='utf-8')
TRIZ = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\ТРИЗ-мастер-класс.pptx"
prs = Presentation(TRIZ)
for i, slide in enumerate(prs.slides):
    imgs = []
    for rel in slide.part.rels.values():
        if rel.reltype == RT.IMAGE:
            p = rel.target_part
            try:
                bn = p.blob
            except Exception as e:
                bn = None
            imgs.append((rel.rId, str(rel.target_ref), len(bn) if bn else 0))
    print(i+1, slide.slide_layout.name, imgs)