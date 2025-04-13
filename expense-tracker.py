import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import pickle
from datetime import datetime

# Sample data (replace with actual data from your app)
data = {
    'date': ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01'],
    'amount': [200, 250, 220, 210, 240]
}

# Convert data to DataFrame
df = pd.DataFrame(data)

# Convert 'date' to datetime
df['date'] = pd.to_datetime(df['date'])

# Extract year and month from 'date' column
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month

# Create 'month_num' as a continuous variable (from Jan 2023 as month 1)
df['month_num'] = df['month'] + (df['year'] - df['year'].min()) * 12

# Define features (X) and target variable (y)
X = df[['month_num']]  # Feature: month number
y = df['amount']  # Target: expense amount

# Split data into training and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Initialize and train the linear regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model using Mean Squared Error (MSE)
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error (MSE): {mse}')

# Plot actual vs predicted expenses
plt.figure(figsize=(10, 6))
plt.plot(df['date'], df['amount'], label='Actual Expenses', marker='o', color='blue')
plt.plot(df['date'].iloc[len(X_train):], y_pred, label='Predicted Expenses', marker='x', color='orange')
plt.xlabel('Date')
plt.ylabel('Expense Amount')
plt.title('Expense Prediction (Monthly)')
plt.legend()
plt.grid(True)
plt.show()

# Save the trained model to a file
with open('expense_tracker_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

print("Model saved successfully.")