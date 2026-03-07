"""
backend/app.py
--------------
Flask REST API for Disaster Prediction (Flood, Earthquake, Forest Fire, Landslide, Tsunami).

Run from project root:
    python backend/app.py
"""

import os
import sys
import logging

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from utils.preprocessing import _engineer_features, FEATURE_COLUMNS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))

# Dictionary to store all models
models_store = {
    'flood': {},
    'earthquake': {},
    'forestfire': {},
    'landslide': {},
    'tsunami': {}
}

def load_all_models():
    # 1. Flood
    try:
        models_store['flood'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, "flood_model.pkl")),
            'scaler': joblib.load(os.path.join(MODELS_DIR, "scaler.pkl")),
            'features': joblib.load(os.path.join(MODELS_DIR, "feature_names.pkl")),
            'ready': True
        }
    except Exception as e:
        log.warning(f"Flood model not ready: {e}")
        models_store['flood']['ready'] = False

    # 2-5. Others
    for t in ['earthquake', 'forestfire', 'landslide', 'tsunami']:
        try:
            models_store[t] = {
                'model': joblib.load(os.path.join(MODELS_DIR, f"{t}_model.pkl")),
                'scaler': joblib.load(os.path.join(MODELS_DIR, f"{t}_scaler.pkl")),
                'features': joblib.load(os.path.join(MODELS_DIR, f"{t}_features.pkl")),
                'ready': True
            }
        except Exception as e:
            log.warning(f"{t.capitalize()} model not ready: {e}")
            models_store[t]['ready'] = False

load_all_models()

def _risk_label(probability: float) -> str:
    if probability < 0.30: return "Low"
    elif probability < 0.60: return "Moderate"
    elif probability < 0.80: return "High"
    else: return "Very High"

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models": {k: v.get('ready', False) for k, v in models_store.items()}
    }), 200

@app.route("/features", methods=["GET"])
@app.route("/features/<disaster>", methods=["GET"])
def features(disaster="flood"):
    if disaster not in models_store or not models_store[disaster].get('ready'):
        return jsonify({"error": f"Model for {disaster} not loaded"}), 404
    
    feats = models_store[disaster]['features']
    return jsonify({
        "feature_count": len(feats),
        "features": feats
    }), 200

@app.route("/predict", methods=["POST"])
@app.route("/predict/<disaster>", methods=["POST"])
def predict(disaster="flood"):
    if disaster not in models_store or not models_store[disaster].get('ready'):
        return jsonify({"error": f"Model for {disaster} not loaded"}), 404

    payload = request.get_json(silent=True)
    if not payload: return jsonify({"error": "Request body must be valid JSON."}), 400

    model = models_store[disaster]['model']
    scaler = models_store[disaster]['scaler']
    feature_names = models_store[disaster]['features']

    try:
        # Array format 
        if "features" in payload:
            raw = payload["features"]
            if len(raw) != len(feature_names):
                return jsonify({"error": f"Expected {len(feature_names)} features, got {len(raw)}."}), 400
            input_arr = np.array(raw, dtype=float).reshape(1, -1)
            
        # Object format
        elif "data" in payload:
            data = payload["data"]
            if disaster == "flood":
                # Special flood engineering logic
                # Auto-fill missing base features (from our 5-feature simplified UI) with dataset average (5)
                for c in FEATURE_COLUMNS:
                    if c not in data:
                        data[c] = 5
                        
                missing_cols = [c for c in FEATURE_COLUMNS if c not in data]
                if missing_cols: return jsonify({"error": f"Missing feature: {missing_cols}"}), 400
                df_input = pd.DataFrame([{c: data[c] for c in FEATURE_COLUMNS}])
                df_input = _engineer_features(df_input)
                df_input = df_input[feature_names]
                input_arr = df_input.values.astype(float)
            else:
                missing_cols = [c for c in feature_names if c not in data]
                if missing_cols: return jsonify({"error": f"Missing feature: {missing_cols}"}), 400
                input_arr = np.array([float(data[c]) for c in feature_names]).reshape(1, -1)
        else:
            return jsonify({"error": "Provide either 'features' (array) or 'data' (named dict)."}), 400

        # Scale & predict
        scaled = scaler.transform(input_arr)
        prediction = int(model.predict(scaled)[0])
        probability = float(model.predict_proba(scaled)[0][1])
        risk_level = _risk_label(probability)

        return jsonify({
            "prediction": prediction,
            "probability": round(probability, 4),
            "risk_level": risk_level,
            "label": f"{disaster.capitalize()} Risk" if prediction == 1 else "No Risk"
        }), 200

    except Exception as e:
        log.exception("Unexpected error during prediction.")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    log.info("Starting Disaster Prediction API on http://127.0.0.1:%d", port)
    app.run(debug=True, host="127.0.0.1", port=port, use_reloader=False)

