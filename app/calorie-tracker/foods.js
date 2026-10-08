/** Common ship-mess + everyday foods. Values per typical serving. */
window.FOOD_DB = [
  // Ship mess staples
  { id: "mess-chicken-rice", name: "Mess: chicken + rice", kcal: 520, protein: 38, carbs: 55, fat: 14, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-fish-rice", name: "Mess: fish + rice", kcal: 480, protein: 36, carbs: 52, fat: 12, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-pork-rice", name: "Mess: pork + rice", kcal: 610, protein: 32, carbs: 55, fat: 26, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-beef-stew", name: "Mess: beef stew + rice", kcal: 580, protein: 34, carbs: 50, fat: 22, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-adobo", name: "Mess: chicken adobo + rice", kcal: 560, protein: 35, carbs: 48, fat: 20, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-curry", name: "Mess: curry + rice", kcal: 540, protein: 28, carbs: 58, fat: 18, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-noodles", name: "Mess: fried noodles", kcal: 490, protein: 18, carbs: 62, fat: 18, tags: ["ship", "lunch", "dinner"] },
  { id: "mess-soup-bread", name: "Mess: soup + bread", kcal: 320, protein: 14, carbs: 42, fat: 10, tags: ["ship", "lunch"] },
  { id: "mess-eggs-rice", name: "Mess: eggs + rice", kcal: 450, protein: 22, carbs: 48, fat: 16, tags: ["ship", "breakfast"] },
  { id: "mess-breakfast", name: "Mess: breakfast plate", kcal: 550, protein: 24, carbs: 55, fat: 24, tags: ["ship", "breakfast"] },
  { id: "mess-salad", name: "Mess: salad side", kcal: 80, protein: 3, carbs: 8, fat: 4, tags: ["ship"] },
  { id: "mess-veg", name: "Mess: vegetable side", kcal: 60, protein: 2, carbs: 10, fat: 2, tags: ["ship"] },
  { id: "white-rice-1c", name: "White rice (1 cup cooked)", kcal: 205, protein: 4, carbs: 45, fat: 0, tags: ["ship", "staple"] },
  { id: "brown-rice-1c", name: "Brown rice (1 cup cooked)", kcal: 215, protein: 5, carbs: 45, fat: 2, tags: ["staple"] },

  // Proteins
  { id: "chicken-breast-150", name: "Chicken breast (150g)", kcal: 248, protein: 46, carbs: 0, fat: 5, tags: ["protein"] },
  { id: "chicken-thigh-150", name: "Chicken thigh (150g)", kcal: 270, protein: 38, carbs: 0, fat: 12, tags: ["protein"] },
  { id: "fish-fillet-150", name: "Fish fillet (150g)", kcal: 180, protein: 36, carbs: 0, fat: 4, tags: ["protein"] },
  { id: "tuna-can", name: "Tuna canned in water (1 can)", kcal: 120, protein: 28, carbs: 0, fat: 1, tags: ["protein", "snack"] },
  { id: "eggs-2", name: "Eggs (2 large)", kcal: 140, protein: 12, carbs: 1, fat: 10, tags: ["breakfast", "protein"] },
  { id: "egg-1", name: "Egg (1 large)", kcal: 70, protein: 6, carbs: 0.5, fat: 5, tags: ["breakfast", "protein"] },
  { id: "pork-chop-150", name: "Pork chop (150g)", kcal: 320, protein: 36, carbs: 0, fat: 18, tags: ["protein"] },
  { id: "beef-150", name: "Lean beef (150g)", kcal: 280, protein: 40, carbs: 0, fat: 12, tags: ["protein"] },
  { id: "shrimp-150", name: "Shrimp (150g)", kcal: 150, protein: 30, carbs: 1, fat: 2, tags: ["protein"] },
  { id: "tofu-150", name: "Tofu firm (150g)", kcal: 120, protein: 14, carbs: 3, fat: 7, tags: ["protein"] },
  { id: "whey-scoop", name: "Whey protein (1 scoop)", kcal: 120, protein: 24, carbs: 3, fat: 1, tags: ["protein", "snack"] },

  // Dairy / breakfast
  { id: "milk-250", name: "Milk (250ml)", kcal: 150, protein: 8, carbs: 12, fat: 8, tags: ["breakfast"] },
  { id: "yogurt-plain", name: "Greek yogurt plain (170g)", kcal: 100, protein: 17, carbs: 6, fat: 0.5, tags: ["breakfast", "snack"] },
  { id: "cheese-slice", name: "Cheese slice", kcal: 70, protein: 5, carbs: 1, fat: 5, tags: ["snack"] },
  { id: "oatmeal-1c", name: "Oatmeal cooked (1 cup)", kcal: 160, protein: 6, carbs: 28, fat: 3, tags: ["breakfast"] },
  { id: "bread-2", name: "Bread (2 slices)", kcal: 160, protein: 6, carbs: 30, fat: 2, tags: ["breakfast"] },
  { id: "toast-butter", name: "Toast with butter (2)", kcal: 220, protein: 6, carbs: 28, fat: 10, tags: ["breakfast"] },
  { id: "banana", name: "Banana (1 medium)", kcal: 105, protein: 1, carbs: 27, fat: 0, tags: ["snack", "fruit"] },
  { id: "apple", name: "Apple (1 medium)", kcal: 95, protein: 0.5, carbs: 25, fat: 0, tags: ["snack", "fruit"] },
  { id: "orange", name: "Orange (1 medium)", kcal: 65, protein: 1, carbs: 15, fat: 0, tags: ["snack", "fruit"] },

  // Snacks / drinks (watch these at sea)
  { id: "coffee-black", name: "Coffee black", kcal: 5, protein: 0, carbs: 0, fat: 0, tags: ["drink"] },
  { id: "coffee-milk-sugar", name: "Coffee with milk + sugar", kcal: 60, protein: 1, carbs: 10, fat: 1.5, tags: ["drink"] },
  { id: "soft-drink-can", name: "Soft drink (1 can)", kcal: 140, protein: 0, carbs: 39, fat: 0, tags: ["drink"] },
  { id: "juice-250", name: "Fruit juice (250ml)", kcal: 110, protein: 1, carbs: 26, fat: 0, tags: ["drink"] },
  { id: "beer-1", name: "Beer (1 bottle)", kcal: 150, protein: 1, carbs: 13, fat: 0, tags: ["drink"] },
  { id: "chips-small", name: "Chips / crisps (small pack)", kcal: 230, protein: 3, carbs: 22, fat: 15, tags: ["snack"] },
  { id: "biscuit-4", name: "Biscuits (4 pcs)", kcal: 180, protein: 3, carbs: 26, fat: 8, tags: ["snack"] },
  { id: "peanuts-30", name: "Peanuts (30g)", kcal: 170, protein: 7, carbs: 5, fat: 14, tags: ["snack"] },
  { id: "protein-bar", name: "Protein bar", kcal: 200, protein: 20, carbs: 22, fat: 6, tags: ["snack"] },

  // Fats / extras
  { id: "oil-tbsp", name: "Cooking oil (1 tbsp)", kcal: 120, protein: 0, carbs: 0, fat: 14, tags: ["extra"] },
  { id: "mayo-tbsp", name: "Mayonnaise (1 tbsp)", kcal: 90, protein: 0, carbs: 0, fat: 10, tags: ["extra"] },
  { id: "gravy-ladle", name: "Gravy (1 ladle)", kcal: 60, protein: 1, carbs: 4, fat: 4, tags: ["extra", "ship"] },
];
