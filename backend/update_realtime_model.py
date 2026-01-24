import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
import json
import os
from train_model import BloodDemandPredictor

def load_realtime_data():
    """Load real-time data from CSV and MongoDB collections"""
    try:
        # Load real-time CSV data
        realtime_df = pd.read_csv('realtime_data.csv')
        
        # Convert to proper format for ML model
        processed_data = []
        
        for _, row in realtime_df.iterrows():
            # Calculate demand based on type
            if row['type'] == 'donation':
                supply = row['units']
                demand = 0  # Donation doesn't create demand
            else:  # request
                supply = 0
                demand = row['units']
            
            # Get current date info
            date_obj = pd.to_datetime(row['date'])
            
            processed_row = {
                'date': row['date'],
                'city': row['city'],
                'blood_type': row['blood_type'],
                'demand': demand,
                'supply': supply,
                'population': get_city_population(row['city']),
                'hospitals': get_city_hospitals(row['city']),
                'month': date_obj.month,
                'day_of_week': date_obj.weekday(),
                'season': get_season(date_obj.month),
                'seasonal_multiplier': get_seasonal_multiplier(date_obj.month),
                'weather_factor': get_weather_factor(row.get('weather', 'unknown')),
                'is_critical': row.get('urgency', 'normal') in ['high', 'critical'],
                'shortage': max(0, demand - supply)
            }
            
            processed_data.append(processed_row)
        
        return pd.DataFrame(processed_data)
        
    except FileNotFoundError:
        print("No real-time data found, using empty dataset")
        return pd.DataFrame()

def get_city_population(city):
    """Get population for city"""
    populations = {
        'Delhi': 32000000, 'Mumbai': 25000000, 'Bangalore': 13000000,
        'Chennai': 11000000, 'Kolkata': 15000000, 'Hyderabad': 10000000,
        'Pune': 7000000, 'Ahmedabad': 8000000
    }
    return populations.get(city, 5000000)  # Default for unknown cities

def get_city_hospitals(city):
    """Get number of hospitals for city"""
    hospitals = {
        'Delhi': 150, 'Mumbai': 180, 'Bangalore': 120,
        'Chennai': 100, 'Kolkata': 110, 'Hyderabad': 90,
        'Pune': 70, 'Ahmedabad': 60
    }
    return hospitals.get(city, 50)  # Default for unknown cities

def get_season(month):
    """Map month to season"""
    if month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    elif month in [9, 10, 11]:
        return 'Autumn'
    else:
        return 'Winter'

def get_seasonal_multiplier(month):
    """Get seasonal demand multiplier"""
    if month in [5, 6]:  # Summer peak
        return 1.4
    elif month in [10, 11]:  # Festival season
        return 1.6
    elif month in [12, 1, 2]:  # Winter
        return 0.9
    elif month in [7, 8, 9]:  # Monsoon
        return 1.2
    else:
        return 1.0

def get_weather_factor(weather):
    """Get weather impact factor"""
    factors = {
        'sunny': 1.0,
        'rainy': 1.2,
        'cloudy': 1.0,
        'stormy': 1.5,
        'cold': 0.9,
        'unknown': 1.0
    }
    return factors.get(weather, 1.0)

