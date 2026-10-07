#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Annotate original schematics like handwritten start-run-stop sequence notes."""

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
import os
import shutil

RED = (220, 30, 30)
ORANGE = (230, 100, 20)
GREEN = (20, 140, 50)
BLUE = (20, 90, 200)
PURPLE = (140, 40, 180)
WHITE = (255, 255, 255)
YELLOW = (255, 255, 180)
BLACK = (20, 20, 20)


def font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def circle(d, box, color=RED, width=4):
    d.ellipse(box, outline=color, width=width)


def arrow_line(d, pts, color=RED, width=4):
    d.line(pts, fill=color, width=width)


def note_box(d, x, y, lines, fill=YELLOW, outline=RED, size=18, bold=True):
    f = font(size, bold)
    pad = 10
    widths = [d.textlength(l, font=f) for l in lines]
    tw = max(widths) if widths else 100
    th = (size + 6) * len(lines)
    d.rounded_rectangle((x, y, x + tw + 2 * pad, y + th + 2 * pad), radius=8, fill=fill, outline=outline, width=3)
    yy = y + pad
    for l in lines:
        d.text((x + pad, yy), l, fill=outline, font=f)
        yy += size + 6


def annotate_sd1(src, out_png):
    """HI-2536-ME-SD1 page 072 - power + control starter sequence."""
    im = Image.open(src).convert("RGB")
    d = ImageDraw.Draw(im)
    W, H = im.size  # 2000 x 1500

    # === Title sequence banner (like handwritten top notes) ===
    d.rectangle((20, 5, 1980, 118), fill=(255, 250, 230), outline=RED, width=3)
    d.text((35, 12), "NO.4 E/R VENT. FAN (REV)  |  START -> RUN -> STOP SEQUENCE", fill=RED, font=font(22, True))
    d.text((35, 42), "START:  1) Press SUPPLY  ->  88F ON  ->  6-1 ON  ->  6-2 ON  ->  TIMER 19 ON  ->  AUTO TR ON (80% = 352V)", fill=RED, font=font(15, True))
    d.text((35, 68), "RUN:    AFTER ~30 SEC  ->  6-1 & 6-2 OFF  ->  88 ON (full voltage)  ->  CT-OC -> MOTOR  |  EOCR 51 monitoring", fill=GREEN, font=font(15, True))
    d.text((35, 94), "STOP:   Press STOP / EOCR o.C  ->  88 & 88F OFF  ->  Motor coasts  ->  (HEATER ON if switch ON)", fill=BLUE, font=font(15, True))

    # Power section Y around 400-560 from earlier mapping
    # Circles on key power devices
    # 52 area
    circle(d, (140, 420, 230, 560), RED, 4)
    d.text((145, 400), "52", fill=RED, font=font(16, True))

    # 88F
    circle(d, (260, 410, 380, 520), RED, 4)
    d.text((270, 390), "88F FWD", fill=RED, font=font(15, True))

    # 88R (for note)
    circle(d, (260, 520, 380, 600), ORANGE, 3)
    d.text((265, 600), "88R REV", fill=ORANGE, font=font(13, True))

    # 6-2 / ATr start
    circle(d, (420, 400, 560, 560), ORANGE, 4)
    d.text((430, 380), "6-2 / ATr START", fill=ORANGE, font=font(14, True))

    # 88 run bypass
    circle(d, (560, 430, 680, 560), GREEN, 4)
    d.text((570, 410), "88 RUN", fill=GREEN, font=font(15, True))

    # 6-1
    circle(d, (680, 410, 800, 560), ORANGE, 4)
    d.text((700, 390), "6-1", fill=ORANGE, font=font(15, True))

    # CT-OC
    circle(d, (850, 410, 1000, 560), PURPLE, 4)
    d.text((860, 390), "CT-OC", fill=PURPLE, font=font(15, True))

    # Motor
    circle(d, (1050, 420, 1220, 580), GREEN, 5)
    d.text((1080, 400), "MOTOR M", fill=GREEN, font=font(16, True))

    # EOCR 51
    circle(d, (900, 580, 1080, 700), PURPLE, 4)
    d.text((910, 705), "51 EOCR", fill=PURPLE, font=font(15, True))

    # Power path arrows START (orange) then RUN (green)
    arrow_line(d, [(100, 470), (200, 470), (320, 470), (480, 470), (740, 470), (920, 470), (1100, 500)], ORANGE, 5)
    arrow_line(d, [(320, 500), (620, 500), (920, 500), (1100, 520)], GREEN, 5)

    # Control section circles (lower half ~700-1100)
    # Approximate control coils area bottom-left
    circle(d, (80, 780, 200, 900), ORANGE, 3)
    d.text((90, 760), "6-1 coil", fill=ORANGE, font=font(13, True))

    circle(d, (220, 780, 340, 900), ORANGE, 3)
    d.text((230, 760), "6-2 coil", fill=ORANGE, font=font(13, True))

    circle(d, (360, 780, 480, 900), ORANGE, 3)
    d.text((380, 760), "TIMER 19", fill=ORANGE, font=font(13, True))

    circle(d, (500, 780, 620, 900), GREEN, 3)
    d.text((520, 760), "88 coil", fill=GREEN, font=font(13, True))

    circle(d, (640, 780, 780, 900), RED, 3)
    d.text((650, 760), "88F coil", fill=RED, font=font(13, True))

    # Voltage / formula notes (like handwritten right side)
    note_box(d, 1280, 140, [
        "START VOLTAGE",
        "440V x 0.8 = 352V",
        "(ATr 80% tap)",
        "",
        "I = V / R",
        "lower V => lower I start",
    ], YELLOW, ORANGE, 16)

    note_box(d, 1280, 340, [
        "1 START (~0-30s)",
        "6-1 + 6-2 + ATr ON",
        "Timer 19 timing",
        "reduced voltage",
    ], (255, 230, 210), ORANGE, 15)

    note_box(d, 1280, 500, [
        "2 RUN (after 30s)",
        "6-1 & 6-2 OFF",
        "88 ON full voltage",
        "EOCR watches current",
    ], (220, 255, 220), GREEN, 15)

    note_box(d, 1280, 660, [
        "3 STOP",
        "STOP or EOCR o.C",
        "88 / 88F OFF",
        "Amp -> 0",
    ], (220, 235, 255), BLUE, 15)

    note_box(d, 1280, 820, [
        "YOUR CASE",
        "EOCR o.C on R",
        "rc=3.40  R~3.65",
        "Door ~65A",
    ], (255, 220, 220), RED, 15)

    # Legend bottom
    d.rectangle((20, 1420, 1260, 1485), fill=WHITE, outline=RED, width=2)
    d.text((35, 1430), "RED=direction/power in   ORANGE=START path (ATr)   GREEN=RUN path   PURPLE=EOCR/CT   BLUE=STOP", fill=BLACK, font=font(14, True))
    d.text((35, 1455), "HI-2536-ME-SD1 p.072  |  Annotated START -> RUN -> STOP  |  Same style as handwritten notes", fill=BLACK, font=font(13))

    im.save(out_png, quality=95)
    print("saved", out_png)
    return out_png


