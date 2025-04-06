from fastapi import FastAPI
from pydantic import BaseModel
import joblib

# Load the trained model
model = joblib.load("expense_tracker_model.pkl")

# Initialize FastAPI app
app = FastAPI()

# Define request body schema
class ExpenseRequest(BaseModel):
    description: str

@app.post("/predict")
def predict_category(expense: ExpenseRequest):
    predicted_category = model.predict([expense.description])[0]
    return {"category": predicted_category}
