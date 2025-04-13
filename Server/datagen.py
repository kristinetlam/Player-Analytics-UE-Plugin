import random
from datetime import datetime, timedelta
from pymongo import MongoClient

# MongoDB Local Connection
MONGO_LOCAL_URI = "mongodb://localhost:27017/"

# Connect to Local MongoDB
client_local = MongoClient(MONGO_LOCAL_URI)
db_local = client_local.PlayerAnalytics
collection = db_local.sessions

# Clear old dummy data (optional, for clean testing)
collection.delete_many({"DummyData": True})

# Config
player_ids = [f"user_{i:03d}" for i in range(1, 6)]
versions = ["1.0.0", "1.1.0", "2.0.0"]
start_date = datetime(2025, 4, 1)
days_to_generate = 10
sessions_per_day = 5

def generate_timestamp(date, offset_minutes=0):
    dt = date + timedelta(minutes=offset_minutes)
    return dt.strftime("%Y.%m.%d-%H.%M.%S")

# Generate sessions
session_docs = []
for day_offset in range(days_to_generate):
    base_date = start_date + timedelta(days=day_offset)
    for _ in range(sessions_per_day):
        player_id = random.choice(player_ids)
        game_version = random.choice(versions)
        start_offset = random.randint(0, 720)  # up to 12 hours
        session_length = round(random.uniform(2.0, 20.0), 6)

        timestamp = generate_timestamp(base_date, offset_minutes=start_offset)

        session = {
            "PlayerID": player_id,
            "Game Version": game_version,
            "SessionID": f"SESSION-{random.randint(1000, 9999)}",
            "StartTime": "0.0",
            "EndTime": str(session_length),
            "EndType": "Exit",
            "Timestamp": timestamp,
            "DummyData": True  # tag to allow easy cleanup
        }
        session_docs.append(session)

# Insert into MongoDB
result = collection.insert_many(session_docs)
print(f"Inserted {len(result.inserted_ids)} dummy session documents.")
