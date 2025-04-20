import json
from flask import Flask, request, jsonify
from pymongo import MongoClient, ASCENDING, DESCENDING
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
moments_local = db_local.moments

def verify_token():
    """
    Checks if the request has a valid authentication token.
    
    Returns:
        bool: True if the token is valid, False otherwise
    """
    token = request.headers.get("Authorization")
    return token == f"Bearer {SECRET_TOKEN}"

@app.route("/add-data", methods=["POST"])
def add_data():
    """
    Endpoint to add various types of game analytics data to the database.
    
    Expected JSON data structure should contain one or more of these keys:
    - Interactions: List of player interaction events
    - Inventories: List of player inventory snapshots
    - Positions: List of player position data points
    - FPS (Frames Per Second): List of FPS measurements
    - RAM Usage: List of RAM usage measurements
    - CPU Usage: List of CPU usage measurements
    - Sessions: List of player session data
    - Computer Specifications: List of player computer specs
    - moments: List of gameplay moment data
    
    Returns:
        JSON response with success message or error details
        
    Status codes:
        201: Data added successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
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
            try:
                computer_specs_local.insert_many(data["Computer Specifications"])
                print("Inserted Computer Specifications successfully.")
            except Exception as e:
                print("Error inserting Computer Specifications:", str(e))
            
        # Insert Moments
        if "moments" in data:
            try:
                moments_local.insert_many(data["moments"])
                print("Inserted Moments successfully.")
            except Exception as e:
                print("Error inserting Moments:", str(e))

        return jsonify({"message": "Data added successfully"}), 201

    except Exception as e:
        print("General Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/get-data", methods=["GET"])
def get_data():
    """
    Endpoint to retrieve comprehensive analytics data from all collections.
    
    Returns:
        JSON containing data from multiple collections:
        - Interactions: Player interaction events
        - Positions: Player position data
        - AVG FPS: Performance metrics
        - Sessions: Session information
        - Computer Specifications: Hardware information
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
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
    """
    Endpoint to retrieve filtered player interaction data.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
    
    Returns:
        JSON with filtered interaction data under "Interactions" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
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

        print("Interaction Query:", query)
        interactions = list(interactions_local.find(query, {"_id": 0}))

        return jsonify({"Interactions": interactions}), 200

    except Exception as e:
        print("Error fetching interaction data:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/get-position-data", methods=["GET"])
def get_position_data():
    """
    Endpoint to retrieve filtered player position data.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
    
    Returns:
        JSON with filtered position data under "Positions" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
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

        print("Position query:", query)  # Debug line
        positions = list(positions_local.find(query, {"_id": 0}))

        return jsonify({"Positions": positions}), 200
    except Exception as e:
        return jsonify({"error fetching Position: ": str(e)}), 500


@app.route("/get-avg-fps-data", methods=["GET"])
def get_avg_fps_data():
    """
    Endpoint to retrieve filtered FPS (Frames Per Second) data.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
    
    Returns:
        JSON with filtered FPS data under "AVG FPS" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
            query["PlayerID"] = player_id

        if game_version:
            query["Game Version"] = game_version

        if start_time and end_time:
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
    """
    Endpoint to retrieve filtered player session data.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
    
    Returns:
        JSON with filtered session data under "Sessions" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
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
    """
    Endpoint to retrieve filtered CPU usage data.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
    
    Returns:
        JSON with filtered CPU usage data under "CPU" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
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
    """
    Endpoint to retrieve filtered RAM usage data.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
    
    Returns:
        JSON with filtered RAM usage data under "ram" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
            query["PlayerID"] = player_id

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
    """
    Endpoint to retrieve raw computer specification data without filtering.
    
    Returns:
        JSON with all computer specification data under "Computer Specifications" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        specs = list(computer_specs_local.find({}, {"_id": 0}))
        return jsonify({"Computer Specifications": specs}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-player-ids", methods=["GET"])
def get_player_ids():
    """
    Endpoint to retrieve all unique PlayerIDs from the database.
    
    Returns:
        JSON with a list of unique player IDs under "PlayerIDs" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token) - implicit from other code paths
        500: Server error - implicit from other code paths
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401
        
    try:
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-game-versions", methods=["GET"])
def get_game_versions():
    """
    Endpoint to retrieve all unique Game Versions from the sessions collection.
    
    Returns:
        JSON with a list of unique game versions under "GameVersions" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        versions = sessions_local.distinct("Game Version")
        return jsonify({"GameVersions": versions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-gpu-groups", methods=["GET"])
def get_gpu_groups():
    """
    Endpoint to retrieve GPU information grouped by GPU name with associated player IDs.
    
    Returns:
        JSON with GPU groups data under "GPUGroups" key, including:
        - gpuName: The name of the GPU
        - playerIds: List of player IDs using this GPU
        - count: Number of players using this GPU
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Group by GPUName and collect associated PlayerIDs
        pipeline = [
            {"$group": {
                "_id": "$GPUName",
                "playerIds": {"$addToSet": "$PlayerID"},
                "count": {"$sum": 1}
            }},
            {"$project": {
                "gpuName": "$_id",
                "playerIds": 1,
                "count": 1,
                "_id": 0
            }},
            {"$sort": {"count": -1}}  # Sort by popularity
        ]
        
        result = list(computer_specs_local.aggregate(pipeline))
        return jsonify({"GPUGroups": result}), 200
    except Exception as e:
        print("Error fetching GPU groups:", str(e))
        return jsonify({"error": str(e)}), 500

