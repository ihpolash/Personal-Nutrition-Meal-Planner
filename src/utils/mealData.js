const CATEGORIES = {
  'Greek yogurt': 'Dairy', 'granola': 'Pantry', 'mixed berries': 'Produce', 'honey': 'Pantry',
  'almonds': 'Pantry', 'eggs': 'Dairy', 'bell peppers': 'Produce', 'onion': 'Produce',
  'olive oil': 'Pantry', 'salt': 'Pantry', 'pepper': 'Pantry', 'rolled oats': 'Pantry',
  'milk': 'Dairy', 'chia seeds': 'Pantry', 'vanilla extract': 'Pantry', 'banana': 'Produce',
  'whole grain bread': 'Bakery', 'avocado': 'Produce', 'lemon': 'Produce', 'red pepper flakes': 'Pantry',
  'protein powder': 'Pantry', 'frozen berries': 'Produce', 'coconut flakes': 'Pantry', 'mixed seeds': 'Pantry',
  'spinach': 'Produce', 'tomato': 'Produce', 'tofu': 'Produce', 'turmeric': 'Pantry',
  'black salt': 'Pantry', 'black beans': 'Pantry', 'corn': 'Pantry', 'quinoa': 'Pantry',
  'salsa': 'Pantry', 'chicken breast': 'Meat', 'mixed greens': 'Produce', 'cherry tomatoes': 'Produce',
  'cucumber': 'Produce', 'vinegar': 'Pantry', 'herbs': 'Produce', 'chickpeas': 'Pantry',
  'cumin': 'Pantry', 'paprika': 'Pantry', 'tahini': 'Pantry', 'whole wheat wrap': 'Bakery',
  'hummus': 'Pantry', 'turkey slices': 'Meat', 'lettuce': 'Produce', 'lentils': 'Pantry',
  'garlic': 'Produce', 'carrots': 'Produce', 'vegetable broth': 'Pantry', 'salmon': 'Meat',
  'teriyaki sauce': 'Pantry', 'rice': 'Pantry', 'broccoli': 'Produce', 'mozzarella': 'Dairy',
  'fresh basil': 'Produce', 'ciabatta': 'Bakery', 'balsamic glaze': 'Pantry', 'snap peas': 'Produce',
  'soy sauce': 'Pantry', 'ginger': 'Produce', 'canned tuna': 'Pantry', 'celery': 'Produce',
  'chicken thighs': 'Meat', 'rosemary': 'Produce', 'baby potatoes': 'Produce', 'green beans': 'Produce',
  'lean ground beef': 'Meat', 'crushed tomatoes': 'Pantry', 'whole wheat spaghetti': 'Pantry',
  'asparagus': 'Produce', 'dill': 'Produce', 'curry paste': 'Pantry', 'coconut milk': 'Pantry',
  'mixed vegetables': 'Produce', 'basmati rice': 'Pantry', 'beef steak': 'Meat', 'sweet potato': 'Produce',
  'shrimp': 'Meat', 'rice noodles': 'Pantry', 'ground turkey': 'Meat', 'tomato sauce': 'Pantry',
  'zucchini': 'Produce', 'pesto sauce': 'Pantry', 'pine nuts': 'Pantry', 'apple': 'Produce',
  'almond butter': 'Pantry', 'peanut butter': 'Pantry', 'cottage cheese': 'Dairy', 'peach': 'Produce',
  'cinnamon': 'Pantry', 'edamame': 'Produce', 'sea salt': 'Pantry', 'walnuts': 'Pantry',
  'dried cranberries': 'Pantry', 'dark chocolate chips': 'Pantry', 'rice cakes': 'Pantry',
  'everything seasoning': 'Pantry',
};

export function getCategory(ingredient) {
  return CATEGORIES[ingredient] || 'Pantry';
}

