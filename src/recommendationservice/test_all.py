import unittest
import json
from recommendation_server import RecommendationService, ProductRecommendation, ListRecommendationsResponse
import logger

# Load the sample data from the data file
with open('sample_data.json') as f:
    sample_data = json.load(f)

class TestRecommendationServer(unittest.TestCase):
    def test_recommendation_logic(self):
        # Arrange
        service = RecommendationService()
        request = sample_data

        # Act
        response = service.ListRecommendations(request)

        # Assert
        self.assertIsInstance(response, ListRecommendationsResponse)
        self.assertEqual(len(response.recommendations), 2)
        self.assertEqual(response.recommendations[0].product_id, "prod1")
        self.assertEqual(response.recommendations[1].product_id, "prod2")

    # Other test cases...

if __name__ == '__main__':
    unittest.main()