def get_player_ids_by_gpu(gpu_name):
    """
    Helper function to get player IDs associated with a specific GPU.
    
    Args:
        gpu_name (str): The name of the GPU to filter by
        
    Returns:
        list: List of player IDs that use the specified GPU
    """
    try:
        players = list(computer_specs_local.find({"GPUName": gpu_name}, {"PlayerID": 1, "_id": 0}))
        return [p["PlayerID"] for p in players]
    except Exception as e:
        print(f"Error getting player IDs for GPU {gpu_name}: {str(e)}")
        return []

@app.route("/get-computer-specs", methods=["GET"])
def get_computer_specs():
    """
    Endpoint to retrieve unique GPU names and brands from computer specifications.
    
    Returns:
        JSON with two lists:
        - GPUBrands: List of unique GPU brands
        - GPUNames: List of unique GPU names
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        specs = list(computer_specs_local.find({}, {"GPUName": 1, "GPUBrand": 1, "_id": 0}))
        gpu_names = list({spec["GPUName"] for spec in specs if "GPUName" in spec})
        gpu_brands = list({spec["GPUBrand"] for spec in specs if "GPUBrand" in spec})
        return jsonify({"GPUBrands": gpu_brands, "GPUNames": gpu_names}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-moment-data", methods=["GET"])
def get_moment_data():
    """
    Endpoint to retrieve filtered gameplay moment data with flexible query options.
    
    Query Parameters:
        player_id (str, optional): Filter by specific player ID
        session_id (str, optional): Filter by specific session ID
        gpu_group (str, optional): Filter by GPU group/name
        game_version (str, optional): Filter by game version
        start_time (str, optional): Start timestamp (YYYY-MM-DD format)
        end_time (str, optional): End timestamp (YYYY-MM-DD format)
        fields (list, optional): Multiple fields to include in projection
        sort_by (str, optional): Field name to sort by (e.g., Timestamp, FPS)
        sort_order (str, optional): Either 'asc' (default) or 'desc' for sort direction
    
    Returns:
        JSON with filtered moment data under "Moments" key
        
    Status codes:
        200: Data retrieved successfully
        401: Unauthorized (invalid token)
        500: Server error
    """
    if not verify_token():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        query = {}

        player_id = request.args.get("player_id")
        gpu_group = request.args.get("gpu_group")
        game_version = request.args.get("game_version")
        session_id = request.args.get("session_id")  # Fixed: was using player_id again
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")

        # If GPU group is specified, get associated player IDs
        if gpu_group and not player_id:  # Only use GPU filtering if no specific player is selected
            player_ids = get_player_ids_by_gpu(gpu_group)
            if player_ids:
                query["PlayerID"] = {"$in": player_ids}
        elif player_id:
            query["PlayerID"] = player_id
        projection = {"_id": 0}

        fields = request.args.getlist("fields")

        # Sorting
        sort_by = request.args.get("sort_by")  # e.g., "Timestamp"
        sort_order = request.args.get("sort_order", "asc").lower()  # "asc" or "desc"
        sort_direction = ASCENDING if sort_order == "asc" else DESCENDING

        if session_id:
            query["SessionID"] = session_id
        if game_version:
            query["GameVersion"] = game_version
        if start_time and end_time:
            query["Timestamp"] = {
                "$gte": f"{start_time.replace('-', '.')}-00.00.00",
                "$lte": f"{end_time.replace('-', '.')}-23.59.59",
            }

        if fields:
            for field in fields:
                projection[field] = 1
            projection["Timestamp"] = 1  # Always include timestamp with field-based queries

        print("[DEBUG] Moment Query:", json.dumps(query, indent=2))
        print("[DEBUG] Projection:", projection)
        print("[DEBUG] Sorting:", sort_by, sort_order)

        cursor = db_local.moments.find(query, projection)

        if sort_by:
            cursor = cursor.sort(sort_by, sort_direction)

        moments = list(cursor)
        return jsonify({"Moments": moments}), 200

    except Exception as e:
        print("[ERROR] Failed to fetch moment data:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)