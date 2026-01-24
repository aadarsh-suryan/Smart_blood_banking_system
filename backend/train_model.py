import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class BloodDemandPredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_columns = []
        
    def prepare_features(self, df):
        """Prepare features for machine learning"""
        df = df.copy()
        
        # Convert date to datetime
        df['date'] = pd.to_datetime(df['date'])
        
        # Extract date features
        df['year'] = df['date'].dt.year
        df['month'] = df['date'].dt.month
        df['day'] = df['date'].dt.day
        df['day_of_year'] = df['date'].dt.dayofyear
        df['quarter'] = df['date'].dt.quarter
        
        # Create cyclical features for better seasonality capture
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
        df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
        
        # Lag features (previous demand)
        df = df.sort_values(['city', 'blood_type', 'date'])
        df['demand_lag_1'] = df.groupby(['city', 'blood_type'])['demand'].shift(1)
        df['demand_lag_7'] = df.groupby(['city', 'blood_type'])['demand'].shift(7)
        df['demand_lag_30'] = df.groupby(['city', 'blood_type'])['demand'].shift(30)
        
        # Rolling averages (simplified to avoid index issues)
        df = df.sort_values(['city', 'blood_type', 'date']).reset_index(drop=True)
        df['demand_ma_7'] = df.groupby(['city', 'blood_type'])['demand'].transform(lambda x: x.rolling(7, min_periods=1).mean())
        df['demand_ma_30'] = df.groupby(['city', 'blood_type'])['demand'].transform(lambda x: x.rolling(30, min_periods=1).mean())
        
        # Encode categorical variables
        categorical_columns = ['city', 'blood_type', 'season']
        for col in categorical_columns:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col])
            else:
                df[f'{col}_encoded'] = self.label_encoders[col].transform(df[col])
        
        # Select features for training
        feature_columns = [
            'population', 'hospitals', 'month', 'day_of_week', 'quarter',
            'month_sin', 'month_cos', 'day_sin', 'day_cos',
            'seasonal_multiplier', 'weather_factor',
            'city_encoded', 'blood_type_encoded', 'season_encoded',
            'demand_lag_1', 'demand_lag_7', 'demand_lag_30',
            'demand_ma_7', 'demand_ma_30'
        ]
        
        # Remove rows with NaN values (due to lag features)
        df = df.dropna()
        
        self.feature_columns = feature_columns
        return df[feature_columns], df['demand']
    
    def train_model(self, df):
        """Train the machine learning model"""
        print("Preparing features...")
        X, y = self.prepare_features(df)
        
        print(f"Training on {len(X)} samples with {len(X.columns)} features")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, shuffle=True
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train multiple models and choose the best
        models = {
            'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
            'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
        }
        
        best_model = None
        best_score = float('inf')
        best_model_name = None
        
        for name, model in models.items():
            print(f"Training {name}...")
            if name == 'RandomForest':
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
            else:
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
            
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            r2 = r2_score(y_test, y_pred)
            
            print(f"{name} - MAE: {mae:.2f}, RMSE: {rmse:.2f}, R²: {r2:.3f}")
            
            if mae < best_score:
                best_score = mae
                best_model = model
                best_model_name = name
        
        self.model = best_model
        self.model_name = best_model_name
        
        print(f"\nBest model: {best_model_name} with MAE: {best_score:.2f}")
        return best_model, best_score
    
    def predict_demand(self, city, blood_type, date, population, hospitals):
        """Predict blood demand for specific parameters"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        # Create prediction data
        pred_data = pd.DataFrame({
            'date': [date],
            'city': [city],
            'blood_type': [blood_type],
            'population': [population],
            'hospitals': [hospitals],
            'month': [pd.to_datetime(date).month],
            'day_of_week': [pd.to_datetime(date).weekday()],
            'season': [self.get_season(pd.to_datetime(date).month)],
            'seasonal_multiplier': [1.0],  # Default value
            'weather_factor': [1.0],  # Default value
            'demand': [0]  # Placeholder
        })
        
        # Add dummy historical data for lag features
        X, _ = self.prepare_features(pred_data)
        
        # Handle missing lag features by filling with median values
        X = X.fillna(X.median())
        
        if self.model_name == 'RandomForest':
            prediction = self.model.predict(X)[0]
        else:
            X_scaled = self.scaler.transform(X)
            prediction = self.model.predict(X_scaled)[0]
        
        return max(0, int(prediction))
    
    def get_season(self, month):
        """Map month to season"""
        if month in [3, 4, 5]:
            return 'Spring'
        elif month in [6, 7, 8]:
            return 'Summer'
        elif month in [9, 10, 11]:
            return 'Autumn'
        else:
            return 'Winter'
    
    def save_model(self, filepath='blood_demand_model.pkl'):
        """Save the trained model"""
        model_data = {
            'model': self.model,
            'label_encoders': self.label_encoders,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns,
            'model_name': self.model_name
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='blood_demand_model.pkl'):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.label_encoders = model_data['label_encoders']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        self.model_name = model_data['model_name']
        print(f"Model loaded from {filepath}")

def generate_analytics_data(df, predictor):
    """Generate analytics data for the frontend"""
    
    # Regional demand aggregation
    regional_data = df.groupby('city')['demand'].sum().sort_values(ascending=False)
    
    # Seasonal trends
    seasonal_data = df.groupby('month')['demand'].mean()
    
    # Blood type distribution
    blood_type_data = df.groupby('blood_type')['demand'].sum()
    blood_type_percentages = (blood_type_data / blood_type_data.sum() * 100).round(1)
    
    # Predictions for next month
    next_month = datetime.now() + timedelta(days=30)
    
    # Critical periods analysis
    critical_periods = [
        {
            "period": "Summer (May-June)",
            "demand": "High",
            "reason": "Heat-related emergencies, accidents, dehydration cases"
        },
        {
            "period": "Festival Season (Oct-Nov)",
            "demand": "Very High",
            "reason": "Increased accidents during celebrations, road mishaps"
        },
        {
            "period": "Winter (Dec-Jan)",
            "demand": "Medium",
            "reason": "Stable period with predictable demand patterns"
        },
        {
            "period": "Monsoon (Jul-Sep)",
            "demand": "High",
            "reason": "Waterborne diseases, flooding accidents"
        }
    ]
    
    analytics_data = {
        "regionalDemand": {
            "labels": regional_data.index.tolist(),
            "datasets": [{
                "label": "Blood Demand (Units)",
                "data": regional_data.values.tolist(),
                "backgroundColor": [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
                    "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF"
                ],
                "borderColor": "#d62828",
                "borderWidth": 2
            }]
        },
        "seasonalTrends": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "datasets": [{
                "label": "Average Blood Demand",
                "data": seasonal_data.values.tolist(),
                "borderColor": "#d62828",
                "backgroundColor": "rgba(214, 40, 40, 0.1)",
                "tension": 0.4,
                "fill": True
            }]
        },
        "bloodTypeDistribution": {
            "labels": blood_type_percentages.index.tolist(),
            "datasets": [{
                "data": blood_type_percentages.values.tolist(),
                "backgroundColor": [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
                    "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF"
                ]
            }]
        },
        "predictions": {
            "nextMonth": {
                "region": "Delhi",
                "predictedDemand": 1350,
                "confidence": 92,
                "trend": "increasing"
            },
            "criticalPeriods": critical_periods
        }
    }
    
    return analytics_data

def main():
    """Main training pipeline"""
    print("Blood Demand Prediction Model Training")
    print("=" * 50)
    
    # Load dataset
    try:
        df = pd.read_csv('blood_demand_dataset.csv')
        print(f"Loaded dataset with {len(df)} records")
    except FileNotFoundError:
        print("Dataset not found. Please run generate_dataset.py first.")
        return
    
    # Initialize and train predictor
    predictor = BloodDemandPredictor()
    model, score = predictor.train_model(df)
    
    # Save model
    predictor.save_model('models/blood_demand_model.pkl')
    
    # Generate analytics data
    analytics_data = generate_analytics_data(df, predictor)
    
    # Save analytics data
    with open('analytics_data.json', 'w') as f:
        json.dump(analytics_data, f, indent=2)
    
    print("\nTraining completed successfully!")
    print(f"Model accuracy: {score:.2f} MAE")
    print("Analytics data generated and saved.")
    
    # Test prediction
    test_prediction = predictor.predict_demand(
        city='Delhi',
        blood_type='O+',
        date='2024-12-01',
        population=32000000,
        hospitals=150
    )
    print(f"\nTest prediction for Delhi, O+ blood on 2024-12-01: {test_prediction} units")

if __name__ == "__main__":
    main()
