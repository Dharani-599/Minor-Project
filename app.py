from flask import Flask, jsonify, request
import joblib  # Use joblib instead of pickle

app = Flask(__name__)

# Load the trained model using joblib
model = joblib.load('expense_tracker_model.pkl')

# Route to predict expense for a given month number
@app.route('/predict', methods=['GET'])
def predict():
    try:
        # Get the month_num from the query parameters
        month_num = int(request.args.get('month_num'))
        
        # Make a prediction
        prediction = model.predict([[month_num]])[0]
        
        return jsonify({'predicted_expense': prediction}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
