import unittest
import json
import os
from logger import getJSONLogger
from email_client import EmailClient
from email_server import EmailServer

class TestLogger(unittest.TestCase):
    def setUp(self):
        self.log_file = 'app.log'
        self.logger = getJSONLogger("TestLogger")

    def tearDown(self):
        # Clean up the log file after each test
        if os.path.exists(self.log_file):
            os.remove(self.log_file)

    def test_log_creation(self):
        """Test if a log entry is correctly written to the log file."""
        self.logger.info("Test log entry")
        with open(self.log_file, "r") as file:
            content = file.read()
        self.assertIn("Test log entry", content)

    def test_json_logging(self):
        """Test logging of a JSON string."""
        data = {
            "to": "test@example.com",
            "subject": "Test Subject",
            "body": "This is a test email."
        }
        json_data = json.dumps(data)
        self.logger.info(json_data)
        with open(self.log_file, "r") as file:
            content = file.read()
        self.assertIn(json_data, content)

    def test_empty_log_message(self):
        """Test logging of an empty message."""
        self.logger.info("")
        with open(self.log_file, "r") as file:
            content = file.read()
        self.assertIn("[INFO] TestLogger: ", content)

    def test_special_characters_logging(self):
        """Test logging of a message with special characters."""
        message = "Special characters !@#$%^&*()"
        self.logger.info(message)
        with open(self.log_file, "r") as file:
            content = file.read()
        self.assertIn(message, content)

class TestEmailClient(unittest.TestCase):
    def setUp(self):
        with open("test_data.json") as f:
            self.test_data = json.load(f)
        self.client = EmailClient()

    def test_send_email(self):
        """Test sending an email with valid data."""
        data = self.test_data["email_client"]
        result = self.client.send_email(
            to=data["to"],
            subject=data["subject"],
            body=data["body"]
        )
        self.assertTrue(result)

    def test_send_email_missing_to(self):
        """Test sending an email with missing 'to' field."""
        data = self.test_data["email_client"]
        with self.assertRaises(ValueError):
            self.client.send_email(
                to=None,
                subject=data["subject"],
                body=data["body"]
            )

    def test_send_email_empty_subject(self):
        """Test sending an email with an empty subject."""
        data = self.test_data["email_client"]
        result = self.client.send_email(
            to=data["to"],
            subject="",
            body=data["body"]
        )
        self.assertTrue(result)

class TestEmailServer(unittest.TestCase):
    def setUp(self):
        with open("test_data.json") as f:
            self.test_data = json.load(f)
        self.server = EmailServer()

    def test_receive_email(self):
        """Test receiving an email with valid data."""
        data = self.test_data["email_server"]
        response = self.server.receive_email(data)
        self.assertEqual(response.get('status_code', 200), 200)
        self.assertIn("Email received", response.get('message', ''))

    def test_receive_email_missing_body(self):
        """Test receiving an email with missing 'body' field."""
        data = self.test_data["email_server"]
        data.pop("body")
        response = self.server.receive_email(data)
        self.assertEqual(response.get('status_code', 200), 200)
        self.assertIn("Email received", response.get('message', ''))

    def test_receive_email_empty_subject(self):
        """Test receiving an email with an empty subject."""
        data = self.test_data["email_server"]
        data["subject"] = ""
        response = self.server.receive_email(data)
        self.assertEqual(response.get('status_code', 200), 200)
        self.assertIn("Email received", response.get('message', ''))

if __name__ == '__main__':
    unittest.main()
