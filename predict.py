import pickle
import pandas as pd

# Load the saved model
def load_model(model_path):
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    return model

# Predict expense for a given month number
def predict_expense(model, month_num):
    return model.predict([[month_num]])[0]

# Load the model
model = load_model('expense_tracker_model.pkl')

# Example of predicting the expense for the next month (assuming the last month_num was 5)
future_month_num = 6  # Next month
predicted_expense = predict_expense(model, future_month_num)
print(f"Predicted expense for next month (month {future_month_num}): ₹{predicted_expense:.2f}")