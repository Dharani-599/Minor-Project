import React, { useState } from 'react';

function ExpensePrediction() {
    const [monthNum, setMonthNum] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handlePredict = async () => {
        const response = await fetch(`http://127.0.0.1:5000/predict?month_num=${monthNum}`);
        const data = await response.json();
        setPrediction(data.predicted_expense);
    };

    return (
        <div>
            <h1>Expense Prediction</h1>
            <input
                type="number"
                value={monthNum}
                onChange={(e) => setMonthNum(e.target.value)}
                placeholder="Enter month number"
            />
            <button onClick={handlePredict}>Predict Expense</button>
            {prediction !== null && <p>Predicted Expense: ₹{prediction}</p>}
        </div>
    );
}

export default ExpensePrediction;