const MEALS = {
  breakfast: [
    { name: 'Greek Yogurt Parfait', prepTime: '5 min', calories: 320, protein: 24, carbs: 40, fats: 8, instructions: ['Layer Greek yogurt with granola and mixed berries', 'Drizzle with honey', 'Top with chopped almonds'], ingredients: ['Greek yogurt', 'granola', 'mixed berries', 'honey', 'almonds'] },
    { name: 'Veggie Scramble', prepTime: '12 min', calories: 350, protein: 28, carbs: 12, fats: 22, instructions: ['Sauté diced bell peppers and onions in olive oil', 'Beat eggs and pour over veggies', 'Scramble until cooked, season with salt and pepper'], ingredients: ['eggs', 'bell peppers', 'onion', 'olive oil', 'salt', 'pepper'] },
    { name: 'Overnight Oats', prepTime: '5 min + overnight', calories: 380, protein: 20, carbs: 55, fats: 10, instructions: ['Mix oats with milk and chia seeds in a jar', 'Add vanilla extract and a pinch of salt', 'Refrigerate overnight and top with banana slices'], ingredients: ['rolled oats', 'milk', 'chia seeds', 'vanilla extract', 'banana'] },
    { name: 'Avocado Toast + Eggs', prepTime: '10 min', calories: 410, protein: 22, carbs: 30, fats: 24, instructions: ['Toast whole grain bread', 'Mash avocado with lemon juice and spread on toast', 'Top with fried eggs and red pepper flakes'], ingredients: ['whole grain bread', 'avocado', 'lemon', 'eggs', 'red pepper flakes'] },
    { name: 'Protein Smoothie Bowl', prepTime: '8 min', calories: 360, protein: 30, carbs: 45, fats: 8, instructions: ['Blend protein powder with frozen berries and banana', 'Pour into bowl and add splash of milk for thickness', 'Top with coconut flakes and seeds'], ingredients: ['protein powder', 'frozen berries', 'banana', 'milk', 'coconut flakes', 'mixed seeds'] },
    { name: 'Veggie Omelette', prepTime: '10 min', calories: 300, protein: 26, carbs: 8, fats: 18, instructions: ['Whisk eggs with a splash of milk', 'Pour into heated non-stick pan', 'Add spinach and diced tomatoes, fold and cook'], ingredients: ['eggs', 'milk', 'spinach', 'tomato', 'salt', 'pepper'] },
    { name: 'Banana Pancakes', prepTime: '15 min', calories: 370, protein: 18, carbs: 52, fats: 10, instructions: ['Mash banana and mix with eggs and oats', 'Pour batter onto heated pan', 'Cook 2 min each side, serve with yogurt'], ingredients: ['banana', 'eggs', 'rolled oats', 'yogurt'] },
    { name: 'Tofu Breakfast Bowl', prepTime: '12 min', calories: 340, protein: 24, carbs: 28, fats: 16, instructions: ['Crumble tofu and sauté with turmeric and black salt', 'Add black beans and corn', 'Serve over quinoa with salsa'], ingredients: ['tofu', 'turmeric', 'black salt', 'black beans', 'corn', 'quinoa', 'salsa'] },
  ],
  lunch: [
    { name: 'Grilled Chicken Salad', prepTime: '15 min', calories: 420, protein: 38, carbs: 18, fats: 22, instructions: ['Grill chicken breast seasoned with herbs', 'Toss mixed greens with cherry tomatoes and cucumber', 'Slice chicken on top and add vinaigrette'], ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'olive oil', 'vinegar', 'herbs'] },
    { name: 'Quinoa Buddha Bowl', prepTime: '20 min', calories: 450, protein: 22, carbs: 55, fats: 16, instructions: ['Cook quinoa according to package directions', 'Roast chickpeas with cumin and paprika', 'Assemble bowl with quinoa, greens, avocado, and tahini'], ingredients: ['quinoa', 'chickpeas', 'cumin', 'paprika', 'mixed greens', 'avocado', 'tahini'] },
    { name: 'Turkey Wrap', prepTime: '8 min', calories: 390, protein: 32, carbs: 35, fats: 14, instructions: ['Spread hummus on whole wheat wrap', 'Layer turkey slices, lettuce, and tomato', 'Roll tightly and slice in half'], ingredients: ['whole wheat wrap', 'hummus', 'turkey slices', 'lettuce', 'tomato'] },
    { name: 'Lentil Soup', prepTime: '30 min', calories: 360, protein: 24, carbs: 48, fats: 8, instructions: ['Sauté onion, garlic, and carrots in olive oil', 'Add lentils, vegetable broth, and cumin', 'Simmer 25 min, season and serve'], ingredients: ['lentils', 'onion', 'garlic', 'carrots', 'vegetable broth', 'cumin', 'olive oil'] },
    { name: 'Salmon Teriyaki Bowl', prepTime: '20 min', calories: 480, protein: 36, carbs: 50, fats: 14, instructions: ['Marinate salmon in teriyaki sauce', 'Cook salmon in pan until flaky', 'Serve over rice with steamed broccoli'], ingredients: ['salmon', 'teriyaki sauce', 'rice', 'broccoli'] },
    { name: 'Caprese Panini', prepTime: '10 min', calories: 410, protein: 24, carbs: 38, fats: 20, instructions: ['Layer mozzarella, tomato, and basil on ciabatta', 'Drizzle with balsamic glaze', 'Press in panini grill until golden'], ingredients: ['mozzarella', 'tomato', 'fresh basil', 'ciabatta', 'balsamic glaze'] },
    { name: 'Stir-Fried Tofu & Veggies', prepTime: '15 min', calories: 370, protein: 22, carbs: 35, fats: 16, instructions: ['Press and cube tofu, pan-fry until golden', 'Stir-fry bell peppers, snap peas, and carrots', 'Add soy sauce and ginger, serve over rice'], ingredients: ['tofu', 'bell peppers', 'snap peas', 'carrots', 'soy sauce', 'ginger', 'rice'] },
    { name: 'Tuna Stuffed Avocado', prepTime: '10 min', calories: 380, protein: 30, carbs: 12, fats: 24, instructions: ['Mix canned tuna with Greek yogurt and diced celery', 'Halve avocado and remove pit', 'Fill avocado halves with tuna mixture'], ingredients: ['canned tuna', 'Greek yogurt', 'celery', 'avocado'] },
  ],
  dinner: [
    { name: 'Herb Baked Chicken', prepTime: '35 min', calories: 480, protein: 42, carbs: 30, fats: 20, instructions: ['Season chicken thighs with rosemary and garlic', 'Roast at 400°F for 30 min with baby potatoes', 'Serve with steamed green beans'], ingredients: ['chicken thighs', 'rosemary', 'garlic', 'baby potatoes', 'green beans', 'olive oil'] },
    { name: 'Spaghetti Bolognese', prepTime: '30 min', calories: 520, protein: 34, carbs: 58, fats: 16, instructions: ['Brown lean ground beef with onion and garlic', 'Add crushed tomatoes and simmer 20 min', 'Serve over whole wheat spaghetti'], ingredients: ['lean ground beef', 'onion', 'garlic', 'crushed tomatoes', 'whole wheat spaghetti', 'olive oil'] },
    { name: 'Sheet Pan Salmon', prepTime: '25 min', calories: 460, protein: 38, carbs: 32, fats: 22, instructions: ['Place salmon and asparagus on baking sheet', 'Drizzle with lemon and dill', 'Bake at 400°F for 18 min, serve with quinoa'], ingredients: ['salmon', 'asparagus', 'lemon', 'dill', 'quinoa', 'olive oil'] },
    { name: 'Veggie Curry', prepTime: '30 min', calories: 390, protein: 16, carbs: 48, fats: 16, instructions: ['Sauté onion, ginger, and curry paste', 'Add coconut milk and mixed vegetables', 'Simmer 20 min, serve with basmati rice'], ingredients: ['onion', 'ginger', 'curry paste', 'coconut milk', 'mixed vegetables', 'basmati rice'] },
    { name: 'Lean Steak & Sweet Potato', prepTime: '25 min', calories: 510, protein: 40, carbs: 45, fats: 18, instructions: ['Season steak with salt and pepper', 'Grill steak 4 min each side, bake sweet potato', 'Slice steak and serve with roasted asparagus'], ingredients: ['beef steak', 'sweet potato', 'asparagus', 'salt', 'pepper', 'olive oil'] },
    { name: 'Shrimp Stir-Fry', prepTime: '15 min', calories: 420, protein: 35, carbs: 40, fats: 14, instructions: ['Sauté shrimp with garlic and ginger', 'Add bell peppers and broccoli florets', 'Toss with soy sauce and serve over rice noodles'], ingredients: ['shrimp', 'garlic', 'ginger', 'bell peppers', 'broccoli', 'soy sauce', 'rice noodles'] },
    { name: 'Stuffed Bell Peppers', prepTime: '35 min', calories: 440, protein: 30, carbs: 38, fats: 18, instructions: ['Cut tops off bell peppers and remove seeds', 'Mix ground turkey with rice and tomato sauce', 'Stuff peppers and bake at 375°F for 30 min'], ingredients: ['bell peppers', 'ground turkey', 'rice', 'tomato sauce', 'onion', 'garlic'] },
    { name: 'Pesto Zucchini Noodles', prepTime: '15 min', calories: 360, protein: 20, carbs: 18, fats: 24, instructions: ['Spiralize zucchini into noodles', 'Sauté cherry tomatoes and garlic', 'Toss with pesto sauce and top with pine nuts'], ingredients: ['zucchini', 'cherry tomatoes', 'garlic', 'pesto sauce', 'pine nuts'] },
  ],
  snack: [
    { name: 'Apple & Almond Butter', prepTime: '2 min', calories: 200, protein: 7, carbs: 25, fats: 10, instructions: ['Slice apple into wedges', 'Measure 2 tbsp almond butter', 'Dip and enjoy'], ingredients: ['apple', 'almond butter'] },
    { name: 'Protein Balls', prepTime: '10 min', calories: 180, protein: 12, carbs: 18, fats: 8, instructions: ['Mix oats, protein powder, and peanut butter', 'Roll into small balls', 'Refrigerate 30 min before serving'], ingredients: ['rolled oats', 'protein powder', 'peanut butter', 'honey'] },
    { name: 'Hummus & Veggies', prepTime: '3 min', calories: 160, protein: 8, carbs: 18, fats: 8, instructions: ['Cut carrot and cucumber into sticks', 'Scoop hummus into bowl', 'Dip veggies and enjoy'], ingredients: ['hummus', 'carrots', 'cucumber'] },
    { name: 'Greek Yogurt & Berries', prepTime: '2 min', calories: 150, protein: 15, carbs: 16, fats: 3, instructions: ['Scoop Greek yogurt into bowl', 'Top with fresh berries', 'Enjoy as is'], ingredients: ['Greek yogurt', 'mixed berries'] },
    { name: 'Trail Mix', prepTime: '2 min', calories: 220, protein: 8, carbs: 22, fats: 14, instructions: ['Combine almonds, walnuts, and dried cranberries', 'Mix in dark chocolate chips', 'Portion into small bags'], ingredients: ['almonds', 'walnuts', 'dried cranberries', 'dark chocolate chips'] },
    { name: 'Rice Cakes with Avocado', prepTime: '3 min', calories: 170, protein: 4, carbs: 20, fats: 10, instructions: ['Spread mashed avocado on rice cakes', 'Sprinkle with everything seasoning', 'Serve immediately'], ingredients: ['rice cakes', 'avocado', 'everything seasoning'] },
    { name: 'Cottage Cheese Bowl', prepTime: '3 min', calories: 190, protein: 20, carbs: 12, fats: 6, instructions: ['Scoop cottage cheese into bowl', 'Add peach slices and a sprinkle of cinnamon', 'Mix gently and enjoy'], ingredients: ['cottage cheese', 'peach', 'cinnamon'] },
    { name: 'Edamame', prepTime: '5 min', calories: 180, protein: 16, carbs: 14, fats: 8, instructions: ['Steam frozen edamame according to package', 'Toss with sea salt', 'Serve warm'], ingredients: ['edamame', 'sea salt'] },
  ],
};

