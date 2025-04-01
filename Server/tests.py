import unittest
import os
import json
from unittest.mock import patch, MagicMock
from app import app

class FlaskMongoDBApiTestCase(unittest.TestCase):
    def setUp(self):
        """
        Set up the test client for the Flask application.
        Enables testing mode and prepares authorization headers.
        """
        self.app = app.test_client()
        self.app.testing = True
        self.headers = {"Authorization": f"Bearer {os.getenv('API_SECRET_TOKEN', 'your_secure_token_here')}"}
    
    # Get Request test cases
    @patch("app.interactions_local.find")  # Mock MongoDB find operation
    def test_get_interaction_data_by_player(self, mock_find):
        """
        Test retrieving interaction data for a specific player.
        """
        mock_find.return_value = [{"PlayerID": "123", "Action": "Jump"}]  # Simulate MongoDB query response
        
        response = self.app.get("/get-interaction-data/player/123", headers=self.headers)
        
        self.assertEqual(response.status_code, 200)  # Ensure request is successful
        self.assertIn("Interactions", response.json)  # Verify response contains expected key

    @patch("app.sessions_local.find")
    def test_get_session_data_by_session(self, mock_find):
        """
        Test retrieving session data by session ID.
        """
        mock_find.return_value = [{"SessionID": "abc123", "Duration": 3600}]
        
        response = self.app.get("/get-session-data/session/abc123", headers=self.headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.sessions_local.find")
    def test_get_session_data_by_game_version(self, mock_find):
        """
        Test retrieving session data filtered by game version.
        """
        mock_find.return_value = [{"Game Version": "1.0.0", "Players": 5}]
        
        response = self.app.get("/get-session-data/game-version/1.0.0", headers=self.headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.sessions_local.find")
    def test_get_session_data_by_session_name(self, mock_find):
        """
        Test retrieving session data filtered by session name.
        """
        mock_find.return_value = [{"Session Name": "TestSession", "Status": "Completed"}]
        
        response = self.app.get("/get-session-data/session-name/TestSession", headers=self.headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.interactions_local.find")
    @patch("app.positions_local.find")
    @patch("app.avg_fps_local.find")
    @patch("app.sessions_local.find")
    def test_get_data_by_timeframe(self, mock_sessions, mock_avg_fps, mock_positions, mock_interactions):
        """
        Test retrieving all data within a specific timeframe.
        """
        mock_interactions.return_value = [{"Timestamp": "2025-03-01T12:00:00Z", "Action": "Move"}]
        mock_positions.return_value = [{"Timestamp": "2025-03-01T12:00:00Z", "X": 100, "Y": 200}]
        mock_avg_fps.return_value = [{"Timestamp": "2025-03-01T12:00:00Z", "FPS": 60}]
        mock_sessions.return_value = [{"Timestamp": "2025-03-01T12:00:00Z", "SessionID": "xyz456"}]
        
        response = self.app.get("/get-data/timeframe?start_time=2025-03-01T00:00:00Z&end_time=2025-03-02T00:00:00Z", headers=self.headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Interactions", response.json)
        self.assertIn("Positions", response.json)
        self.assertIn("AVG FPS", response.json)
        self.assertIn("Sessions", response.json)
    
    @patch("app.interactions_local.find")
    @patch("app.sessions_local.find")
    def test_get_all_player_ids(self, mock_sessions, mock_interactions):
        """
        Test retrieving all unique PlayerIDs from the database.
        """
        # Mock data for PlayerIDs
        mock_interactions.return_value = [{"PlayerID": "123"}, {"PlayerID": "456"}]
        mock_sessions.return_value = [{"PlayerID": "123"}, {"PlayerID": "789"}]
        
        response = self.app.get("/get-player-ids", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        player_ids = response.json.get("PlayerIDs")
        
        # Check if the PlayerIDs are correct (should be unique)
        self.assertEqual(set(player_ids), {"123", "456", "789"})

    
    # Post Request test cases
    @patch("app.interactions_local.insert_many")
    @patch("app.positions_local.insert_many")
    @patch("app.avg_fps_local.insert_many")
    @patch("app.sessions_local.insert_many")
    def test_add_data(self, mock_sessions, mock_avg_fps, mock_positions, mock_interactions):
        """
        Test adding new data via POST request.
        Mocks MongoDB insert operations to simulate database behavior.
        """
        mock_interactions.return_value = MagicMock()
        mock_positions.return_value = MagicMock()
        mock_avg_fps.return_value = MagicMock()
        mock_sessions.return_value = MagicMock()

        # Sample data payload
        test_data = {
            "Interactions": [{"PlayerID": "123", "Action": "Jump"}],
            "Positions": [{"PlayerID": "123", "X": 10, "Y": 5}],
            "AVG FPS": [{"PlayerID": "123", "FPS": 60}],
            "Sessions": [{"SessionID": "ABC123", "PlayerID": "123"}]
        }

        response = self.app.post("/add-data", data=json.dumps(test_data), content_type="application/json", headers=self.headers)
        
        self.assertEqual(response.status_code, 201)  # Ensure successful creation
        self.assertIn("Data added successfully", response.get_json()["message"])

    def test_add_data_unauthorized(self):
        """
        Test unauthorized POST request (missing authorization token).
        """
        test_data = {"Interactions": [{"PlayerID": "123", "Action": "Jump"}]}
        
        response = self.app.post("/add-data", data=json.dumps(test_data), content_type="application/json")
        
        self.assertEqual(response.status_code, 401)  # Expect unauthorized access
        self.assertIn("Unauthorized", response.get_json()["error"])

if __name__ == "__main__":
    unittest.main()