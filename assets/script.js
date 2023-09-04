// Select the form using its ID
const weatherForm = document.getElementById("weatherSearch");
const searchResultsDiv = document.getElementById("searchResults");
var pastSearches = new Array(10);

// Add an event listener to the form
weatherForm.addEventListener("submit", function (event) {
  // Prevent the form from refreshing the page
  event.preventDefault();

  // Get the city entered by the user
  const city = document.getElementById("searchCity").value;
  if (pastSearches.length >= 10) {
    pastSearches.shift();
  }
  pastSearches.push(city);

  displayPreviousSearch();
  // Fetch weather data for the city (this is just a placeholder, you'll need to use an actual API)
  fetchWeatherData(city);
});

function fetchWeatherData(city) {
  // Placeholder function: Here you can call an actual weather API to get data for the city
  // For now, let's just log the city}...`); to the console
  console.log(pastSearches);

  // TODO: Add API call and display the data in the appropriate sections of the webpage
}

function displayPreviousSearch() {
  searchResultsDiv.innerHTML = ""; // Clear previous results

  if (pastSearches.length > 0) {
    pastSearches.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.textContent = item; // Adjust based on the actual data structure
      searchResultsDiv.appendChild(itemDiv);
    });
  } else {
    searchResultsDiv.textContent = "No results found";
  }
}
