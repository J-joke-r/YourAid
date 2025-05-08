from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS  # Enable CORS to allow frontend requests

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Load the dataset
try:
    df = pd.read_excel("medicaldatasetotc.xlsx")  
    df.columns = df.columns.str.strip()  # Ensure no leading/trailing spaces in column names
    df.fillna("N/A", inplace=True)  # Replace NaN values with "N/A"
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame()  # Empty DataFrame if file not found

@app.route("/get_recommendation", methods=["POST"])
def get_recommendation():
    if df.empty:
        return jsonify({"error": "Dataset not found or empty"}), 500

    # Get data from the frontend
    data = request.json
    username = data.get("username", "").strip()
    symptom1 = data.get("symptom1", "").strip()
    symptom2 = data.get("symptom2", "").strip()
    medical_history = data.get("medicalhistory", "").strip()

    # Convert empty inputs to "N/A" to match dataset
    symptom1 = "N/A" if symptom1 == "" else symptom1
    symptom2 = "N/A" if symptom2 == "" else symptom2
    medical_history = "N/A" if medical_history == "" else medical_history

    # Ensure dataset columns have no leading/trailing spaces
    df["symptom1"] = df["symptom1"].str.strip()
    df["symptom2"] = df["symptom2"].str.strip()
    df["medicalhistory"] = df["medicalhistory"].str.strip()

    # Search for matching row in the dataset
    try:
        match = df[
            (df["symptom1"] == symptom1) & 
            (df["symptom2"] == symptom2) & 
            (df["medicalhistory"] == medical_history)
        ]

        if not match.empty:
            response = {
                "username": username,
                "DrugName": match.iloc[0]["DrugName"],
                "Dosage": match.iloc[0]["Dosage"],
                "LifestyleAdvice": match.iloc[0]["LifestyleAdvice"]
            }
            return jsonify(response)
        else:
            return jsonify({"error": "No matching record found. Please check your inputs."}), 404
    except KeyError as e:
        return jsonify({"error": f"Column not found in dataset: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
