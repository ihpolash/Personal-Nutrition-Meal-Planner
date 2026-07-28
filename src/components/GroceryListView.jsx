import { useNutrition } from '../context/NutritionContext';

const CATEGORY_ICONS = { Produce: '🥬', Meat: '🥩', Dairy: '🥛', Bakery: '🍞', Pantry: '🥫' };
const CATEGORY_ORDER = ['Produce', 'Meat', 'Dairy', 'Bakery', 'Pantry'];

export default function GroceryListView() {
  const { mealPlan, groceryList, groceryChecks, toggleGroceryItem } = useNutrition();

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-warm-300">
        <span className="text-5xl mb-4">🛒</span>
        <h3 className="text-xl font-semibold text-warm-800 mb-2">No grocery list yet</h3>
        <p className="text-warm-500 max-w-md">Generate a meal plan and your grocery list will appear here automatically.</p>
      </div>
    );
  }

  const sortedCats = CATEGORY_ORDER.filter(cat => groceryList[cat]?.length > 0);
  const allItems = Object.values(groceryList).flat();
  const total = allItems.length;
  const checked = groceryChecks.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-warm-800">Grocery List</h1><p className="text-warm-500 mt-1">{checked} of {total} items checked</p></div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 bg-warm-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${total ? (checked / total) * 100 : 0}%` }} />
          </div>
          <span className="text-sm font-medium text-warm-600">{total ? Math.round((checked / total) * 100) : 0}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedCats.map(cat => (
          <div key={cat} className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
              <h3 className="font-semibold text-warm-800">{cat}</h3>
              <span className="text-xs text-warm-400 ml-auto">{groceryList[cat].length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groceryList[cat].map(item => {
                const checked = groceryChecks.includes(item.name);
                return (
                  <button key={item.name} onClick={() => toggleGroceryItem(item.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${checked ? 'border-primary-200 bg-primary-50' : 'border-warm-200 hover:border-warm-300'}`}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${checked ? 'bg-primary-500 border-primary-500' : 'border-warm-300'}`}>
                      {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`font-medium transition ${checked ? 'text-warm-400 line-through' : 'text-warm-800'}`}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