def annotate_sd2(src, out_png):
    """HI-2536-ME-SD2 page 073 - SMC-503H control sequence."""
    im = Image.open(src).convert("RGB")
    d = ImageDraw.Draw(im)
    W, H = im.size

    # Banner
    d.rectangle((20, 5, 1980, 120), fill=(255, 250, 230), outline=RED, width=3)
    d.text((35, 12), "NO.4 E/R VENT. FAN (REV)  |  SMC-503H CONTROL  |  START -> RUN -> STOP", fill=RED, font=font(20, True))
    d.text((35, 42), "START:  SOURCE ON  ->  Press SUPPLY  ->  SMC 4F ON  ->  command to starter (88F + 6-1/6-2/ATr sequence)", fill=RED, font=font(14, True))
    d.text((35, 68), "RUN:    4FX feedback ON  ->  SUPPLY RUN lamp ON  ->  EOCR 51 monitors  ->  HEATING OFF", fill=GREEN, font=font(14, True))
    d.text((35, 94), "STOP:   Press STOP  OR  EOCR o.C (51)  ->  4F OFF  ->  ABNORMAL if trip  ->  HEATING ON if heater switch ON", fill=BLUE, font=font(14, True))

    # SMC block - center of page roughly
    # Highlight SMC area
    circle(d, (500, 200, 1500, 1100), RED, 3)
    d.text((520, 180), "SMC-503H CONTROLLER", fill=RED, font=font(18, True))

    # Key terminal / function callouts
    note_box(d, 40, 160, [
        "1 SOURCE",
        "S1-S2 AC220V",
        "SOURCE lamp ON",
    ], YELLOW, RED, 14)

    note_box(d, 40, 300, [
        "2 START",
        "Press SUPPLY",
        "internal 4F ON",
    ], (255, 230, 210), ORANGE, 14)

    note_box(d, 40, 440, [
        "3 TO STARTER",
        "pick up 88F",
        "+ start sequence",
    ], (255, 230, 210), ORANGE, 14)

    note_box(d, 40, 580, [
        "4 RUN OK",
        "4FX feedback",
        "SUPPLY lamp ON",
    ], (220, 255, 220), GREEN, 14)

    note_box(d, 40, 720, [
        "5 PROTECT",
        "51 EOCR contact",
        "opens on o.C",
    ], (255, 220, 220), PURPLE, 14)

    note_box(d, 40, 860, [
        "6 STOP",
        "STOP button",
        "or abnormal trip",
    ], (220, 235, 255), BLUE, 14)

    # Right side lamps legend
    note_box(d, 1580, 160, [
        "LAMPS",
        "W SOURCE",
        "R ABNORMAL",
        "G SUP RUN",
        "G EXH RUN",
        "Y INTERVAL",
        "O HEATING",
    ], WHITE, RED, 14)

    note_box(d, 1580, 400, [
        "YOUR TRIP",
        "ABNORMAL ON",
        "EOCR = o.C",
        "R phase LED",
        "rc=3.40",
        "R reading 3.65",
    ], (255, 220, 220), RED, 14)

    note_box(d, 1580, 620, [
        "TIMERS",
        "T1 SEQ START",
        "T2 INTERVAL",
        "Starter Timer19",
        "~30 sec -> RUN",
    ], YELLOW, ORANGE, 14)

    note_box(d, 1580, 820, [
        "STOP TYPES",
        "Normal: HEATING",
        "  ABNORMAL OFF",
        "Trip: ABNORMAL",
        "  ON + o.C",
    ], (220, 235, 255), BLUE, 14)

    # Flow arrows down left notes
    arrow_line(d, [(100, 250), (100, 290)], RED, 4)
    arrow_line(d, [(100, 390), (100, 430)], ORANGE, 4)
    arrow_line(d, [(100, 530), (100, 570)], ORANGE, 4)
    arrow_line(d, [(100, 670), (100, 710)], GREEN, 4)
    arrow_line(d, [(100, 810), (100, 850)], PURPLE, 4)

    d.rectangle((20, 1420, 1560, 1485), fill=WHITE, outline=RED, width=2)
    d.text((35, 1430), "Page 2 of 2: SMC-503H side  |  Press SUPPLY starts sequence on page 1 (SD1 starter)", fill=BLACK, font=font(14, True))
    d.text((35, 1455), "HI-2536-ME-SD2 p.073  |  Annotated START -> RUN -> STOP", fill=BLACK, font=font(13))

    im.save(out_png, quality=95)
    print("saved", out_png)
    return out_png


