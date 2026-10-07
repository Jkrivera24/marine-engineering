#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-page CT-OC(R) check checklist for No.4 E/R Vent Fan."""

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import shutil

def font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

NAVY = (11, 44, 74)
TEAL = (14, 124, 123)
ORANGE = (196, 92, 38)
GREEN = (46, 125, 50)
RED = (183, 28, 28)
GRAY = (90, 106, 122)
LIGHT = (244, 247, 250)
WHITE = (255, 255, 255)
DARK = (26, 26, 26)
LG = (232, 245, 233)
LR = (255, 235, 238)
LO = (253, 232, 216)


def rr(d, box, fill, outline=None, w=3, r=14):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline or fill, width=w)


def checkbox(d, x, y, label, f):
    d.rectangle((x, y, x + 28, y + 28), outline=TEAL, width=2)
    d.text((x + 40, y + 2), label, fill=DARK, font=f)


def create_card(path):
    W, H = 1240, 1754
    img = Image.new("RGB", (W, H), LIGHT)
    d = ImageDraw.Draw(img)

    d.rectangle((0, 0, W, 130), fill=NAVY)
    d.rectangle((0, 130, W, 145), fill=TEAL)
    d.text((40, 28), "CT-OC(R) Check Checklist", fill=WHITE, font=font(34, True))
    d.text((40, 78), "NO.4 E/R VENT. FAN (REV)  |  HiMP-D06  |  Keep at panel", fill=(168, 197, 216), font=font(16))

    y = 170
    rr(d, (40, y, 1200, y + 160), LR, RED, 3, 14)
    d.text((60, y + 16), "SAFETY", fill=RED, font=font(20, True))
    for i, line in enumerate([
        "- Prefer motor STOPPED before loosening anything.",
        "- NEVER open / disconnect CT secondary (K-L) while motor is running.",
        "- Open CT secondary = dangerous high voltage. Keep K-L closed.",
        "- If only looking while running: look only - do not unscrew terminals.",
    ]):
        d.text((60, y + 55 + i * 24), line, fill=DARK, font=font(15))

    y = 350
    rr(d, (40, y, 1200, y + 150), LO, ORANGE, 3, 14)
    d.text((60, y + 14), "YOUR LAST READINGS (reference)", fill=ORANGE, font=font(18, True))
    d.text((60, y + 50), "Door ammeter ~ 65 A  |  rc SET = 3.40 A  |  Expected EOCR at 65 A ~ 3.25 A (CT 100/5)", fill=DARK, font=font(14))
    d.text((60, y + 80), "R = 3.65 A (HIGH)    S ~ 3.4 A    T = 3.54 A", fill=DARK, font=font(16, True))
    d.text((60, y + 112), "R is highest -> check CT-OC(R) first. Do not raise rc to hide trip.", fill=RED, font=font(14, True))

    y = 520
    rr(d, (40, y, 1200, y + 280), WHITE, TEAL, 3, 14)
    d.text((60, y + 14), "CHECK 1 - Visual (motor STOPPED)", fill=TEAL, font=font(18, True))
    f = font(15)
    items = [
        "Find brown ring CT-OC(R) - thick black cable through center, wires K and L",
        "Confirm ratio marking used: 100/5A",
        "Count cable passes through CT hole: must be ONE pass only",
        "If 2 passes -> reading ~ double (can cause false high / o.C)",
        "Cable not pinched; insulation OK; CT body not cracked/burnt",
        "K and L screws tight; no corrosion; ferrules OK",
        "K-L wires go to HiMP CT input (not loose / not open)",
    ]
    for i, t in enumerate(items):
        checkbox(d, 60, y + 55 + i * 30, t, f)

    y = 820
    rr(d, (40, y, 1200, y + 200), WHITE, GREEN, 3, 14)
    d.text((60, y + 14), "CHECK 2 - Compare phases (motor RUNNING - no disconnect)", fill=GREEN, font=font(18, True))
    for i, t in enumerate([
        "On HiMP: SELECT Down -> read R, then S, then T",
        "Write values: R ____   S ____   T ____   Door A ____",
        "If only R clearly highest -> CT-OC(R) / R-phase suspect",
        "If R~S~T and all high -> load issue or EOCR/common CT problem",
    ]):
        checkbox(d, 60, y + 55 + i * 32, t, f)

    y = 1040
    rr(d, (40, y, 1200, y + 220), WHITE, ORANGE, 3, 14)
    d.text((60, y + 14), "CHECK 3 - Swap test (best proof - STOPPED / authorized only)", fill=ORANGE, font=font(18, True))
    for i, t in enumerate([
        "Stop & isolate as required. Mark all wires before touching.",
        "Swap CT-OC(R) with CT-OC(S) (keep secondary closed - never open live CT)",
        "Run again -> read R/S/T",
        "High reading MOVES with CT -> bad CT (or its wiring)",
        "High reading STAYS on electrical R -> real R load/cable issue",
    ]):
        checkbox(d, 60, y + 50 + i * 30, t, f)

    y = 1280
    rr(d, (40, y, 600, y + 280), LG, GREEN, 3, 14)
    d.text((60, y + 16), "PASS (good)", fill=GREEN, font=font(18, True))
    for i, t in enumerate([
        "- Cable through CT once",
        "- K-L tight & clean",
        "- EOCR ~ 3.2-3.3 A at door 65 A",
        "- R ~ S ~ T",
        "- No more delayed o.C",
    ]):
        d.text((60, y + 60 + i * 35), t, fill=DARK, font=font(15))

    rr(d, (660, y, 1200, y + 280), LR, RED, 3, 14)
    d.text((680, y + 16), "FAIL / FIX", fill=RED, font=font(18, True))
    for i, t in enumerate([
        "- 2 turns through CT -> make 1 turn",
        "- Loose K-L -> tighten",
        "- Bad CT -> replace 100/5A",
        "- Do NOT raise rc only",
        "- After fix: retest R/S/T + door A",
    ]):
        d.text((680, y + 60 + i * 35), t, fill=DARK, font=font(15))

    d.text((40, 1590), "Path: R/S/T -> 52 -> 88F -> 6-1 -> CT-OC -> Motor  |  CT secondary -> HiMP-D06 (51)", fill=GRAY, font=font(13))
    d.text((40, 1620), "NO.4 E/R VENT. FAN (REV)  |  HI-2536-ME-SD1  |  CT-OC(R) checklist Rev.1", fill=GRAY, font=font(13))
    d.text((40, 1650), "Related: HiMP setting card  |  Schematic current-path overlay", fill=GRAY, font=font(13))

    img.save(path, "PNG")
    print("PNG", path)
    return path


def png_to_pdf(png, pdf):
    c = canvas.Canvas(pdf, pagesize=A4)
    pw, ph = A4
    c.drawImage(png, 0, 0, width=pw, height=ph)
    c.showPage()
    c.save()
    print("PDF", pdf)


if __name__ == "__main__":
    art = "/opt/cursor/artifacts"
    os.makedirs(art, exist_ok=True)
    png = "/workspace/No4_ER_Vent_Fan_CT_OC_R_Check_Checklist.png"
    pdf = "/workspace/No4_ER_Vent_Fan_CT_OC_R_Check_Checklist.pdf"
    create_card(png)
    png_to_pdf(png, pdf)
    shutil.copy2(png, f"{art}/No4_ER_Vent_Fan_CT_OC_R_Check_Checklist.png")
    shutil.copy2(pdf, f"{art}/No4_ER_Vent_Fan_CT_OC_R_Check_Checklist.pdf")
