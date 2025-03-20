import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Secret token (store securely in an environment variable)
SECRET_TOKEN = os.getenv("API_SECRET_TOKEN", "your_secure_token_here")

# MongoDB Local Connection
MONGO_LOCAL_URI = "mongodb://localhost:27017/"

# Connect to Local MongoDB
client_local = MongoClient(MONGO_LOCAL_URI)
db_local = client_local.PlayerAnalytics
interactions_local = db_local.interactions  
positions_local = db_local.positions
avg_fps_local = db_local.avg_fps
sessions_local = db_local.sessions

def verify_token():
    """Checks if the request has a valid token."""
    token = request.headers.get("Authorization")
    return token == f"Bearer {SECRET_TOKEN}"

@app.route("/add-data", methods=["POST"])
def add_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.json
        print("Received data:", json.dumps(data, indent=4))

        # Insert Interactions
        if "Interactions" in data:
            try:
                interactions_local.insert_many(data["Interactions"])
                print("Inserted Interactions successfully.")
            except Exception as e:
                print("Error inserting interactions:", str(e))

        # Insert Positions
        if "Positions" in data:
            try:
                positions_local.insert_many(data["Positions"])
                print("Inserted Positions successfully.")
            except Exception as e:
                print("Error inserting positions:", str(e))

        # Insert AVG FPS
        if "AVG FPS" in data:
            try:
                avg_fps_local.insert_many(data["AVG FPS"])
                print("Inserted AVG FPS successfully.")
            except Exception as e:
                print("Error inserting AVG FPS:", str(e))

        # Insert Sessions
        if "Sessions" in data:
            try:
                sessions_local.insert_many(data["Sessions"])
                print("Inserted Sessions successfully.")
            except Exception as e:
                print("Error inserting sessions:", str(e))

        return jsonify({"message": "Data added successfully"}), 201

    except Exception as e:
        print("General Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/get-data", methods=["GET"])
def get_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Retrieve all data from MongoDB
        interactions = list(interactions_local.find({}, {"_id": 0}))
        positions = list(positions_local.find({}, {"_id": 0}))
        avg_fps = list(avg_fps_local.find({}, {"_id": 0}))
        sessions = list(sessions_local.find({}, {"_id": 0}))

        return jsonify({
            "Interactions": interactions, 
            "Positions": positions,
            "AVG FPS": avg_fps,
            "Sessions": sessions
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get-interaction-data", methods=["GET"])
def get_interaction_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        interactions = list(interactions_local.find({}, {"_id": 0}))
        return jsonify({"Interactions": interactions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get-position-data", methods=["GET"])
def get_position_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        positions = list(positions_local.find({}, {"_id": 0}))
        return jsonify({"Positions": positions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get-avg-fps-data", methods=["GET"])
def get_avg_fps_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        avg_fps = list(avg_fps_local.find({}, {"_id": 0}))
        return jsonify({"AVG FPS": avg_fps}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get-session-data", methods=["GET"])
def get_session_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        sessions = list(sessions_local.find({}, {"_id": 0}))
        return jsonify({"Sessions": sessions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
