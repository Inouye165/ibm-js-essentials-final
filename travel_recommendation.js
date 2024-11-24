let allRecommendations = []; // To store all recommendations for searching

// Add event listeners for search and reset buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-button').addEventListener('click', searchRecommendations);
    document.getElementById('reset-button').addEventListener('click', resetRecommendations);

    // Fetch recommendations after setting up event listeners
    fetchRecommendations();
});

function resetRecommendations() {
    document.getElementById('search-input').value = '';
    displayRecommendations(allRecommendations);
}

// Fetch data from the JSON file
function fetchRecommendations() {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse JSON data
        })
        .then(data => {
            console.log('Data fetched successfully:', data); // Log raw JSON data

            // Flatten and combine all recommendations into allRecommendations array
            allRecommendations = [];

            // Process countries and their cities
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    // Add country name to city object for searching
                    city.countryName = country.name;
                    allRecommendations.push(city);
                });
            });

            // Process temples
            data.temples.forEach(temple => {
                allRecommendations.push(temple);
            });

            // Process beaches
            data.beaches.forEach(beach => {
                allRecommendations.push(beach);
            });

            console.log('All recommendations:', allRecommendations); // Log the processed recommendations

            // Display all recommendations initially
            displayRecommendations(allRecommendations);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to display recommendations on the page
// Function to display recommendations on the page
function displayRecommendations(recommendations) {
    console.log('Displaying recommendations:', recommendations); // Log recommendations to display
    const recommendationsContainer = document.getElementById('recommendations-container');

    // Clear any existing content
    recommendationsContainer.innerHTML = '';

    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<p>No recommendations found.</p>';
        return;
    }

    // Iterate over the recommendations and create HTML elements
    recommendations.forEach(item => {
        console.log('Processing recommendation:', item); // Log each recommendation being processed

        // Create a card or div for each recommendation
        const recCard = document.createElement('div');
        recCard.className = 'rec-card';

        // Create and set the image
        const image = document.createElement('img');
        image.src = item.imageUrl; // Ensure you have your own images
        image.alt = item.name;

        // Create and set the name/title
        const name = document.createElement('h3');
        name.textContent = item.name;

        // Create and set the description
        const description = document.createElement('p');
        description.textContent = item.description;

        // Create and display the local time
        const time = document.createElement('p');
        const options = {
            timeZone: item.timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        try {
            const localTime = new Date().toLocaleTimeString('en-US', options);
            console.log(`Local Time for ${item.name}:`, localTime); // Log the calculated local time
            time.textContent = `Local Time: ${localTime}`;
        } catch (error) {
            console.error(`Invalid timeZone for ${item.name}:`, item.timeZone, error);
            time.textContent = `Time not available`;
        }

        // Add the timeZone to a custom data attribute
        time.className = 'local-time';
        time.setAttribute('data-timezone', item.timeZone); // Set the correct time zone

        // Append elements to the card
        recCard.appendChild(image);
        recCard.appendChild(name);
        recCard.appendChild(description);
        recCard.appendChild(time);

        // Append the card to the container
        recommendationsContainer.appendChild(recCard);
    });
}


// Function to update times dynamically
function updateTimes() {
    const timeElements = document.querySelectorAll('.rec-card .local-time');

    timeElements.forEach(timeElement => {
        const timeZone = timeElement.getAttribute('data-timezone') || 'UTC'; // Default to UTC
        console.log('Updating time for time zone:', timeZone); // Log the time zone

        const options = {
            timeZone: timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        try {
            const localTime = new Date().toLocaleTimeString('en-US', options);
            console.log('Updated Local Time:', localTime); // Log the updated local time
            timeElement.textContent = `Local Time: ${localTime}`;
        } catch (error) {
            console.error(`Error generating time for timeZone: ${timeZone}`, error);
            timeElement.textContent = `Time not available`;
        }
    });
}

setInterval(updateTimes, 1000); // Update every second

function searchRecommendations() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    console.log('Search query:', query); // Log the search query

    if (query === '') {
        alert('Please enter a keyword to search.');
        return;
    }

    // Handle plural and singular forms
    let searchTerms = [query];

    if (query.endsWith('s')) {
        searchTerms.push(query.slice(0, -1));
    } else {
        searchTerms.push(query + 's');
    }
    console.log('Search terms:', searchTerms); // Log the search terms

    // Filter recommendations based on the keyword
    const filteredRecommendations = allRecommendations.filter(item => {
        const itemName = item.name.toLowerCase();
        const itemDescription = item.description.toLowerCase();
        const itemCountry = item.countryName ? item.countryName.toLowerCase() : '';

        return searchTerms.some(term =>
            itemName.includes(term) ||
            itemDescription.includes(term) ||
            itemCountry.includes(term)
        );
    });

    console.log('Filtered recommendations:', filteredRecommendations); // Log filtered results

    if (filteredRecommendations.length === 0) {
        alert('No recommendations found for your search.');
    }

    displayRecommendations(filteredRecommendations);
}
