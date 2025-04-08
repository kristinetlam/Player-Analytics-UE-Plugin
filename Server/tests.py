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

    # POST Request test cases
    @patch("app.interactions_local.insert_many")
    @patch("app.positions_local.insert_many")
    @patch("app.avg_fps_local.insert_many")
    @patch("app.sessions_local.insert_many")
    @patch("app.computer_specs_local.insert_many")
    def test_add_data(self, mock_computer_specs, mock_sessions, mock_avg_fps, mock_positions, mock_interactions):
        """
        Test adding new data via POST request.
        Mocks MongoDB insert operations to simulate database behavior.
        """
        mock_interactions.return_value = MagicMock()
        mock_positions.return_value = MagicMock()
        mock_avg_fps.return_value = MagicMock()
        mock_sessions.return_value = MagicMock()
        mock_computer_specs.return_value = MagicMock()

        # Sample data payload
        test_data = {
            "Interactions": [{"PlayerID": "123", "Action": "Jump"}],
            "Positions": [{"PlayerID": "123", "X": 10, "Y": 5}],
            "AVG FPS": [{"PlayerID": "123", "FPS": 60}],
            "Sessions": [{"SessionID": "ABC123", "PlayerID": "123"}],
            "Computer Specifications": [{"PlayerID": "123", "OS": "Windows"}]
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

    # GET Request test cases
    @patch("app.interactions_local.find")
    def test_get_interaction_data(self, mock_find):
        """
        Test retrieving interaction data.
        """
        mock_find.return_value = [{"PlayerID": "123", "Action": "Jump"}]

        response = self.app.get("/get-interaction-data", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Interactions", response.json)

    @patch("app.positions_local.find")
    def test_get_position_data(self, mock_find):
        """
        Test retrieving position data.
        """
        mock_find.return_value = [{"PlayerID": "123", "X": 10, "Y": 5}]

        response = self.app.get("/get-position-data", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Positions", response.json)

    @patch("app.avg_fps_local.find")
    def test_get_avg_fps_data(self, mock_find):
        """
        Test retrieving average FPS data.
        """
        mock_find.return_value = [{"PlayerID": "123", "FPS": 60}]

        response = self.app.get("/get-avg-fps-data", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("AVG FPS", response.json)

    @patch("app.sessions_local.find")
    def test_get_session_data(self, mock_find):
        """
        Test retrieving session data.
        """
        mock_find.return_value = [{"SessionID": "abc123", "PlayerID": "123"}]

        response = self.app.get("/get-session-data", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.computer_specs_local.find")
    def test_get_computer_specs(self, mock_find):
        """
        Test retrieving computer specs data.
        """
        mock_find.return_value = [{"PlayerID": "123", "OS": "Windows"}]

        response = self.app.get("/get-computer-specs", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Computer Specifications", response.json)

    # Test with specific query parameters for getting data by player or session
    @patch("app.interactions_local.find")
    def test_get_data_by_player(self, mock_find):
        """
        Test retrieving interaction data by player.
        """
        mock_find.return_value = [{"PlayerID": "123", "Action": "Jump"}]

        response = self.app.get("/get-data/player/123", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Interactions", response.json)

    @patch("app.sessions_local.find")
    def test_get_data_by_session(self, mock_find):
        """
        Test retrieving session data by session ID.
        """
        mock_find.return_value = [{"SessionID": "abc123", "PlayerID": "123"}]

        response = self.app.get("/get-data/session-version/abc123", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.sessions_local.find")
    def test_get_data_by_game_version(self, mock_find):
        """
        Test retrieving session data filtered by game version.
        """
        mock_find.return_value = [{"Game Version": "1.0.0", "Players": 5}]

        response = self.app.get("/get-data/game-version/1.0.0", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.sessions_local.find")
    def test_get_data_by_timeframe(self, mock_find):
        """
        Test retrieving all data within a specific timeframe.
        """
        mock_find.return_value = [{"Timestamp": "2025-03-01T12:00:00Z", "SessionID": "xyz456"}]

        response = self.app.get("/get-data/timeframe?start_time=2025-03-01T00:00:00Z&end_time=2025-03-02T00:00:00Z", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("Sessions", response.json)

    @patch("app.sessions_local.find")
    @patch("app.interactions_local.find")
    def test_get_all_player_ids(self, mock_interactions, mock_sessions):
        """
        Test retrieving all unique PlayerIDs from the database.
        """
        mock_interactions.return_value = [{"PlayerID": "123"}, {"PlayerID": "456"}]
        mock_sessions.return_value = [{"PlayerID": "123"}, {"PlayerID": "789"}]

        response = self.app.get("/get-player-ids", headers=self.headers)

        self.assertEqual(response.status_code, 200)
        player_ids = response.json.get("PlayerIDs")

        # Check if the PlayerIDs are correct (should be unique)
        self.assertEqual(set(player_ids), {"123", "456", "789"})

    def test_get_data_unauthorized(self):
        """
        Test unauthorized GET request (missing authorization token).
        """
        response = self.app.get("/get-interaction-data")

        self.assertEqual(response.status_code, 401)  # Expect unauthorized access
        self.assertIn("Unauthorized", response.get_json()["error"])


if __name__ == "__main__":
    unittest.main()
