from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from dotenv import load_dotenv
import google.generativeai as genai
import traceback

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("GOOGLE_API_KEY not set in environment variables.")

# Configure Gemini model
genai.configure(api_key=API_KEY)
chat_model = genai.GenerativeModel("gemini-1.5-pro")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# --- Blood Demand Prediction Setup ---
demand_model = joblib.load('models/blood_donation_model.pkl')
demand_df = pd.read_csv("blood_demand_data.csv")
mean_values = {
    "Temperature": demand_df['Temperature'].mean(),
    "HistoricalBloodUsage": demand_df['HistoricalBloodUsage'].mean(),
    "HospitalAdmissions": demand_df['HospitalAdmissions'].mean(),
    "BloodDonorsAvailable": demand_df['BloodDonorsAvailable'].mean()
}

# --- Top Donors Setup ---
donor_model = joblib.load('models/donor_prediction_model.pkl')
scaler = joblib.load('models/scaler.pkl')
donor_df = pd.read_csv('updated_transfusion.csv')

def calculate_normalized_score(df):
    df = df.copy()
    df['Normalized Recency'] = (df['Recency (months)'] - df['Recency (months)'].min()) / (df['Recency (months)'].max() - df['Recency (months)'].min())
    df['Normalized Frequency'] = (df['Frequency (times)'] - df['Frequency (times)'].min()) / (df['Frequency (times)'].max() - df['Frequency (times)'].min())
    df['Normalized Monetary'] = (df['Monetary (c.c. blood)'] - df['Monetary (c.c. blood)'].min()) / (df['Monetary (c.c. blood)'].max() - df['Monetary (c.c. blood)'].min())
    df['Normalized Donor Score'] = (df['Normalized Frequency'] * 0.4 + df['Normalized Monetary'] * 0.4 + (1 - df['Normalized Recency']) * 0.2) * 100
    return df

donor_df = calculate_normalized_score(donor_df)

# --- Routes ---
@app.route("/")
def home():
    return "✅ Unified Flask server is running. Endpoints: /predict, /api/top-donors, /chat"

@app.route("/predict", methods=["POST"])
def predict_demand():
    data = request.get_json()
    date = pd.to_datetime(data.get("Date"))
    population = data.get("Population")

    input_data = pd.DataFrame([{
        "DayOfWeek": date.dayofweek,
        "Month": date.month,
        "Population": population,
        "Events": 0,
        "HistoricalBloodUsage": mean_values["HistoricalBloodUsage"],
        "HospitalAdmissions": mean_values["HospitalAdmissions"],
        "BloodDonorsAvailable": mean_values["BloodDonorsAvailable"],
        "Temperature": mean_values["Temperature"]
    }])

    prediction = demand_model.predict(input_data)
    return jsonify({"PredictedBloodDemand": prediction[0]})

@app.route("/api/top-donors", methods=["POST"])
def top_donors():
    data = request.get_json()
    blood_group = data.get('bloodGroup', '').lower()

    filtered = donor_df[donor_df['Blood Group'].str.lower() == blood_group]
    if filtered.empty:
        return jsonify({'error': 'No donors found for the given blood group.'}), 404

    X = filtered[['Recency (months)', 'Frequency (times)', 'Monetary (c.c. blood)']]
    X_scaled = scaler.transform(X)

    filtered = filtered.copy()
    filtered['Predicted Donor Score'] = donor_model.predict(X_scaled)

    top_5 = filtered.sort_values(by='Predicted Donor Score', ascending=False).head(5)
    result = top_5[['ID', 'Blood Group', 'Predicted Donor Score']].to_dict(orient='records')
    return jsonify(result)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        allowed_topics = [
            "Smart Blood Banking", "Blood Demand Prediction", "Blood Supply Chain Optimization",
            "Real-Time Blood Monitoring", "Smart Blood Donation System", "Automated Blood Management",
            "Data-Driven Blood Bank", "Blood Inventory Forecasting",
            "Blood Demand Forecasting", "Predictive Analytics for Blood Banking",
            "Machine Learning Blood Demand Prediction", "Data-Driven Blood Demand Planning",
            "Blood Usage Patterns", "Demand Prediction Models", "Time Series Analysis for Blood Demand",
            "Potential Donor Identification", "Donor Prediction Algorithms",
            "Donor Pattern Recognition", "Machine Learning Donor Prediction",
            "Donor Database Management", "Predictive Donor Analytics",
            "Donor Availability Prediction",
            "Donor Matching Algorithms", "Blood Group Matching", "Recipient Compatibility Analysis",
            "Blood Type Compatibility", "Donor-Recipient Matching System",
            "Optimized Blood Matching", "Cross-Matching Blood Types",
            "Blood Donation Camp Management", "Camp Promotion Strategies",
            "Donation Camp Scheduling", "Donor Outreach Programs", "Community Blood Drives",
            "Camp Location Optimization", "Volunteer Management",
            "Donor Engagement", "Blood Donation Promotion", "Social Media Promotion for Blood Donation",
            "Awareness Campaigns", "Blood Donation Drive Promotion",
            "Promotional Strategies for Blood Banks",
            "Donor Database Management", "Donor Retention Strategies", "Donor Communication",
            "Tracking Donor History", "Managing Donor Data", "Donor Record Maintenance",
            "Donation Frequency Monitoring",
            "Artificial Intelligence in Blood Banking", "Data Analytics for Blood Banks",
            "Integration with Health Databases", "Data-Driven Decision Making",
            "Smart Blood Bank Management System", "Mobile App for Blood Donation",
            "Donor Health Monitoring", "Blood Safety and Quality Control", "Post-Donation Health Tracking",
            "Compliance with Blood Safety Standards", "Emergency Blood Availability",
            "Health Data Privacy",
            "Time Series Analysis", "Regression Models", "Clustering Techniques",
            "Anomaly Detection", "Deep Learning Models", "Classification Algorithms",
            "Feature Engineering", "Data Visualization for Blood Trends"
        ]

        if not any(topic.lower() in user_message.lower() for topic in allowed_topics):
            return jsonify({"response": "Sorry, I can only answer questions about Blood Banking."})

        response = chat_model.generate_content(user_message, generation_config={"max_output_tokens": 300})
        text = response.candidates[0].content.parts[0].text
        return jsonify({"response": text})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