export function generateMealPlan(dietaryRestrictions = []) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const filtered = {};
  for (const type of mealTypes) {
    filtered[type] = MEALS[type].filter(meal => {
      if (dietaryRestrictions.length === 0) return true;
      if (dietaryRestrictions.includes('vegan')) {
        const nonVegan = ['eggs', 'chicken breast', 'salmon', 'turkey slices', 'chicken thighs', 'lean ground beef', 'beef steak', 'shrimp', 'ground turkey', 'canned tuna', 'mozzarella', 'Greek yogurt', 'milk', 'cottage cheese', 'honey', 'yogurt'];
        if (meal.ingredients.some(i => nonVegan.includes(i))) return false;
      }
      if (dietaryRestrictions.includes('vegetarian')) {
        const meat = ['chicken breast', 'salmon', 'turkey slices', 'chicken thighs', 'lean ground beef', 'beef steak', 'shrimp', 'ground turkey', 'canned tuna'];
        if (meal.ingredients.some(i => meat.includes(i))) return false;
      }
      if (dietaryRestrictions.includes('gluten-free')) {
        const gluten = ['granola', 'whole grain bread', 'whole wheat wrap', 'ciabatta', 'whole wheat spaghetti', 'rice noodles', 'rolled oats', 'rice cakes'];
        if (meal.ingredients.some(i => gluten.includes(i))) return false;
      }
      if (dietaryRestrictions.includes('dairy-free')) {
        const dairy = ['mozzarella', 'Greek yogurt', 'milk', 'cottage cheese', 'butter', 'cheese', 'yogurt'];
        if (meal.ingredients.some(i => dairy.includes(i))) return false;
      }
      if (dietaryRestrictions.includes('keto')) {
        if (meal.carbs > 25) return false;
      }
      if (dietaryRestrictions.includes('paleo')) {
        const nonPaleo = ['rolled oats', 'rice', 'quinoa', 'whole wheat wrap', 'ciabatta', 'whole wheat spaghetti', 'rice noodles', 'rice cakes', 'black beans', 'chickpeas', 'lentils', 'tofu', 'granola', 'hummus', 'protein powder', 'peanut butter', 'chia seeds', 'tahini', 'teriyaki sauce', 'soy sauce', 'balsamic glaze', 'pesto sauce'];
        if (meal.ingredients.some(i => nonPaleo.includes(i))) return false;
      }
      return true;
    });
    if (filtered[type].length === 0) filtered[type] = MEALS[type];
  }

  const plan = days.map((day) => {
    const meals = {};
    for (const type of mealTypes) {
      const pool = filtered[type];
      const meal = pool[Math.floor(Math.random() * pool.length)];
      meals[type] = meal;
    }
    return { day, meals };
  });

  return plan;
}

export function generateGroceryList(mealPlan) {
  const ingredientMap = {};
  for (const day of mealPlan) {
    for (const type of ['breakfast', 'lunch', 'dinner', 'snack']) {
      const meal = day.meals[type];
      if (meal && meal.ingredients) {
        for (const ingredient of meal.ingredients) {
          const key = ingredient.toLowerCase();
          ingredientMap[key] = {
            name: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
            category: getCategory(ingredient),
            checked: ingredientMap[key]?.checked || false,
          };
        }
      }
    }
  }
  const grouped = {};
  for (const item of Object.values(ingredientMap)) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}