def make_pdf(pngs, pdf_path):
    c = canvas.Canvas(pdf_path, pagesize=landscape(A4))
    pw, ph = landscape(A4)
    for png in pngs:
        c.drawImage(png, 8, 8, width=pw - 16, height=ph - 16, preserveAspectRatio=True, anchor="c")
        c.showPage()
    c.save()
    print("pdf", pdf_path)


if __name__ == "__main__":
    art = "/opt/cursor/artifacts"
    os.makedirs(art, exist_ok=True)

    sd1 = "/home/ubuntu/.cursor/projects/workspace/assets/29c47044-021d-4bd6-8d65-4a003fe8c03e.jpg"
    sd2 = "/home/ubuntu/.cursor/projects/workspace/assets/ae7fc8a1-82d3-483e-8c3b-15f7ebf9ceb0.jpg"

    out1 = "/workspace/No4_ER_Vent_Fan_SD1_Start_Run_Stop_Annotated.png"
    out2 = "/workspace/No4_ER_Vent_Fan_SD2_Start_Run_Stop_Annotated.png"
    pdf = "/workspace/No4_ER_Vent_Fan_Start_Run_Stop_Annotated.pdf"

    annotate_sd1(sd1, out1)
    annotate_sd2(sd2, out2)
    make_pdf([out1, out2], pdf)

    for f in (out1, out2, pdf):
        shutil.copy2(f, os.path.join(art, os.path.basename(f)))
    print("done")
