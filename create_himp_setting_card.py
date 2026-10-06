#!/usr/bin/env python3
"""One-page HiMP-D06 EOCR setting card for No.4 E/R Vent Fan."""

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import shutil

def font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
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
LT = (212, 239, 238)


def rr(d, box, fill, outline=None, w=3, r=14):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline or fill, width=w)


def create_card(path):
    # Portrait A4-ish at 150 dpi: 1240 x 1754
    W, H = 1240, 1754
    img = Image.new("RGB", (W, H), LIGHT)
    d = ImageDraw.Draw(img)

    # Header
    d.rectangle((0, 0, W, 130), fill=NAVY)
    d.rectangle((0, 130, W, 145), fill=TEAL)
    d.text((40, 28), "HiMP-D06 EOCR — Setting Card", fill=WHITE, font=font(36, True))
    d.text((40, 78), "NO.4 E/R VENT. FAN (REV)  ·  CT-OC 100/5A  ·  Keep this at the panel", fill=(168, 197, 216), font=font(16))

    # Buttons section
    y = 170
    rr(d, (40, y, 1200, y + 280), WHITE, TEAL, 3, 16)
    d.text((60, y + 20), "BUTTONS", fill=TEAL, font=font(22, True))

    buttons = [
        (70, "MODE", "Enter / leave\nsetting menu", TEAL, LT),
        (360, "SET", "Show value /\nSAVE setting", ORANGE, LO),
        (650, "SELECT ▲▼", "Change parameter\nor value", GREEN, LG),
        (940, "RESET/TEST", "Clear o.C trip /\ntest when stopped", RED, LR),
    ]
    for x, title, body, col, fill in buttons:
        rr(d, (x, y + 70, x + 250, y + 250), fill, col, 3, 12)
        tw = d.textlength(title, font=font(18, True))
        d.text((x + (250 - tw) / 2, y + 95), title, fill=col, font=font(18, True))
        yy = y + 145
        for line in body.split("\n"):
            lw = d.textlength(line, font=font(15))
            d.text((x + (250 - lw) / 2, yy), line, fill=DARK, font=font(15))
            yy += 28

    # How to set
    y = 480
    rr(d, (40, y, 1200, y + 320), WHITE, NAVY, 3, 16)
    d.text((60, y + 18), "HOW TO SET", fill=NAVY, font=font(22, True))
    steps = [
        "1. Stop the motor if possible (safer).",
        "2. Press MODE  →  enter setting menu (may show rc).",
        "3. Press SELECT ▲▼  →  choose the parameter.",
        "4. Press SET  →  current value appears.",
        "5. Press SELECT ▲▼  →  change the value.",
        "6. Press SET again  →  SAVE.",
        "7. Press MODE  →  return to amp display.",
        "Tip: To only VIEW settings, browse with SELECT then MODE — do not press SET.",
    ]
    yy = y + 60
    for s in steps:
        d.text((70, yy), s, fill=DARK, font=font(17))
        yy += 30

    # Drawing values table
    y = 830
    rr(d, (40, y, 1200, y + 420), WHITE, ORANGE, 3, 16)
    d.text((60, y + 18), "DRAWING SETTINGS (HI-2536) — USE THESE", fill=ORANGE, font=font(22, True))

    rows = [
        ("Parameter", "Set value", "Notes", True),
        ("Operating current SET’G", "3.27 A", "Secondary = motor 65.4 A with CT 100/5", False),
        ("Characteristic CHA", "INV", "Inverse — delayed trip", False),
        ("O-TIME", "10 s", "OC operating time (ref. ~600%)", False),
        ("D-TIME", "6 s", "Start delay — ignore OC during start", False),
        ("PF (phase fail)", "OFF", "As drawing", False),
        ("CT ratio factor", "1 *", "If display shows ~3.x A (secondary)", False),
        ("Motor FLA / CT", "65.4 A / 100/5", "Primary ÷ 20 = EOCR secondary", False),
    ]
    yy = y + 65
    for a, b, c, hdr in rows:
        bg = ORANGE if hdr else (LO if yy % 2 == 0 else WHITE)
        fg = WHITE if hdr else DARK
        d.rectangle((60, yy, 1180, yy + 40), fill=bg)
        d.text((70, yy + 8), a, fill=fg, font=font(15, True if hdr else False))
        d.text((420, yy + 8), b, fill=fg, font=font(15, True))
        d.text((620, yy + 8), c, fill=fg, font=font(14))
        yy += 40

    d.text((60, y + 385), "* If CT factor = 20, display shows primary (~65 A) and SET must be ~65.4 — do NOT mix with SET 3.27.", fill=RED, font=font(14, True))

    # Reset + warning
    y = 1280
    rr(d, (40, y, 600, y + 280), LR, RED, 3, 16)
    d.text((60, y + 20), "AFTER o.C TRIP", fill=RED, font=font(20, True))
    for i, line in enumerate([
        "1. Photo/note: o.C + phase LED (R/S/T)",
        "2. Motor stopped → press RESET",
        "3. Clear SMC ABNORMAL if latched",
        "4. Check why current ≥ SET",
        "5. Then restart",
    ]):
        d.text((60, y + 70 + i * 35), line, fill=DARK, font=font(15))

    rr(d, (660, y, 1200, y + 280), LO, ORANGE, 3, 16)
    d.text((680, y + 20), "DO NOT", fill=ORANGE, font=font(20, True))
    for i, line in enumerate([
        "• Raise SET only to stop trips",
        "• Mix CT factor 20 + SET 3.27",
        "• Ignore R-phase high reading",
        "• Open CT secondary live",
        "",
        "Your case: door ~65 A, EOCR ~3.63 A",
        "→ trips near 112.5% of SET 3.27",
    ]):
        d.text((680, y + 65 + i * 28), line, fill=DARK, font=font(15))

    # Footer
    d.text((40, 1600), "Hyundai HiMP-Deluxe  ·  Range 0.5–6 A  ·  Trip ~112.5% of SET on INV", fill=GRAY, font=font(14))
    d.text((40, 1635), "NO.4 E/R VENT. FAN (REV)  ·  HI-2536-ME-SD1/SD2  ·  Setting card Rev.1", fill=GRAY, font=font(14))
    d.text((40, 1670), "Next check: SELECT while running to read R / S / T separately; inspect CT-OC(R) one-pass + K-L.", fill=GRAY, font=font(14))

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
    png = "/workspace/No4_ER_Vent_Fan_HiMP_Setting_Card.png"
    pdf = "/workspace/No4_ER_Vent_Fan_HiMP_Setting_Card.pdf"
    create_card(png)
    png_to_pdf(png, pdf)
    shutil.copy2(png, f"{art}/No4_ER_Vent_Fan_HiMP_Setting_Card.png")
    shutil.copy2(pdf, f"{art}/No4_ER_Vent_Fan_HiMP_Setting_Card.pdf")
