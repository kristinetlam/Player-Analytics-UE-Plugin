from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
from bson.objectid import ObjectId

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI if needed
db = client.PlayerAnalytics  # Use the "PlayerAnalytics" database
collection = db.players  # Use the "players" collection

@app.route("/add-player", methods=["POST"])
def add_player():
    try:
        # Get JSON data from the request
        data = request.json

        # Validate required fields
        required_fields = ["PlayerID", "VersionID", "Timestamp", "SessionID"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Convert Timestamp to a datetime object
        data["Timestamp"] = datetime.fromisoformat(data["Timestamp"])

        # Insert the document into the collection
        result = collection.insert_one(data)

        # Return the inserted document ID
        return jsonify({
            "message": "Player added successfully",
            "inserted_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-players", methods=["GET"])
def get_players():
    try:
        # Retrieve all players from the collection
        players = list(collection.find())

        # Convert ObjectId to string for JSON serialization
        for player in players:
            player["_id"] = str(player["_id"])

        return jsonify(players), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 