import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Secret token (store securely in an environment variable)
SECRET_TOKEN = os.getenv("API_SECRET_TOKEN", "your_secure_token_here")

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI if needed
db = client.PlayerAnalytics  # Use the "PlayerAnalytics" database
collection = db.players  # Use the "players" collection

def verify_token():
    """Checks if the request has a valid token."""
    token = request.headers.get("Authorization")
    if not token or token != f"Bearer {SECRET_TOKEN}":
        return False
    return True

def verify_required_fields(data, required_fields):
    """
    Recursively verifies that all required fields exist in the provided data.
    
    :param data: The JSON data (can be a dictionary or a list of dictionaries).
    :param required_fields: A dictionary defining required fields and possible nested structures.
    :return: None if valid, otherwise returns an error message.
    """
    for field, subfields in required_fields.items():
        if field not in data:
            return f"Missing required field: {field}"
        
        if isinstance(subfields, dict) and isinstance(data[field], list):
            for item in data[field]:
                error = verify_required_fields(item, subfields)
                if error:
                    return error
        elif isinstance(subfields, dict) and isinstance(data[field], dict):
            error = verify_required_fields(data[field], subfields)
            if error:
                return error
    return None 


@app.route("/add-player", methods=["POST"])
def add_player():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Get JSON data from the request
        data = request.json
        print(json.dumps(data, indent=4))
 
        # Define required fields
        required_fields = {
            "Interactions": {
                "Timestamp": {}  # Requires "Timestamp" in each interaction
            }
        }

        # Validate fields
        error_message = verify_required_fields(data, required_fields)
        if error_message:
            return jsonify({"error": error_message}), 400

        # Insert the document into the collection
        interactions_data = data["Interactions"]
        result = collection.insert_one({"Interactions": interactions_data})

        # Return the inserted document ID
        return jsonify({
            "message": "Player added successfully",
            "inserted_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-players", methods=["GET"])
def get_players():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Retrieve all players from the collection
        players = list(collection.find())

        # Convert ObjectId to string for JSON serialization
        for player in players:
            player["_id"] = str(player["_id"])

        return jsonify(players), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
