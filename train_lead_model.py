import pandas as pd
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import json

# --- Data Ingestion ---
def load_data(chat_log_path, crm_log_path):
    chat_logs = pd.read_json(chat_log_path)
    crm_logs = pd.read_json(crm_log_path)
    # Merge on lead/session id
    data = pd.merge(chat_logs, crm_logs, on='lead_id', how='inner')
    return data

# --- Feature Engineering ---
def prepare_features(data):
    # Example: intent, urgency, booking outcome, manual score
    data['intent_score'] = data['chat_text'].str.contains('buy|urgent|now|call', case=False).astype(int)
    data['booked'] = (data['outcome'] == 'booked').astype(int)
    X = data[['intent_score']]
    y = data['booked']
    return X, y

# --- Training ---
def train_lead_model(chat_logs_path, crm_log_path, model_out_path):
    data = load_data(chat_logs_path, crm_log_path)
    X, y = prepare_features(data)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    joblib.dump(model, model_out_path)
    return model, X_test, y_test

# --- Evaluation ---
def evaluate_model_accuracy(model, X_test, y_test):
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    return acc

# --- MLflow Logging ---
def log_model_to_mlflow(model, accuracy, model_out_path):
    with mlflow.start_run():
        mlflow.sklearn.log_model(model, "lead_scorer")
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_artifact(model_out_path)

if __name__ == "__main__":
    model, X_test, y_test = train_lead_model('chat_sessions.json', 'crm_log.json', 'models/lead_scorer_v1.pkl')
    acc = evaluate_model_accuracy(model, X_test, y_test)
    log_model_to_mlflow(model, acc, 'models/lead_scorer_v1.pkl')
    print(f"Model trained and logged with accuracy: {acc}") 