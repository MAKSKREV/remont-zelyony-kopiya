# -*- coding: utf-8 -*-
"""Add PowerPoint teacher comments to TRIZ-master-klass.pptx (19 slides)."""
import os, shutil, zipfile
from lxml import etree

PATH = r"C:\Users\Maks\Desktop\ремонтзелёный  копия\TRIZ-master-klass.pptx"
TMP = os.path.join(os.path.dirname(PATH), "_build", "triz_comments_tmp.pptx")

NS_CT = "http://schemas.openxmlformats.org/package/2006/content-types"
NS_REL = "http://schemas.openxmlformats.org/package/2006/relationships"
NS_P = "http://schemas.openxmlformats.org/presentationml/2006/main"
REL_COMMENTS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments"
REL_AUTHORS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/commentAuthors"

AUTHOR = "Преподаватель"
INITIALS = "Пр"

COMMENTS = {
1: ("Титульный слайд.\n"
    "1. Поприветствуем, назовём тему: «Сегодня каждый станет изобретателем».\n"
    "2. Спросите: «Кто такой изобретатель? Что он делает?» — короткие ответы с мест.\n"
    "3. Объявите задачу мастер-класса: научиться решать задачи по одному алгоритму.\n"
    "4. Разделите класс на команды по 4–5 человек (им понадобятся лист и ручка)."),
2: ("План занятия.\n"
    "Покажите маршрут и скажите: «Все этапы пройдём за 45 минут, на каждом стоят часы».\n"
    "Подчеркните логику: разминка → теория → практика → защита.\n"
    "Если времени мало, места сокращения: слайды «Эдисон» и «ИКР» (можно быстрее)."),
3: ("Слайд-разделитель «Игра Разминка».\n"
    "Время: ~3 минуты. Тема: «Кто такой изобретатель?»\n"
    "Приём: записывайте ВСЕ ответы детей — даже смешные. Правило на весь урок: идеи не критикуем."),
4: ("Упражнение со скрепкой (2 мин).\n"
    "За 30 секунд команды придумывают способы использования скрепки и записывают.\n"
    "Спросите 2–3 команды по одной самой необычной идее и похвалите.\n"
    "Вывод, который нужно подвести: у обычной вещи есть скрытые «ресурсы» — это и использует изобретатель."),
5: ("Слайд-разделитель «ТЕОРИЯ».\n"
    "Мостик: «Разминка показала — идеи уже есть. Теперь узнаем правила, по которым рождаются сильные решения»."),
6: ("Эдисон и «10 000 материалов» (2–3 мин).\n"
    "Расскажите историю: Эдисон испробовал около 10 000 материалов для нити лампочки.\n"
    "Спросите: «Сильное ли это решение?» Вывод: перебор работает, но это долго и дорого.\n"
    "Анонс: ТРИЗ позволяет решать без слепого перебора — за минуты."),
7: ("Что такое ТРИЗ (2 мин).\n"
    "Расшифруйте аббревиатуру по буквам (Т-Р-И-З).\n"
    "Ключевая мысль: изобретать — это НАВЫК, а не врождённый талант. Ему можно научиться.\n"
    "Сегодня освоим 3 инструмента: противоречие, ИКР, 4 приёма."),
8: ("Генрих Альтшуллер (3 мин).\n"
    "Расскажите: в 17 лет изобрёл «мотокар» (спасает записку от огня струёй воздуха).\n"
    "Изучив десятки тысяч патентов, увидел: сильные решения повторяются.\n"
    "В 1946 году создал ТРИЗ. Вывод: можно не изобретать заново, а применять найденные законы."),
9: ("ПРОТИВОРЕЧИЕ — главный слайд теории (5 мин).\n"
    "Прочитайте определение. Разберите зонт: хотим БОЛЬШОЙ (накрывает) и МАЛЕНЬКИЙ (носим в рюкзаке).\n"
    "Спросите класс: «Как разрешить?» Ждём ответ «складывается».\n"
    "Закрепите: попросите придумать ещё 1–2 противоречия из жизни (например, чай горячий и не обжигает).\n"
    "Этот навык — опора для практикумов, не пропускайте."),
10: ("ИКР — Идеальный Конечный Результат (3 мин).\n"
    "Объясните: представляем, что задача решается САМА (посуда моется сама, свет загорается сам).\n"
    "Важно: ИКР редко достижим на 100%, но он задаёт направление.\n"
    "Правило урока: «Сначала сформулируй ИКР — потом ищи ответ»."),
11: ("4 приёма (4 мин).\n"
    "Разберите по одному, приведите пример из жизни: "
    "ДРОБЛЕНИЕ (шоколад на дольки), ОБЪЕДИНЕНИЕ (ручка с ластиком), "
    "МАТРЁШКА (складная мебель), НАОБОРОТ (не тащим груз — он катится).\n"
    "Попросите класс дать свой пример на любой приём.\n"
    "Эти приёмы пригодятся в задачах «Рюкзак», «Продукты», «Мост»."),
12: ("Слайд-разделитель «ПРАКТИКА».\n"
    "Переход: «Теперь применяем теорию». Время: 8 мин на два задания «Рюкзак» и «Продукты».\n"
    "Напомните регламент: решение записываем, защита — по номерам."),
13: ("Задача «Тяжёлый рюкзак» (4 мин).\n"
    "Зачитайте ситуацию. Не раскрывайте готовый ответ — направляйте вопросами:\n"
    "«Что на самом деле создаёт вес? Нужны ли завтрашние учебники? Что можно заменить?»\n"
    "Подсказка-направление: сформулировать ИКР («рюкзак сам становится лёгким»).\n"
    "Возможные решения: носить только обязательное, электронные версии, разложить по дням."),
14: ("Задача «Продукты в походе» (4 мин).\n"
    "Зачитайте ситуацию. Наводящие вопросы:\n"
    "— какое здесь противоречие? (хочется свежее и вкусное, но тяжело нести и портится)\n"
    "— что рациональнее взять? (лёгкое и сытное: орехи, сухофрукты; горячее — в термосе)\n"
    "Разрешено несколько верных решений — поощряйте это."),
15: ("Практика №2 «Бумажный мост» (7 мин) — конструирование.\n"
    "Выдайте каждой команде: 1 лист А4, ножницы, скотч, 2 книги, ластик.\n"
    "Критерии (на слайде): пролёт не меньше 8 см, держит ластик 5 секунд, только выданные материалы.\n"
    "Не показывайте решение сразу! Если команда строит плоский лист — пусть сама обнаружит нехватку жёсткости.\n"
    "Ожидаемые решения: лист «гармошкой», рёбра жёсткости (загнутые края), балка из складок."),
16: ("Слайд-разделитель «ЗАЩИТА».\n"
    "Соберите внимание, озвучьте регламент: 1 минута на команду.\n"
    "Напомните пять шагов выступления (следующий слайд)."),
17: ("Как докладывать решение (3 мин).\n"
    "Проведите защиты по шагам 1–5: Проблема → Противоречие → ИКР → Приёмы → Решение.\n"
    "Каждой команде задайте контрольный вопрос: «Где здесь противоречие?» — главный навык урока.\n"
    "Хвалите ход мысли, а не только итоговый ответ."),
18: ("Рефлексия (2 мин).\n"
    "Вопросы дайте в парах — 30 секунд на обсуждение каждого.\n"
    "Домашнее задание: найти дома противоречие и предложить решение — принести на следующий урок.\n"
    "Пройдитесь по ответам 2–3 пар, чтобы закрепить термины."),
19: ("Финал (1 мин).\n"
    "Поблагодарите команды. Эмоциональное резюме: «ТРИЗ — это не магия, а навык, который теперь у вас».\n"
    "Объявите, что тема продолжится на следующих занятиях и домашнее задание ждёт решений."),
}

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def build_comments_xml(text, idx):
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
            f'<p:cmLst xmlns:p="{NS_P}">\n'
            f'  <p:cm authorId="0" dt="2026-09-24T10:00:00.000000000" idx="{idx}">\n'
            f'    <p:pos x="915000" y="400000"/>\n'
            f'    <p:text>{esc(text)}</p:text>\n'
            f'  </p:cm>\n'
            f'</p:cmLst>\n'.encode("utf-8"))

