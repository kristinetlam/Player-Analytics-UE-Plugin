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

# MongoDB Atlas Connection String
# #MONGO_ATLAS_URI = os.getenv("MONGO_URI", "mongodb+srv://your_user:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority")

# Local MongoDB Connection
MONGO_LOCAL_URI = "mongodb://localhost:27017/"

# Connect to MongoDB Atlas
#client_atlas = MongoClient(MONGO_ATLAS_URI)
#db_atlas = client_atlas.PlayerAnalytics
#interactions_atlas = db_atlas.interactions  
#positions_atlas = db_atlas.positions  

# Connect to Local MongoDB
client_local = MongoClient(MONGO_LOCAL_URI)
db_local = client_local.PlayerAnalytics
interactions_local = db_local.interactions  
positions_local = db_local.positions  

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

        if "Interactions" in data:
            try:
                interactions_local.insert_many(data["Interactions"])
                print("Inserted Interactions successfully.")
            except Exception as e:
                print("Error inserting interactions:", str(e))

        if "Positions" in data:
            try:
                positions_local.insert_many(data["Positions"])
                print("Inserted Positions successfully.")
            except Exception as e:
                print("Error inserting positions:", str(e))

        return jsonify({"message": "Data added successfully"}), 201

    except Exception as e:
        print("General Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/get-data", methods=["GET"])
def get_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Retrieve data from MongoDB Atlas
        interactions = list(interactions_local.find({}, {"_id": 0}))  
        positions = list(positions_local.find({}, {"_id": 0}))

        return jsonify({"Interactions": interactions, "Positions": positions}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
