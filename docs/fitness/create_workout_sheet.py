# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""Create personalized vessel-gym workout workbook (Google Sheets compatible)."""

from openpyxl import Workbook
from openpyxl.styles import Font, Fill, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.hyperlink import Hyperlink
from pathlib import Path

OUT = Path(__file__).resolve().parent / "Vessel_Gym_Workout_Plan_80_to_72kg.xlsx"
ARTIFACT = Path("/opt/cursor/artifacts/Vessel_Gym_Workout_Plan_80_to_72kg.xlsx")

# Colors
HEADER = PatternFill("solid", fgColor="1F4E79")
SUBHEADER = PatternFill("solid", fgColor="2E75B6")
DAY_FILL = PatternFill("solid", fgColor="D6EAF8")
ALT_ROW = PatternFill("solid", fgColor="F2F2F2")
GREEN = PatternFill("solid", fgColor="E2EFDA")
YELLOW = PatternFill("solid", fgColor="FFF2CC")
ORANGE = PatternFill("solid", fgColor="FCE4D6")
WHITE_FONT = Font(name="Calibri", bold=True, color="FFFFFF", size=12)
TITLE_FONT = Font(name="Calibri", bold=True, size=16, color="1F4E79")
BOLD = Font(name="Calibri", bold=True, size=11)
NORMAL = Font(name="Calibri", size=11)
LINK_FONT = Font(name="Calibri", size=11, color="0563C1", underline="single")
THIN = Border(
    left=Side(style="thin", color="B0B0B0"),
    right=Side(style="thin", color="B0B0B0"),
    top=Side(style="thin", color="B0B0B0"),
    bottom=Side(style="thin", color="B0B0B0"),
)
WRAP = Alignment(wrap_text=True, vertical="center")
CENTER = Alignment(wrap_text=True, vertical="center", horizontal="center")


