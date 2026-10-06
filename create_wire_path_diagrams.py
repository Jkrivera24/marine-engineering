#!/usr/bin/env python3
"""Create highlighted wire-path diagrams for No.4 E/R Vent Fan start sequence."""

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import Color, white, black
from reportlab.pdfgen import canvas
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import os
import shutil

# ---------- fonts ----------
def font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


# Colors
NAVY = (11, 44, 74)
TEAL = (14, 124, 123)
ORANGE = (196, 92, 38)
GREEN = (46, 125, 50)
RED = (183, 28, 28)
AMBER = (230, 81, 0)
PURPLE = (94, 53, 177)
BLUE = (25, 118, 210)
GRAY = (90, 106, 122)
LIGHT = (244, 247, 250)
WHITE = (255, 255, 255)
DARK = (26, 26, 26)
WIRE_POWER = (220, 50, 50)      # highlight power from start
WIRE_CTRL = (14, 124, 123)      # control from start
WIRE_START = (196, 92, 38)      # reduced voltage start
WIRE_RUN = (46, 125, 50)        # full voltage run
WIRE_FB = (94, 53, 177)         # feedback
WIRE_PROT = (183, 28, 28)       # EOCR protect


def rounded_rect(draw, xy, fill, outline=None, width=2, radius=12):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def box(draw, x, y, w, h, title, sub, fill, outline, title_size=18, sub_size=13):
    rounded_rect(draw, (x, y, x + w, y + h), fill, outline, 3, 14)
    # title
    tb = font(title_size, True)
    sb = font(sub_size, False)
    # center text roughly
    tw = draw.textlength(title, font=tb)
    draw.text((x + (w - tw) / 2, y + 10), title, fill=WHITE if fill != WHITE else outline, font=tb)
    if sub:
        lines = sub.split("\n")
        yy = y + 38
        for line in lines:
            lw = draw.textlength(line, font=sb)
            draw.text((x + (w - lw) / 2, yy), line, fill=WHITE if fill not in (WHITE, LIGHT, (232, 245, 233), (255, 235, 238), (253, 232, 216), (227, 242, 253), (237, 231, 246)) else DARK, font=sb)
            yy += 18


def thick_line(draw, pts, color, width=8):
    draw.line(pts, fill=color, width=width)
    # end caps
    r = width // 2
    for p in (pts[0], pts[-1]):
        draw.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), fill=color)


def arrow(draw, x1, y1, x2, y2, color, width=8):
    thick_line(draw, [(x1, y1), (x2, y2)], color, width)
    # arrow head
    import math
    ang = math.atan2(y2 - y1, x2 - x1)
    L = 16
    a1 = ang + 2.6
    a2 = ang - 2.6
    p1 = (x2 + L * math.cos(a1), y2 + L * math.sin(a1))
    p2 = (x2 + L * math.cos(a2), y2 + L * math.sin(a2))
    draw.polygon([(x2, y2), p1, p2], fill=color)


def label(draw, x, y, text, color, size=14, bold=True):
    f = font(size, bold)
    # background pill
    tw = draw.textlength(text, font=f)
    pad = 6
    rounded_rect(draw, (x - pad, y - pad, x + tw + pad, y + size + pad), WHITE, color, 2, 8)
    draw.text((x, y), text, fill=color, font=f)


