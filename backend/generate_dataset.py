import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_blood_demand_dataset():
    """
    Generate a comprehensive blood demand dataset for machine learning
    """
    
    # Define cities and their characteristics
    cities = {
        'Delhi': {'population': 32000000, 'hospitals': 150, 'base_demand': 1200},
        'Mumbai': {'population': 25000000, 'hospitals': 180, 'base_demand': 1500},
        'Bangalore': {'population': 13000000, 'hospitals': 120, 'base_demand': 800},
        'Chennai': {'population': 11000000, 'hospitals': 100, 'base_demand': 600},
        'Kolkata': {'population': 15000000, 'hospitals': 110, 'base_demand': 900},
        'Hyderabad': {'population': 10000000, 'hospitals': 90, 'base_demand': 700},
        'Pune': {'population': 7000000, 'hospitals': 70, 'base_demand': 500},
        'Ahmedabad': {'population': 8000000, 'hospitals': 60, 'base_demand': 450}
    }
    
    blood_types = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']
    blood_type_distribution = [0.35, 0.25, 0.20, 0.08, 0.07, 0.03, 0.015, 0.005]
    
    # Generate data for 3 years
    start_date = datetime(2021, 1, 1)
    end_date = datetime(2024, 12, 31)
    
    data = []
    
    current_date = start_date
    while current_date <= end_date:
        for city, city_info in cities.items():
            for i, blood_type in enumerate(blood_types):
                
                # Base demand influenced by population and blood type distribution
                base_demand = city_info['base_demand'] * blood_type_distribution[i]
                
                # Seasonal factors
                month = current_date.month
                seasonal_multiplier = 1.0
                
                # Summer peak (May-June)
                if month in [5, 6]:
                    seasonal_multiplier = 1.4
                # Festival season (October-November)
                elif month in [10, 11]:
                    seasonal_multiplier = 1.6
                # Winter stability (December-February)
                elif month in [12, 1, 2]:
                    seasonal_multiplier = 0.9
                # Monsoon (July-September)
                elif month in [7, 8, 9]:
                    seasonal_multiplier = 1.2
                
                # Day of week factor (weekends have different patterns)
                day_of_week = current_date.weekday()
                if day_of_week >= 5:  # Weekend
                    day_multiplier = 1.1
                else:
                    day_multiplier = 1.0
                
                # Random events (accidents, emergencies)
                emergency_factor = np.random.exponential(0.1) if random.random() < 0.05 else 0
                
                # Weather impact (simplified)
                weather_factor = np.random.normal(1.0, 0.1)
                
                # Calculate final demand
                demand = int(base_demand * seasonal_multiplier * day_multiplier * 
                           weather_factor + emergency_factor * 100)
                
                # Ensure minimum demand
                demand = max(demand, 5)
                
                # Supply availability (80-120% of demand typically)
                supply = int(demand * np.random.uniform(0.8, 1.2))
                
                # Critical shortage flag
                is_critical = supply < demand * 0.7
                
                data.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'city': city,
                    'blood_type': blood_type,
                    'population': city_info['population'],
                    'hospitals': city_info['hospitals'],
                    'month': month,
                    'day_of_week': day_of_week,
                    'season': get_season(month),
                    'demand': demand,
                    'supply': supply,
                    'shortage': max(0, demand - supply),
                    'is_critical': is_critical,
                    'seasonal_multiplier': seasonal_multiplier,
                    'weather_factor': weather_factor
                })
        
        current_date += timedelta(days=1)
    
    return pd.DataFrame(data)

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

def save_dataset():
    """Generate and save the dataset"""
    print("Generating blood demand dataset...")
    df = generate_blood_demand_dataset()
    
    # Save to CSV
    df.to_csv('blood_demand_dataset.csv', index=False)
    print(f"Dataset saved with {len(df)} records")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Cities: {df['city'].unique()}")
    print(f"Blood types: {df['blood_type'].unique()}")
    
    # Display sample statistics
    print("\nSample Statistics:")
    print(df.groupby('city')['demand'].mean().round(2))
    print("\nSeasonal averages:")
    print(df.groupby('season')['demand'].mean().round(2))
    
    return df

if __name__ == "__main__":
    dataset = save_dataset()
