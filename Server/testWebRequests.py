import requests
import json

API_URL = "http://localhost:5000/get-moment-data"
API_TOKEN = "your_secure_token_here"  # Replace with your actual token

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def test_get_all_moments():
    print("=== Test: Get all moments ===")
    resp = requests.get(API_URL, headers=HEADERS)
    data = resp.json()
    assert "Moments" in data, "Missing 'Moments' key"
    print("✓ Retrieved", len(data["Moments"]), "moments\n")

def test_filtered_moments():
    print("=== Test: Filtered by PlayerID and SessionID ===")
    params = {
        "player_id": "1520b9137c371146d5a16d060a782d45",
        "session_id": "70F23DDE-483D-98C1-5801-9681EBF161C3"
    }
    resp = requests.get(API_URL, headers=HEADERS, params=params)
    data = resp.json()
    assert "Moments" in data, "Missing 'Moments' key"
    print("✓ Returned", len(data["Moments"]), "results\n")

def test_field_projection():
    print("=== Test: Field Projection ===")
    params = {
        "player_id": "1520b9137c371146d5a16d060a782d45",
        "fields": ["Position", "FPS"]
    }
    resp = requests.get(API_URL, headers=HEADERS, params=params)
    data = resp.json()
    assert "Moments" in data, "Missing 'Moments' key"
    for doc in data["Moments"]:
        assert "Position" in doc and "FPS" in doc, "Missing fields in result"
    print("✓ Projection fields are present\n")

def test_sorting_by_timestamp_desc():
    print("=== Test: Sort by Timestamp DESC ===")
    params = {
        "player_id": "1520b9137c371146d5a16d060a782d45",
        "fields": ["Timestamp"],
        "sort_by": "Timestamp",
        "sort_order": "desc"
    }
    resp = requests.get(API_URL, headers=HEADERS, params=params)
    data = resp.json()
    assert "Moments" in data, "Missing 'Moments' key"
    timestamps = [doc["Timestamp"] for doc in data["Moments"]]
    assert timestamps == sorted(timestamps, reverse=True), "Timestamps not in descending order"
    print("✓ Sorted correctly in descending order\n")

def test_date_range_and_fields():
    print("=== Test: Date Range + Field Filter ===")
    params = {
        "start_time": "2025-04-15",
        "end_time": "2025-04-15",
        "fields": ["RAM", "CPU"],
        "sort_by": "CPU",
        "sort_order": "asc"
    }
    resp = requests.get(API_URL, headers=HEADERS, params=params)
    data = resp.json()
    assert "Moments" in data, "Missing 'Moments' key"
    for doc in data["Moments"]:
        assert "RAM" in doc and "CPU" in doc, "Missing expected fields"
    print("✓ Filtered by date and returned CPU/RAM sorted ascending\n")

if __name__ == "__main__":
    try:
        test_get_all_moments()
        test_filtered_moments()
        test_field_projection()
        test_sorting_by_timestamp_desc()
        test_date_range_and_fields()
        print("✅ All tests passed.")
    except AssertionError as e:
        print("❌ Test failed:", str(e))
    except requests.RequestException as e:
        print("❌ Request error:", str(e))
