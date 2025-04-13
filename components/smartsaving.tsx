type SmartSavingsProps = {
  totalSpent: number;
  categoryTotals: Record<string, number>;
};

const getSuggestions = (totalSpent: number, categoryTotals: Record<string, number>) => {
  if (!totalSpent || totalSpent === 0) return [];

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return sorted.map(([category, amount]) => {
    const percent = ((amount / totalSpent) * 100).toFixed(1);
    const possibleSave = Math.round(amount * 0.2); // Suggest 20% cut

    let tip = "";
    const cat = category.toLowerCase();
    if (cat.includes("food")) {
      tip = "Try meal planning or home-cooked meals to reduce food costs.";
    } else if (cat.includes("shopping")) {
      tip = "Avoid impulsive buys — wait 24 hours before purchasing.";
    } else if (cat.includes("entertainment")) {
      tip = "Explore free events or subscriptions you can cancel.";
    } else if (cat.includes("utilities")) {
      tip = "Turn off appliances when not in use to lower your bills.";
    }

    return {
      category,
      percent,
      possibleSave,
      tip,
    };
  });
};

const SmartSavings: React.FC<SmartSavingsProps> = ({ totalSpent, categoryTotals }) => {
  const suggestions = getSuggestions(totalSpent, categoryTotals);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-blue-50 rounded-2xl p-4 shadow-md mt-6">
      <h2 className="text-xl font-semibold text-blue-900 mb-2">💡 Smart Savings Suggestions</h2>
      <p className="text-blue-800 mb-3">
        You spent ₹{totalSpent} this month. Here's how you could save more next time:
      </p>
      {suggestions.slice(0, 2).map((s, idx) => (
        <div key={idx} className="mb-3">
          <p className="text-base text-blue-700">
            • <strong>{s.category}</strong> made up <strong>{s.percent}%</strong> of your spending.
            <br />
            → Cutting 20% from this category could save you <strong>₹{s.possibleSave}</strong>.
            <br />
            <span className="italic text-gray-600">{s.tip}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default SmartSavings;
