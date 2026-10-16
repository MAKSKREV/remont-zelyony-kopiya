# -*- coding: utf-8 -*-
import sys, zipfile
from pptx import Presentation
sys.stdout.reconfigure(encoding="utf-8")
P = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\TRIZ-master-klass для преподавателя.pptx"
prs = Presentation(P)
z = zipfile.ZipFile(P)
print("slides:", len(prs.slides._sldIdLst), "| comments:", len([n for n in z.namelist() if n.startswith("ppt/comments/")]), "| size MB:", round(prs.part.package.main_document_part.blob.__len__()/1,1))