def build_authors_xml(last_idx):
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
            f'<p:cmAuthorLst xmlns:p="{NS_P}">\n'
            f'  <p:cmAuthor id="0" name="{AUTHOR}" initials="{INITIALS}" lastIdx="{last_idx}" clrIdx="0"/>\n'
            f'</p:cmAuthorLst>\n'.encode("utf-8"))

def main():
    n = len(COMMENTS)
    with zipfile.ZipFile(PATH, "r") as zin:
        data = {nm: zin.read(nm) for nm in zin.namelist()}
        names = list(data.keys())

    ct = etree.fromstring(data["[Content_Types].xml"])
    def add_override(root, partname, content_type):
        for o in root:
            if o.tag == f"{{{NS_CT}}}Override" and o.get("PartName") == partname:
                o.set("ContentType", content_type)
                return
        el = etree.SubElement(root, f"{{{NS_CT}}}Override")
        el.set("PartName", partname)
        el.set("ContentType", content_type)
    add_override(ct, "/ppt/commentAuthors.xml",
                 "application/vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml")
    for k in range(1, n + 1):
        add_override(ct, f"/ppt/comments/comment{k}.xml",
                     "application/vnd.openxmlformats-officedocument.presentationml.comments+xml")
    data["[Content_Types].xml"] = etree.tostring(ct, xml_declaration=True,
                                                 encoding="UTF-8", standalone=True)

    data["ppt/commentAuthors.xml"] = build_authors_xml(n)
    for k in range(1, n + 1):
        data[f"ppt/comments/comment{k}.xml"] = build_comments_xml(COMMENTS[k], k)

    def add_rel(root, target, reltype):
        for r in root:
            if r.tag == f"{{{NS_REL}}}Relationship" and r.get("Target") == target \
               and r.get("Type") == reltype:
                return r.get("Id")
        ids = [int(r.get("Id")[3:]) for r in root
               if r.tag == f"{{{NS_REL}}}Relationship" and r.get("Id", "").startswith("rId")]
        rid = f"rId{max(ids) + 1}" if ids else "rId1"
        el = etree.SubElement(root, f"{{{NS_REL}}}Relationship")
        el.set("Id", rid); el.set("Type", reltype); el.set("Target", target)
        return rid

    rels_path = "ppt/_rels/presentation.xml.rels"
    rels = etree.fromstring(data[rels_path])
    add_rel(rels, "commentAuthors.xml", REL_AUTHORS)
    data[rels_path] = etree.tostring(rels, xml_declaration=True, encoding="UTF-8", standalone=True)

    for k in range(1, n + 1):
        sp = f"ppt/slides/_rels/slide{k}.xml.rels"
        if sp in data:
            root = etree.fromstring(data[sp])
        else:
            root = etree.fromstring(f'<Relationships xmlns="{NS_REL}"/>'.encode("utf-8"))
        add_rel(root, f"../comments/comment{k}.xml", REL_COMMENTS)
        data[sp] = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)

    with zipfile.ZipFile(TMP, "w", zipfile.ZIP_DEFLATED) as zout:
        for nm in data:
            zout.writestr(nm, data[nm])
    shutil.move(TMP, PATH)
    print("added comments for", n, "slides")

if __name__ == "__main__":
    main()