import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://main.d30w2b6tekn5z0.amplifyapp.com"]}})


# Secret token (store securely in an environment variable)
SECRET_TOKEN = os.getenv("API_SECRET_TOKEN", "your_secure_token_here")

# MongoDB Local Connection
MONGO_LOCAL_URI = "mongodb://localhost:27017/"

# Connect to Local MongoDB
client_local = MongoClient(MONGO_LOCAL_URI)
db_local = client_local.PlayerAnalytics
interactions_local = db_local.interactions 
inventories_local = db_local.inventories
positions_local = db_local.positions
avg_fps_local = db_local.avg_fps
ram_local = db_local.ram
cpu_local = db_local.cpu
sessions_local = db_local.sessions
computer_specs_local = db_local.computer_specs

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
        
        # Insert Inventories
        if "Inventories" in data:
            try:
                inventories_local.insert_many(data["Inventories"])
                print("Inserted Inventories successfully.")
            except Exception as e:
                print("Error inserting Inventories:", str(e))

        # Insert Positions
        if "Positions" in data:
            try:
                positions_local.insert_many(data["Positions"])
                print("Inserted Positions successfully.")
            except Exception as e:
                print("Error inserting positions:", str(e))

        # Insert AVG FPS
        if "FPS (Frames Per Second)" in data:
            try:
                avg_fps_local.insert_many(data["FPS (Frames Per Second)"])
                print("Inserted AVG FPS successfully.")
            except Exception as e:
                print("Error inserting AVG FPS:", str(e))
                
        # Insert RAM
        if "RAM Usage" in data:
            try:
                ram_local.insert_many(data["RAM Usage"])
                print("Inserted Ram Usage successfully.")
            except Exception as e:
                print("Error inserting Ram Usage:", str(e))
        
        # Insert CPU
        if "CPU Usage" in data:
            try:
                cpu_local.insert_many(data["CPU Usage"])
                print("Inserted CPU Usage successfully.")
            except Exception as e:
                print("Error inserting CPU Usage:", str(e))

        # Insert Sessions
        if "Sessions" in data:
            try:
                sessions_local.insert_many(data["Sessions"])
                print("Inserted Sessions successfully.")
            except Exception as e:
                print("Error inserting sessions:", str(e))
                
        # Insert Computer Specifications
        if "Computer Specifications" in data:
            computer_specs_local.insert_many(data["Computer Specifications"])

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
        specs = list(computer_specs_local.find({}, {"_id": 0}))

        return jsonify({
            "Interactions": interactions, 
            "Positions": positions,
            "AVG FPS": avg_fps,
            "Sessions": sessions,
            "Computer Specifications": specs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-interaction-data", methods=["GET"])
def get_interaction_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}
        player_id = request.args.get("player_id")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        if player_id:
            query["PlayerID"] = player_id
        if game_version:
            query["Game Version"] = game_version
        if start_time and end_time:
            query["Timestamp"] = {
                "$gte": f"{start_time.replace('-', '.')}-00.00.00",
                "$lte": f"{end_time.replace('-', '.')}-23.59.59"
            }

        print("Interaction Query:", query)
        interactions = list(interactions_local.find(query, {"_id": 0}))

        return jsonify({"Interactions": interactions}), 200

    except Exception as e:
        print("Error fetching interaction data:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/get-position-data", methods=["GET"])
def get_position_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        if player_id:
            query["PlayerID"] = player_id

        if game_version:
            query["Game Version"] = game_version

        if start_time and end_time:
            # Adjust if your Timestamp format is not ISO (example: "2025.03.20-12.00.00")
            query["Timestamp"] = {
                "$gte": f"{start_time.replace('-', '.')}-00.00.00",
                "$lte": f"{end_time.replace('-', '.')}-23.59.59",
            }

        print("Avg FPS query:", query)  # Debug line
        positions = list(positions_local.find(query, {"_id": 0}))

        return jsonify({"Positions": positions}), 200
    except Exception as e:
        return jsonify({"error fetching Position: ": str(e)}), 500


@app.route("/get-avg-fps-data", methods=["GET"])
def get_avg_fps_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        if player_id:
            query["PlayerID"] = player_id

        if game_version:
            query["Game Version"] = game_version

        if start_time and end_time:
            # Adjust if your Timestamp format is not ISO (example: "2025.03.20-12.00.00")
            query["Timestamp"] = {
                "$gte": f"{start_time.replace('-', '.')}-00.00.00",
                "$lte": f"{end_time.replace('-', '.')}-23.59.59",
            }

        print("Avg FPS query:", query)  # Debug line
        fps_docs = list(avg_fps_local.find(query, {"_id": 0}))

        return jsonify({"AVG FPS": fps_docs}), 200

    except Exception as e:
        print("Error fetching AVG FPS:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/get-session-data", methods=["GET"])
def get_session_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        # Log all query parameters for debugging
        player_id = request.args.get("player_id")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        print("Received parameters:", {
            "player_id": player_id,
            "game_version": game_version,
            "start_time": start_time,
            "end_time": end_time,
        })

        if player_id:
            query["PlayerID"] = player_id

        if game_version:
            query["Game Version"] = game_version

        if start_time and end_time:
            start_key = start_time.replace('-', '.').strip()
            end_key = end_time.replace('-', '.').strip()

            query["Timestamp"] = {
                "$gte": f"{start_key}-00.00.00",
                "$lte": f"{end_key}-23.59.59",
            }

        print("Session Query:", query)
        sessions = list(sessions_local.find(query, {"_id": 0}))
        print(f"Found {len(sessions)} sessions")

        return jsonify({"Sessions": sessions}), 200

    except Exception as e:
        print("Error fetching session data:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/get-cpu-data", methods=["GET"])
def get_cpu_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        if player_id:
            query["PlayerID"] = player_id

        if game_version:
            query["Game Version"] = game_version

        if start_time and end_time:
            # Adjust if your Timestamp format is not ISO (example: "2025.03.20-12.00.00")
            query["Timestamp"] = {
                "$gte": f"{start_time.replace('-', '.')}-00.00.00",
                "$lte": f"{end_time.replace('-', '.')}-23.59.59",
            }

        print("CPU query:", query)  # Debug line
        cpu_docs = list(cpu_local.find(query, {"_id": 0}))

        return jsonify({"CPU": cpu_docs}), 200

    except Exception as e:
        print("Error fetching CPU Usage:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-ram-data", methods=["GET"])
def get_ram_data():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        if player_id:
            query["PlayerID"] = player_id

        if game_version:
            query["Game Version"] = game_version

        if start_time and end_time:
            # Adjust if your Timestamp format is not ISO (example: "2025.03.20-12.00.00")
            query["Timestamp"] = {
                "$gte": f"{start_time.replace('-', '.')}-00.00.00",
                "$lte": f"{end_time.replace('-', '.')}-23.59.59",
            }

        print("ram query:", query)  # Debug line
        ram_docs = list(ram_local.find(query, {"_id": 0}))

        return jsonify({"ram": ram_docs}), 200

    except Exception as e:
        print("Error fetching RAM Usage:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-computer-specs-raw", methods=["GET"])
def get_computer_specs_raw():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        specs = list(computer_specs_local.find({}, {"_id": 0}))
        return jsonify({"Computer Specifications": specs}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-data/player/<player_id>", methods=["GET"])
def get_interaction_data_by_player(player_id):
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        interactions = list(interactions_local.find({"PlayerID": player_id}, {"_id": 0}))
        positions = list(positions_local.find({"PlayerID": player_id}, {"_id": 0}))
        avg_fps = list(avg_fps_local.find({"PlayerID": player_id}, {"_id": 0}))
        sessions = list(sessions_local.find({"PlayerID": player_id}, {"_id": 0}))
        specs = list(computer_specs_local.find({"PlayerID": player_id}, {"_id": 0}))
        ram = list(ram_local.find({"PlayerID": player_id}, {"_id": 0}))
        cpu = list(cpu_local.find({"PlayerID": player_id}, {"_id": 0}))
        
        return jsonify({
            "Interactions": interactions, 
            "Positions": positions,
            "AVG FPS": avg_fps,
            "Sessions": sessions,
            "Computer Specifications": specs,
            "Ram Usage": ram,
            "CPU Usage": cpu
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-data/session-version/<session_id>", methods=["GET"])
def get_session_data_by_session(session_id):
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        interactions = list(interactions_local.find({"SessionID": session_id}, {"_id": 0}))
        positions = list(positions_local.find({"SessionID": session_id}, {"_id": 0}))
        avg_fps = list(avg_fps_local.find({"SessionID": session_id}, {"_id": 0}))
        sessions = list(sessions_local.find({"SessionID": session_id}, {"_id": 0}))
        specs = list(computer_specs_local.find({"SessionID": session_id}, {"_id": 0}))
        
        return jsonify({
            "Interactions": interactions, 
            "Positions": positions,
            "AVG FPS": avg_fps,
            "Sessions": sessions,
            "Computer Specifications": specs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-data/game-version/<game_version>", methods=["GET"])
def get_session_data_by_game_version(game_version):
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        interactions = list(interactions_local.find({"Game Version": game_version}, {"_id": 0}))
        positions = list(positions_local.find({"Game Version": game_version}, {"_id": 0}))
        avg_fps = list(avg_fps_local.find({"Game Version": game_version}, {"_id": 0}))
        sessions = list(sessions_local.find({"Game Version": game_version}, {"_id": 0}))
        specs = list(computer_specs_local.find({"Game Version": game_version}, {"_id": 0}))

        return jsonify({
            "Interactions": interactions, 
            "Positions": positions,
            "AVG FPS": avg_fps,
            "Sessions": sessions,
            "Computer Specifications": specs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-data/timeframe", methods=["GET"])
def get_data_by_timeframe():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        query = {"Timestamp": {"$gte": start_time, "$lte": end_time}}

        interactions = list(interactions_local.find(query, {"_id": 0}))
        positions = list(positions_local.find(query, {"_id": 0}))
        avg_fps = list(avg_fps_local.find(query, {"_id": 0}))
        sessions = list(sessions_local.find(query, {"_id": 0}))
        specs = list(computer_specs_local.find(query, {"_id": 0}))

        return jsonify({
            "Interactions": interactions, 
            "Positions": positions,
            "AVG FPS": avg_fps,
            "Sessions": sessions,
            "Computer Specifications": specs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-player-ids", methods=["GET"])
def get_player_ids():
    """
    Endpoint to retrieve all unique PlayerIDs from the database.
    """
    # Query the collections for PlayerID
    player_ids = set()

    # Extract PlayerIDs from interactions
    interactions = interactions_local.find({}, {"PlayerID": 1})
    for interaction in interactions:
        player_ids.add(interaction.get("PlayerID"))

    # Extract PlayerIDs from sessions
    sessions = sessions_local.find({}, {"PlayerID": 1})
    for session in sessions:
        player_ids.add(session.get("PlayerID"))

    # Return the unique PlayerIDs as a JSON response
    return jsonify({"PlayerIDs": list(player_ids)}), 200

@app.route("/get-game-versions", methods=["GET"])
def get_game_versions():
    """Retrieve all unique Game Versions from the sessions collection."""
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        versions = sessions_local.distinct("Game Version")
        return jsonify({"GameVersions": versions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-gpu-player-groups", methods=["GET"])
def get_gpu_player_groups():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Group by GPUName and count distinct PlayerIDs
        pipeline = [
            {"$group": {
                "_id": "$GPUName",
                "players": {"$addToSet": "$PlayerID"}
            }},
            {"$project": {
                "name": "$_id",
                "playerCount": {"$size": "$players"},
                "_id": 0
            }}
        ]
        result = list(computer_specs_local.aggregate(pipeline))
        return jsonify({"GPUPlayerGroups": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-computer-specs", methods=["GET"])
def get_computer_specs():
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        specs = list(computer_specs_local.find({}, {"GPUName": 1, "GPUBrand": 1, "_id": 0}))
        gpu_names = list({spec["GPUName"] for spec in specs if "GPUName" in spec})
        gpu_brands = list({spec["GPUBrand"] for spec in specs if "GPUBrand" in spec})
        return jsonify({"GPUBrands": gpu_brands, "GPUNames": gpu_names}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