def create_power_start_diagram(path):
    W, H = 2000, 1200
    img = Image.new("RGB", (W, H), LIGHT)
    d = ImageDraw.Draw(img)

    # header
    d.rectangle((0, 0, W, 90), fill=NAVY)
    d.rectangle((0, 90, W, 100), fill=TEAL)
    d.text((40, 22), "NO.4 E/R VENT. FAN (REV) — How it works: POWER path from START", fill=WHITE, font=font(32, True))
    d.text((40, 60), "HI-2536-ME-SD1  ·  Highlighted wires show energize order for SUPPLY (Forward) start", fill=(168, 197, 216), font=font(16))

    # Legend
    legend_y = 120
    items = [
        (WIRE_POWER, "1 Power in (R/S/T)"),
        (WIRE_START, "2 Reduced-V start"),
        (WIRE_RUN, "3 Full-V run"),
        (WIRE_PROT, "4 EOCR monitor"),
        (WIRE_FB, "5 Feedback / heater"),
    ]
    x = 40
    for col, txt in items:
        d.rectangle((x, legend_y, x + 36, legend_y + 18), fill=col)
        d.text((x + 44, legend_y), txt, fill=DARK, font=font(15, True))
        x += 280

    # Row of devices - power path
    y0 = 280
    bw, bh = 160, 110

    devices = [
        (80, "SOURCE\nR S T", "3-phase", WIRE_POWER, WIRE_POWER),
        (280, "52\nMCCB", "Main breaker", WIRE_POWER, WIRE_POWER),
        (480, "88F\n(Forward)", "Direction\ncontactor", WIRE_RUN, GREEN),
        (700, "6-1 / 6-2\n+ ATr", "Reduced V\nstart", WIRE_START, ORANGE),
        (960, "MOTOR\nM", "U V W", WIRE_RUN, GREEN),
    ]

    # Draw boxes
    positions = []
    for x, title, sub, wire, outline in devices:
        fill = outline if title.startswith("MOTOR") or title.startswith("SOURCE") else outline
        # softer fills
        soft = {
            WIRE_POWER: (255, 235, 238),
            WIRE_START: (253, 232, 216),
            WIRE_RUN: (232, 245, 233),
        }.get(wire, WHITE)
        rounded_rect(d, (x, y0, x + bw, y0 + bh), soft, outline, 4, 16)
        tb = font(20, True)
        sb = font(14)
        lines = title.split("\n")
        yy = y0 + 18
        for i, line in enumerate(lines):
            tw = d.textlength(line, font=tb)
            d.text((x + (bw - tw) / 2, yy), line, fill=outline, font=tb)
            yy += 26
        for line in sub.split("\n"):
            tw = d.textlength(line, font=sb)
            d.text((x + (bw - tw) / 2, yy + 4), line, fill=GRAY, font=sb)
            yy += 18
        positions.append((x, y0, bw, bh, wire))

    # Highlighted wires between devices (thick)
    # 1 SOURCE -> 52
    arrow(d, 80 + bw, y0 + bh // 2, 280, y0 + bh // 2, WIRE_POWER, 10)
    label(d, 200, y0 - 40, "① START: power available", WIRE_POWER, 14)

    # 2 52 -> 88F
    arrow(d, 280 + bw, y0 + bh // 2, 480, y0 + bh // 2, WIRE_POWER, 10)
    label(d, 370, y0 + bh + 20, "② through 52", WIRE_POWER, 13)

    # 3 branch: start path 88F area -> 6-1/6-2 (reduced) then motor
    # Show start path in orange going through ATr
    arrow(d, 480 + bw, y0 + bh // 2 - 15, 700, y0 + bh // 2 - 15, WIRE_START, 10)
    label(d, 560, y0 - 45, "③ START path (first ~30s)", WIRE_START, 14)

    arrow(d, 700 + bw, y0 + bh // 2 - 15, 960, y0 + bh // 2 - 15, WIRE_START, 10)

    # Run path (after timer) - parallel green below
    # 88F direct to motor full voltage after transition
    d.line([(480 + bw // 2, y0 + bh), (480 + bw // 2, y0 + bh + 70), (960, y0 + bh + 70)], fill=WIRE_RUN, width=10)
    arrow(d, 960, y0 + bh + 70, 960 + 0, y0 + bh, WIRE_RUN, 10)
    # fix arrow to motor bottom
    arrow(d, 900, y0 + bh + 70, 960 + bw // 2, y0 + bh + 70, WIRE_RUN, 10)
    # vertical into motor
    thick_line(d, [(960 + bw // 2, y0 + bh + 70), (960 + bw // 2, y0 + bh)], WIRE_RUN, 10)
    label(d, 620, y0 + bh + 85, "④ After Timer 19 (~30s): FULL VOLTAGE RUN via 88F", WIRE_RUN, 14)

    # CT / EOCR branch
    ct_x, ct_y = 1180, y0
    rounded_rect(d, (ct_x, ct_y, ct_x + 170, ct_y + bh), (255, 235, 238), RED, 4, 16)
    d.text((ct_x + 30, ct_y + 20), "CT-OC (R)", fill=RED, font=font(20, True))
    d.text((ct_x + 35, ct_y + 50), "100 / 5 A", fill=DARK, font=font(15))
    d.text((ct_x + 25, ct_y + 75), "on R-phase", fill=GRAY, font=font(14))

    eocr_x = 1420
    rounded_rect(d, (eocr_x, ct_y, eocr_x + 200, ct_y + bh), (255, 235, 238), RED, 4, 16)
    d.text((eocr_x + 25, ct_y + 15), "EOCR 51", fill=RED, font=font(20, True))
    d.text((eocr_x + 20, ct_y + 45), "HiMP-D06", fill=DARK, font=font(15))
    d.text((eocr_x + 15, ct_y + 70), "SET 3.27A INV", fill=DARK, font=font(14))

    # wire from motor line to CT to EOCR
    arrow(d, 960 + bw, y0 + 30, ct_x, y0 + 30, WIRE_PROT, 8)
    arrow(d, ct_x + 170, y0 + 55, eocr_x, y0 + 55, WIRE_PROT, 8)
    label(d, 1100, y0 - 45, "⑤ Always monitoring (trips o.C)", WIRE_PROT, 14)

    # Door ammeter
    rounded_rect(d, (1180, y0 + 150, 1380, y0 + 230), (227, 242, 253), BLUE, 3, 12)
    d.text((1205, y0 + 165), "Door Ammeter", fill=BLUE, font=font(16, True))
    d.text((1220, y0 + 195), "~65 A running", fill=DARK, font=font(14))

    # Bottom note cards
    cards = [
        (80, 720, 420, 180, "STEP A — Press SUPPLY",
         "SMC commands 4F\n88SH heater opens\nStart contactors pick up", TEAL, (212, 239, 238)),
        (540, 720, 420, 180, "STEP B — Reduced voltage",
         "Power wire via ATr taps\n(6-1 / 6-2) limits inrush\nTimer 19 starts (~30s)", ORANGE, (253, 232, 216)),
        (1000, 720, 420, 180, "STEP C — Full voltage run",
         "Transfer to full V on 88F\n4FX feedback to SMC\nEOCR watches current", GREEN, (232, 245, 233)),
        (1480, 720, 420, 180, "If EOCR > SET 3.27",
         "INV delay → minutes\nthen o.C + ABNORMAL\n(your confirmed trip)", RED, (255, 235, 238)),
    ]
    for x, y, w, h, title, body, col, fill in cards:
        rounded_rect(d, (x, y, x + w, y + h), fill, col, 4, 16)
        d.text((x + 20, y + 16), title, fill=col, font=font(18, True))
        yy = y + 55
        for line in body.split("\n"):
            d.text((x + 20, yy), line, fill=DARK, font=font(15))
            yy += 28

    # footer
    d.text((40, 1140), "Wire colors = energize order from START (Supply/Forward). Reverse uses 88R / 4RX the same way.", fill=GRAY, font=font(14))
    d.text((40, 1165), "CT-OC(R) 100/5  ·  FLA 65.4A  ·  EOCR SET 3.27A  ·  Your run: door ~65A, EOCR ~3.63A", fill=GRAY, font=font(14))

    img.save(path, "PNG", quality=95)
    print("PNG:", path)
    return path


def create_control_start_diagram(path):
    W, H = 2000, 1200
    img = Image.new("RGB", (W, H), LIGHT)
    d = ImageDraw.Draw(img)

    d.rectangle((0, 0, W, 90), fill=NAVY)
    d.rectangle((0, 90, W, 100), fill=TEAL)
    d.text((40, 22), "NO.4 E/R VENT. FAN (REV) — How it works: CONTROL wires from START", fill=WHITE, font=font(30, True))
    d.text((40, 60), "HI-2536-ME-SD2  ·  SMC-503H  ·  Highlighted control path when you press SUPPLY", fill=(168, 197, 216), font=font(16))

    # Vertical-ish flow left to right with control wire highlight
    nodes = [
        (60, 200, 200, 120, "CPT\nAC 220V", "Control power", TEAL),
        (320, 200, 220, 120, "SMC-503H\nSOURCE", "S1–S2 powered", TEAL),
        (600, 200, 220, 120, "Press\nSUPPLY", "Operator start", ORANGE),
        (880, 200, 200, 120, "Internal\n4F ON", "Run command", ORANGE),
        (1140, 200, 220, 120, "To starter\npanel", "Pick up 88F\n+ start seq", GREEN),
        (1440, 200, 220, 120, "4FX\nfeedback", "Aux 13–14\nback to SMC", PURPLE),
        (1720, 200, 200, 120, "SUPPLY\nRUN lamp", "Running OK", GREEN),
    ]

    softs = {
        TEAL: (212, 239, 238),
        ORANGE: (253, 232, 216),
        GREEN: (232, 245, 233),
        PURPLE: (237, 231, 246),
        RED: (255, 235, 238),
    }

    centers = []
    for x, y, w, h, title, sub, col in nodes:
        rounded_rect(d, (x, y, x + w, y + h), softs[col], col, 4, 16)
        tb = font(18, True)
        sb = font(13)
        yy = y + 16
        for line in title.split("\n"):
            tw = d.textlength(line, font=tb)
            d.text((x + (w - tw) / 2, yy), line, fill=col, font=tb)
            yy += 24
        for line in sub.split("\n"):
            tw = d.textlength(line, font=sb)
            d.text((x + (w - tw) / 2, yy + 6), line, fill=DARK, font=sb)
            yy += 18
        centers.append((x + w, y + h // 2, col))

    # highlighted control wire chain
    for i in range(len(centers) - 1):
        x1 = centers[i][0]
        y1 = centers[i][1]
        # next box left
        nx = nodes[i + 1][0]
        col = centers[i][2] if i < 2 else (ORANGE if i < 4 else GREEN if i < 5 else PURPLE)
        # use sequence colors
        cols = [TEAL, TEAL, ORANGE, ORANGE, GREEN, PURPLE]
        arrow(d, x1, y1, nx, y1, cols[i], 9)

    # step numbers on wires
    labels_w = [
        (270, 160, "①", TEAL),
        (550, 160, "②", TEAL),
        (830, 160, "③", ORANGE),
        (1080, 160, "④", ORANGE),
        (1360, 160, "⑤", GREEN),
        (1660, 160, "⑥", PURPLE),
    ]
    for x, y, t, col in labels_w:
        d.ellipse((x, y, x + 36, y + 36), fill=col)
        tw = d.textlength(t, font=font(16, True))
        d.text((x + (36 - tw) / 2, y + 7), t, fill=WHITE, font=font(16, True))

    # Protection string below
    d.text((60, 400), "PROTECTION / STOP string in control (must stay closed to keep running)", fill=NAVY, font=font(20, True))

    prot = [
        (60, 450, "EOCR 51\n95–96 NC", "Opens on o.C", RED),
        (320, 450, "Interlocks\n88F / 88R", "Anti both-ways", ORANGE),
        (580, 450, "SMC run\nhold / STOP", "NC STOP in series", TEAL),
        (840, 450, "Remote\nGSP2 (if used)", "Remote run contact", TEAL),
        (1100, 450, "4FX closed\nwhile running", "Feedback OK", PURPLE),
    ]
    for i, (x, y, title, sub, col) in enumerate(prot):
        rounded_rect(d, (x, y, x + 220, y + 100), softs.get(col, WHITE), col, 3, 14)
        tb = font(16, True)
        yy = y + 14
        for line in title.split("\n"):
            tw = d.textlength(line, font=tb)
            d.text((x + (220 - tw) / 2, yy), line, fill=col, font=tb)
            yy += 22
        tw = d.textlength(sub, font=font(13))
        d.text((x + (220 - tw) / 2, yy + 8), sub, fill=DARK, font=font(13))
        if i < len(prot) - 1:
            arrow(d, x + 220, y + 50, x + 260, y + 50, GRAY, 6)

    # Your trip callout
    rounded_rect(d, (1400, 450, 1940, 650), (255, 235, 238), RED, 4, 16)
    d.text((1430, 470), "YOUR TRIP PATH (confirmed)", fill=RED, font=font(18, True))
    d.text((1430, 510), "EOCR measures ~3.63 A > SET 3.27 A", fill=DARK, font=font(15))
    d.text((1430, 545), "INV delay → several minutes", fill=DARK, font=font(15))
    d.text((1430, 580), "95–96 opens → 88F drops → Amp 0", fill=DARK, font=font(15))
    d.text((1430, 615), "97–98 → SMC ABNORMAL ON · display o.C", fill=DARK, font=font(15))

    # Sequence summary bottom
    rounded_rect(d, (60, 720, 1940, 1100), WHITE, TEAL, 3, 16)
    d.text((90, 745), "Full start sequence (wires energize in this order)", fill=NAVY, font=font(22, True))
    steps = [
        "1. CPT feeds SMC SOURCE (control live).",
        "2. Press SUPPLY → SMC 4F closes → run command wire to starter.",
        "3. Heater circuit 88SH drops out (HEATING off).",
        "4. Start wires energize 6-1 / 6-2 + ATr (reduced voltage) and 88F path.",
        "5. Timer 19 (~30 s) — start wire transfers to full-voltage run on 88F.",
        "6. 4FX aux closes — feedback wire to SMC → SUPPLY RUN lamp ON.",
        "7. CT-OC(R) sense wire continuously feeds EOCR; if > SET → o.C trip opens control NC 95–96.",
        "8. Normal STOP: SMC releases 4F → contactors open → (optional) heater ON if HEATER switch ON.",
    ]
    yy = 790
    for s in steps:
        d.text((90, yy), s, fill=DARK, font=font(16))
        yy += 32

    d.text((40, 1140), "Highlighted thick lines = control/power wires in start order. Reverse = same with EXHAUST / 88R / 4RX.", fill=GRAY, font=font(14))

    img.save(path, "PNG", quality=95)
    print("PNG:", path)
    return path


def pngs_to_pdf(pngs, pdf_path):
    c = canvas.Canvas(pdf_path, pagesize=landscape(A4))
    pw, ph = landscape(A4)
    for png in pngs:
        img = Image.open(png)
        # fit
        iw, ih = img.size
        scale = min(pw / iw, ph / ih) * 0.98
        w, h = iw * scale, ih * scale
        x, y = (pw - w) / 2, (ph - h) / 2
        c.drawImage(png, x, y, width=w, height=h)
        c.showPage()
    c.save()
    print("PDF:", pdf_path)


def add_to_pptx(pptx_path, pngs):
    prs = Presentation(pptx_path)
    for png, title in pngs:
        slide = prs.slides.add_slide(prs.slide_layouts[6])
        # bg
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = RGBColor(0xF4, 0xF7, 0xFA)
        shape.line.fill.background()
        spTree = slide.shapes._spTree
        sp = shape._element
        spTree.remove(sp)
        spTree.insert(2, sp)
        # full-bleed image almost
        slide.shapes.add_picture(png, Inches(0.15), Inches(0.1), width=Inches(13.0))
    prs.save(pptx_path)
    print("PPTX updated:", pptx_path)


if __name__ == "__main__":
    art = "/opt/cursor/artifacts"
    os.makedirs(art, exist_ok=True)

    p1 = "/workspace/No4_ER_Vent_Fan_Power_Path_From_Start.png"
    p2 = "/workspace/No4_ER_Vent_Fan_Control_Path_From_Start.png"
    create_power_start_diagram(p1)
    create_control_start_diagram(p2)

    shutil.copy2(p1, f"{art}/No4_ER_Vent_Fan_Power_Path_From_Start.png")
    shutil.copy2(p2, f"{art}/No4_ER_Vent_Fan_Control_Path_From_Start.png")

    pdf = "/workspace/No4_ER_Vent_Fan_Wire_Path_From_Start.pdf"
    pdf_art = f"{art}/No4_ER_Vent_Fan_Wire_Path_From_Start.pdf"
    pngs_to_pdf([p1, p2], pdf)
    shutil.copy2(pdf, pdf_art)

    pptx = "/workspace/No4_ER_Vent_Fan_Start_Run_Stop_Sequence.pptx"
    add_to_pptx(pptx, [
        (p1, "Power path"),
        (p2, "Control path"),
    ])
    shutil.copy2(pptx, f"{art}/No4_ER_Vent_Fan_Start_Run_Stop_Sequence.pptx")
    print("Done")
