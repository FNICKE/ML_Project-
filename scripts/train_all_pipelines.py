import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os

os.makedirs('models', exist_ok=True)

def train_earthquake():
    print("Training Earthquake Model...")
    df = pd.read_csv('datasets/database.csv')
    df = df.dropna(subset=['Latitude', 'Longitude', 'Depth', 'Magnitude'])
    X = df[['Latitude', 'Longitude', 'Depth']]
    y = (df['Magnitude'] >= 6.0).astype(int) # High magnitude threshold
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_scaled, y)
    
    joblib.dump(model, 'models/earthquake_model.pkl')
    joblib.dump(scaler, 'models/earthquake_scaler.pkl')
    joblib.dump(list(X.columns), 'models/earthquake_features.pkl')
    print("Accuracy:", accuracy_score(y, model.predict(X_scaled)))

def train_forestfire():
    print("Training Forest Fire Model...")
    df = pd.read_csv('datasets/forestfires.csv')
    df = df.dropna()
    features = ['FFMC', 'DMC', 'DC', 'ISI', 'temp', 'RH', 'wind', 'rain']
    X = df[features]
    y = (df['area'] > 0).astype(int) # Fire happened
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_scaled, y)
    
    joblib.dump(model, 'models/forestfire_model.pkl')
    joblib.dump(scaler, 'models/forestfire_scaler.pkl')
    joblib.dump(features, 'models/forestfire_features.pkl')
    print("Accuracy:", accuracy_score(y, model.predict(X_scaled)))

def train_landslide():
    print("Training Landslide Model...")
    df = pd.read_csv('datasets/landslides.csv')
    df['population'] = pd.to_numeric(df['population'], errors='coerce').fillna(0)
    df['distance'] = pd.to_numeric(df['distance'], errors='coerce').fillna(0)
    df = df.dropna(subset=['latitude', 'longitude'])
    features = ['latitude', 'longitude', 'population', 'distance']
    X = df[features]
    
    y = (X['population'] > X['population'].median()).astype(int)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_scaled, y)
    
    joblib.dump(model, 'models/landslide_model.pkl')
    joblib.dump(scaler, 'models/landslide_scaler.pkl')
    joblib.dump(features, 'models/landslide_features.pkl')
    print("Accuracy:", accuracy_score(y, model.predict(X_scaled)))

def train_tsunami():
    print("Training Tsunami Model...")
    df = pd.read_csv('datasets/tsunami_dataset.csv')
    df = df.dropna(subset=['EQ_MAGNITUDE', 'EQ_DEPTH'])
    features = ['EQ_MAGNITUDE', 'EQ_DEPTH']
    X = df[features]
    y = (X['EQ_MAGNITUDE'] > 7.0).astype(int) 
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_scaled, y)
    
    joblib.dump(model, 'models/tsunami_model.pkl')
    joblib.dump(scaler, 'models/tsunami_scaler.pkl')
    joblib.dump(features, 'models/tsunami_features.pkl')
    print("Accuracy:", accuracy_score(y, model.predict(X_scaled)))

if __name__ == '__main__':
    train_earthquake()
    train_forestfire()
    train_landslide()
    train_tsunami()
    print("All models successfully trained and saved!")