def style_header_row(ws, row, cols):
    for c in range(1, cols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER
        cell.font = WHITE_FONT
        cell.alignment = CENTER
        cell.border = THIN


def set_widths(ws, widths):
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w


def add_link(cell, url, label="Watch form video"):
    cell.value = label
    cell.hyperlink = url
    cell.font = LINK_FONT
    cell.alignment = CENTER
    cell.border = THIN


def write_exercise_table(ws, start_row, headers, rows):
    for col, h in enumerate(headers, 1):
        ws.cell(row=start_row, column=col, value=h)
    style_header_row(ws, start_row, len(headers))

    for i, row in enumerate(rows):
        r = start_row + 1 + i
        fill = ALT_ROW if i % 2 else PatternFill("solid", fgColor="FFFFFF")
        for col, val in enumerate(row[:-1], 1):  # all except URL
            cell = ws.cell(row=r, column=col, value=val)
            cell.font = NORMAL
            cell.alignment = WRAP if col in (1, 5) else CENTER
            cell.border = THIN
            cell.fill = fill
        add_link(ws.cell(row=r, column=len(headers)), row[-1])
        ws.cell(row=r, column=len(headers)).fill = fill
        ws.row_dimensions[r].height = 32
    return start_row + 1 + len(rows)


def build():
    wb = Workbook()

    # ---------- Overview ----------
    ws = wb.active
    ws.title = "Overview"
    set_widths(ws, [28, 55, 22, 22, 22])

    ws["A1"] = "Vessel Gym Plan - 80 kg -> 72 kg"
    ws["A1"].font = TITLE_FONT
    ws.merge_cells("A1:E1")
    ws.row_dimensions[1].height = 28

    ws["A2"] = "Personalized for: Male | Age 36 | Height 5'7\" (170 cm) | Train 4x/week | Ship gym"
    ws["A2"].font = Font(name="Calibri", italic=True, size=11, color="666666")
    ws.merge_cells("A2:E2")

    profile = [
        ("Current weight", "80 kg"),
        ("Goal weight", "72 kg (?8 kg)"),
        ("Pace target", "0.4-0.6 kg / week (~3-5 months)"),
        ("Calories (start)", "1,900-2,100 kcal / day"),
        ("Protein", "130-150 g / day"),
        ("Training days", "4 per week (see Schedule tab)"),
        ("Gym", "Vessel: Smith/rack, cables, DBs, rower, treadmill, bike, leg curl/ext"),
    ]
    ws["A4"] = "Profile & targets"
    ws["A4"].font = BOLD
    ws["A4"].fill = SUBHEADER
    ws["A4"].font = WHITE_FONT
    ws["B4"] = ""
    ws["B4"].fill = SUBHEADER
    for i, (k, v) in enumerate(profile):
        ws.cell(row=5 + i, column=1, value=k).font = BOLD
        ws.cell(row=5 + i, column=1).border = THIN
        ws.cell(row=5 + i, column=1).fill = GREEN
        ws.cell(row=5 + i, column=2, value=v).border = THIN
        ws.cell(row=5 + i, column=2).alignment = WRAP

    rules = [
        "Warm up 5 min bike/treadmill + 1 light set before heavy lifts.",
        "When you hit the top of the rep range with good form, add a little weight next session.",
        "Log Weight Used + Reps Done every session (columns on each Day tab).",
        "Click Watch form video before a new exercise - learn form first, then load.",
        "Rower is your best fat-loss cardio on this ship; incline walk on easier days.",
        "Weigh weekly (same day/time). Also tape waist at navel once a week.",
        "If loss <1 kg in 4 weeks -> trim ~150-200 kcal or add one incline walk.",
        "If energy crashes / strength drops hard -> add 150-200 kcal around training.",
        "Rest days: easy walk OK. Sleep 7+ hours when possible.",
    ]
    ws["A13"] = "How to use this sheet"
    ws["A13"].font = WHITE_FONT
    ws["A13"].fill = SUBHEADER
    ws.merge_cells("A13:B13")
    for i, rule in enumerate(rules):
        ws.cell(row=14 + i, column=1, value=i + 1).border = THIN
        ws.cell(row=14 + i, column=1).alignment = CENTER
        ws.cell(row=14 + i, column=2, value=rule).border = THIN
        ws.cell(row=14 + i, column=2).alignment = WRAP
        ws.row_dimensions[14 + i].height = 28

    ws["A24"] = "Tabs in this workbook"
    ws["A24"].font = WHITE_FONT
    ws["A24"].fill = HEADER
    ws.merge_cells("A24:B24")
    tabs = [
        ("Schedule", "Weekly layout + rest days"),
        ("Day1_Lower_Push", "Workout A - legs + chest/shoulders/triceps"),
        ("Day2_Pull_Core_Row", "Workout B - back + core + rower intervals"),
        ("Day4_FullBody", "Workout C - full body strength"),
        ("Day5_Metabolic", "Workout D - upper circuit + cardio"),
        ("Exercise_Library", "All exercises with YouTube form links"),
        ("Progress_Log", "Weekly weight & waist tracking"),
        ("Nutrition", "Simple calorie/protein guide"),
    ]
    for i, (t, d) in enumerate(tabs):
        ws.cell(row=25 + i, column=1, value=t).font = BOLD
        ws.cell(row=25 + i, column=1).border = THIN
        ws.cell(row=25 + i, column=1).fill = DAY_FILL
        ws.cell(row=25 + i, column=2, value=d).border = THIN

    ws["A35"] = "Import to Google Sheets: Upload this .xlsx to Google Drive ? right-click ? Open with ? Google Sheets. Hyperlinks stay clickable."
    ws["A35"].font = Font(name="Calibri", size=10, italic=True, color="666666")
    ws.merge_cells("A35:E35")

    # ---------- Schedule ----------
    ws = wb.create_sheet("Schedule")
    set_widths(ws, [14, 28, 50, 18, 18])
    ws["A1"] = "Weekly schedule (4 training days)"
    ws["A1"].font = TITLE_FONT
    ws.merge_cells("A1:E1")

    headers = ["Day", "Session", "Focus", "Duration", "Tab"]
    schedule = [
        ("Mon (Day 1)", "Lower + Push", "Squat, RDL, leg curl, incline press, laterals, triceps, plank", "~45-55 min", "Day1_Lower_Push"),
        ("Tue (Day 2)", "Pull + Core + Rower", "Pull-ups/rows, face pulls, curls, dead bug, rower intervals", "~50 min", "Day2_Pull_Core_Row"),
        ("Wed", "Rest / easy", "Optional easy walk or bike 20-30 min", "Optional", "-"),
        ("Thu (Day 4)", "Full Body Strength", "Squat, press, RDL, row, lunges, woodchop, farmer carry", "~50 min", "Day4_FullBody"),
        ("Fri (Day 5)", "Upper Metabolic + Cardio", "Circuit press/row/push-up/swing + incline walk or rower", "~45-50 min", "Day5_Metabolic"),
        ("Sat", "Rest / walk", "Light steps if possible", "Easy", "-"),
        ("Sun", "Rest", "Full recovery", "-", "-"),
    ]
    for c, h in enumerate(headers, 1):
        ws.cell(row=3, column=c, value=h)
    style_header_row(ws, 3, 5)
    for i, row in enumerate(schedule):
        for c, val in enumerate(row, 1):
            cell = ws.cell(row=4 + i, column=c, value=val)
            cell.border = THIN
            cell.alignment = WRAP
            cell.fill = DAY_FILL if "Day" in str(row[0]) and row[0] != "Mon (Day 1)" or "Day" in row[0] else (YELLOW if "Rest" in row[1] else GREEN)
            if "Rest" in row[1]:
                cell.fill = YELLOW
            elif "Day" in row[0]:
                cell.fill = GREEN
            else:
                cell.fill = ALT_ROW
        ws.row_dimensions[4 + i].height = 36

    ws["A12"] = "Shift days to match your sea schedule - keep order: Day1 -> Day2 -> rest -> Day4 -> Day5, with >=1 rest day between hard blocks when possible."
    ws["A12"].alignment = WRAP
    ws.merge_cells("A12:E12")
    ws.row_dimensions[12].height = 40

    # Exercise data: (name, sets_reps, rest, equipment, cues, youtube_url)
    day1 = [
        ("Smith squat (or goblet DB)", "3 x 8-10", "90s", "Smith / DBs", "Feet slightly forward of bar; controlled depth; knees track toes", "https://www.youtube.com/watch?v=DUWK_gKcRCc"),
        ("Romanian deadlift (bar or DB)", "3 x 8-10", "90s", "Barbell / DBs", "Soft knees, hips back, bar close to legs, neutral spine", "https://www.youtube.com/watch?v=_oyxCn2iSjU"),
        ("Lying / seated leg curl", "3 x 10-12", "60s", "Leg curl machine", "Squeeze hamstrings at top; no hip lift", "https://www.youtube.com/watch?v=ELOCsoDSmrg"),
        ("Incline DB or Smith press", "3 x 8-10", "90s", "Bench + DBs / Smith", "Bench ~30-45 deg; lower with control to upper chest", "https://www.youtube.com/watch?v=8iPEnn-ltC8"),
        ("DB or cable lateral raise", "2 x 12-15", "45s", "DBs / cable", "Slight elbow bend; raise to just below shoulder height", "https://www.youtube.com/watch?v=3VcKaXpzqRo"),
        ("Cable tricep pushdown (rope)", "2 x 12-15", "45s", "Cable + rope", "Elbows pinned; spread rope at bottom", "https://www.youtube.com/watch?v=2-LAMcpzODU"),
        ("Plank", "3 x 30-45s", "45s", "Mat", "Ribs down, glutes on, body straight", "https://www.youtube.com/watch?v=A3mGZrXBAuU"),
    ]

    day2 = [
        ("Pull-up (or jump/band assist / cable pulldown)", "3 x 6-10", "90s", "Pull-up bar / cable", "Full hang -> pull chest to bar; control down", "https://www.youtube.com/watch?v=eGo4IYlbE5g"),
        ("One-arm DB row (or cable row)", "3 x 8-10 / side", "75s", "DB / cable", "Elbow to hip; squeeze shoulder blade", "https://www.youtube.com/watch?v=roCP6wCXPqo"),
        ("Face pulls (cable rope)", "3 x 12-15", "45s", "Cable + rope", "High to face; hands beat elbows; external rotation", "https://www.youtube.com/watch?v=eIq5CB9JfKE"),
        ("Leg extension", "3 x 10-12", "60s", "Leg extension", "Full extension without slamming; optional if legs sore", "https://www.youtube.com/watch?v=YyvSfVjQeL0"),
        ("EZ-bar or DB curl", "2 x 10-12", "45s", "EZ bar / DBs", "Elbows still; no swinging", "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"),
        ("Dead bug", "3 x 8-10 / side", "45s", "Mat", "Low back glued to floor; slow opposite arm/leg", "https://www.youtube.com/watch?v=4XLEnwUr1d8"),
        ("Rower intervals", "12-15 min (40s hard / 80s easy)", "-", "Rower", "Legs -> hips -> arms; reverse on recovery", "https://www.youtube.com/watch?v=4zWu1yuJ0_g"),
    ]

    day4 = [
        ("Goblet squat or Smith squat", "3 x 10", "75s", "DB / Smith", "Slightly lighter than Day 1; tall chest", "https://www.youtube.com/watch?v=MeIiIdhvXT4"),
        ("Flat DB press (or push-ups)", "3 x 8-12", "75s", "Bench + DBs", "Wrists stacked; soft lockout", "https://www.youtube.com/watch?v=VmB1G1K7v94"),
        ("Barbell or DB Romanian deadlift", "3 x 10", "75s", "Barbell / DBs", "Same hinge cues as Day 1", "https://www.youtube.com/watch?v=_oyxCn2iSjU"),
        ("Seated or standing cable row", "3 x 10", "60s", "Cable", "Pull to lower chest/ribs; squeeze mid-back", "https://www.youtube.com/watch?v=GZbfZ033f74"),
        ("Reverse lunges (DB)", "2 x 10 / leg", "60s", "DBs", "Step back, front knee tracks toes", "https://www.youtube.com/watch?v=sjlsISvHyZs"),
        ("Cable woodchop", "2 x 10 / side", "45s", "Cable", "Rotate through hips/core, not just arms", "https://www.youtube.com/watch?v=pAplQXk3dkU"),
        ("Farmer carry (or static hold)", "3 x 30-40 m or 40-60s", "60s", "Heavy DBs", "Tall posture, crushed grip, short steps", "https://www.youtube.com/watch?v=8OtwXwrJizk"),
    ]

    day5 = [
        ("DB shoulder press", "3 x 10-12", "45-60s", "DBs", "Circuit style - shorter rest; no excessive lean", "https://www.youtube.com/watch?v=qEwKCR5JCog"),
        ("Cable or DB row", "3 x 10-12", "45-60s", "Cable / DBs", "Keep chest up; squeeze shoulder blades", "https://www.youtube.com/watch?v=GZbfZ033f74"),
        ("Push-ups (or incline push-ups)", "3 x 8-15 quality", "45-60s", "Floor / bench", "Body straight; full range", "https://www.youtube.com/watch?v=IODxDxX7oi4"),
        ("Kettlebell or DB swing / hip hinge", "3 x 12-15", "45-60s", "KB / DB", "Hips snap, not arm raise; hinge pattern", "https://www.youtube.com/watch?v=YSxHifyI6s8"),
        ("Cable face pull", "2 x 15", "45s", "Cable + rope", "Posture finisher - same cues as Day 2", "https://www.youtube.com/watch?v=eIq5CB9JfKE"),
        ("Hanging knee raise (or lying leg raise)", "3 x 10-12", "45s", "Pull-up bar / mat", "Control swing; curl pelvis slightly", "https://www.youtube.com/watch?v=RD_A-Z15ER4"),
        ("Cardio finisher (pick one)", "Incline walk 30-35 min OR rower 20 min OR bike 25-30 min", "-", "Treadmill / rower / bike", "Brisk but sustainable pace", "https://www.youtube.com/watch?v=meR1rZfIg40"),
    ]

    headers_ex = ["#", "Exercise", "Sets x Reps", "Rest", "Equipment", "Form cues", "Weight Used", "Reps Done", "Form video"]

    def make_day_sheet(name, title, warmup, exercises, notes):
        ws = wb.create_sheet(name)
        set_widths(ws, [4, 42, 28, 10, 18, 42, 14, 12, 18])
        ws["A1"] = title
        ws["A1"].font = TITLE_FONT
        ws.merge_cells("A1:I1")
        ws["A2"] = warmup
        ws["A2"].font = Font(name="Calibri", italic=True, size=10)
        ws.merge_cells("A2:I2")

        for c, h in enumerate(headers_ex, 1):
            ws.cell(row=4, column=c, value=h)
        style_header_row(ws, 4, 9)

        for i, ex in enumerate(exercises):
            r = 5 + i
            fill = ALT_ROW if i % 2 else PatternFill("solid", fgColor="FFFFFF")
            vals = [i + 1, ex[0], ex[1], ex[2], ex[3], ex[4], "", ""]
            for c, v in enumerate(vals, 1):
                cell = ws.cell(row=r, column=c, value=v)
                cell.border = THIN
                cell.fill = fill
                cell.font = BOLD if c == 2 else NORMAL
                cell.alignment = WRAP if c in (2, 6) else CENTER
            add_link(ws.cell(row=r, column=9), ex[5])
            ws.cell(row=r, column=9).fill = fill
            ws.row_dimensions[r].height = 40

        note_row = 5 + len(exercises) + 1
        ws.cell(row=note_row, column=1, value="Notes").font = WHITE_FONT
        ws.cell(row=note_row, column=1).fill = SUBHEADER
        ws.merge_cells(start_row=note_row, start_column=1, end_row=note_row, end_column=9)
        ws.cell(row=note_row + 1, column=1, value=notes).alignment = WRAP
        ws.merge_cells(start_row=note_row + 1, start_column=1, end_row=note_row + 1, end_column=9)
        ws.row_dimensions[note_row + 1].height = 50

        # Session log block
        log_row = note_row + 3
        ws.cell(row=log_row, column=1, value="Session log (copy row down each week)").font = WHITE_FONT
        ws.cell(row=log_row, column=1).fill = HEADER
        ws.merge_cells(start_row=log_row, start_column=1, end_row=log_row, end_column=5)
        for c, h in enumerate(["Date", "Body weight (kg)", "How felt (1-10)", "Notes", "Next focus"], 1):
            cell = ws.cell(row=log_row + 1, column=c, value=h)
            cell.fill = SUBHEADER
            cell.font = WHITE_FONT
            cell.border = THIN
        for r in range(log_row + 2, log_row + 8):
            for c in range(1, 6):
                ws.cell(row=r, column=c).border = THIN
                ws.cell(row=r, column=c).fill = ORANGE if r == log_row + 2 else PatternFill("solid", fgColor="FFFFFF")

    make_day_sheet(
        "Day1_Lower_Push",
        "Day 1 - Lower + Push (~45-55 min)",
        "Warm-up: 5 min bike or treadmill + 1 light set of squat and press.",
        day1,
        "Priority day for legs and pushing strength. Progressive overload on squat, RDL, and incline press first. Fill Weight Used / Reps Done after each exercise.",
    )
    make_day_sheet(
        "Day2_Pull_Core_Row",
        "Day 2 - Pull + Core + Rower (~50 min)",
        "Warm-up: 5 min easy rower + band/arm circles if available + 1 light row set.",
        day2,
        "Face pulls = posture medicine for rounded shoulders. Rower intervals last: 40s hard / 80s easy x 8-10 rounds. Legs drive first on the rower.",
    )
    make_day_sheet(
        "Day4_FullBody",
        "Day 4 - Full Body Strength (~50 min)",
        "Warm-up: 5 min bike + bodyweight squats x 10 + push-ups x 5-8.",
        day4,
        "Use slightly lighter loads than Day 1 on squat/RDL. Farmer carries build grip and core - great for fat-loss conditioning without joint stress.",
    )
    make_day_sheet(
        "Day5_Metabolic",
        "Day 5 - Upper Metabolic + Cardio (~45-50 min)",
        "Warm-up: 3-5 min easy cardio. Then circuit with 45-60s between exercises.",
        day5,
        "Keep moving. After the circuit, pick ONE cardio: incline treadmill walk 30-35 min (best default), rower 20 min steady, or bike 25-30 min.",
    )

    # ---------- Exercise Library ----------
    ws = wb.create_sheet("Exercise_Library")
    set_widths(ws, [36, 22, 55, 18])
    ws["A1"] = "Exercise library - all movements + YouTube form links"
    ws["A1"].font = TITLE_FONT
    ws.merge_cells("A1:D1")

    lib_headers = ["Exercise", "Primary gear", "Coaching cue", "Form video"]
    # Dedupe by exercise name keeping first URL
    seen = {}
    for block in (day1, day2, day4, day5):
        for ex in block:
            if ex[0] not in seen:
                seen[ex[0]] = (ex[3], ex[4], ex[5])
    # Add a few alternates
    extras = [
        ("Goblet squat (alt for Smith)", "Dumbbell", "Hold DB at chest; sit between heels", "https://www.youtube.com/watch?v=MeIiIdhvXT4"),
        ("Push-up", "Bodyweight", "Body line straight; chest to floor", "https://www.youtube.com/watch?v=IODxDxX7oi4"),
        ("Lying leg raise (alt for hanging raise)", "Mat", "Press low back down; lift legs controlled", "https://www.youtube.com/watch?v=JB2oyawG9KI"),
        ("Incline treadmill walk", "Treadmill", "Brisk incline walk - talk but slightly breathless", "https://www.youtube.com/watch?v=meR1rZfIg40"),
        ("Recumbent bike steady cardio", "Bike", "Easy-moderate pace on recovery days", "https://www.youtube.com/watch?v=ualUvWZ7bUE"),
    ]
    for ex in extras:
        if ex[0] not in seen:
            seen[ex[0]] = (ex[1], ex[2], ex[3])

    for c, h in enumerate(lib_headers, 1):
        ws.cell(row=3, column=c, value=h)
    style_header_row(ws, 3, 4)

    for i, (name, (gear, cue, url)) in enumerate(sorted(seen.items(), key=lambda x: x[0].lower())):
        r = 4 + i
        fill = ALT_ROW if i % 2 else PatternFill("solid", fgColor="FFFFFF")
        for c, v in enumerate([name, gear, cue], 1):
            cell = ws.cell(row=r, column=c, value=v)
            cell.border = THIN
            cell.fill = fill
            cell.alignment = WRAP
            cell.font = BOLD if c == 1 else NORMAL
        add_link(ws.cell(row=r, column=4), url)
        ws.cell(row=r, column=4).fill = fill
        ws.row_dimensions[r].height = 30

    # ---------- Progress Log ----------
    ws = wb.create_sheet("Progress_Log")
    set_widths(ws, [12, 14, 14, 14, 14, 40])
    ws["A1"] = "Weekly progress log (weigh same day/time each week)"
    ws["A1"].font = TITLE_FONT
    ws.merge_cells("A1:F1")
    ws["A2"] = "Start: 80 kg ? Goal: 72 kg | Also track waist at navel (cm)"
    ws["A2"].font = Font(name="Calibri", italic=True, size=10)

    prog_headers = ["Week #", "Date", "Weight (kg)", "Waist (cm)", "? vs start (kg)", "Notes (energy, sleep, food)"]
    for c, h in enumerate(prog_headers, 1):
        ws.cell(row=4, column=c, value=h)
    style_header_row(ws, 4, 6)

    # Pre-fill week 0
    ws["A5"] = 0
    ws["C5"] = 80
    ws["E5"] = 0
    for c in range(1, 7):
        ws.cell(row=5, column=c).border = THIN
        ws.cell(row=5, column=c).fill = GREEN
        ws.cell(row=5, column=c).alignment = CENTER
    ws["F5"] = "Baseline week - take waist measurement too"
    ws["F5"].alignment = WRAP

    for i in range(1, 17):
        r = 5 + i
        ws.cell(row=r, column=1, value=i).border = THIN
        ws.cell(row=r, column=1).alignment = CENTER
        for c in range(2, 7):
            cell = ws.cell(row=r, column=c, value="")
            cell.border = THIN
            cell.fill = ALT_ROW if i % 2 else PatternFill("solid", fgColor="FFFFFF")
        # Delta formula vs start weight in C5
        ws.cell(row=r, column=5, value=f'=IF(C{r}="","",C{r}-$C$5)')
        ws.cell(row=r, column=5).alignment = CENTER

    ws["A23"] = "Checkpoint (every 4 weeks)"
    ws["A23"].font = WHITE_FONT
    ws["A23"].fill = SUBHEADER
    ws.merge_cells("A23:F23")
    checks = [
        "Lost 1.5-2.5 kg in 4 weeks -> keep plan.",
        "Lost <1 kg -> tighten food ~150-200 kcal or add one incline walk.",
        "Waist down but scale slow ? recomposition; stay patient.",
        "Strength crashing -> eat more protein/carbs around workouts; don't cut harder.",
    ]
    for i, t in enumerate(checks):
        ws.cell(row=24 + i, column=1, value=t).alignment = WRAP
        ws.merge_cells(start_row=24 + i, start_column=1, end_row=24 + i, end_column=6)
        ws.row_dimensions[24 + i].height = 24

    # ---------- Nutrition ----------
    ws = wb.create_sheet("Nutrition")
    set_widths(ws, [28, 60])
    ws["A1"] = "Nutrition guide (needed for 80 ? 72 kg)"
    ws["A1"].font = TITLE_FONT
    ws.merge_cells("A1:B1")

    nutrition = [
        ("Daily calories (start)", "1,900-2,100 kcal - adjust after 2 weekly weigh-ins"),
        ("Protein", "130-150 g/day (chicken, fish, eggs, dairy, tofu, whey)"),
        ("Carbs", "Around training for energy (rice, pasta, potatoes, fruit, bread)"),
        ("Fats", "Moderate (oils, nuts, avocado, fatty fish) - don't go near-zero"),
        ("Easy ship cuts", "Drop sugary drinks, second helpings at dinner, late-night snacks"),
        ("Hydration", "Aim ~3+ liters water/day; more in heat/engine room work"),
        ("Meal idea template", "Protein + veg + carb each meal; protein snack post-workout"),
        ("Alcohol / juice", "Biggest silent calorie sources at sea - limit hard"),
        ("If hungry always", "Raise veggies & protein first before raising calories a lot"),
        ("If stalling 2 weeks", "Trim ~150-200 kcal OR add one 30-min incline walk"),
    ]
    ws["A3"] = "Topic"
    ws["B3"] = "Guideline"
    style_header_row(ws, 3, 2)
    for i, (a, b) in enumerate(nutrition):
        ws.cell(row=4 + i, column=1, value=a).font = BOLD
        ws.cell(row=4 + i, column=1).border = THIN
        ws.cell(row=4 + i, column=1).fill = GREEN
        ws.cell(row=4 + i, column=2, value=b).border = THIN
        ws.cell(row=4 + i, column=2).alignment = WRAP
        ws.row_dimensions[4 + i].height = 28

    ws["A15"] = "Disclaimer: General fitness guidance only - not medical advice. Stop if you feel sharp pain, dizziness, or chest pain and seek medical care."
    ws["A15"].font = Font(name="Calibri", size=9, italic=True, color="666666")
    ws.merge_cells("A15:B15")

    # Freeze panes on day sheets
    for name in ["Day1_Lower_Push", "Day2_Pull_Core_Row", "Day4_FullBody", "Day5_Metabolic", "Exercise_Library", "Progress_Log"]:
        wb[name].freeze_panes = "A5"

    wb.save(OUT)
    wb.save(ARTIFACT)
    print(f"Wrote {OUT}")
    print(f"Wrote {ARTIFACT}")


if __name__ == "__main__":
    build()
