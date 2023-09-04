// Select the form using its ID
const weatherForm = document.getElementById("weatherSearch");
const searchResultsDiv = document.getElementById("searchResults");
var pastSearches = new Array(10);
const weatherAPIKey = "22416836bfaaf9b43c5d9d1c14bbb7ff";

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
  let locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherAPIKey}`;
  fetch(locationUrl)
    .then((response) => response.json())
    .then((data) => {
      let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${weatherAPIKey}&units=metric`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          displayResults(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
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

function displayResults(data) {
  let currentWeather = data.list[0];

  updateCurrentWeatherDisplay(data.city.name, currentWeather);
}

function updateCurrentWeatherDisplay(cityName, currentWeather) {
  console.log(currentWeather);
  $("#cityDate").text(cityName);
  $("#temp").text("Temp: " + currentWeather.main.temp + "°C");
}

function createWeatherDiv(currentWeather) {}
