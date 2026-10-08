window.WORKOUT_PLAN = {
  "profile": {
    "startKg": 80,
    "goalKg": 72,
    "height": "5'7\"",
    "age": 36,
    "kcal": "1900-2100",
    "protein": "130-150g",
    "daysPerWeek": 4
  },
  "schedule": [
    {
      "day": "Mon (Day 1)",
      "session": "Lower + Push",
      "focus": "Squat, RDL, leg curl, incline press, laterals, triceps, plank",
      "duration": "~45-55 min",
      "workoutId": "day1"
    },
    {
      "day": "Tue (Day 2)",
      "session": "Pull + Core + Rower",
      "focus": "Pull-ups/rows, face pulls, curls, dead bug, rower intervals",
      "duration": "~50 min",
      "workoutId": "day2"
    },
    {
      "day": "Wed",
      "session": "Rest / easy",
      "focus": "Optional easy walk or bike 20-30 min",
      "duration": "Optional",
      "workoutId": null
    },
    {
      "day": "Thu (Day 4)",
      "session": "Full Body Strength",
      "focus": "Squat, press, RDL, row, lunges, woodchop, farmer carry",
      "duration": "~50 min",
      "workoutId": "day4"
    },
    {
      "day": "Fri (Day 5)",
      "session": "Upper Metabolic + Cardio",
      "focus": "Circuit press/row/push-up/swing + incline walk or rower",
      "duration": "~45-50 min",
      "workoutId": "day5"
    },
    {
      "day": "Sat",
      "session": "Rest / walk",
      "focus": "Light steps if possible",
      "duration": "Easy",
      "workoutId": null
    },
    {
      "day": "Sun",
      "session": "Rest",
      "focus": "Full recovery",
      "duration": "-",
      "workoutId": null
    }
  ],
  "workouts": [
    {
      "id": "day1",
      "sheet": "Day1_Lower_Push",
      "title": "Day 1 - Lower + Push (~45-55 min)",
      "short": "Day 1",
      "focus": "Lower + Push",
      "weekday": "Mon",
      "duration": "~45-55 min",
      "warmup": "Warm-up: 5 min bike or treadmill + 1 light set of squat and press.",
      "notes": "Priority day for legs and pushing strength. Progressive overload on squat, RDL, and incline press first. Fill Weight Used / Reps Done after each exercise.",
      "exercises": [
        {
          "id": "day1-ex1",
          "name": "Smith squat (or goblet DB)",
          "setsReps": "3 x 8-10",
          "rest": "90s",
          "equipment": "Smith / DBs",
          "cues": "Feet slightly forward of bar; controlled depth; knees track toes",
          "video": "https://www.youtube.com/watch?v=DUWK_gKcRCc"
        },
        {
          "id": "day1-ex2",
          "name": "Romanian deadlift (bar or DB)",
          "setsReps": "3 x 8-10",
          "rest": "90s",
          "equipment": "Barbell / DBs",
          "cues": "Soft knees, hips back, bar close to legs, neutral spine",
          "video": "https://www.youtube.com/watch?v=_oyxCn2iSjU"
        },
        {
          "id": "day1-ex3",
          "name": "Lying / seated leg curl",
          "setsReps": "3 x 10-12",
          "rest": "60s",
          "equipment": "Leg curl machine",
          "cues": "Squeeze hamstrings at top; no hip lift",
          "video": "https://www.youtube.com/watch?v=ELOCsoDSmrg"
        },
        {
          "id": "day1-ex4",
          "name": "Incline DB or Smith press",
          "setsReps": "3 x 8-10",
          "rest": "90s",
          "equipment": "Bench + DBs / Smith",
          "cues": "Bench ~30-45 deg; lower with control to upper chest",
          "video": "https://www.youtube.com/watch?v=8iPEnn-ltC8"
        },
        {
          "id": "day1-ex5",
          "name": "DB or cable lateral raise",
          "setsReps": "2 x 12-15",
          "rest": "45s",
          "equipment": "DBs / cable",
          "cues": "Slight elbow bend; raise to just below shoulder height",
          "video": "https://www.youtube.com/watch?v=3VcKaXpzqRo"
        },
        {
          "id": "day1-ex6",
          "name": "Cable tricep pushdown (rope)",
          "setsReps": "2 x 12-15",
          "rest": "45s",
          "equipment": "Cable + rope",
          "cues": "Elbows pinned; spread rope at bottom",
          "video": "https://www.youtube.com/watch?v=2-LAMcpzODU"
        },
        {
          "id": "day1-ex7",
          "name": "Plank",
          "setsReps": "3 x 30-45s",
          "rest": "45s",
          "equipment": "Mat",
          "cues": "Ribs down, glutes on, body straight",
          "video": "https://www.youtube.com/watch?v=A3mGZrXBAuU"
        }
      ]
    },
    {
      "id": "day2",
      "sheet": "Day2_Pull_Core_Row",
      "title": "Day 2 - Pull + Core + Rower (~50 min)",
      "short": "Day 2",
      "focus": "Pull + Core + Rower",
      "weekday": "Tue",
      "duration": "~50 min",
      "warmup": "Warm-up: 5 min easy rower + band/arm circles if available + 1 light row set.",
      "notes": "Face pulls = posture medicine for rounded shoulders. Rower intervals last: 40s hard / 80s easy x 8-10 rounds. Legs drive first on the rower.",
      "exercises": [
        {
          "id": "day2-ex1",
          "name": "Pull-up (or jump/band assist / cable pulldown)",
          "setsReps": "3 x 6-10",
          "rest": "90s",
          "equipment": "Pull-up bar / cable",
          "cues": "Full hang -> pull chest to bar; control down",
          "video": "https://www.youtube.com/watch?v=eGo4IYlbE5g"
        },
        {
          "id": "day2-ex2",
          "name": "One-arm DB row (or cable row)",
          "setsReps": "3 x 8-10 / side",
          "rest": "75s",
          "equipment": "DB / cable",
          "cues": "Elbow to hip; squeeze shoulder blade",
          "video": "https://www.youtube.com/watch?v=roCP6wCXPqo"
        },
        {
          "id": "day2-ex3",
          "name": "Face pulls (cable rope)",
          "setsReps": "3 x 12-15",
          "rest": "45s",
          "equipment": "Cable + rope",
          "cues": "High to face; hands beat elbows; external rotation",
          "video": "https://www.youtube.com/watch?v=eIq5CB9JfKE"
        },
        {
          "id": "day2-ex4",
          "name": "Leg extension",
          "setsReps": "3 x 10-12",
          "rest": "60s",
          "equipment": "Leg extension",
          "cues": "Full extension without slamming; optional if legs sore",
          "video": "https://www.youtube.com/watch?v=YyvSfVjQeL0"
        },
        {
          "id": "day2-ex5",
          "name": "EZ-bar or DB curl",
          "setsReps": "2 x 10-12",
          "rest": "45s",
          "equipment": "EZ bar / DBs",
          "cues": "Elbows still; no swinging",
          "video": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
        },
        {
          "id": "day2-ex6",
          "name": "Dead bug",
          "setsReps": "3 x 8-10 / side",
          "rest": "45s",
          "equipment": "Mat",
          "cues": "Low back glued to floor; slow opposite arm/leg",
          "video": "https://www.youtube.com/watch?v=4XLEnwUr1d8"
        },
        {
          "id": "day2-ex7",
          "name": "Rower intervals",
          "setsReps": "12-15 min (40s hard / 80s easy)",
          "rest": "-",
          "equipment": "Rower",
          "cues": "Legs -> hips -> arms; reverse on recovery",
          "video": "https://www.youtube.com/watch?v=4zWu1yuJ0_g"
        }
      ]
    },
    {
      "id": "day4",
      "sheet": "Day4_FullBody",
      "title": "Day 4 - Full Body Strength (~50 min)",
      "short": "Day 4",
      "focus": "Full Body Strength",
      "weekday": "Thu",
      "duration": "~50 min",
      "warmup": "Warm-up: 5 min bike + bodyweight squats x 10 + push-ups x 5-8.",
      "notes": "Use slightly lighter loads than Day 1 on squat/RDL. Farmer carries build grip and core - great for fat-loss conditioning without joint stress.",
      "exercises": [
        {
          "id": "day4-ex1",
          "name": "Goblet squat or Smith squat",
          "setsReps": "3 x 10",
          "rest": "75s",
          "equipment": "DB / Smith",
          "cues": "Slightly lighter than Day 1; tall chest",
          "video": "https://www.youtube.com/watch?v=MeIiIdhvXT4"
        },
        {
          "id": "day4-ex2",
          "name": "Flat DB press (or push-ups)",
          "setsReps": "3 x 8-12",
          "rest": "75s",
          "equipment": "Bench + DBs",
          "cues": "Wrists stacked; soft lockout",
          "video": "https://www.youtube.com/watch?v=VmB1G1K7v94"
        },
        {
          "id": "day4-ex3",
          "name": "Barbell or DB Romanian deadlift",
          "setsReps": "3 x 10",
          "rest": "75s",
          "equipment": "Barbell / DBs",
          "cues": "Same hinge cues as Day 1",
          "video": "https://www.youtube.com/watch?v=_oyxCn2iSjU"
        },
        {
          "id": "day4-ex4",
          "name": "Seated or standing cable row",
          "setsReps": "3 x 10",
          "rest": "60s",
          "equipment": "Cable",
          "cues": "Pull to lower chest/ribs; squeeze mid-back",
          "video": "https://www.youtube.com/watch?v=GZbfZ033f74"
        },
        {
          "id": "day4-ex5",
          "name": "Reverse lunges (DB)",
          "setsReps": "2 x 10 / leg",
          "rest": "60s",
          "equipment": "DBs",
          "cues": "Step back, front knee tracks toes",
          "video": "https://www.youtube.com/watch?v=sjlsISvHyZs"
        },
        {
          "id": "day4-ex6",
          "name": "Cable woodchop",
          "setsReps": "2 x 10 / side",
          "rest": "45s",
          "equipment": "Cable",
          "cues": "Rotate through hips/core, not just arms",
          "video": "https://www.youtube.com/watch?v=pAplQXk3dkU"
        },
        {
          "id": "day4-ex7",
          "name": "Farmer carry (or static hold)",
          "setsReps": "3 x 30-40 m or 40-60s",
          "rest": "60s",
          "equipment": "Heavy DBs",
          "cues": "Tall posture, crushed grip, short steps",
          "video": "https://www.youtube.com/watch?v=8OtwXwrJizk"
        }
      ]
    },
    {
      "id": "day5",
      "sheet": "Day5_Metabolic",
      "title": "Day 5 - Upper Metabolic + Cardio (~45-50 min)",
      "short": "Day 5",
      "focus": "Upper Metabolic + Cardio",
      "weekday": "Fri",
      "duration": "~45-50 min",
      "warmup": "Warm-up: 3-5 min easy cardio. Then circuit with 45-60s between exercises.",
      "notes": "Keep moving. After the circuit, pick ONE cardio: incline treadmill walk 30-35 min (best default), rower 20 min steady, or bike 25-30 min.",
      "exercises": [
        {
          "id": "day5-ex1",
          "name": "DB shoulder press",
          "setsReps": "3 x 10-12",
          "rest": "45-60s",
          "equipment": "DBs",
          "cues": "Circuit style - shorter rest; no excessive lean",
          "video": "https://www.youtube.com/watch?v=qEwKCR5JCog"
        },
        {
          "id": "day5-ex2",
          "name": "Cable or DB row",
          "setsReps": "3 x 10-12",
          "rest": "45-60s",
          "equipment": "Cable / DBs",
          "cues": "Keep chest up; squeeze shoulder blades",
          "video": "https://www.youtube.com/watch?v=GZbfZ033f74"
        },
        {
          "id": "day5-ex3",
          "name": "Push-ups (or incline push-ups)",
          "setsReps": "3 x 8-15 quality",
          "rest": "45-60s",
          "equipment": "Floor / bench",
          "cues": "Body straight; full range",
          "video": "https://www.youtube.com/watch?v=IODxDxX7oi4"
        },
        {
          "id": "day5-ex4",
          "name": "Kettlebell or DB swing / hip hinge",
          "setsReps": "3 x 12-15",
          "rest": "45-60s",
          "equipment": "KB / DB",
          "cues": "Hips snap, not arm raise; hinge pattern",
          "video": "https://www.youtube.com/watch?v=YSxHifyI6s8"
        },
        {
          "id": "day5-ex5",
          "name": "Cable face pull",
          "setsReps": "2 x 15",
          "rest": "45s",
          "equipment": "Cable + rope",
          "cues": "Posture finisher - same cues as Day 2",
          "video": "https://www.youtube.com/watch?v=eIq5CB9JfKE"
        },
        {
          "id": "day5-ex6",
          "name": "Hanging knee raise (or lying leg raise)",
          "setsReps": "3 x 10-12",
          "rest": "45s",
          "equipment": "Pull-up bar / mat",
          "cues": "Control swing; curl pelvis slightly",
          "video": "https://www.youtube.com/watch?v=RD_A-Z15ER4"
        },
        {
          "id": "day5-ex7",
          "name": "Cardio finisher (pick one)",
          "setsReps": "Incline walk 30-35 min OR rower 20 min OR bike 25-30 min",
          "rest": "-",
          "equipment": "Treadmill / rower / bike",
          "cues": "Brisk but sustainable pace",
          "video": "https://www.youtube.com/watch?v=meR1rZfIg40"
        }
      ]
    }
  ],
  "nutrition": [
    {
      "topic": "Daily calories (start)",
      "guide": "1,900-2,100 kcal - adjust after 2 weekly weigh-ins"
    },
    {
      "topic": "Protein",
      "guide": "130-150 g/day (chicken, fish, eggs, dairy, tofu, whey)"
    },
    {
      "topic": "Carbs",
      "guide": "Around training for energy (rice, pasta, potatoes, fruit, bread)"
    },
    {
      "topic": "Fats",
      "guide": "Moderate (oils, nuts, avocado, fatty fish) - don't go near-zero"
    },
    {
      "topic": "Easy ship cuts",
      "guide": "Drop sugary drinks, second helpings at dinner, late-night snacks"
    },
    {
      "topic": "Hydration",
      "guide": "Aim ~3+ liters water/day; more in heat/engine room work"
    },
    {
      "topic": "Meal idea template",
      "guide": "Protein + veg + carb each meal; protein snack post-workout"
    },
    {
      "topic": "Alcohol / juice",
      "guide": "Biggest silent calorie sources at sea - limit hard"
    },
    {
      "topic": "If hungry always",
      "guide": "Raise veggies & protein first before raising calories a lot"
    },
    {
      "topic": "If stalling 2 weeks",
      "guide": "Trim ~150-200 kcal OR add one 30-min incline walk"
    }
  ],
  "exerciseLibrary": [
    {
      "name": "Barbell or DB Romanian deadlift",
      "gear": "Barbell / DBs",
      "cue": "Same hinge cues as Day 1",
      "video": "https://www.youtube.com/watch?v=_oyxCn2iSjU"
    },
    {
      "name": "Cable face pull",
      "gear": "Cable + rope",
      "cue": "Posture finisher - same cues as Day 2",
      "video": "https://www.youtube.com/watch?v=eIq5CB9JfKE"
    },
    {
      "name": "Cable or DB row",
      "gear": "Cable / DBs",
      "cue": "Keep chest up; squeeze shoulder blades",
      "video": "https://www.youtube.com/watch?v=GZbfZ033f74"
    },
    {
      "name": "Cable tricep pushdown (rope)",
      "gear": "Cable + rope",
      "cue": "Elbows pinned; spread rope at bottom",
      "video": "https://www.youtube.com/watch?v=2-LAMcpzODU"
    },
    {
      "name": "Cable woodchop",
      "gear": "Cable",
      "cue": "Rotate through hips/core, not just arms",
      "video": "https://www.youtube.com/watch?v=pAplQXk3dkU"
    },
    {
      "name": "Cardio finisher (pick one)",
      "gear": "Treadmill / rower / bike",
      "cue": "Brisk but sustainable pace",
      "video": "https://www.youtube.com/watch?v=meR1rZfIg40"
    },
    {
      "name": "DB or cable lateral raise",
      "gear": "DBs / cable",
      "cue": "Slight elbow bend; raise to just below shoulder height",
      "video": "https://www.youtube.com/watch?v=3VcKaXpzqRo"
    },
    {
      "name": "DB shoulder press",
      "gear": "DBs",
      "cue": "Circuit style - shorter rest; no excessive lean",
      "video": "https://www.youtube.com/watch?v=qEwKCR5JCog"
    },
    {
      "name": "Dead bug",
      "gear": "Mat",
      "cue": "Low back glued to floor; slow opposite arm/leg",
      "video": "https://www.youtube.com/watch?v=4XLEnwUr1d8"
    },
    {
      "name": "EZ-bar or DB curl",
      "gear": "EZ bar / DBs",
      "cue": "Elbows still; no swinging",
      "video": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
    },
    {
      "name": "Face pulls (cable rope)",
      "gear": "Cable + rope",
      "cue": "High to face; hands beat elbows; external rotation",
      "video": "https://www.youtube.com/watch?v=eIq5CB9JfKE"
    },
    {
      "name": "Farmer carry (or static hold)",
      "gear": "Heavy DBs",
      "cue": "Tall posture, crushed grip, short steps",
      "video": "https://www.youtube.com/watch?v=8OtwXwrJizk"
    },
    {
      "name": "Flat DB press (or push-ups)",
      "gear": "Bench + DBs",
      "cue": "Wrists stacked; soft lockout",
      "video": "https://www.youtube.com/watch?v=VmB1G1K7v94"
    },
    {
      "name": "Goblet squat (alt for Smith)",
      "gear": "Dumbbell",
      "cue": "Hold DB at chest; sit between heels",
      "video": "https://www.youtube.com/watch?v=MeIiIdhvXT4"
    },
    {
      "name": "Goblet squat or Smith squat",
      "gear": "DB / Smith",
      "cue": "Slightly lighter than Day 1; tall chest",
      "video": "https://www.youtube.com/watch?v=MeIiIdhvXT4"
    },
    {
      "name": "Hanging knee raise (or lying leg raise)",
      "gear": "Pull-up bar / mat",
      "cue": "Control swing; curl pelvis slightly",
      "video": "https://www.youtube.com/watch?v=RD_A-Z15ER4"
    },
    {
      "name": "Incline DB or Smith press",
      "gear": "Bench + DBs / Smith",
      "cue": "Bench ~30-45 deg; lower with control to upper chest",
      "video": "https://www.youtube.com/watch?v=8iPEnn-ltC8"
    },
    {
      "name": "Incline treadmill walk",
      "gear": "Treadmill",
      "cue": "Brisk incline walk - talk but slightly breathless",
      "video": "https://www.youtube.com/watch?v=meR1rZfIg40"
    },
    {
      "name": "Kettlebell or DB swing / hip hinge",
      "gear": "KB / DB",
      "cue": "Hips snap, not arm raise; hinge pattern",
      "video": "https://www.youtube.com/watch?v=YSxHifyI6s8"
    },
    {
      "name": "Leg extension",
      "gear": "Leg extension",
      "cue": "Full extension without slamming; optional if legs sore",
      "video": "https://www.youtube.com/watch?v=YyvSfVjQeL0"
    },
    {
      "name": "Lying / seated leg curl",
      "gear": "Leg curl machine",
      "cue": "Squeeze hamstrings at top; no hip lift",
      "video": "https://www.youtube.com/watch?v=ELOCsoDSmrg"
    },
    {
      "name": "Lying leg raise (alt for hanging raise)",
      "gear": "Mat",
      "cue": "Press low back down; lift legs controlled",
      "video": "https://www.youtube.com/watch?v=JB2oyawG9KI"
    },
    {
      "name": "One-arm DB row (or cable row)",
      "gear": "DB / cable",
      "cue": "Elbow to hip; squeeze shoulder blade",
      "video": "https://www.youtube.com/watch?v=roCP6wCXPqo"
    },
    {
      "name": "Plank",
      "gear": "Mat",
      "cue": "Ribs down, glutes on, body straight",
      "video": "https://www.youtube.com/watch?v=A3mGZrXBAuU"
    },
    {
      "name": "Pull-up (or jump/band assist / cable pulldown)",
      "gear": "Pull-up bar / cable",
      "cue": "Full hang -> pull chest to bar; control down",
      "video": "https://www.youtube.com/watch?v=eGo4IYlbE5g"
    },
    {
      "name": "Push-up",
      "gear": "Bodyweight",
      "cue": "Body line straight; chest to floor",
      "video": "https://www.youtube.com/watch?v=IODxDxX7oi4"
    },
    {
      "name": "Push-ups (or incline push-ups)",
      "gear": "Floor / bench",
      "cue": "Body straight; full range",
      "video": "https://www.youtube.com/watch?v=IODxDxX7oi4"
    },
    {
      "name": "Recumbent bike steady cardio",
      "gear": "Bike",
      "cue": "Easy-moderate pace on recovery days",
      "video": "https://www.youtube.com/watch?v=ualUvWZ7bUE"
    },
    {
      "name": "Reverse lunges (DB)",
      "gear": "DBs",
      "cue": "Step back, front knee tracks toes",
      "video": "https://www.youtube.com/watch?v=sjlsISvHyZs"
    },
    {
      "name": "Romanian deadlift (bar or DB)",
      "gear": "Barbell / DBs",
      "cue": "Soft knees, hips back, bar close to legs, neutral spine",
      "video": "https://www.youtube.com/watch?v=_oyxCn2iSjU"
    },
    {
      "name": "Rower intervals",
      "gear": "Rower",
      "cue": "Legs -> hips -> arms; reverse on recovery",
      "video": "https://www.youtube.com/watch?v=4zWu1yuJ0_g"
    },
    {
      "name": "Seated or standing cable row",
      "gear": "Cable",
      "cue": "Pull to lower chest/ribs; squeeze mid-back",
      "video": "https://www.youtube.com/watch?v=GZbfZ033f74"
    },
    {
      "name": "Smith squat (or goblet DB)",
      "gear": "Smith / DBs",
      "cue": "Feet slightly forward of bar; controlled depth; knees track toes",
      "video": "https://www.youtube.com/watch?v=DUWK_gKcRCc"
    }
  ]
};