def update_analytics_with_realtime():
    """Update analytics data with real-time information"""
    try:
        # Load existing analytics data
        with open('analytics_data.json', 'r') as f:
            analytics_data = json.load(f)
        
        # Load real-time data
        realtime_df = load_realtime_data()
        
        if realtime_df.empty:
            print("No real-time data to process")
            return
        
        # Update regional demand with real-time data
        today = datetime.now().date()
        recent_data = realtime_df[pd.to_datetime(realtime_df['date']).dt.date >= today - timedelta(days=7)]
        
        if not recent_data.empty:
            # Update regional demand
            city_demand = recent_data.groupby('city')['demand'].sum()
            
            # Merge with existing data
            existing_cities = analytics_data['regionalDemand']['labels']
            existing_values = analytics_data['regionalDemand']['datasets'][0]['data']
            
            for city, demand in city_demand.items():
                if city in existing_cities:
                    idx = existing_cities.index(city)
                    existing_values[idx] += int(demand)
                else:
                    existing_cities.append(city)
                    existing_values.append(int(demand))
            
            # Update blood type distribution
            blood_type_demand = recent_data.groupby('blood_type')['demand'].sum()
            blood_type_labels = analytics_data['bloodTypeDistribution']['labels']
            blood_type_values = analytics_data['bloodTypeDistribution']['datasets'][0]['data']
            
            for blood_type, demand in blood_type_demand.items():
                if blood_type in blood_type_labels:
                    idx = blood_type_labels.index(blood_type)
                    # Convert to percentage
                    total_demand = sum(blood_type_values)
                    blood_type_values[idx] = ((blood_type_values[idx] * total_demand / 100) + demand) / (total_demand + demand) * 100
        
        # Update predictions with latest trends
        latest_demand = realtime_df['demand'].tail(30).mean() if len(realtime_df) >= 30 else realtime_df['demand'].mean()
        
        if not pd.isna(latest_demand):
            analytics_data['predictions']['nextMonth']['predictedDemand'] = int(latest_demand * 30)  # Monthly prediction
            
            # Update confidence based on data recency
            data_freshness = min(len(realtime_df) / 100, 1.0)  # More data = higher confidence
            analytics_data['predictions']['nextMonth']['confidence'] = int(85 + data_freshness * 10)
        
        # Add real-time insights
        analytics_data['realTimeInsights'] = {
            'lastUpdated': datetime.now().isoformat(),
            'totalRealTimeRecords': len(realtime_df),
            'recentDonations': int(recent_data[recent_data['supply'] > 0]['supply'].sum()) if not recent_data.empty else 0,
            'recentRequests': int(recent_data[recent_data['demand'] > 0]['demand'].sum()) if not recent_data.empty else 0,
            'criticalRequests': int(recent_data['is_critical'].sum()) if not recent_data.empty else 0
        }
        
        # Save updated analytics
        with open('analytics_data.json', 'w') as f:
            json.dump(analytics_data, f, indent=2)
        
        print("Analytics updated with real-time data successfully!")
        print(f"Processed {len(realtime_df)} real-time records")
        
    except Exception as e:
        print(f"Error updating analytics: {e}")

def retrain_with_realtime_data():
    """Retrain ML model with combined historical and real-time data"""
    try:
        # Load historical dataset
        historical_df = pd.read_csv('blood_demand_dataset.csv')
        
        # Load real-time data
        realtime_df = load_realtime_data()
        
        if realtime_df.empty:
            print("No real-time data for retraining")
            return
        
        # Combine datasets
        combined_df = pd.concat([historical_df, realtime_df], ignore_index=True)
        
        # Remove duplicates and sort by date
        combined_df = combined_df.drop_duplicates().sort_values('date')
        
        print(f"Combined dataset size: {len(combined_df)} records")
        print(f"Real-time records added: {len(realtime_df)}")
        
        # Retrain model
        predictor = BloodDemandPredictor()
        model, score = predictor.train_model(combined_df)
        
        # Save updated model
        predictor.save_model('models/blood_demand_model_realtime.pkl')
        
        print(f"Model retrained with accuracy: {score:.2f}")
        
        # Generate updated analytics
        from train_model import generate_analytics_data
        analytics_data = generate_analytics_data(combined_df, predictor)
        
        # Add real-time specific insights
        analytics_data['realTimeInsights'] = {
            'lastUpdated': datetime.now().isoformat(),
            'totalRecords': len(combined_df),
            'realtimeRecords': len(realtime_df),
            'modelAccuracy': f"{100 - score:.1f}%"
        }
        
        # Save updated analytics
        with open('analytics_data.json', 'w') as f:
            json.dump(analytics_data, f, indent=2)
        
        print("Real-time model update completed successfully!")
        
    except Exception as e:
        print(f"Error retraining with real-time data: {e}")

def main():
    """Main function for real-time updates"""
    print("Updating analytics with real-time data...")
    
    # Quick update for immediate analytics
    update_analytics_with_realtime()
    
    # Check if enough new data for retraining
    try:
        realtime_df = load_realtime_data()
        if len(realtime_df) >= 50:  # Retrain if we have enough new data
            print("Sufficient new data found. Retraining model...")
            retrain_with_realtime_data()
        else:
            print(f"Only {len(realtime_df)} new records. Skipping model retraining.")
    except:
        print("Could not check real-time data for retraining")

if __name__ == "__main__":
    main()
