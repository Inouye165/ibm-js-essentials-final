// travel_recommendation.js

// Function to fetch data from the JSON file
function fetchRecommendations() {
    fetch('travel_recommendation_api.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse JSON data
      })
      .then(data => {
        console.log('Data fetched successfully:', data); // Log the data to the console
        // Display the data on the page
        displayRecommendations(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  
  // Call the fetchRecommendations function when the page loads
  window.onload = fetchRecommendations;
  